import { BaseError, BaseErrorOptions } from './base';

export class EthereumError extends BaseError {}

export class ChainMismatchError extends EthereumError {
  constructor(message = 'Chain mismatch.', options: BaseErrorOptions = {}) {
    super(message, options);
  }
}

export class UserRejectedRequestError extends EthereumError {
  constructor(message = 'User rejected request.', options: BaseErrorOptions = {}) {
    super(message, options);
  }
}

export class ConnectorNotConnectedError extends EthereumError {
  constructor(message = 'Wallet not connected.', options: BaseErrorOptions = {}) {
    super(message, options);
  }
}
