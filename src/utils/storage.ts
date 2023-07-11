import { useLocalStorage } from '@liuqiang1357/react-use-storage';

export const DAPP_CHAIN_ID = 'DAPP_CHAIN_ID';

export function useDappChainId(): {
  dappChainId: number | null;
  setDappChainId: (chainId: number | null) => void;
} {
  const [dappChainId, setDappChainId] = useLocalStorage<number | null>(DAPP_CHAIN_ID, null);
  return { dappChainId, setDappChainId };
}

export const LAST_CONNECTED_WALLET_ID = 'LAST_CONNECTED_WALLET_ID';

export function useLastConnectedWalletId(): {
  lastConnectedWalletId: string | null;
  setLastConnectedWalletId: (walletId: string | null) => void;
} {
  const [lastConnectedWalletId, setLastConnectedWalletId] = useLocalStorage<string | null>(
    LAST_CONNECTED_WALLET_ID,
    null,
  );
  return { lastConnectedWalletId, setLastConnectedWalletId };
}
