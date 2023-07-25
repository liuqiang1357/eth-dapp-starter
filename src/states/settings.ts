import { merge } from 'lodash-es';
import { proxy, subscribe } from 'valtio';
import { SUPPORTED_CHAIN_IDS } from 'utils/configs';

const SETTINGS_KEY = 'SETTINGS';

export const settingsState = proxy({
  local: {
    dappChainId: SUPPORTED_CHAIN_IDS[0],
  },
  session: {},
});

function syncLocalSettingsState() {
  const raw = localStorage.getItem(SETTINGS_KEY);

  if (raw != null) {
    const persisted = JSON.parse(raw);
    if (!SUPPORTED_CHAIN_IDS.includes(persisted.dappChainId)) {
      delete persisted.dappChainId;
    }
    merge(settingsState.local, persisted);
  }

  return subscribe(settingsState.local, () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsState.local));
  });
}

function syncSessionSettingsState() {
  const raw = sessionStorage.getItem(SETTINGS_KEY);

  if (raw != null) {
    const persisted = JSON.parse(raw);
    merge(settingsState.session, persisted);
  }

  return subscribe(settingsState.session, () => {
    sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsState.session));
  });
}

export function syncSettingsState(): () => void {
  const localSettingsDisposer = syncLocalSettingsState();
  const sessionSettingsDisposer = syncSessionSettingsState();

  return () => {
    localSettingsDisposer();
    sessionSettingsDisposer();
  };
}
