export type BaseErrorOptions = {
  cause?: unknown;
  data?: Record<string, unknown>;
  expose?: boolean;
};

export class BaseError extends Error {
  cause: unknown;
  data: Record<string, unknown>;
  expose: boolean;

  constructor(message?: string, options: BaseErrorOptions = {}) {
    super(message);
    this.cause = options.cause;
    this.data = options.data ?? {};
    this.expose = options.expose ?? true;
  }

  getLocalMessage(): string {
    return this.message;
  }

  printTraceStack(): void {
    console.error(this);
    for (
      let error = this.cause;
      error != null;
      error = error instanceof BaseError ? error.cause : null
    ) {
      console.error('Caused by:', error);
    }
  }
}

export class CancelledError extends BaseError {
  constructor(message?: string, options: BaseErrorOptions = {}) {
    super(message ?? 'Cancelled', options);
    this.expose = options.expose ?? false;
  }
}

enum WalletErrorCodes {
  UnknownError = 'UnknownError',
  NotConnected = 'NotConnected',
  CommunicateFailed = 'CommunicateFailed',
  IncorrectNetwork = 'IncorrectNetwork',
  NoAccount = 'NoAccount',
  UserRejected = 'UserRejected',
  FailedToSwitchNetwork = 'FailedToSwitchNetwork',
}

export type WalletErrorOptions = BaseErrorOptions & {
  code?: WalletErrorCodes;
};

export class WalletError extends BaseError {
  static readonly Codes = WalletErrorCodes;

  code: WalletErrorCodes;

  constructor(message?: string, options: WalletErrorOptions = {}) {
    super(message, options);
    this.code = options.code ?? WalletError.Codes.UnknownError;
  }

  getLocalMessage(): string {
    return this.message;
  }
}

enum BackendErrorCodes {
  UnknownError = 'UnknownError',
  NetworkError = 'NetworkError',
  BadRequest = 'BadRequest',
  InternalServiceError = 'InternalServiceError',
  NotFound = 'NotFound',
}

export type BackendErrorOptions = BaseErrorOptions & {
  code?: BackendErrorCodes;
};

export class BackendError extends BaseError {
  static readonly Codes = BackendErrorCodes;

  code: BackendErrorCodes;

  constructor(message?: string, options: BackendErrorOptions = {}) {
    super(message, options);
    this.code = options.code ?? BackendError.Codes.UnknownError;
  }

  getLocalMessage(): string {
    return this.message;
  }
}
