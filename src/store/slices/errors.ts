import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from 'store';
import { createAsyncThunk } from 'utils/misc';
import { convertMaybeWeb3Error } from 'utils/web3';

export const errorsSlice = createSlice({
  name: 'errorsSlice',
  initialState: {
    lastError: null as Error | null,
  },
  reducers: {
    publishError: (state, action: PayloadAction<unknown>) => {
      const error = convertMaybeWeb3Error(action.payload);
      if (error instanceof Error) {
        state.lastError = error;
      }
    },
    clearError: (state, action: PayloadAction<Error>) => {
      if (state.lastError === action.payload) {
        state.lastError = null;
      }
    },
  },
});

export const { publishError, clearError } = errorsSlice.actions;

export const registerErrorHandler = createAsyncThunk(
  'registerErrorHandler',
  async (arg, { dispatch }) => {
    window.addEventListener('error', event => {
      event.preventDefault();
      dispatch(publishError(event.error));
    });
    window.addEventListener('unhandledrejection', event => {
      event.preventDefault();
      dispatch(publishError(event.reason));
    });
  },
);

export function selectLastError(state: State): Error | null {
  return state.errorsSlice.lastError;
}
