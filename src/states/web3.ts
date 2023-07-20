import { getAccount, getNetwork, watchAccount, watchNetwork } from '@wagmi/core';
import { proxy } from 'valtio';
import { derive } from 'valtio/utils';
import { Address } from 'viem';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from 'utils/configs';
import { ChainId, WalletId } from 'utils/models';
import { CONNECTORS } from 'utils/web3';
import { settingsState } from './settings';

const wagmiState = proxy({
  walletId: null as WalletId | null,
  walletChainId: null as number | null,
  account: null as Address | null,
});

export const web3State = derive(
  {
    chainId: get => {
      const walletChainId = get(wagmiState).walletChainId;
      if (walletChainId != null && SUPPORTED_CHAIN_IDS.includes(walletChainId)) {
        return walletChainId as ChainId;
      } else {
        return get(settingsState).dappChainId;
      }
    },
  },
  { proxy: wagmiState },
);

export function registerWeb3Listeners(): () => void {
  const accountListenerDisposer = watchAccount(() => {
    const account = getAccount();
    web3State.walletId = account.isConnected
      ? SUPPORTED_WALLET_IDS.find(walletId => CONNECTORS[walletId] === account.connector) ?? null
      : null;
    web3State.account = account.address != null ? (account.address.toLowerCase() as Address) : null;
  });

  const networkListenerDisposer = watchNetwork(() => {
    const network = getNetwork();
    web3State.walletChainId = network.chain?.id ?? null;
  });

  return () => {
    accountListenerDisposer();
    networkListenerDisposer();
  };
}
