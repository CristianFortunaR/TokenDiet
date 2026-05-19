export type OptimizerErrorCode = 'MISSING_KEY_ERROR' | 'API_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';

export class OptimizerError extends Error {
  public code: OptimizerErrorCode;

  constructor(message: string, code: OptimizerErrorCode) {
    super(message);
    this.name = 'OptimizerError';
    this.code = code;
  }
}
