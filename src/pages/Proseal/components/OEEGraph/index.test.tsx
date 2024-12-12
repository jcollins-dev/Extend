import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import OEEGraph from '.';
import moment from 'moment';

describe('OEE Graph', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <OEEGraph startDate={moment(new Date())} endDate={moment(new Date())} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
