import { TRANSACTION_TYPE } from '@waves/ts-types';

export const messageType = 'transfer';
export const txType = 'transaction';

export function getAssetsId(tx): Array<string> {
  const feeAssetId =
    tx.fee && tx.fee.assetId ? tx.fee.assetId : tx.feeAssetId || 'WAVES';
  const amountAssetId =
    tx.amount && tx.amount.assetId ? tx.amount.assetId : tx.assetId || 'WAVES';

  if (feeAssetId === amountAssetId) {
    return [amountAssetId];
  }

  return [amountAssetId, feeAssetId];
}

export { getFee } from '../BaseTransaction/parseTx';

export function getAmount(tx) {
  return typeof tx.amount === 'object'
    ? tx.amount
    : { coins: tx.amount, assetId: 'WAVES' };
}

export function getAmountSign() {
  return '-' as const;
}

export function isMe(tx, type: string) {
  return tx.type === TRANSACTION_TYPE.TRANSFER && type === txType;
}
