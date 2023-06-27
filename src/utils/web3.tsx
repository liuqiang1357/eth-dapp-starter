import { StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { useWeb3React } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { AddEthereumChainParameter, Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { MulticallWrapper } from 'ethers-multicall-provider';
import {
  createContext,
  FC,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS } from './configs';
import { ChainId, WalletId } from './enums';

export interface Web3ContextValue {
  staticProviders: Record<ChainId, StaticJsonRpcProvider>;
  walletProviderRef: RefObject<Web3Provider | null>;
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

  const walletProviderRef = useRef<Web3Provider | null>(null);

  useEffect(() => {
    (async () => {
      if (activeConnector.provider) {
        walletProviderRef.current = MulticallWrapper.wrap(
          new Web3Provider(activeConnector.provider),
        );
      } else {
        walletProviderRef.current = null;
      }
    })();
  }, [activeConnector, chainId]);

  return (
    <Web3Context.Provider value={{ staticProviders, walletProviderRef }}>
      {children}
    </Web3Context.Provider>
  );
};

const [metaMask, metaMaskHooks] = initializeConnector(actions => new MetaMask({ actions }));

class WalletConnectFixed extends WalletConnect {
  async activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter) {
    const desiredChainId =
      typeof desiredChainIdOrChainParameters === 'number'
        ? desiredChainIdOrChainParameters
        : desiredChainIdOrChainParameters?.chainId;
    await super.activate(desiredChainId);
  }
}

const [walletConnect, walletConnectHooks] = initializeConnector(
  actions =>
    new WalletConnectFixed({
      options: {
        projectId: '892908ed5f35e5a218df5bd4b4ba7828',
        chains: [1],
        optionalChains: SUPPORTED_CHAIN_IDS,
        rpcMap: SUPPORTED_CHAIN_IDS.reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: CHAIN_CONFIGS[cur].rpcUrl,
          }),
          {},
        ),
        showQrModal: true,
      },
      actions,
    }),
);

export const CONNECTIONS: Record<WalletId, { connector: Connector; hooks: Web3ReactHooks }> = {
  [WalletId.MetaMask]: { connector: metaMask, hooks: metaMaskHooks },
  [WalletId.WalletConnect]: { connector: walletConnect, hooks: walletConnectHooks },
};
