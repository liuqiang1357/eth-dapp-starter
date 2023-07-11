import { AddEthereumChainParameter } from '@web3-react/types';
import { Contract, ContractInterface } from 'ethers';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { CHAIN_CONFIGS, SUPPORTED_WALLET_IDS } from 'utils/configs';
import { CONNECTIONS, convertConnectorError } from 'utils/connectors';
import { ChainId, WalletId } from 'utils/enums';
import { WalletError } from 'utils/errors';
import { useDappChainId, useLastConnectedWalletId } from 'utils/storage';
import { Web3Context, Web3ContextValue } from 'utils/web3';

export function useWeb3State(): Web3ContextValue {
  const web3State = useContext(Web3Context);

  if (!web3State) {
    throw new Error('Web3 hooks must be wrapped in a <Web3ContextProvider>');
  }
  return web3State;
}

export function useContract<T extends Contract = Contract>(
  address: string | null,
  abi: ContractInterface,
  readonly = false,
): T | null {
  const { provider, signer } = useWeb3State();

  const contract = useMemo(() => {
    const signerOrProvider = readonly ? provider : signer;
    return signerOrProvider && address != null
      ? (new Contract(address, abi, signerOrProvider) as T)
      : null;
  }, [abi, address, provider, readonly, signer]);

  return contract;
}

export function useConnect(): (walletId: WalletId) => Promise<void> {
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

export function useDisconnect(): () => Promise<void> {
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

export function useRestoreConnection(): () => void {
  const { lastConnectedWalletId } = useLastConnectedWalletId();

  return useCallback(() => {
    const walletId = SUPPORTED_WALLET_IDS.find(walletId => walletId === lastConnectedWalletId);
    if (walletId != null) {
      const connector = CONNECTIONS[walletId].connector;
      connector.connectEagerly?.();
    }
  }, [lastConnectedWalletId]);
}

export function useSwitchChain(): (chainId: ChainId) => Promise<void> {
  const { walletId, chainId } = useWeb3State();
  const { setDappChainId } = useDappChainId();

  useEffect(() => {
    setDappChainId(chainId);
  }, [chainId, setDappChainId]);

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
