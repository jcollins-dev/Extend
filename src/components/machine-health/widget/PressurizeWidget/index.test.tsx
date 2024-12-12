import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import PressurizeWidget from '.';

describe('Pressurize Widget', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <PressurizeWidget
              kpi={{
                key: 'pressurize',
                values: []
              }}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
