import {
  JsonRpcProvider,
  JsonRpcSigner,
  StaticJsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { MulticallWrapper } from 'ethers-multicall-provider';
import { createContext, FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { WalletError } from 'utils/errors';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from './configs';
import { CONNECTIONS } from './connectors';
import { ChainId, WalletId } from './enums';
import { useDappChainId } from './storage';

export interface Web3ContextValue {
  walletId: WalletId | null;
  chainId: ChainId;
  walletChainId: number | null;
  account: string | null;
  provider: JsonRpcProvider;
  signer: JsonRpcSigner | null;
}

export const Web3Context = createContext<Web3ContextValue | null>(null);

const Web3ContextInnerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [staticProviders] = useState(() =>
    SUPPORTED_CHAIN_IDS.reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: MulticallWrapper.wrap(new StaticJsonRpcProvider(CHAIN_CONFIGS[cur].rpcUrl)),
      }),
      {} as Record<ChainId, StaticJsonRpcProvider>,
    ),
  );
  const [walletProvider, setWalletProvider] = useState<Web3Provider | null>(null);

  const { connector, isActive, chainId: walletChainId, account } = useWeb3React();
  const { dappChainId } = useDappChainId();

  const walletId = isActive
    ? SUPPORTED_WALLET_IDS.find(walletId => CONNECTIONS[walletId].connector === connector)
    : null;

  let chainId: ChainId;

  if (walletChainId != null && SUPPORTED_CHAIN_IDS.includes(walletChainId)) {
    chainId = walletChainId as ChainId;
  } else if (dappChainId != null && SUPPORTED_CHAIN_IDS.includes(dappChainId)) {
    chainId = dappChainId as ChainId;
  } else {
    chainId = SUPPORTED_CHAIN_IDS[0];
  }

  const provider = useMemo(() => {
    if (chainId === walletChainId && walletProvider) {
      return walletProvider;
    }
    return staticProviders[chainId];
  }, [chainId, staticProviders, walletChainId, walletProvider]);

  const signer = useMemo(() => {
    const signer = walletProvider?.getUncheckedSigner(account);
    return signer != null && chainId === walletChainId && account != null ? signer : null;
  }, [account, chainId, walletChainId, walletProvider]);

  useEffect(() => {
    if (connector.provider) {
      const provider = MulticallWrapper.wrap(new Web3Provider(connector.provider));
      setWalletProvider(provider);
    } else {
      setWalletProvider(null);
    }
  }, [connector, walletChainId]);

  return (
    <Web3Context.Provider
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
    </Web3Context.Provider>
  );
};

export const Web3ContextProvider: FC<PropsWithChildren> = ({ children }) => {
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

export function convertMaybeEthersError(error: any): any {
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
