import {
  JsonRpcProvider,
  JsonRpcSigner,
  StaticJsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { MulticallWrapper } from 'ethers-multicall-provider';
import { createContext, FC, PropsWithChildren, useMemo, useState } from 'react';
import { WalletError } from 'utils/errors';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from './configs';
import { CONNECTIONS } from './connectors';
import { ChainId, WalletId } from './enums';
import { useDappChainId } from './storage';

export interface Web3StateContextValue {
  walletId: WalletId | null;
  chainId: ChainId;
  walletChainId: number | null;
  account: string | null;
  provider: JsonRpcProvider;
  signer: JsonRpcSigner | null;
}

export const Web3StateContext = createContext<Web3StateContextValue | null>(null);

const Web3ContextInnerProvider: FC<PropsWithChildren> = ({ children }) => {
  const { connector, isActive, chainId: originWalletChainId, account } = useWeb3React();
  const { dappChainId } = useDappChainId();

  const walletId = isActive
    ? SUPPORTED_WALLET_IDS.find(walletId => CONNECTIONS[walletId].connector === connector)
    : null;
  const walletChainId = isActive ? originWalletChainId : null;

  let chainId: ChainId;

  if (walletChainId != null && SUPPORTED_CHAIN_IDS.includes(walletChainId)) {
    chainId = walletChainId as ChainId;
  } else if (dappChainId != null && SUPPORTED_CHAIN_IDS.includes(dappChainId)) {
    chainId = dappChainId as ChainId;
  } else {
    chainId = SUPPORTED_CHAIN_IDS[0];
  }

  const [staticProviders] = useState(() =>
    SUPPORTED_CHAIN_IDS.reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: MulticallWrapper.wrap(new StaticJsonRpcProvider(CHAIN_CONFIGS[cur].rpcUrl)),
      }),
      {} as Record<ChainId, StaticJsonRpcProvider>,
    ),
  );

  const walletProvider = useMemo(() => {
    if (connector.provider && chainId === walletChainId) {
      return MulticallWrapper.wrap(new Web3Provider(connector.provider));
    } else {
      return null;
    }
  }, [connector.provider, chainId, walletChainId]);

  const provider = useMemo(() => {
    if (walletProvider) {
      return walletProvider;
    }
    return staticProviders[chainId];
  }, [chainId, staticProviders, walletProvider]);

  const signer = useMemo(() => {
    const signer = walletProvider?.getUncheckedSigner(account);
    return signer != null && account != null ? signer : null;
  }, [account, walletProvider]);

  return (
    <Web3StateContext.Provider
      value={{
        walletId: walletId ?? null,
        chainId,
        walletChainId: walletChainId ?? null,
        account: account?.toLowerCase() ?? null,
        provider,
        signer: signer ?? null,
      }}
    >
      {children}
    </Web3StateContext.Provider>
  );
};

export const Web3StateProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Web3ReactProvider
      connectors={SUPPORTED_WALLET_IDS.map(walletId => CONNECTIONS[walletId]).map(connection => [
        connection.connector,
        connection.hooks,
      ])}
    >
      <Web3ContextInnerProvider>{children}</Web3ContextInnerProvider>
    </Web3ReactProvider>
  );
};

export function convertMaybeWeb3Error(error: any): any {
  if (error.code === 4001) {
    return new WalletError('Request is rejected by user.', {
      code: WalletError.Codes.UserRejected,
      cause: error,
    });
  }
  if (error.code === 'ACTION_REJECTED') {
    return new WalletError('Request is rejected by user.', {
      code: WalletError.Codes.UserRejected,
      cause: error,
    });
  }
  if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
    return new WalletError('Unpredictable gas limit.', {
      code: WalletError.Codes.UnpredictableGasLimit,
      cause: error,
      data: { reason: error.reason },
    });
  }
  if (error.code === 'CALL_EXCEPTION') {
    return new WalletError('Transaction failed.', {
      code: WalletError.Codes.CallException,
      cause: error,
    });
  }
  return error;
}
