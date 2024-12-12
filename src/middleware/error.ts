// 3rd party libraries
import { MiddlewareAPI, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';

// Actions
import { authActions, userActions } from 'actions';

export const errorMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  // Check if request to API failed with a 401 and redirect unset the token,
  // it's likely expired.
  if (isRejectedWithValue(action) && action?.payload?.status === 401) {
    const b2cflag: boolean = process.env.REACT_APP_ENABLE_B2C == 'true';
    if (!b2cflag) {
      const { dispatch } = api;
      dispatch({ type: authActions.DELETE_TOKENS });
      dispatch({ type: userActions.LOGOUT_USER });
    }
  }

  return next(action);
};

export default errorMiddleware;
