import { useQuery } from '@tanstack/react-query';
import { arbitrum, Chain, mainnet, polygonMumbai } from '@wagmi/chains';
import { Connector } from '@wagmi/connectors';
import { InjectedConnector } from '@wagmi/connectors/injected';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
import {
  Address,
  configureChains,
  createConfig,
  getAccount,
  getNetwork,
  getPublicClient,
  getWalletClient,
  PublicClient,
  WalletClient,
  watchAccount,
  watchNetwork,
} from '@wagmi/core';
import { publicProvider } from '@wagmi/core/providers/public';
import { createContext, FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { UserRejectedRequestError, BaseError as ViemBaseError } from 'viem';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from './configs';
import { ChainId, WalletId } from './enums';
import { WalletError } from './errors';
import { useDappChainId } from './storage';

export const CHAINS: Record<ChainId, Chain> = {
  [ChainId.PolygonMumbai]: polygonMumbai,
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

const { publicClient, webSocketPublicClient } = configureChains(
  SUPPORTED_CHAIN_IDS.map(chainId => CHAINS[chainId]),
  [publicProvider()],
);

createConfig({
  publicClient,
  webSocketPublicClient,
  connectors: SUPPORTED_WALLET_IDS.map(walletId => CONNECTORS[walletId]),
  autoConnect: true,
});

export interface Web3StateContextValue {
  walletId: WalletId | null;
  walletChainId: number | null;
  chainId: ChainId;
  account: Address | null;
  publicClient: PublicClient;
  walletClient: WalletClient | null;
}

export const Web3StateContext = createContext<Web3StateContextValue | null>(null);

export const Web3StateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState(getAccount);
  useEffect(() => watchAccount(setAccount), []);

  const [network, setNetwork] = useState(getNetwork);
  useEffect(() => watchNetwork(setNetwork), []);

  const walletId = account.isConnected
    ? SUPPORTED_WALLET_IDS.find(walletId => CONNECTORS[walletId] === account.connector)
    : null;
  const walletChainId = account.isConnected ? network.chain?.id : null;
  const address = account.address != null ? (account.address.toLowerCase() as Address) : null;

  const { dappChainId } = useDappChainId();

  let chainId: ChainId;
  if (walletChainId != null && SUPPORTED_CHAIN_IDS.includes(walletChainId)) {
    chainId = walletChainId as ChainId;
  } else if (dappChainId != null && SUPPORTED_CHAIN_IDS.includes(dappChainId)) {
    chainId = dappChainId as ChainId;
  } else {
    chainId = SUPPORTED_CHAIN_IDS[0];
  }

  const publicClient = useMemo(() => getPublicClient({ chainId }), [chainId]);

  const { data: walletClient } = useQuery({
    queryKey: ['walletClient', { chainId }] as const,
    queryFn: ({ queryKey: [, { chainId }] }) => getWalletClient({ chainId }),
  });

  return (
    <Web3StateContext.Provider
      value={{
        walletId: walletId ?? null,
        walletChainId: walletChainId ?? null,
        chainId,
        account: address ?? null,
        publicClient,
        walletClient: walletClient ?? null,
      }}
    >
      {children}
    </Web3StateContext.Provider>
  );
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
