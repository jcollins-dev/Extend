import { AuthAction, AuthState } from 'types/auth';
import { authActions } from 'actions';

// TODO: token needs to be validatated
// TODO: token likely shouldn't be stored in `sessionStorage`, use a more secure
// mechanism, if possible
const defaultToken = sessionStorage.getItem('token');
const defaultRefreshToken = sessionStorage.getItem('refreshToken');
export const defaultAuthState = { token: defaultToken, refreshToken: defaultRefreshToken };

export default (
  state: null | AuthState = defaultAuthState,
  action: AuthAction
): null | AuthState => {
  switch (action.type) {
    case authActions.SET_TOKENS: {
      if (action.accessToken && action.refreshToken) {
        sessionStorage.setItem('token', action.accessToken);
        sessionStorage.setItem('refreshToken', action.refreshToken);
        return {
          token: action.accessToken,
          refreshToken: action.refreshToken
        };
      } else return state;
    }
    case authActions.DELETE_TOKENS: {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      return null;
    }
    default:
      return state;
  }
};
