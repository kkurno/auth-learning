import config from './config';

const ACCESS_TOKEN_KEY = `${config.projectUniqueKey}-cmVmcmVzaCB0b2tlbg==`;
export const accessTokenHandler = {
  get: (): string | null => (typeof localStorage !== 'undefined' ? localStorage : { getItem: () => null }).getItem(ACCESS_TOKEN_KEY),
  set: (v: string): void => (typeof localStorage !== 'undefined' ? localStorage : { setItem: () => {} }).setItem(ACCESS_TOKEN_KEY, v),
  clear: (): void => (typeof localStorage !== 'undefined' ? localStorage : { removeItem: () => {} }).removeItem(ACCESS_TOKEN_KEY),
};
