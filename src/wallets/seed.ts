import { BigNumber } from '@waves/bignumber';
import {
  address,
  privateKey,
  publicKey,
  signBytes,
} from '@waves/ts-lib-crypto';
import { customData, wavesAuth } from '@waves/waves-transactions';
import { TCustomData } from '@waves/waves-transactions/dist/requests/custom-data';
import { IWavesAuthParams } from '@waves/waves-transactions/dist/transactions';
import create from 'parse-json-bignumber';
import { AccountOfType, NetworkName } from 'accounts/types';
import {
  convertFromSa,
  makeBytes,
  SaAuth,
  SaCancelOrder,
  SaOrder,
  SaRequest,
  SaTransaction,
} from 'transactions/utils';
import { Wallet } from './wallet';

const { stringify } = create({ BigNumber });

export interface SeedWalletInput {
  name: string;
  network: NetworkName;
  networkCode: string;
  seed: string;
}

type SeedWalletData = AccountOfType<'seed'> & {
  seed: string;
};

export class SeedWallet extends Wallet<SeedWalletData> {
  constructor({ name, network, networkCode, seed }: SeedWalletInput) {
    super({
      address: address(seed, networkCode),
      name,
      network,
      networkCode,
      publicKey: publicKey(seed),
      seed,
      type: 'seed',
    });
  }

  getSeed() {
    return this.data.seed;
  }

  getPrivateKey() {
    return privateKey(this.getSeed());
  }

  private signBytes(bytes: Uint8Array) {
    return signBytes(this.data.seed, bytes);
  }

  async signTx(tx: SaTransaction) {
    const result = convertFromSa.transaction(
      tx,
      this.data.networkCode.charCodeAt(0),
      'seed'
    );

    result.proofs.push(this.signBytes(makeBytes.transaction(result)));

    return stringify(result);
  }

  async signAuth(auth: SaAuth) {
    return this.signBytes(makeBytes.auth(convertFromSa.auth(auth)));
  }

  async signRequest(request: SaRequest) {
    return this.signBytes(makeBytes.request(convertFromSa.request(request)));
  }

  async signOrder(order: SaOrder) {
    const result = convertFromSa.order(order);

    result.proofs.push(this.signBytes(makeBytes.order(result)));

    return stringify(result);
  }

  async signCancelOrder(cancelOrder: SaCancelOrder) {
    const result = convertFromSa.cancelOrder(cancelOrder);

    result.signature = this.signBytes(makeBytes.cancelOrder(result));

    return stringify(result);
  }

  async signWavesAuth(data: IWavesAuthParams) {
    return wavesAuth(data, this.getSeed());
  }

  async signCustomData(data: TCustomData) {
    return customData(data, this.getSeed());
  }
}
