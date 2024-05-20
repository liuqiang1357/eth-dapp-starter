import { BaseError, BaseErrorOptions } from './base';

export class Web3Error extends BaseError {}

export class ChainMismatchError extends Web3Error {
  constructor(message = 'Chain mismatch.', options: BaseErrorOptions = {}) {
    super(message, options);
  }
}

export class UserRejectedRequestError extends Web3Error {
  constructor(message = 'User rejected request.', options: BaseErrorOptions = {}) {
    super(message, options);
  }
}
