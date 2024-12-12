import configureStore from 'redux-mock-store';

import { default as store } from './index';
import { default as middlewares } from 'middleware';
import { userActions } from 'actions';
import { defaultUser } from 'reducers/user';
import { UserAction } from 'types';

const mockStore = configureStore(middlewares);

describe('Store', () => {
  it('It should match have the same user state as the mock state.', () => {
    const mockState = mockStore(defaultUser).getState();
    expect(store.getState().user).toBe(mockState);
  });
});
