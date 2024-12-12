import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import HelpEmailForm from './HelpEmail';

describe('Help Email', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <HelpEmailForm
              businessUnits={[
                {
                  id: 1,
                  name: 'someName'
                }
              ]}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
