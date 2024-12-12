import { authActions, cartActions, userActions } from 'actions';
import { camelCaseKeysDeep } from 'helpers';
import { useDispatch } from 'react-redux';
import { BaseType, User } from 'types';
import { AuthResponseBody } from 'types/auth';

import { AnalyticsCategories, UserAnalyticsEventActions } from 'constants/analytics';
import { enableAnalyticsForUser, generateAnalyticsEvent } from 'helpers/analytics';

// Auth utils
export interface Auth {
  signin: (username: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
}

export default function useAuth(): Auth {
  const dispatch = useDispatch();

  const login = (token: string, refreshToken: string, user: User) => {
    dispatch({ type: userActions.LOGIN_USER, user: user });
    dispatch({ type: authActions.SET_TOKENS, accessToken: token, refreshToken: refreshToken });
    dispatch({ type: cartActions.SET_CART_USER_ID, userId: user.id });
    generateAnalyticsEvent({
      category: AnalyticsCategories.USER,
      action: UserAnalyticsEventActions.LOGIN,
      label: `Login via login page`
    });
  };
  const logout = async () => {
    dispatch({ type: userActions.LOGOUT_USER });
    dispatch({ type: authActions.DELETE_TOKENS });
    dispatch({ type: cartActions.DELETE_CART_USER_ID });
    generateAnalyticsEvent({
      category: AnalyticsCategories.USER,
      action: UserAnalyticsEventActions.LOGOUT,
      label: `Logout: (user email TBD)`
    });
    window.location.reload();
  };

  const signin = async (username: string, password: string): Promise<void> => {
    let response: Response;
    try {
      // TODO: maybe extract API URLS
      response = await fetch(`${process.env.REACT_APP_API}/token`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username,
          password
        }),
        mode: 'cors',
        credentials: 'include'
      });
    } catch (err) {
      console.error(
        'Unable to authenticate, potentially backend server is unavailable. Error:',
        err
      );
      throw new Error(
        `Unable to authenticate, potentially backend server is unavailable. Error: ${err}`
      );
    }

    if (!response.ok) {
      const status = response.status;
      if (status === 401 || status === 403) {
        throw new Error('Invalid username or password');
      } else if (status >= 500 && status < 600) {
        throw new Error(`Unable to authenticate, potentially service is unavailable`);
      }
      throw new Error(`Unavailable at this time`);
    }

    let body: AuthResponseBody;
    try {
      body = (await response.json()) as AuthResponseBody;
    } catch (err) {
      throw new Error(`Unable to parse server response. Error: ${err}`);
    }

    const { access_token: accessToken, refresh_token: refreshToken } = body;
    if (
      !accessToken ||
      typeof accessToken !== 'string' ||
      !refreshToken ||
      typeof refreshToken !== 'string'
    ) {
      throw new Error(`Unable to parse token from response.`);
    }

    // validate the token we just got from the authentication request
    try {
      fetch(`${process.env.REACT_APP_API}/users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        mode: 'cors'
      }).then(async (response) => {
        body = await response.json();
        if (!response.ok) {
          logout();
        } else {
          const user = camelCaseKeysDeep(body as BaseType) as unknown as User;
          enableAnalyticsForUser(user);
          login(accessToken, refreshToken, user);
        }
      });
    } catch (err) {
      console.error('Failed to manually validate token. Forcing logout.');
      logout();
    }
  };

  const signout = async () => {
    // TODO: eventually communicate this to auth provider
    logout();
  };

  return {
    signin,
    signout
  };
}
