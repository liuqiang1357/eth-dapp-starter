import { getAccount, getChainId, reconnect, watchAccount, watchChainId } from '@wagmi/core';
import { proxy } from 'valtio';
import { Address } from 'viem';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_WALLET_IDS } from 'utils/configs';
import { WalletId } from 'utils/models';
import { config } from 'utils/web3';

export const web3State = proxy({
  walletId: null as WalletId | null,
  walletChainId: null as number | null,
  account: null as Address | null,
  chainId: SUPPORTED_CHAIN_IDS[0],
});

export function syncWeb3State(): () => void {
  reconnect(config);

  const updateAccount = () => {
    const account = getAccount(config);
    web3State.walletId = SUPPORTED_WALLET_IDS.includes(account.connector?.id as WalletId)
      ? (account.connector?.type as WalletId)
      : null;
    web3State.walletChainId =
      web3State.walletId != null && account.chainId != null ? account.chainId : null;
    web3State.account =
      web3State.walletId != null && account.address != null ? account.address : null;
  };

  updateAccount();
  const accountDisposer = watchAccount(config, {
    onChange: updateAccount,
  });

  const updateChainId = () => {
    const chainId = getChainId(config);
    web3State.chainId = SUPPORTED_CHAIN_IDS.includes(chainId) ? chainId : SUPPORTED_CHAIN_IDS[0];
  };

  updateChainId();
  const chainIdDisposer = watchChainId(config, {
    onChange: updateChainId,
  });

  return () => {
    accountDisposer();
    chainIdDisposer();
  };
}
