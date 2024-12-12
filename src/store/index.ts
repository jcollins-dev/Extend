// Third party
import { configureStore } from '@reduxjs/toolkit';

// Middleware
import { default as middlewares } from 'middleware';

// Reducers
import { default as reducer } from 'reducers';

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...middlewares)
});

export default store;
