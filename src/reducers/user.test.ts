import { defaultUser, default as userReducer } from './user';
import { userActions } from 'actions';

const retrievedUser = {
  id: '1',
  firstName: 'Spicy',
  lastName: 'Churro',
  email: 'spicy@jbtc.com',
  organizations: []
};

describe('User reducer', () => {
  it('It should return the default user state if no action is passed.', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(defaultUser);
  });

  it('It should return the new user data if given a new user and the UPDATE_USER action', () => {
    expect(userReducer(defaultUser, { type: userActions.LOGIN_USER, user: retrievedUser })).toEqual(
      retrievedUser
    );
  });

  it('It should return the default user if given a new user but no action', () => {
    expect(userReducer(defaultUser, { type: '', user: retrievedUser })).toEqual(defaultUser);
  });

  it('It should return default user data if given no user and the UPDATE_USER action', () => {
    expect(userReducer(defaultUser, { type: userActions.LOGIN_USER })).toEqual(defaultUser);
  });
});
