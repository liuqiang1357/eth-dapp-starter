import { merge } from 'lodash-es';
import { proxy, subscribe } from 'valtio';
import { SUPPORTED_CHAIN_IDS } from 'utils/configs';

const SETTINGS = 'SETTINGS';

export const settingsState = proxy({
  dappChainId: SUPPORTED_CHAIN_IDS[0],
});

export function syncSettings(): void {
  const raw = localStorage.getItem(SETTINGS);
  const persisted = raw != null ? JSON.parse(raw) : null;

  if (!SUPPORTED_CHAIN_IDS.includes(persisted?.dappChainId)) {
    delete persisted?.dappChainId;
  }
  merge(settingsState, persisted);

  subscribe(settingsState, () => {
    localStorage.setItem(SETTINGS, JSON.stringify(settingsState));
  });
}

syncSettings();
