import { useCallback, useContext, useEffect } from 'react';
import { ChainId } from 'utils/enums';
import { WalletError } from 'utils/errors';
import { useDappChainId } from 'utils/storage';
import { CONNECTORS, Web3StateContext, Web3StateContextValue } from 'utils/web3';

export function useWeb3State(): Web3StateContextValue {
  const web3State = useContext(Web3StateContext);

  if (!web3State) {
    throw new Error('Web3 hooks must be wrapped in a <Web3StateProvider>');
  }
  return web3State;
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
        const connector = CONNECTORS[walletId];
        if (connector.switchChain) {
          await connector.switchChain(chainId);
        } else {
          throw new WalletError('Switching network failed.', {
            code: WalletError.Codes.FailedToSwitchNetwork,
          });
        }
      }
      setDappChainId(chainId);
    },
    [setDappChainId, walletId],
  );
}
