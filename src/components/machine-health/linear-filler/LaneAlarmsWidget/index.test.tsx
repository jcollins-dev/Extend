import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import LaneAlarmsWidget from '.';

describe('LaneAlarmsWidget', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <LaneAlarmsWidget />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
