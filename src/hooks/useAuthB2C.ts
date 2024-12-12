// 3rd party libraries
import { authActions, cartActions, userActions } from 'actions';
import { useDispatch } from 'react-redux';
import { AuthResponseBody } from 'types/auth';
import { useMsal } from '@azure/msal-react';
import { useState } from 'react';
import jwt_decode from 'jwt-decode';
import { isEmpty } from 'lodash';

// Constants
import { AnalyticsCategories, UserAnalyticsEventActions } from 'constants/analytics';

// helpers
import { BaseType, User } from 'types';
import { camelCaseKeysDeep } from 'helpers';
import { enableAnalyticsForUser, generateAnalyticsEvent } from 'helpers/analytics';
import { getB2CAccessToken } from 'helpers/authB2C';
import { useAuthToken } from 'selectors';

// Auth utils
export interface Auth {
  getAccessToken: () => void;
  getUserResources: () => void;
  signout: () => Promise<void>;
}

export default function useAuth(): Auth {
  const dispatch = useDispatch();
  const { instance } = useMsal();
  const [, setAuthPending] = useState(true);
  const [authToken] = useState(useAuthToken());

  const setAccessToken = (accessToken: string) => {
    dispatch({ type: authActions.SET_TOKENS, accessToken: accessToken, refreshToken: accessToken });
    setAuthPending(false);
  };

  const getAccessToken = (): void => {
    const account = instance.getActiveAccount();
    if (account) {
      getB2CAccessToken(dispatch);
    } else {
      // handleRedirectPromise is called and awaited on both the redirectUri page
      // redirectUri page will initiate a redirect back to the page that originally invoked loginRedirect and that page will process the token response
      instance
        .handleRedirectPromise()
        .then((tokenResponse) => {
          if (tokenResponse?.accessToken) {
            setAccessToken(tokenResponse.accessToken);
          }
          setAuthPending(false);
        })
        .catch((error) => {
          // Handle error
          console.error('Failed getting access token: ', error);
          setAuthPending(false);
        });
    }
  };

  const getUserResources = (): void => {
    getB2CAccessToken(dispatch);
    let body: AuthResponseBody;
    try {
      fetch(`${process.env.REACT_APP_API}/users/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        mode: 'cors'
      })
        .then(async (response) => {
          console.log('returned....');
          body = await response.json();
          if (response.ok) {
            const user = camelCaseKeysDeep(body as BaseType) as unknown as User;
            const decodedToken: { enable_ap_permission: boolean; permissions: string } = jwt_decode(
              authToken ?? ''
            );
            const permissions =
              decodedToken?.enable_ap_permission &&
              decodedToken?.permissions &&
              !isEmpty(decodedToken?.permissions)
                ? JSON.parse(decodedToken?.permissions)
                : [];
            dispatch({
              type: userActions.LOGIN_USER,
              user: {
                ...user,
                enable_ap_permission: decodedToken?.enable_ap_permission,
                permissions
              }
            });
            dispatch({ type: cartActions.SET_CART_USER_ID, userId: user.id });
            enableAnalyticsForUser(user);
            generateAnalyticsEvent({
              category: AnalyticsCategories.USER,
              action: UserAnalyticsEventActions.LOGIN,
              label: `Login via login page`
            });
          } else {
            console.log('Bad Response:...', response);
          }
        })
        .catch((error) => {
          console.log('Auth data error: ', error);
        });
    } catch (err) {
      console.error('Failed to fetch user resources.');
    }
  };

  const signout = async () => {
    logout();
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
    instance.logoutRedirect();
  };

  return {
    getAccessToken,
    getUserResources,
    signout
  };
}
