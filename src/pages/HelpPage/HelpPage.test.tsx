import React from 'react';
import ReactDOM from 'react-dom';
import HelpPage from './HelpPage';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';

// Theme
import theme from 'themes';

// State management
import { default as store } from 'store';

describe('HelpPage', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <HelpPage />
        </ThemeProvider>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
