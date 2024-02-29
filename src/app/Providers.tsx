'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FC, ReactNode, useEffect } from 'react';
import 'lib/states';
import { syncSettingsState } from 'lib/states/settings';
import { syncWeb3State } from 'lib/states/web3';
import { theme } from 'lib/utils/mantineTheme';
import { queryClient } from 'lib/utils/queryClient';
import { ErrorHandler } from './ErrorHandler';

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    return syncSettingsState();
  }, []);

  useEffect(() => {
    return syncWeb3State();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <MantineProvider theme={theme}>
        <Notifications />
        <ErrorHandler />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
};
