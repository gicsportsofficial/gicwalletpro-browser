export enum NetworkName {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
  Stagenet = 'stagenet',
  Custom = 'custom',
}

export enum NetworkByte {
  Mainnet = 71,
  Testnet = 83,
  Stagenet = 88,
}

export type Account = {
  address: string;
  lastUsed?: number;
  name: string;
  network: NetworkName;
  networkCode: string;
  publicKey: string;
} & (
  | { type: 'seed' }
  | { type: 'encodedSeed' }
  | { type: 'privateKey' }
  | { type: 'ledger'; id: number }
  | { type: 'wx'; uuid: string; username: string }
  | { type: 'debug' }
);

export type AccountType = Account['type'];

export type AccountOfType<T extends AccountType> = Extract<
  Account,
  { type: T }
>;

export type KeystoreAccount = Pick<
  Account,
  'address' | 'name' | 'networkCode'
> &
  (
    | { type?: 'seed'; seed: string }
    | { type: 'encodedSeed'; encodedSeed: string }
    | { type: 'privateKey'; privateKey: string }
    | { type: 'debug' }
  );

export type KeystoreProfiles = Record<
  NetworkName,
  { accounts: KeystoreAccount[] }
>;
