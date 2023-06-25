import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State } from 'store';

export const uiSlice = createSlice({
  name: 'uiSlice',
  initialState: {
    walletsPopoverOpen: false,
  },
  reducers: {
    setWalletsPopoverOpen: (state, action: PayloadAction<boolean>) => {
      state.walletsPopoverOpen = action.payload;
    },
  },
});

export const { setWalletsPopoverOpen } = uiSlice.actions;

export function selectWalletsPopoverOpen(state: State): boolean {
  return state.uiSlice.walletsPopoverOpen;
}
