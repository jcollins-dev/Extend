import { Action } from 'types';

export type AuthState = {
  token: string | null;
  refreshToken: string | null;
};

export interface AuthResponseBody {
  access_token?: string;
  refresh_token?: string;
}

export interface AuthAction extends Action {
  accessToken?: string;
  refreshToken?: string;
}
