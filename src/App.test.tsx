import { render, screen } from '@testing-library/react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { default as store } from 'store';

import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from 'constants/authConfig';

import App from './App';

describe('App container', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </Provider>,
      div
    );
  });
});
