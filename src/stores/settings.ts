import { createStore } from '@udecode/zustood';
import { produce } from 'immer';
import { SUPPORTED_CHAIN_IDS } from 'utils/configs';

export const settingsStore = createStore('settings')(
  {
    dappChainId: SUPPORTED_CHAIN_IDS[0],
  },
  {
    persist: {
      enabled: true,
      merge: (persistedState, currentState) => {
        const mergedState: typeof currentState = {
          ...currentState,
          ...(persistedState as any),
        };
        return produce(mergedState, draft => {
          const { dappChainId } = persistedState ?? ({} as any);
          if (dappChainId == null || !SUPPORTED_CHAIN_IDS.includes(dappChainId)) {
            draft.dappChainId = currentState.dappChainId;
          }
        });
      },
    },
  },
);
