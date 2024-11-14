import { QueryCache, QueryClient } from '@tanstack/react-query';
import { stringify } from 'viem';
import { lastErrorAtom } from '../states/errors';
import { store } from './jotai';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000,
      retryDelay: 0,
      queryKeyHashFn: stringify,
    },
  },
  queryCache: new QueryCache({
    onError: error => {
      store.set(lastErrorAtom, error);
    },
  }),
});
