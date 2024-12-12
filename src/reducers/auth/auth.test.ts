import { default as authReducer, defaultAuthState } from './auth';

import { authActions } from 'actions';

describe('Auth reducer', () => {
  // not to be taken as security advice
  const token = 'my-password-is-password';
  const refreshToken = 'my-refresh-token';

  it('It should have no auth token set by default', () => {
    expect(authReducer(defaultAuthState, { type: '' })).toEqual({
      token: null,
      refreshToken: null
    });
  });

  it('It should return the auth token properly if the auth token is set', () => {
    expect(
      authReducer(defaultAuthState, {
        type: authActions.SET_TOKENS,
        accessToken: token,
        refreshToken: refreshToken
      })
    ).toEqual({ token: token, refreshToken: refreshToken });
  });

  it('It should properly unset the auth token', () => {
    expect(
      authReducer({ token: token, refreshToken: refreshToken }, { type: authActions.DELETE_TOKENS })
    ).toEqual(null);
  });
});
