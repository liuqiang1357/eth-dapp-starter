export enum ChainId {
  ArbitrumOne = 42161,
  PolygonMumbai = 80001,
}

export type ChainConfig = {
  name: string;
  icon: any;
  nodeUrl: string;
};

export enum WalletId {
  MetaMask = 'injected',
  WalletConnect = 'walletConnect',
}

export type WalletConfig = {
  name: string;
  icon: any;
};
