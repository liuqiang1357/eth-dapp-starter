import { Address } from 'viem';
import { ChainId, ChainMap } from './chains';

export const wethAddresses: Partial<ChainMap<Address>> = {
  [ChainId.Mainnet]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  [ChainId.Arbitrum]: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  [ChainId.Sepolia]: '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
};
