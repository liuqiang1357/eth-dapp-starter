import { arbitrum, Chain, polygonMumbai } from '@wagmi/chains';
import { injected, walletConnect } from '@wagmi/connectors';
import { createConfig, CreateConnectorFn } from '@wagmi/core';
import { produce } from 'immer';
import { createClient, http, BaseError as ViemBaseError } from 'viem';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from './configs';
import { WalletError } from './errors';
import { ChainId, WalletId } from './models';

export const CHAINS: Record<ChainId, Chain> = {
  [ChainId.PolygonMumbai]: produce(polygonMumbai, chain => {
    chain.rpcUrls.default.http = ['https://rpc.ankr.com/polygon_mumbai'] as any;
    chain.rpcUrls.public.http = ['https://rpc.ankr.com/polygon_mumbai'] as any;
  }),
  [ChainId.ArbitrumOne]: arbitrum,
};

export const CONNECTORS: Record<WalletId, CreateConnectorFn> = {
  [WalletId.MetaMask]: injected(),
  [WalletId.WalletConnect]: walletConnect({
    projectId: '6fc6f515daaa4b001616766bc028bffa',
  }),
};

export function convertMaybeViemError(error: unknown): unknown {
  if (error instanceof ViemBaseError) {
    if (
      error.name === 'UserRejectedRequestError' ||
      (error as any).cause?.name === 'UserRejectedRequestError'
    ) {
      return new WalletError(error.shortMessage, {
        code: WalletError.Codes.UserRejected,
        cause: error,
      });
    }
    if (
      error.name === 'ChainMismatchError' ||
      (error as any).cause?.name === 'ChainMismatchError'
    ) {
      return new WalletError(error.shortMessage, {
        code: WalletError.Codes.IncorrectNetwork,
        cause: error,
      });
    }
    return new WalletError(error.shortMessage, {
      code: WalletError.Codes.UnknownError,
      cause: error,
    });
  }
  return error;
}

export const config = createConfig({
  chains: SUPPORTED_CHAIN_IDS.map(chainId => CHAINS[chainId]) as [Chain, ...Chain[]],
  connectors: SUPPORTED_WALLET_IDS.map(walletId => CONNECTORS[walletId]),
  client({ chain }) {
    return createClient({
      chain,
      transport: http(CHAINS[chain.id as ChainId].rpcUrls.default.http[0]),
    });
  },
  syncConnectedChain: true,
});
