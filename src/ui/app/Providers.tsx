'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { FC, ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { store } from 'lib/utils/jotai';
import { mantineTheme } from 'lib/utils/mantine';
import { rainbowkitTheme } from 'lib/utils/rainbowkit';
import { queryClient } from 'lib/utils/reactQuery';
import { wagmiConfig } from 'lib/utils/wagmi';
import { AccountIcon } from 'ui/app/AccountIcon';
import { ErrorHandler } from './ErrorHandler';

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <JotaiProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <WagmiProvider config={wagmiConfig}>
          <RainbowKitProvider theme={rainbowkitTheme} avatar={AccountIcon} locale="en">
            <MantineProvider theme={mantineTheme}>
              <Notifications />
              <ErrorHandler />
              {children}
            </MantineProvider>
          </RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
};
