import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, goerli, mainnet, sepolia } from '@wagmi/chains';
import { produce } from 'immer';
import {
  BaseError as ViemBaseError,
  ChainMismatchError as ViemChainMismatchError,
  UserRejectedRequestError as ViemUserRejectedRequestError,
} from 'viem';
import { ChainId, ChainMap, supportedChainIds } from 'configs/chains';
import { ChainMismatchError, UserRejectedRequestError, Web3Error } from 'lib/errors/web3';

const chains: ChainMap<Chain> = {
  [ChainId.Mainnet]: mainnet,
  [ChainId.Arbitrum]: arbitrum,
  [ChainId.Sepolia]: produce(sepolia, chain => {
    chain.rpcUrls.default.http[0] =
      'https://sepolia.infura.io/v3/006c057c342d4476b6befdba551e7fd3' as never;
  }),
  [ChainId.Goerli]: goerli,
};

export const wagmiConfig = getDefaultConfig({
  appName: 'OpenSwap',
  projectId: '6fc6f515daaa4b001616766bc028bffa',
  chains: supportedChainIds.map(chainId => chains[chainId]) as [Chain, ...Chain[]],
  ssr: true,
});

export function convertMaybeWagmiError(error: Error): Error {
  if (error instanceof ViemBaseError) {
    if (error instanceof ViemUserRejectedRequestError) {
      return new UserRejectedRequestError(error.shortMessage, { cause: error });
    }
    if (error instanceof ViemChainMismatchError) {
      return new ChainMismatchError(error.shortMessage, { cause: error });
    }
    return new Web3Error(error.shortMessage, { cause: error });
  }
  return error;
}
