// Third party
import { combineReducers } from 'redux';
import { iopsApi } from 'api';

// All reducers
import { default as user } from './user';
import { default as auth } from './auth/auth';
import { default as cart } from './cart';
import { default as help } from './help';
import { default as report } from './report';
import { default as tanStackTableFilterOptions } from './tanStackTable';

const reducers = combineReducers({
  user,
  [iopsApi.reducerPath]: iopsApi.reducer,
  tokens: auth,
  cart,
  help,
  report,
  tanStackTableFilterOptions
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
