export interface ChainConfig {
  name: string;
  icon: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
}

export interface WalletConfig {
  name: string;
  icon: string;
}
