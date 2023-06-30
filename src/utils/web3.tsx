import { StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { MulticallWrapper } from 'ethers-multicall-provider';
import { createContext, FC, PropsWithChildren, useEffect, useState } from 'react';
import { WalletError } from 'utils/errors';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS } from './configs';
import { ChainId } from './enums';

export interface Web3ContextValue {
  staticProviders: Record<ChainId, StaticJsonRpcProvider>;
  walletProvider: Web3Provider | null;
}

export const Web3Context = createContext<Web3ContextValue | null>(null);

export const Web3ContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [staticProviders] = useState(() =>
    SUPPORTED_CHAIN_IDS.reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: MulticallWrapper.wrap(new StaticJsonRpcProvider(CHAIN_CONFIGS[cur].rpcUrl)),
      }),
      {} as Record<ChainId, StaticJsonRpcProvider>,
    ),
  );
  const { connector: activeConnector, chainId } = useWeb3React();

  const [walletProvider, setWalletProvider] = useState<Web3Provider | null>(null);

  useEffect(() => {
    if (activeConnector.provider) {
      const provider = MulticallWrapper.wrap(new Web3Provider(activeConnector.provider));
      setWalletProvider(provider);
    } else {
      setWalletProvider(null);
    }
  }, [activeConnector, chainId]);

  return (
    <Web3Context.Provider value={{ staticProviders, walletProvider }}>
      {children}
    </Web3Context.Provider>
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
