import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import LineDurationChart from '.';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

describe('LineDurationChart', () => {
  it('renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <LineDurationChart lineId={'000'} lineName="Line" />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
