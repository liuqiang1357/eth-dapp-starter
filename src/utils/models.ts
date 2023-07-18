export enum ChainId {
  ArbitrumOne = 42161,
  PolygonMumbai = 80001,
}

export interface ChainConfig {
  name: string;
  icon: string;
}

export enum WalletId {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
}

export interface WalletConfig {
  name: string;
  icon: string;
}
