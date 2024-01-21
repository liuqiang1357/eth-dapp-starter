export enum ChainId {
  ArbitrumOne = 42161,
  PolygonMumbai = 80001,
}

export type ChainConfig = {
  name: string;
  icon: string;
};

export enum WalletId {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
}

export type WalletConfig = {
  name: string;
  icon: string;
};
