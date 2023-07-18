import { createStore } from '@udecode/zustood';
import { produce } from 'immer';
import { SUPPORTED_CHAIN_IDS } from 'utils/configs';
import { ChainId } from 'utils/models';

export const settingsStore = createStore('settings')(
  {
    dappChainId: SUPPORTED_CHAIN_IDS[0],
  },
  {
    persist: {
      enabled: true,
      merge: (persistedState: any, currentState) => {
        const mergedState: typeof currentState = {
          ...currentState,
          ...persistedState,
        };
        return produce(mergedState, mergedState => {
          const { dappChainId } = persistedState ?? {};
          if (dappChainId == null || !SUPPORTED_CHAIN_IDS.includes(dappChainId)) {
            mergedState.dappChainId = currentState.dappChainId;
          }
        });
      },
    },
  },
).extendActions(set => ({
  setDappChainId: (chainId: ChainId) => set.dappChainId(chainId),
}));
