import { createStore } from '@udecode/zustood';
import { convertMaybeWeb3Error } from 'utils/web3';

export const errorsStore = createStore('errors')({
  lastError: null as Error | null,
})
  .extendActions((set, get) => ({
    publishError: (error: unknown) => {
      const finalError = convertMaybeWeb3Error(error);
      if (finalError instanceof Error) {
        set.lastError(finalError);
      }
    },
    clearError: (error: Error) => {
      if (get.lastError() === error) {
        set.lastError(null);
      }
    },
  }))
  .extendActions(set => ({
    registerListeners: () => {
      window.addEventListener('error', event => {
        event.preventDefault();
        set.publishError(event.error);
      });
      window.addEventListener('unhandledrejection', event => {
        event.preventDefault();
        set.publishError(event.reason);
      });
    },
  }));
