import { proxy } from 'valtio';
import { convertMaybeViemError } from 'utils/web3';

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
  const errorEventListener = (event: ErrorEvent) => {
    event.preventDefault();
    publishError(event.error);
  };

  const promiseRejectionEventListener = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    publishError(event.reason);
  };

  window.addEventListener('error', errorEventListener);
  window.addEventListener('unhandledrejection', promiseRejectionEventListener);

  return () => {
    window.removeEventListener('error', errorEventListener);
    window.removeEventListener('unhandledrejection', promiseRejectionEventListener);
  };
}
