import { configureStore } from '@reduxjs/toolkit';
import { errorsSlice } from './slices/errors';
import { uiSlice } from './slices/ui';

export const store = configureStore({
  reducer: {
    [errorsSlice.name]: errorsSlice.reducer,
    [uiSlice.name]: uiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(),
});

export type Store = typeof store;
export type Dispatch = Store['dispatch'];
export type GetState = Store['getState'];
export type State = ReturnType<GetState>;
