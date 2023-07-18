import { arbitrum, Chain, mainnet, polygonMumbai } from '@wagmi/chains';
import { Connector } from '@wagmi/connectors';
import { InjectedConnector } from '@wagmi/connectors/injected';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
import {
  Config,
  configureChains,
  createConfig,
  PublicClient,
  WebSocketPublicClient,
} from '@wagmi/core';
import { publicProvider } from '@wagmi/core/providers/public';
import { produce } from 'immer';
import { FallbackTransport, UserRejectedRequestError, BaseError as ViemBaseError } from 'viem';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from './configs';
import { WalletError } from './errors';
import { ChainId, WalletId } from './models';

export const CHAINS: Record<ChainId, Chain> = {
  [ChainId.PolygonMumbai]: produce(polygonMumbai, draft => {
    draft.rpcUrls.public.http = ['https://rpc.ankr.com/polygon_mumbai'] as any;
  }),
  [ChainId.ArbitrumOne]: arbitrum,
};

export const CONNECTORS: Record<WalletId, Connector> = {
  [WalletId.MetaMask]: new InjectedConnector({
    chains: SUPPORTED_CHAIN_IDS.map(chainId => CHAINS[chainId]),
    options: { shimDisconnect: true },
  }),
  [WalletId.WalletConnect]: new WalletConnectConnector({
    chains: [mainnet, ...SUPPORTED_CHAIN_IDS.map(chainId => CHAINS[chainId])],
    options: { projectId: '6fc6f515daaa4b001616766bc028bffa' },
  }),
};

export function convertMaybeWeb3Error(error: any): any {
  if (error instanceof ViemBaseError) {
    if (error instanceof UserRejectedRequestError) {
      return new WalletError(error.shortMessage, {
        code: WalletError.Codes.UserRejected,
        cause: error,
      });
    }
    if (error.cause instanceof UserRejectedRequestError) {
      return new WalletError(error.cause.shortMessage, {
        code: WalletError.Codes.UserRejected,
        cause: error.cause,
      });
    }
    return new WalletError(error.shortMessage, {
      code: WalletError.Codes.UnknownError,
      cause: error,
    });
  }
  return error;
}

export function createWagmiConfig(): Config<
  PublicClient<FallbackTransport>,
  WebSocketPublicClient<FallbackTransport>
> {
  const { publicClient, webSocketPublicClient } = configureChains(
    SUPPORTED_CHAIN_IDS.map(chainId => CHAINS[chainId]),
    [publicProvider()],
  );

  return createConfig({
    publicClient,
    webSocketPublicClient,
    connectors: SUPPORTED_WALLET_IDS.map(walletId => CONNECTORS[walletId]),
    autoConnect: true,
  });
}

export const config = createWagmiConfig();
