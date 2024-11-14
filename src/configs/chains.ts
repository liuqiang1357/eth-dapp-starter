import { target, Target } from './targets';

export enum ChainId {
  Mainnet = 1,
  Arbitrum = 42161,
  Sepolia = 11155111,
  Goerli = 5,
}

export const chainIds = {
  [Target.MainNet]: [ChainId.Mainnet, ChainId.Arbitrum],
  [Target.TestNet]: [ChainId.Sepolia, ChainId.Goerli],
}[target];

export type ChainMap<T> = Record<ChainId, T>;

export const chainNames: ChainMap<string> = {
  [ChainId.Mainnet]: 'Mainnet',
  [ChainId.Arbitrum]: 'Arbitrum',
  [ChainId.Sepolia]: 'Sepolia',
  [ChainId.Goerli]: 'Goerli',
};
