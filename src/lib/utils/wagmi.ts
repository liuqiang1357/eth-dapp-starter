import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, goerli, mainnet, sepolia } from '@wagmi/chains';
import {
  BaseError as ViemBaseError,
  ChainMismatchError as ViemChainMismatchError,
  UserRejectedRequestError as ViemUserRejectedRequestError,
} from 'viem';
import { ChainId, ChainMap, SUPPORTED_CHAIN_IDS } from 'configs/chains';
import { ChainMismatchError, UnknownWeb3Error, UserRejectedRequestError } from 'lib/errors/web3';

const CHAINS: ChainMap<Chain> = {
  [ChainId.Mainnet]: mainnet,
  [ChainId.Arbitrum]: arbitrum,
  [ChainId.Sepolia]: sepolia,
  [ChainId.Goerli]: goerli,
};

export const wagmiConfig = getDefaultConfig({
  appName: 'OpenSwap',
  projectId: '6fc6f515daaa4b001616766bc028bffa',
  chains: SUPPORTED_CHAIN_IDS.map(chainId => CHAINS[chainId]) as [Chain, ...Chain[]],
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
    return new UnknownWeb3Error(error.shortMessage, { cause: error });
  }
  return error;
}
