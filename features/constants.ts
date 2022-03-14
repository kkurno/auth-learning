export const ErrorResponseMessage = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  API_NOT_FOUND: 'API_NOT_FOUND',
  SOMETHING_WENT_WRONG: 'SOMETHING_WENT_WRONG',
  BAD_REQUEST: 'BAD_REQUEST',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY',
};

export interface ErrorResponse {
  success: false;
  error_code: number;
  error_message: string;
}

export type APIResponse<Custom = { [key: string]: any }> = ({
  success: true;
} & Custom) | ErrorResponse;

export class APIError extends Error {
  readonly success = false;
  error_code: number;
  error_message: string;

  constructor(errRes: Omit<ErrorResponse, 'success'>) {
    super(errRes.error_message);
    this.error_code = errRes.error_code;
    this.error_message = errRes.error_message;
  }
}
