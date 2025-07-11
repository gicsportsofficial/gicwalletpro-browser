import LocalMessageDuplexStream from 'post-message-stream';
import { setupDnode, transformMethods, cbToPromise } from './lib/dnode-util';
import { equals } from 'ramda';
import log from 'loglevel';
import EventEmitter from 'events';

const createDeffer = () => {
  const def = {};
  def.promise = new Promise((res, rej) => {
    def.resolve = res;
    def.reject = rej;
  });

  return def;
};

setupInpageApi().catch(e => log.error(e));

async function setupInpageApi() {
  let cbs = {};
  let args = {};
  const wavesAppDef = createDeffer();
  const wavesApp = {};
  const eventEmitter = new EventEmitter();
  const wavesApi = {
    initialPromise: wavesAppDef.promise,
    on: eventEmitter.on.bind(eventEmitter),
  };
  const proxyApi = {
    get(_, prop) {
      if (wavesApi[prop]) {
        return wavesApi[prop];
      }

      if (!cbs[prop] && prop !== 'on') {
        cbs[prop] = function (...args) {
          const def = createDeffer();
          args[prop] = args[prop] || [];
          args[prop].push({ args, def });
          return def.promise;
        };
      }

      if (!cbs[prop] && prop === 'on') {
        cbs[prop] = function (...args) {
          args[prop] = args[prop] || [];
          args[prop].push({ args });
        };
      }

      return cbs[prop];
    },

    set() {
      throw new Error('Not permitted');
    },

    has() {
      return true;
    },
  };

  global.KeeperWallet =
    global.GicWalletPro =
    global.Waves =
      new Proxy(wavesApp, proxyApi);

  const connectionStream = new LocalMessageDuplexStream({
    name: 'waves_keeper_page',
    target: 'waves_keeper_content',
  });

  const dnode = setupDnode(
    connectionStream,
    {},
    'inpageApi',
    'updatePublicState'
  );

  const inpageApi = await new Promise(resolve => {
    dnode.on('remote', inpageApi => {
      resolve(transformMethods(cbToPromise, inpageApi));
    });
  });

  Object.entries(args).forEach(([prop, data]) => {
    if (data.def) {
      inpageApi[prop](...data.args).then(data.def.resolve, data.def.reject);
    } else {
      inpageApi[prop](...data.args);
    }
  });

  args = [];
  cbs = {};
  Object.assign(wavesApi, inpageApi);
  wavesAppDef.resolve(wavesApi);
  global.KeeperWallet = global.GicWalletPro = global.Waves = wavesApi;
  let publicState = {};
  connectionStream.on('data', async ({ name }) => {
    if (name !== 'updatePublicState') {
      return;
    }

    const isApproved = await wavesApi.resourceIsApproved();
    if (!isApproved) {
      return;
    }

    const updatedPublicState = await wavesApi.publicState();
    if (!equals(updatedPublicState, publicState)) {
      publicState = updatedPublicState;
      eventEmitter.emit('update', updatedPublicState);
    }
  });
  setupClickInterceptor(inpageApi);
}

function setupClickInterceptor(inpageApi) {
  const excludeSites = ['futfinance.com'];

  if (excludeSites.includes(location.host)) {
    return false;
  }

  document.addEventListener('click', e => {
    const paymentApiResult = checkForPaymentApiLink(e);
    try {
      if (
        paymentApiResult &&
        processPaymentAPILink(paymentApiResult, inpageApi)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    } catch (e) {
      // ignore errors
    }
  });
}

function checkForPaymentApiLink(e) {
  let node = e.target;

  const check = node => {
    const href = node.href;

    if (!node.href) {
      return false;
    }

    try {
      const url = new URL(href);

      if (
        ![
          'client.futfinance.com',
          'dex.zeroswap.finance',
          'futfinance.com',
        ].find(item => url.host === item)
      ) {
        return false;
      }

      if (!url.hash.indexOf('#gateway/auth')) {
        return {
          type: 'auth',
          hash: url.hash,
        };
      }

      if (!url.hash.indexOf('#send/') && url.hash.includes('strict=true')) {
        return {
          type: 'send',
          hash: url.hash,
        };
      }

      return false;
    } catch (err) {
      return false;
    }
  };

  while (node) {
    const result = check(node);
    if (result) {
      return result;
    }
    node = node.parentElement;
  }

  return false;
}

function processPaymentAPILink({ type, hash }, inpageApi) {
  const apiData = hash
    .split('?')[1]
    .split('&')
    .reduce(
      (obj, data) => {
        const item = data.split('=');
        obj[item[0]] = decodeURIComponent(item[1].trim());
        return obj;
      },
      { type }
    );

  switch (apiData.type) {
    case 'auth':
      if (
        !apiData.n ||
        !apiData.d ||
        !apiData.r ||
        apiData.r.indexOf('https') !== 0
      ) {
        return false;
      }

      inpageApi.auth({
        name: apiData.n,
        data: apiData.d,
        icon: apiData.i || '',
        referrer: apiData.r || `${location.origin}`,
        successPath: apiData.s || '/',
      });
      break;
    case 'send': {
      const assetId = hash.split('?')[0].replace('#send/', '');

      if (!assetId || !apiData.amount) {
        return false;
      }

      inpageApi.signAndPublishTransaction({
        type: 4,
        successPath: apiData.referrer,
        data: {
          amount: {
            assetId: assetId,
            tokens: apiData.amount,
          },
          fee: {
            assetId: 'WAVES',
            tokens: '0.00100000',
          },
          recipient: apiData.recipient,
          attachment: apiData.attachment || '',
        },
      });
      break;
    }
  }

  return true;
}
