import { createStore } from '@udecode/zustood';
import { getAccount, getNetwork, watchAccount, watchNetwork } from '@wagmi/core';
import { Address } from 'viem';
import { SUPPORTED_WALLET_IDS } from 'utils/configs';
import { WalletId } from 'utils/models';
import { CONNECTORS } from 'utils/web3';

export const web3Store = createStore('web3')({
  walletId: null as WalletId | null,
  walletChainId: null as number | null,
  account: null as Address | null,
}).extendActions(set => ({
  registerListeners: () => {
    watchAccount(() => {
      const account = getAccount();
      const walletId = account.isConnected
        ? SUPPORTED_WALLET_IDS.find(walletId => CONNECTORS[walletId] === account.connector)
        : null;
      const address = account.address != null ? (account.address.toLowerCase() as Address) : null;
      set.mergeState({ walletId: walletId ?? null, account: address ?? null });
    });

    watchNetwork(() => {
      const network = getNetwork();
      const walletChainId = network.chain?.id ?? null;
      set.mergeState({ walletChainId: walletChainId ?? null });
    });
  },
}));
