import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import DateSlider from '.';

describe('Date Slider', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <DateSlider
              value={new Date()}
              min={new Date()}
              max={new Date()}
              tz="someTz"
              onChange={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
