'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { FC, ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { store } from 'lib/utils/jotai';
import { queryClient } from 'lib/utils/react-query';
import { wagmiConfig } from 'lib/utils/wagmi';
import { Toaster } from 'ui/shadcn/toaster';
import { ErrorHandler } from './error-handler';
import { RainbowKitProvider } from './rainbowkit-provider';

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <JotaiProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <WagmiProvider config={wagmiConfig}>
          <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <RainbowKitProvider>
              <Toaster />
              <ErrorHandler />
              {children}
            </RainbowKitProvider>
          </NextThemesProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
};
