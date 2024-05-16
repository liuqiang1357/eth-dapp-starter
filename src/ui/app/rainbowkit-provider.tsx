'use client';

import { RainbowKitProvider as Provider } from '@rainbow-me/rainbowkit';
import { useAtomValue } from 'jotai';
import { useTheme } from 'next-themes';
import { FC, ReactNode, useEffect, useState } from 'react';
import { chainIdAtom } from 'lib/states/web3';
import { rainbowkitDarkTheme, rainbowkitLightTheme } from 'lib/utils/rainbowkit';
import { AccountIcon } from './account-icon';

export const RainbowKitProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  const [theme, setTheme] = useState(rainbowkitLightTheme);

  const chainId = useAtomValue(chainIdAtom);

  useEffect(() => {
    setTheme(resolvedTheme === 'light' ? rainbowkitLightTheme : rainbowkitDarkTheme);
  }, [resolvedTheme]);

  return (
    <Provider theme={theme} avatar={AccountIcon} locale="en" initialChain={chainId}>
      {children}
    </Provider>
  );
};
