import { proxy } from 'valtio';
import { convertMaybeViemError } from 'lib/utils/web3';

export const errorsState = proxy({
  lastError: null as Error | null,
});

export function publishError(error: unknown): void {
  const finalError = convertMaybeViemError(error);
  if (finalError instanceof Error) {
    errorsState.lastError = finalError;
  }
}

export function clearError(error: Error): void {
  if (errorsState.lastError === error) {
    errorsState.lastError = null;
  }
}

export function syncErrorsState(): () => void {
  const errorListener = (event: ErrorEvent) => {
    event.preventDefault();
    publishError(event.error);
  };

  const rejectionListener = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    publishError(event.reason);
  };

  window.addEventListener('error', errorListener);
  window.addEventListener('unhandledrejection', rejectionListener);

  return () => {
    window.removeEventListener('error', errorListener);
    window.removeEventListener('unhandledrejection', rejectionListener);
  };
}
