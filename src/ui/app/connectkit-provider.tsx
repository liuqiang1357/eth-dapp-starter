'use client';

import { ConnectKitProvider as Provider, Types } from 'connectkit';
import { useAtomValue } from 'jotai';
import { useTheme } from 'next-themes';
import { FC, ReactNode } from 'react';
import { chainIdAtom } from '@/lib/states/web3';
import { AccountIcon } from './account-icon';

export const ConnectKitProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  const chainId = useAtomValue(chainIdAtom);

  return (
    <Provider
      mode={resolvedTheme as Types.Mode | undefined}
      customTheme={{
        '--ck-accent-color': 'hsl(var(--primary))',
        '--ck-accent-text-color': 'hsl(var(--primary-foreground))',
      }}
      options={{
        initialChainId: chainId,
        customAvatar: AccountIcon,
      }}
    >
      {children}
    </Provider>
  );
};
