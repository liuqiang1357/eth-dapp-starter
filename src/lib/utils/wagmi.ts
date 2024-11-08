import { getDefaultConfig } from 'connectkit';
import { produce } from 'immer';
import {
  Chain,
  BaseError as ViemBaseError,
  ChainMismatchError as ViemChainMismatchError,
  UserRejectedRequestError as ViemUserRejectedRequestError,
} from 'viem';
import { arbitrum, goerli, mainnet, sepolia } from 'viem/chains';
import { createConfig } from 'wagmi';
import { ChainId, ChainMap, supportedChainIds } from 'configs/chains';
import { ChainMismatchError, UserRejectedRequestError, Web3Error } from 'lib/errors/web3';

// Hotfix for connectkit: ENS-related requests will use this if mainnet is not in supported chains.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(mainnet.rpcUrls.default.http as any)[0] = 'https://ethereum-rpc.publicnode.com';

const chains: ChainMap<Chain> = {
  [ChainId.Mainnet]: produce(mainnet, chain => {
    chain.rpcUrls.default.http[0] = 'https://ethereum-rpc.publicnode.com' as never;
  }),
  [ChainId.Arbitrum]: arbitrum,
  [ChainId.Sepolia]: produce(sepolia, chain => {
    chain.rpcUrls.default.http[0] = 'https://ethereum-sepolia-rpc.publicnode.com' as never;
  }),
  [ChainId.Goerli]: goerli,
};

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'demo',
    walletConnectProjectId: '83333dd2a970d5644e1318f9370b15a1',
    chains: supportedChainIds.map(chainId => chains[chainId]) as [Chain, ...Chain[]],
    ssr: true,
  }),
);

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
