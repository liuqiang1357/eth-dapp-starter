import { getAccount, getNetwork, watchAccount, watchNetwork } from '@wagmi/core';
import { proxy, subscribe } from 'valtio';
import { derive } from 'valtio/utils';
import { Address } from 'viem';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from 'utils/configs';
import { WalletError } from 'utils/errors';
import { ChainId, WalletId } from 'utils/models';
import { CONNECTORS } from 'utils/web3';
import { settingsState } from './settings';

export const web3State = proxy({
  walletId: null as WalletId | null,
  walletChainId: null as number | null,
  account: null as Address | null,

  derived: derive({
    dappChainId: get => get(settingsState).local.dappChainId,
  }),

  get chainId() {
    if (this.walletChainId != null && SUPPORTED_CHAIN_IDS.includes(this.walletChainId)) {
      return this.walletChainId as ChainId;
    } else {
      return this.derived.dappChainId;
    }
  },
});

export function syncWeb3State(): () => void {
  const accountDisposer = watchAccount(() => {
    const account = getAccount();
    web3State.walletId = account.isConnected
      ? SUPPORTED_WALLET_IDS.find(walletId => CONNECTORS[walletId] === account.connector) ?? null
      : null;
    web3State.account = account.address != null ? (account.address.toLowerCase() as Address) : null;
  });

  const networkDisposer = watchNetwork(() => {
    const network = getNetwork();
    web3State.walletChainId = network.chain?.id ?? null;
  });

  const chainIdDisposer = subscribe(web3State, () => {
    settingsState.local.dappChainId = web3State.chainId;
  });

  return () => {
    accountDisposer();
    networkDisposer();
    chainIdDisposer();
  };
}

export async function switchChain(chainId: ChainId): Promise<void> {
  if (web3State.walletId != null) {
    const connector = CONNECTORS[web3State.walletId];
    if (connector.switchChain) {
      await connector.switchChain(chainId);
    } else {
      throw new WalletError('Switching network failed.', {
        code: WalletError.Codes.FailedToSwitchNetwork,
      });
    }
  }
  settingsState.local.dappChainId = chainId;
}
