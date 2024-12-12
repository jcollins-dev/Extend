// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

// Theme
import theme from 'themes';

// Components
import PartsAssembly from './PartAssembly';

// Test data
import { testMachine } from 'constants/testdata';

describe('PartAssembly', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Router>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <PartsAssembly machine={testMachine} />
          </ThemeProvider>
        </Provider>
      </Router>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
