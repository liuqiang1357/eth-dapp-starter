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

export function registerErrorListeners(): void {
  window.addEventListener('error', event => {
    event.preventDefault();
    publishError(event.error);
  });
  window.addEventListener('unhandledrejection', event => {
    event.preventDefault();
    publishError(event.reason);
  });
}

registerErrorListeners();
