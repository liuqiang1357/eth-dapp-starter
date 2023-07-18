import { createStore } from '@udecode/zustood';

export const uiStore = createStore('ui')({
  walletsPopoverOpen: false,
}).extendActions(set => ({
  setWalletsPopoverOpen: (open: boolean) => set.walletsPopoverOpen(open),
}));
