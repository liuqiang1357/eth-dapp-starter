export type BaseErrorOptions = {
  cause?: Error;
  data?: Record<string, unknown>;
  expose?: boolean;
};

export class BaseError extends Error {
  cause?: Error;
  data?: Record<string, unknown>;
  expose: boolean;

  constructor(message: string, options: BaseErrorOptions = {}) {
    super(message);
    this.cause = options.cause;
    this.data = options.data;
    this.expose = options.expose ?? true;
  }

  printTraceStack(): void {
    console.error(this);
    for (
      let error = this.cause;
      error != null;
      error = error instanceof BaseError ? error.cause : undefined
    ) {
      console.error('Caused by:', error);
    }
  }
}
