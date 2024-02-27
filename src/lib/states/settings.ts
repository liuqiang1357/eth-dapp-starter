import { merge, pick } from 'lodash-es';
import { proxy, subscribe } from 'valtio';

const SETTINGS_KEY = 'SETTINGS';

export const settingsState = proxy({
  local: {},
  session: {},
});

function syncLocalSettingsState() {
  const raw = localStorage.getItem(SETTINGS_KEY);

  const persisted = raw != null ? JSON.parse(raw) : {};
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
