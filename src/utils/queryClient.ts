import { QueryCache, QueryClient } from '@tanstack/react-query';
import { publishError } from 'states/errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
    },
  },
  queryCache: new QueryCache({
    onError: error => {
      publishError(error);
    },
  }),
});
