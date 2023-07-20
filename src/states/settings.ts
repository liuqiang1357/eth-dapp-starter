import { merge } from 'lodash-es';
import { proxy, subscribe } from 'valtio';
import { SUPPORTED_CHAIN_IDS } from 'utils/configs';

const SETTINGS_KEY = 'SETTINGS';

export const settingsState = proxy({
  dappChainId: SUPPORTED_CHAIN_IDS[0],
});

export function syncSettingsState(): () => void {
  const raw = localStorage.getItem(SETTINGS_KEY);
  const persisted = raw != null ? JSON.parse(raw) : null;

  if (!SUPPORTED_CHAIN_IDS.includes(persisted?.dappChainId)) {
    delete persisted?.dappChainId;
  }
  merge(settingsState, persisted);

  return subscribe(settingsState, () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsState));
  });
}
