/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useWeb3React } from '@web3-react/core';
import { AddEthereumChainParameter } from '@web3-react/types';
import { Contract, ContractInterface } from 'ethers';
import { useCallback, useContext } from 'react';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from 'utils/configs';
import { ChainId, WalletId } from 'utils/enums';
import { WalletError } from 'utils/errors';
import { useDappChainId, useLastConnectedWalletId } from 'utils/storage';
import { CONNECTIONS, Web3Context } from 'utils/web3';

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

export function useGetProvider() {
  const { staticProviders, walletProviderRef } = useWeb3ContextValue();
  const { chainId, walletChainId } = useWeb3State();

  return useCallback(async () => {
    if (chainId === walletChainId && walletProviderRef.current) {
      return walletProviderRef.current;
    }
    return staticProviders[chainId];
  }, [chainId, staticProviders, walletChainId, walletProviderRef]);
}

export function useGetSigner() {
  const { walletProviderRef } = useWeb3ContextValue();
  const { chainId, walletChainId, account } = useWeb3State();

  return useCallback(async () => {
    const signer = walletProviderRef.current?.getSigner();

    if (signer == null) {
      throw new WalletError('Not Connected.', { code: WalletError.Codes.NotConnected });
    }
    if (chainId !== walletChainId) {
      throw new WalletError('Incorrect Network.', { code: WalletError.Codes.IncorrectNetwork });
    }
    if (account == null) {
      throw new WalletError('No Account.', { code: WalletError.Codes.NoAccount });
    }
    return signer;
  }, [account, chainId, walletChainId, walletProviderRef]);
}

export function useGetContract() {
  const getProvider = useGetProvider();
  const getSigner = useGetSigner();

  return useCallback(
    async <T extends Contract = Contract>(
      address: string,
      abi: ContractInterface,
      readonly = true,
    ) => {
      const providerOrSigner = readonly ? await getProvider() : await getSigner();
      return new Contract(address, abi, providerOrSigner) as T;
    },
    [getProvider, getSigner],
  );
}

export function useConnect() {
  const { setLastConnectedWalletId } = useLastConnectedWalletId();

  return useCallback(
    async (walletId: WalletId) => {
      const connector = CONNECTIONS[walletId].connector;
      await connector.activate();
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
        };
        await connector.activate(addChainParams);
      }
      setDappChainId(chainId);
    },
    [setDappChainId, walletId],
  );
}
