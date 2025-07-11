import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as net from 'net';
import * as mocha from 'mocha';
import * as path from 'path';
import {
  GenericContainer,
  Network,
  StartedTestContainer,
} from 'testcontainers';
import { App } from './actions';

declare global {
  const KeeperWallet: GicWalletPro.TGicWalletProApi;

  interface Window {
    result: unknown;
    approveResult: unknown;
  }
}

declare module 'mocha' {
  interface Context {
    serviceWorkerTab: string;
    driver: WebDriver;
    extensionUrl: string;
    extensionPanel: string;
    nodeUrl: string;
    wait: number;
  }
}

declare module 'selenium-webdriver' {
  interface WebElement {
    getShadowRoot: () => WebElement;
  }
}

interface GlobalFixturesContext {
  selenium: StartedTestContainer;
  node: StartedTestContainer;
}

export async function mochaGlobalSetup(this: GlobalFixturesContext) {
  const exposedPorts = [4444, 5900];

  const host = await new Network().start();

  this.node = await new GenericContainer('wavesplatform/waves-private-node')
    .withExposedPorts(6869)
    .withNetworkMode(host.getName())
    .withNetworkAliases('waves-private-node')
    .start();

  this.selenium = await new GenericContainer('selenium/standalone-chrome')
    .withBindMount(
      path.resolve(__dirname, '..', '..', 'dist'),
      '/app/dist',
      'ro'
    )
    .withBindMount(
      path.resolve(__dirname, '..', 'fixtures'),
      '/app/test/fixtures',
      'ro'
    )
    .withExposedPorts(...exposedPorts)
    .withNetworkMode(host.getName())
    .start();

  await Promise.all(
    exposedPorts.map(
      (port: number) =>
        new Promise((resolve, reject) => {
          net
            .createServer(from => {
              const to = net.createConnection({
                port: this.selenium.getMappedPort(port),
              });

              from.pipe(to);
              to.pipe(from);

              to.once('error', () => {
                from.destroy();
              });
            })
            .once('listening', resolve)
            .once('error', reject)
            .listen(port)
            .unref();
        })
    )
  );
}

export async function mochaGlobalTeardown(this: GlobalFixturesContext) {
  await this.selenium.stop();
  await this.node.stop();
}

export const mochaHooks = () => ({
  async beforeAll(this: mocha.Context) {
    this.timeout(15 * 60 * 1000);
    this.wait = 15 * 1000;

    this.driver = new Builder()
      .forBrowser('chrome')
      .usingServer(`http://localhost:4444/wd/hub`)
      .setChromeOptions(
        new chrome.Options().addArguments(
          '--load-extension=/app/dist/chrome',
          '--disable-dev-shm-usage',
          '--disable-web-security'
        )
      )
      .build();

    // detect Gic Wallet Pro extension URL
    await this.driver.get('chrome://system');
    for (const ext of (
      await this.driver
        .wait(until.elementLocated(By.css('div#extensions-value')))
        .getText()
    ).split('\n')) {
      const [id, name] = ext.split(' : ');
      if (name.toLowerCase() === 'Gic Wallet Pro'.toLowerCase()) {
        this.extensionUrl = `chrome-extension://${id}/popup.html`;
        this.extensionPanel = `chrome://extensions/?id=${id}`;
        this.nodeUrl = 'http://waves-private-node:6869';
        break;
      }
    }

    // this helps extension to be ready
    await this.driver.get('chrome://new-tab-page');
    await App.openServiceWorkerTab.call(this);
    await App.open.call(this);
  },

  afterAll(this: mocha.Context, done: mocha.Done) {
    this.driver && this.driver.quit();
    done();
  },
});
