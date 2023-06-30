import { useWeb3React } from '@web3-react/core';
import { AddEthereumChainParameter } from '@web3-react/types';
import { Contract, ContractInterface } from 'ethers';
import { useCallback, useContext, useMemo } from 'react';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from 'utils/configs';
import { CONNECTIONS, convertConnectorError } from 'utils/connectors';
import { ChainId, WalletId } from 'utils/enums';
import { WalletError } from 'utils/errors';
import { useDappChainId, useLastConnectedWalletId } from 'utils/storage';
import { Web3Context } from 'utils/web3';

function useWeb3ContextValue() {
  const web3ContextValue = useContext(Web3Context);

  if (!web3ContextValue) {
    throw new Error('Web3 hooks must be wrapped in a <Web3ContextProvider>');
  }
  return web3ContextValue;
}

export function useWeb3State() {
  const { connector, isActive, chainId: walletChainId, account } = useWeb3React();
  const { dappChainId } = useDappChainId();

  const walletId = isActive
    ? SUPPORTED_WALLET_IDS.find(walletId => CONNECTIONS[walletId].connector === connector)
    : null;

  let chainId;

  if (walletChainId != null && SUPPORTED_CHAIN_IDS.includes(walletChainId)) {
    chainId = walletChainId as ChainId;
  } else if (dappChainId != null && SUPPORTED_CHAIN_IDS.includes(dappChainId)) {
    chainId = dappChainId as ChainId;
  } else {
    chainId = SUPPORTED_CHAIN_IDS[0];
  }

  return { walletId, chainId, walletChainId, account };
}

export function useProvider() {
  const { staticProviders, walletProvider } = useWeb3ContextValue();
  const { chainId, walletChainId } = useWeb3State();

  const provider = useMemo(() => {
    if (chainId === walletChainId && walletProvider) {
      return walletProvider;
    }
    return staticProviders[chainId];
  }, [chainId, staticProviders, walletChainId, walletProvider]);

  return provider;
}

export function useSigner() {
  const { walletProvider } = useWeb3ContextValue();
  const { chainId, walletChainId, account } = useWeb3State();

  const signer = useMemo(() => {
    const signer = walletProvider?.getUncheckedSigner(account);
    return signer != null && chainId === walletChainId && account != null ? signer : null;
  }, [account, chainId, walletChainId, walletProvider]);

  return signer;
}

export function useContract<T extends Contract = Contract>(
  address: string | null,
  abi: ContractInterface,
  readonly = true,
) {
  const provider = useProvider();
  const signer = useSigner();

  const contract = useMemo(() => {
    const signerOrProvider = readonly ? provider : signer;
    return signerOrProvider && address != null
      ? (new Contract(address, abi, signerOrProvider) as T)
      : null;
  }, [abi, address, provider, readonly, signer]);

  return contract;
}

export function useConnect() {
  const { setLastConnectedWalletId } = useLastConnectedWalletId();

  return useCallback(
    async (walletId: WalletId) => {
      const connector = CONNECTIONS[walletId].connector;
      try {
        await connector.activate();
      } catch (error) {
        throw convertConnectorError(error);
      }
      setLastConnectedWalletId(walletId);
    },
    [setLastConnectedWalletId],
  );
}

export function useDisconnect() {
  const { walletId } = useWeb3State();
  const { setLastConnectedWalletId } = useLastConnectedWalletId();

  return useCallback(async () => {
    if (walletId != null) {
      const connector = CONNECTIONS[walletId].connector;
      await connector.deactivate?.();
      await connector.resetState();
    }
    setLastConnectedWalletId(null);
  }, [setLastConnectedWalletId, walletId]);
}

export function useRestoreConnection() {
  const { lastConnectedWalletId } = useLastConnectedWalletId();

  return useCallback(() => {
    const walletId = SUPPORTED_WALLET_IDS.find(walletId => walletId === lastConnectedWalletId);
    if (walletId != null) {
      const connector = CONNECTIONS[walletId].connector;
      connector.connectEagerly?.();
    }
  }, [lastConnectedWalletId]);
}

export function useSwitchChain() {
  const { walletId } = useWeb3State();
  const { setDappChainId } = useDappChainId();

  return useCallback(
    async (chainId: ChainId) => {
      if (walletId != null) {
        const connector = CONNECTIONS[walletId].connector;
        const addChainParams: AddEthereumChainParameter = {
          chainId,
          chainName: CHAIN_CONFIGS[chainId].name,
          nativeCurrency: CHAIN_CONFIGS[chainId].nativeCurrency,
          rpcUrls: [CHAIN_CONFIGS[chainId].rpcUrl],
          blockExplorerUrls: [CHAIN_CONFIGS[chainId].explorerUrl],
        };
        try {
          try {
            await connector.activate(addChainParams);
          } catch (error: any) {
            throw convertConnectorError(error);
          }
        } catch (error: any) {
          if (error instanceof WalletError && error.code === WalletError.Codes.UnknownError) {
            throw new WalletError('Switching network failed.', {
              code: WalletError.Codes.FailedToSwitchNetwork,
              cause: error,
            });
          }
          throw error;
        }
      }
      setDappChainId(chainId);
    },
    [setDappChainId, walletId],
  );
}
