import config from './config';
import { APIResponse, ErrorResponse, ErrorResponseMessage, APIError } from './constants';
import { accessTokenHandler } from './local-storage';

const defaultErrorResponse:ErrorResponse = { success: false as const, error_code: 500, error_message: ErrorResponseMessage.SOMETHING_WENT_WRONG };

const processFetch = <T = any>(res: any) => (
  Promise.all([res.ok, res.json()])
    .then(([ok, response]) => {
      if (!ok) {
        throw new APIError({
          error_code: response.error_code ?? defaultErrorResponse.error_code,
          error_message: response.error_message ?? defaultErrorResponse.error_message,
        });
      }
      if (!response.success) {
        throw new APIError({
          error_code: response.error_code ?? defaultErrorResponse.error_code,
          error_message: response.error_message ?? defaultErrorResponse.error_message,
        });
      }
      return Promise.resolve(response as APIResponse<T>);
    })
);
const processCatch = (e: any, reThrow?: boolean): ErrorResponse => {
  const errObj = {
    success: false as const,
    error_code: e.error_code ?? defaultErrorResponse.error_code,
    error_message: e.error_message ?? defaultErrorResponse.error_message,
  };
  if (reThrow) {
    throw new APIError(errObj);
  }
  return errObj;
};

type TOption = {
  headers?: RequestInit['headers'];
  body?: Record<string, any>;
  file?: FormData;
  reThrow?: boolean;
  includeAccessToken?: boolean;
};

export function getErrorResponseMessageKey(errorMessage: string): keyof (typeof ErrorResponseMessage) {
  const key = Object.keys(ErrorResponseMessage).find((ek) => {
    const errorResponseMessageKey = ek as keyof (typeof ErrorResponseMessage);
    return ErrorResponseMessage[errorResponseMessageKey] === errorMessage;
  }) as keyof (typeof ErrorResponseMessage);
  if (!key) return 'SOMETHING_WENT_WRONG';
  return key;
}

const api = {
  get: <T>(url: string, option: TOption = {}): Promise<APIResponse<T>> => {
    const { headers = {} } = option;
    const accessToken = accessTokenHandler.get();
    return fetch(`${config.apiBasePath}${url}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    }).then((res) => processFetch<T>(res)).catch((e) => processCatch(e, option.reThrow));
  },
  post: <T>(url: string, option: TOption = {}): Promise<APIResponse<T>> => {
    const { headers = {}, file, body = {} } = option;
    const accessToken = accessTokenHandler.get();
    return fetch(`${config.apiBasePath}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(!file ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      credentials: 'include',
      body: file || JSON.stringify(body),
    }).then((res) => processFetch<T>(res)).catch((e) => processCatch(e, option.reThrow));
  },
  delete: <T>(url: string, option: TOption = {}): Promise<APIResponse<T>> => {
    const { body = {}, headers = {} } = option;
    const accessToken = accessTokenHandler.get();
    return fetch(`${config.apiBasePath}${url}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    }).then((res) => processFetch<T>(res)).catch((e) => processCatch(e, option.reThrow));
  },
  put: <T>(url: string, option: TOption = {}): Promise<APIResponse<T>> => {
    const { body = {}, headers = {} } = option;
    const accessToken = accessTokenHandler.get();
    return fetch(`${config.apiBasePath}${url}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    }).then((res) => processFetch<T>(res)).catch((e) => processCatch(e, option.reThrow));
  },
  patch: <T>(url: string, option: TOption = {}): Promise<APIResponse<T>> => {
    const { body = {}, headers = {} } = option;
    const accessToken = accessTokenHandler.get();
    return fetch(`${config.apiBasePath}${url}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    }).then((res) => processFetch<T>(res)).catch((e) => processCatch(e, option.reThrow));
  }
};

export default api;
