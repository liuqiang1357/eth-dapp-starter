'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { FC, ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { store } from '@/lib/utils/jotai';
import { queryClient } from '@/lib/utils/react-query';
import { wagmiConfig } from '@/lib/utils/wagmi';
import { Toaster } from '@/ui/shadcn/sonner';
import { ConnectKitProvider } from './connectkit-provider';
import { ErrorHandler } from './error-handler';

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <JotaiProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <WagmiProvider config={wagmiConfig}>
          <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <ConnectKitProvider>
              <Toaster />
              <ErrorHandler />
              {children}
            </ConnectKitProvider>
          </NextThemesProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
};
