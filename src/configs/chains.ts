import { TARGET_MAINNET } from './targets';

export enum ChainId {
  Mainnet = 1,
  Arbitrum = 42161,
  Sepolia = 11155111,
  Goerli = 5,
}

export type ChainMap<T> = Record<ChainId, T>;

export const SUPPORTED_CHAIN_IDS = TARGET_MAINNET
  ? [ChainId.Mainnet, ChainId.Arbitrum]
  : [ChainId.Sepolia, ChainId.Goerli];
