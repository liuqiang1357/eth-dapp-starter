import { BaseError, BaseErrorOptions } from './base';

export class UnknownWeb3Error extends BaseError {}

export class ChainMismatchError extends BaseError {
  constructor(message = 'Chain mismatch.', options: BaseErrorOptions = {}) {
    super(message, options);
  }
}

export class UserRejectedRequestError extends BaseError {
  constructor(message = 'User rejected request.', options: BaseErrorOptions = {}) {
    super(message, options);
  }
}
