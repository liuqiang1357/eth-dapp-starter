import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { AddEthereumChainParameter, Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { BaseError, CancelledError, WalletError } from 'utils/errors';
import { CHAIN_CONFIGS, SUPPORTED_CHAIN_IDS } from './configs';
import { WalletId } from './enums';

const [metaMask, metaMaskHooks] = initializeConnector(actions => new MetaMask({ actions }));

class WalletConnectFixed extends WalletConnect {
  async activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter) {
    const desiredChainId =
      typeof desiredChainIdOrChainParameters === 'number'
        ? desiredChainIdOrChainParameters
        : desiredChainIdOrChainParameters?.chainId;
    await super.activate(desiredChainId);
  }
}

const [walletConnect, walletConnectHooks] = initializeConnector(
  actions =>
    new WalletConnectFixed({
      options: {
        projectId: '6fc6f515daaa4b001616766bc028bffa',
        chains: [1],
        optionalChains: SUPPORTED_CHAIN_IDS,
        rpcMap: SUPPORTED_CHAIN_IDS.reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: CHAIN_CONFIGS[cur].rpcUrl,
          }),
          {},
        ),
        showQrModal: true,
      },
      actions,
    }),
);

export const CONNECTIONS: Record<WalletId, { connector: Connector; hooks: Web3ReactHooks }> = {
  [WalletId.MetaMask]: { connector: metaMask, hooks: metaMaskHooks },
  [WalletId.WalletConnect]: { connector: walletConnect, hooks: walletConnectHooks },
};

export function convertConnectorError(error: any): BaseError {
  if (error instanceof BaseError) {
    return error;
  }
  if (error.code === 4001) {
    return new WalletError(error.message, { code: WalletError.Codes.UserRejected, cause: error });
  }
  if (error.message.includes('Connection request reset') === true) {
    return new CancelledError();
  }
  if (error.message.includes('Already processing eth_requestAccounts') === true) {
    return new WalletError(error.message, { code: WalletError.Codes.UserRejected, cause: error });
  }
  if (error.message.includes('User rejected methods') === true) {
    return new WalletError(error.message, { code: WalletError.Codes.UserRejected, cause: error });
  }
  return new WalletError(error.message, { code: WalletError.Codes.UnknownError, cause: error });
}
