// Types
import { User, UserAction } from 'types';

// Actions
import { userActions } from 'actions';
import { cloneDeep } from 'lodash';

export const defaultUser = JSON.parse(sessionStorage.getItem('user') as string);

export default (userState = defaultUser, action: UserAction): User => {
  switch (action.type) {
    case userActions.LOGIN_USER: {
      const { user } = action;
      if (user) {
        const userClone = cloneDeep(user);
        sessionStorage.setItem('user', JSON.stringify(userClone));
        return { ...userClone };
      } else return userState;
    }
    case userActions.LOGOUT_USER: {
      return defaultUser;
    }
    default: {
      return userState;
    }
  }
};
