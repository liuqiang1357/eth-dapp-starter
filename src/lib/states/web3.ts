import {
  getAccount,
  GetAccountReturnType,
  getChainId,
  watchAccount,
  watchChainId,
} from '@wagmi/core';
import { atom } from 'jotai';
import { chainIds } from '@/configs/chains';
import { wagmiConfig } from '../utils/wagmi';

const chainIdBaseAtom = atom(chainIds[0]);

chainIdBaseAtom.onMount = setAtom => {
  const update = () => setAtom(getChainId(wagmiConfig));
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
