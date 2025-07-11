import * as styles from './sponsorship.styl';
import * as React from 'react';
import { withTranslation } from 'react-i18next';
import { ComponentProps, MessageData, TxIcon } from '../BaseTransaction';
import cn from 'classnames';
import { Asset, Balance } from '../../ui';
import { getMoney } from '../../../utils/converters';
import { getAssetFee, SPONSOR_MODE } from './parseTx';

class SponsorshipCardComponent extends React.PureComponent<ComponentProps> {
  render() {
    const className = cn(
      styles.sponsorshipTransactionCard,
      this.props.className,
      {
        [styles.sponsorshipCardCollapsed]: this.props.collapsed,
      }
    );

    const { t, message, assets, collapsed } = this.props;
    const { data = {} as MessageData } = message;
    const tx = { type: data.type, ...data.data };
    const assetFee = getMoney(getAssetFee(tx), assets);
    const isSetSponsored = assetFee.getTokens().gt(0);

    return (
      <>
        <div className={className}>
          <div className={styles.cardHeader}>
            <div className={styles.sponsorshipTxIcon}>
              <TxIcon
                txType={
                  isSetSponsored ? SPONSOR_MODE.enable : SPONSOR_MODE.disable
                }
              />
            </div>
            <div>
              <div className="basic500 body3 margin-min">
                {t(
                  isSetSponsored
                    ? 'transactions.setSponsored'
                    : 'transactions.clearSponsored'
                )}
              </div>
              <h1 className="headline1">
                {isSetSponsored ? (
                  <Balance
                    split={true}
                    showAsset={true}
                    balance={assetFee}
                    showUsdAmount
                  />
                ) : (
                  <Asset assetId={assetFee.asset.id} />
                )}
              </h1>
            </div>
          </div>
        </div>
        {!collapsed && isSetSponsored && (
          <div className="tag1 basic500 margin-min margin-main-top">
            {t('transactions.amountPerTransaction')}
          </div>
        )}
      </>
    );
  }
}

export const SponsorshipCard = withTranslation()(SponsorshipCardComponent);
