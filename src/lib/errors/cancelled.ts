import { BaseError, BaseErrorOptions } from './base';

export class CancelledError extends BaseError {
  constructor(message = 'Cancelled.', options: BaseErrorOptions = {}) {
    super(message, options);
    this.expose = options.expose ?? false;
  }
}
