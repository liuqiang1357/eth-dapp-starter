import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';
import { errorsState } from './errors';
import { settingsState } from './settings';
import { uiState } from './ui';
import { web3State } from './web3';

devtools(
  proxy({
    errors: errorsState,
    settings: settingsState,
    ui: uiState,
    web3: web3State,
  }),
);
