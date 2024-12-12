import ReactDOM from 'react-dom';
import B2CLogin from '.';
import { Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from 'constants/authConfig';

// Theme
import theme from 'themes';
import { createMemoryHistory } from 'history';

// Store
import { default as store } from 'store';

it('It should mount', () => {
  const div = document.createElement('div');
  const history = createMemoryHistory();
  const state = { from: { pathname: '/' } };
  history.push('/', state);

  ReactDOM.render(
    <Router history={history}>
      <Provider store={store}>
        <MsalProvider instance={msalInstance}>
          <ThemeProvider theme={theme}>
            <B2CLogin />
          </ThemeProvider>
        </MsalProvider>
      </Provider>
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
