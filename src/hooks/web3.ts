import { useCallback, useEffect } from 'react';
import { Address } from 'viem';
import { settingsStore } from 'stores/settings';
import { web3Store } from 'stores/web3';
import { SUPPORTED_CHAIN_IDS } from 'utils/configs';
import { WalletError } from 'utils/errors';
import { ChainId, WalletId } from 'utils/models';
import { CONNECTORS } from 'utils/web3';

export function useWeb3State(): {
  walletId: WalletId | null;
  walletChainId: number | null;
  chainId: ChainId;
  account: Address | null;
} {
  const { walletId, walletChainId, account } = web3Store.useStore();
  const dappChainId = settingsStore.use.dappChainId();

  let chainId: ChainId;
  if (walletChainId != null && SUPPORTED_CHAIN_IDS.includes(walletChainId)) {
    chainId = walletChainId as ChainId;
  } else {
    chainId = dappChainId;
  }

  return { walletId, walletChainId, chainId, account };
}

export function useSwitchChain(): (chainId: ChainId) => Promise<void> {
  const { walletId, chainId } = useWeb3State();

  useEffect(() => {
    settingsStore.set.dappChainId(chainId);
  }, [chainId]);

  return useCallback(
    async (chainId: ChainId) => {
      if (walletId != null) {
        const connector = CONNECTORS[walletId];
        if (connector.switchChain) {
          await connector.switchChain(chainId);
        } else {
          throw new WalletError('Switching network failed.', {
            code: WalletError.Codes.FailedToSwitchNetwork,
          });
        }
      }
      settingsStore.set.dappChainId(chainId);
    },
    [walletId],
  );
}
