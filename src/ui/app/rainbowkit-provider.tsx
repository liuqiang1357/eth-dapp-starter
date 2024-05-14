'use client';

import { RainbowKitProvider as Provider } from '@rainbow-me/rainbowkit';
import { useAtomValue } from 'jotai';
import { useTheme } from 'next-themes';
import { FC, ReactNode } from 'react';
import { chainIdAtom } from 'lib/states/web3';
import { rainbowkitDarkTheme, rainbowkitLightTheme } from 'lib/utils/rainbowkit';
import { AccountIcon } from './account-icon';

export const RainbowKitProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  const chainId = useAtomValue(chainIdAtom);

  return (
    <Provider
      theme={resolvedTheme === 'light' ? rainbowkitLightTheme : rainbowkitDarkTheme}
      avatar={AccountIcon}
      locale="en"
      initialChain={chainId}
    >
      {children}
    </Provider>
  );
};
