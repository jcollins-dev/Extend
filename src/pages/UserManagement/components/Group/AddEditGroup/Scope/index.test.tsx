import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import Scope from 'pages/UserManagement/components/Group/AddEditGroup/Scope/index';

describe('Scope', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Scope
              onScopeDetail={() => {}}
              counts={{ organizations: '2', plants: '3', machines: '5' }}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
