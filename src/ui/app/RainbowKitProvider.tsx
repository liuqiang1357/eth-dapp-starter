'use client';

import { RainbowKitProvider as Provider } from '@rainbow-me/rainbowkit';
import { useTheme } from 'next-themes';
import { FC, ReactNode } from 'react';
import { rainbowkitDarkTheme, rainbowkitLightTheme } from 'lib/utils/rainbowkit';
import { AccountIcon } from './AccountIcon';

export const RainbowKitProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  return (
    <Provider
      theme={resolvedTheme === 'light' ? rainbowkitLightTheme : rainbowkitDarkTheme}
      avatar={AccountIcon}
      locale="en"
    >
      {children}
    </Provider>
  );
};
