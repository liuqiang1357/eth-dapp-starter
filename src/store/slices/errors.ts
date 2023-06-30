import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from 'store';
import { createAsyncThunk } from 'utils/misc';
import { convertMaybeEthersError } from 'utils/web3';

export const errorsSlice = createSlice({
  name: 'errorsSlice',
  initialState: {
    lastError: null as Error | null,
  },
  reducers: {
    publishError: (state, action: PayloadAction<Error>) => {
      state.lastError = action.payload;
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
      const error = convertMaybeEthersError(event.error);
      if (error instanceof Error) {
        dispatch(publishError(error));
      }
    });
    window.addEventListener('unhandledrejection', event => {
      event.preventDefault();
      const error = convertMaybeEthersError(event.reason);
      if (error instanceof Error) {
        dispatch(publishError(error));
      }
    });
  },
);

export function selectLastError(state: State): Error | null {
  return state.errorsSlice.lastError;
}
