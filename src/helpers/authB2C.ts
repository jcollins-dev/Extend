import * as msal from '@azure/msal-browser';
import { authActions, cartActions, userActions } from 'actions';
import { AnalyticsCategories, UserAnalyticsEventActions } from 'constants/analytics';
import { loginRequest, msalConfig } from 'constants/authConfig';
import { Dispatch } from 'redux';
import { generateAnalyticsEvent } from './analytics';

export const getB2CAccessToken = (dispatch: Dispatch): void => {
  const instance = new msal.PublicClientApplication(msalConfig);
  const account = instance.getActiveAccount();
  if (account) {
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: account
      })
      .then((tokenResponse) => {
        if (!tokenResponse.fromCache) {
          dispatch({
            type: authActions.SET_TOKENS,
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.accessToken
          });
        }
      })
      .catch((error) => {
        if (error instanceof msal.InteractionRequiredAuthError) {
          logout(dispatch, instance);
        }
      });
  }
};

const logout = (dispatch: Dispatch, instance: msal.PublicClientApplication) => {
  dispatch({ type: userActions.LOGOUT_USER });
  dispatch({ type: authActions.DELETE_TOKENS });
  dispatch({ type: cartActions.DELETE_CART_USER_ID });
  generateAnalyticsEvent({
    category: AnalyticsCategories.USER,
    action: UserAnalyticsEventActions.LOGOUT,
    label: `Logout: (user email TBD)`
  });
  instance.logoutRedirect({
    ...loginRequest
  });
};
