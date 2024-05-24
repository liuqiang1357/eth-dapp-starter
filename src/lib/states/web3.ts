import {
  getAccount,
  GetAccountReturnType,
  getChainId,
  watchAccount,
  watchChainId,
} from '@wagmi/core';
import { atom } from 'jotai';
import { supportedChainIds } from 'configs/chains';
import { wagmiConfig } from 'lib/utils/wagmi';

const chainIdBaseAtom = atom(supportedChainIds[0]);

chainIdBaseAtom.onMount = setAtom => {
  const update = () => {
    const chainId = getChainId(wagmiConfig);
    setAtom(supportedChainIds.includes(chainId) ? chainId : supportedChainIds[0]);
  };
  update();
  return watchChainId(wagmiConfig, { onChange: update });
};

export const chainIdAtom = atom(get => get(chainIdBaseAtom));

const getAccountResultAtom = atom<GetAccountReturnType | null>(null);

getAccountResultAtom.onMount = setAtom => {
  const update = () => setAtom(getAccount(wagmiConfig));
  update();
  return watchAccount(wagmiConfig, { onChange: update });
};

export const walletChainIdAtom = atom(get => get(getAccountResultAtom)?.chainId);

export const accountAtom = atom(get => get(getAccountResultAtom)?.address);
