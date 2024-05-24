import { targetMainnet } from './targets';

export enum ChainId {
  Mainnet = 1,
  Arbitrum = 42161,
  Sepolia = 11155111,
  Goerli = 5,
}

export type ChainMap<T> = Record<ChainId, T>;

export const supportedChainIds = targetMainnet
  ? [ChainId.Mainnet, ChainId.Arbitrum]
  : [ChainId.Sepolia, ChainId.Goerli];

export const chainNames: ChainMap<string> = {
  [ChainId.Mainnet]: 'Mainnet',
  [ChainId.Arbitrum]: 'Arbitrum',
  [ChainId.Sepolia]: 'Sepolia',
  [ChainId.Goerli]: 'Goerli',
};
