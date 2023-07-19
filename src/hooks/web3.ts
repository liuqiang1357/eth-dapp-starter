import { useCallback, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import { settingsState } from 'states/settings';
import { web3State } from 'states/web3';
import { WalletError } from 'utils/errors';
import { ChainId } from 'utils/models';
import { CONNECTORS } from 'utils/web3';

export function useWeb3State() {
  return useSnapshot(web3State);
}

export function useSwitchChain() {
  const { walletId, chainId } = useWeb3State();

  useEffect(() => {
    settingsState.dappChainId = chainId;
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
      settingsState.dappChainId = chainId;
    },
    [walletId],
  );
}
