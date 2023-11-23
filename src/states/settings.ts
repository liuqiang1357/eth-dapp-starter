import { merge, pick } from 'lodash-es';
import { proxy, subscribe } from 'valtio';
import { SUPPORTED_CHAIN_IDS } from 'utils/configs';
import { ChainId } from 'utils/models';

const SETTINGS_KEY = 'SETTINGS';

export const settingsState = proxy({
  local: {
    dappChainId: null as ChainId | null,
  },
  session: {},
});

function syncLocalSettingsState() {
  const raw = localStorage.getItem(SETTINGS_KEY);

  const persisted = raw != null ? JSON.parse(raw) : {};
  if (!SUPPORTED_CHAIN_IDS.includes(persisted.dappChainId)) {
    persisted.dappChainId = SUPPORTED_CHAIN_IDS[0];
  }
  merge(settingsState.local, pick(persisted, Object.keys(settingsState.local)));

  return subscribe(settingsState.local, () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsState.local));
  });
}

function syncSessionSettingsState() {
  const raw = sessionStorage.getItem(SETTINGS_KEY);

  const persisted = raw != null ? JSON.parse(raw) : {};
  merge(settingsState.session, pick(persisted, Object.keys(settingsState.session)));

  return subscribe(settingsState.session, () => {
    sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsState.session));
  });
}

export function syncSettingsState(): () => void {
  const localDisposer = syncLocalSettingsState();
  const sessionDisposer = syncSessionSettingsState();

  return () => {
    localDisposer();
    sessionDisposer();
  };
}
