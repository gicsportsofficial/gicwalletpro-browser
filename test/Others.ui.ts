import { expect } from 'chai';
import { By, until } from 'selenium-webdriver';
import { App, CreateNewAccount, Network, Settings } from './utils/actions';
import { DEFAULT_PAGE_LOAD_DELAY } from './utils/constants';

describe('Others', function () {
  this.timeout(60 * 1000);

  let tabKeeper;

  before(async function () {
    await App.initVault.call(this);
    await Settings.setMaxSessionTimeout.call(this);
    await App.open.call(this);
  });

  after(async function () {
    await App.closeBgTabs.call(this, tabKeeper);
    await App.resetVault.call(this);
  });

  it('The current version of the extension is displayed', async function () {
    const { version } = require('../package.json');

    await this.driver.sleep(DEFAULT_PAGE_LOAD_DELAY);

    expect(
      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="currentVersion"]')),
          this.wait
        )
        .getText()
    ).matches(new RegExp(version, 'g'));
  });

  it(
    'After signAndPublishTransaction() "View transaction" button leads to the correct Explorer'
  );

  it(
    'Signature requests are automatically removed from pending requests after 30 minutes'
  );

  it('Switch account on confirmation screen');

  it('Send more transactions for signature when different screens are open');

  describe('Send WAVES', function () {
    before(async function () {
      await Network.switchToAndCheck.call(this, 'Testnet');

      // save popup and accounts refs
      const handles = await this.driver.getAllWindowHandles();
      tabKeeper = handles[0];
      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="importForm"]')),
          this.wait
        )
        .findElement(By.css('[data-testid="addAccountBtn"]'))
        .click();
      await this.driver.wait(
        async () => (await this.driver.getAllWindowHandles()).length === 3,
        this.wait
      );
      for (const handle of await this.driver.getAllWindowHandles()) {
        if (handle !== tabKeeper && handle !== this.serviceWorkerTab) {
          await this.driver.switchTo().window(handle);
          await this.driver.navigate().refresh();
          break;
        }
      }
      await CreateNewAccount.importAccount.call(
        this,
        'rich',
        'waves private node seed with waves tokens'
      );
      await this.driver.switchTo().window(tabKeeper);
    });

    after(async function () {
      await Network.switchToAndCheck.call(this, 'Mainnet');
    });

    beforeEach(async function () {
      const actions = this.driver.actions({ async: true });
      await actions
        .move({
          origin: await this.driver.wait(
            until.elementLocated(
              By.css('[data-testid="WAVES"] [data-testid="moreBtn"]')
            ),
            this.wait
          ),
        })
        .perform();

      await this.driver
        .wait(
          until.elementLocated(
            By.css('[data-testid="WAVES"] [data-testid="sendBtn"]')
          ),
          this.wait
        )
        .click();

      await this.driver.sleep(DEFAULT_PAGE_LOAD_DELAY);
    });

    afterEach(async function () {
      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="rejectButton"]')),
          this.wait
        )
        .click();

      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="closeTransaction"]')),
          this.wait
        )
        .click();
    });

    it('Send WAVES to an address', async function () {
      const recipientInput = await this.driver.wait(
        until.elementLocated(By.css('[data-testid="recipientInput"]')),
        this.wait
      );

      expect(
        await this.driver.switchTo().activeElement().getAttribute('data-testid')
      ).to.equal('recipientInput');

      await recipientInput.sendKeys('3MsX9C2MzzxE4ySF5aYcJoaiPfkyxZMg4cW');

      const amountInput = await this.driver.wait(
        until.elementLocated(By.css('[data-testid="amountInput"]')),
        this.wait
      );

      await amountInput.sendKeys('123123123.123');

      expect(
        await this.driver.executeScript(function (amountInput) {
          return amountInput.value;
        }, amountInput)
      ).to.equal('123 123 123.123');

      await amountInput.clear();
      await amountInput.sendKeys('0.123');

      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="attachmentInput"]')),
          this.wait
        )
        .sendKeys('This is an attachment');

      const submitButton = await this.driver.wait(
        until.elementIsVisible(
          this.driver.findElement(By.css('[data-testid="submitButton"]'))
        ),
        this.wait
      );
      await submitButton.click();

      expect(await submitButton.isEnabled()).to.equal(false);

      expect(
        await this.driver
          .wait(
            until.elementLocated(By.css('[data-testid="transferAmount"]')),
            this.wait
          )
          .getText()
      ).to.equal('-0.12300000 WAVES');

      expect(
        await this.driver
          .wait(
            until.elementLocated(By.css('[data-testid="recipient"]')),
            this.wait
          )
          .getText()
      ).to.equal('rich\n3MsX9C2M...yxZMg4cW');

      expect(
        await this.driver
          .wait(
            until.elementLocated(By.css('[data-testid="attachmentContent"]')),
            this.wait
          )
          .getText()
      ).to.equal('This is an attachment');
    });

    it('Send assets to an alias', async function () {
      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="recipientInput"]')),
          this.wait
        )
        .sendKeys('alias:T:an_alias');

      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="amountInput"]')),
          this.wait
        )
        .sendKeys('0.87654321');

      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="attachmentInput"]')),
          this.wait
        )
        .sendKeys('This is an attachment');

      const submitButton = await this.driver.wait(
        until.elementIsVisible(
          this.driver.findElement(By.css('[data-testid="submitButton"]'))
        ),
        this.wait
      );
      await submitButton.click();

      expect(
        await this.driver
          .wait(
            until.elementLocated(By.css('[data-testid="transferAmount"]')),
            this.wait
          )
          .getText()
      ).to.equal('-0.87654321 WAVES');

      expect(
        await this.driver
          .wait(
            until.elementLocated(By.css('[data-testid="recipient"]')),
            this.wait
          )
          .getText()
      ).to.equal('alias:T:an_alias');

      expect(
        await this.driver
          .wait(
            until.elementLocated(By.css('[data-testid="attachmentContent"]')),
            this.wait
          )
          .getText()
      ).to.equal('This is an attachment');
    });
  });
});
