import { NftInfo } from 'nfts';
import { equals } from 'ramda';
import { Message } from 'ui/components/transactions/BaseTransaction';
import { FeeConfig } from '../../constants';
import { AssetDetail } from '../services/Background';
import { UiStore } from '../store';
import { ACTION } from './constants';

function getParam<S>(param: S, defaultParam: S) {
  if (param) {
    return param;
  }

  return param === null ? defaultParam : undefined;
}

interface Account {
  address: string;
  network: string;
}

interface UpdateStateInput {
  addresses: Record<string, string>;
  assets: Record<string, Record<string, AssetDetail>>;
  nfts: Record<string, Record<string, NftInfo>>;
  accounts?: Account[];
  balances?: Record<
    string,
    {
      available: string;
      leasedOut: string;
    }
  >;
  config?: unknown;
  currentLocale: string;
  currentNetwork?: string;
  currentNetworkAccounts: Account[];
  customCodes?: unknown;
  customMatchers?: unknown;
  customNodes?: unknown;
  feeConfig?: FeeConfig;
  idleOptions?: unknown;
  initialized: boolean;
  assetLogos: Record<string, string>;
  locked: boolean;
  messages?: Message[];
  networks?: unknown[];
  myNotifications?: unknown[];
  origins?: unknown;
  selectedAccount?: { address?: string; network?: string } | null;
  assetTickers: Record<string, string>;
  uiState?: unknown;
  usdPrices: Record<string, string>;
}

export function createUpdateState(store: UiStore) {
  return (state: UpdateStateInput) => {
    const currentState = store.getState();

    if (state.networks && state.networks.length) {
      store.dispatch({
        type: ACTION.UPDATE_NETWORKS,
        payload: state.networks,
      });
    }

    const config = getParam(state.config, {});
    if (config && !equals(currentState.config, config)) {
      store.dispatch({
        type: ACTION.REMOTE_CONFIG.SET_CONFIG,
        payload: config,
      });
    }

    if (state.feeConfig && !equals(currentState.feeConfig, state.feeConfig)) {
      store.dispatch({
        type: ACTION.UPDATE_FEE_CONFIG,
        payload: state.feeConfig,
      });
    }

    const idleOptions = getParam(state.idleOptions, {});
    if (idleOptions && !equals(currentState.idleOptions, idleOptions)) {
      store.dispatch({
        type: ACTION.REMOTE_CONFIG.UPDATE_IDLE,
        payload: idleOptions,
      });
    }

    const customNodes = getParam(state.customNodes, {});
    if (customNodes && !equals(currentState.customNodes, customNodes)) {
      store.dispatch({
        type: ACTION.UPDATE_NODES,
        payload: customNodes,
      });
    }

    const customCodes = getParam(state.customCodes, {});
    if (customCodes && !equals(currentState.customCodes, customCodes)) {
      store.dispatch({
        type: ACTION.UPDATE_CODES,
        payload: customCodes,
      });
    }

    const customMatchers = getParam(state.customMatchers, {});
    if (customMatchers && !equals(currentState.customMatcher, customMatchers)) {
      store.dispatch({
        type: ACTION.UPDATE_MATCHER,
        payload: customMatchers,
      });
    }

    if (
      state.currentLocale &&
      state.currentLocale !== currentState.currentLocale
    ) {
      store.dispatch({
        type: ACTION.UPDATE_FROM_LNG,
        payload: state.currentLocale,
      });
    }

    const uiState = getParam(state.uiState, {});
    if (uiState && !equals(uiState, currentState.uiState)) {
      store.dispatch({
        type: ACTION.UPDATE_UI_STATE,
        payload: uiState,
      });
    }

    const currentNetwork = getParam(state.currentNetwork, '');
    if (
      currentNetwork !== undefined &&
      currentNetwork !== currentState.currentNetwork
    ) {
      store.dispatch({
        type: ACTION.UPDATE_CURRENT_NETWORK,
        payload: currentNetwork,
      });
    }

    const origins = getParam(state.origins, {});
    if (origins && !equals(origins, currentState.origins)) {
      store.dispatch({
        type: ACTION.UPDATE_ORIGINS,
        payload: origins,
      });
    }

    function isMyMessages(msg) {
      try {
        const account = state.selectedAccount || currentState.selectedAccount;
        return (
          msg.status === 'unapproved' &&
          msg.account.address === account?.address &&
          msg.account.network === account?.network
        );
      } catch (e) {
        return false;
      }
    }

    const messages = getParam(state.messages, []);
    const unapprovedMessages = messages?.filter(isMyMessages);
    const toUpdateActiveNotify = {
      allMessages: messages,
      messages: currentState.messages,
      notifications: currentState.notifications,
    };

    if (
      unapprovedMessages &&
      !equals(unapprovedMessages, currentState.messages)
    ) {
      store.dispatch({
        type: ACTION.UPDATE_MESSAGES,
        payload: { unapprovedMessages, messages },
      });

      toUpdateActiveNotify.messages = unapprovedMessages;
    }

    const myNotifications = getParam(state.myNotifications, []);
    if (
      myNotifications &&
      !equals(currentState.notifications, myNotifications)
    ) {
      store.dispatch({
        type: ACTION.NOTIFICATIONS.SET,
        payload: myNotifications,
      });

      toUpdateActiveNotify.notifications = myNotifications;
    }

    if (
      messages &&
      (toUpdateActiveNotify.messages !== currentState.messages ||
        toUpdateActiveNotify.notifications !== currentState.notifications)
    ) {
      store.dispatch({
        type: ACTION.MESSAGES.SET_ACTIVE_AUTO,
        payload: toUpdateActiveNotify,
      });
    }

    const selectedAccount = getParam(state.selectedAccount, {});
    if (
      selectedAccount &&
      !equals(selectedAccount, currentState.selectedAccount)
    ) {
      store.dispatch({
        type: ACTION.UPDATE_SELECTED_ACCOUNT,
        payload: selectedAccount,
      });
    }

    const currentNetworkAccounts = getParam(state.currentNetworkAccounts, []);
    if (
      currentNetworkAccounts &&
      !equals(currentNetworkAccounts, currentState.accounts)
    ) {
      store.dispatch({
        type: ACTION.UPDATE_ACCOUNTS,
        payload: currentNetworkAccounts,
      });
    }

    const accounts = getParam(state.accounts, []);
    if (accounts && !equals(accounts, currentState.allNetworksAccounts)) {
      store.dispatch({
        type: ACTION.UPDATE_ALL_NETWORKS_ACCOUNTS,
        payload: accounts,
      });
    }

    if (
      !currentState.state ||
      state.initialized !== currentState.state.initialized ||
      state.locked !== currentState.state.locked
    ) {
      store.dispatch({
        type: ACTION.UPDATE_APP_STATE,
        payload: { initialized: state.initialized, locked: state.locked },
      });
    }

    const balances = getParam(state.balances, {});
    if (balances && !equals(balances, currentState.balances)) {
      store.dispatch({
        type: ACTION.UPDATE_BALANCES,
        payload: balances,
      });
    }

    const assets = getParam(state.assets, {});
    const network = state.currentNetwork || currentState.currentNetwork;
    if (
      assets &&
      assets[network] &&
      !equals(assets[network], currentState.assets)
    ) {
      store.dispatch({
        type: ACTION.SET_ASSETS,
        payload: assets[network],
      });
    }

    const usdPrices = getParam(state.usdPrices, {});
    if (usdPrices && !equals(usdPrices, currentState.usdPrices)) {
      store.dispatch({
        type: ACTION.SET_USD_PRICES,
        payload: usdPrices,
      });
    }

    const assetLogos = getParam(state.assetLogos, {});
    if (assetLogos && !equals(assetLogos, currentState.assetLogos)) {
      store.dispatch({
        type: ACTION.SET_ASSET_LOGOS,
        payload: assetLogos,
      });
    }

    const assetTickers = getParam(state.assetTickers, {});
    if (assetTickers && !equals(assetTickers, currentState.assetTickers)) {
      store.dispatch({
        type: ACTION.SET_ASSET_TICKERS,
        payload: assetTickers,
      });
    }

    const addresses = getParam(state.addresses, {});
    if (addresses && !equals(addresses, currentState.addresses)) {
      store.dispatch({
        type: ACTION.UPDATE_ADDRESSES,
        payload: addresses,
      });
    }

    const nfts = getParam(state.nfts, null);
    if (nfts && !equals(nfts, currentState.nfts)) {
      store.dispatch({
        type: ACTION.UPDATE_NFTS,
        payload: nfts,
      });
    }
  };
}
