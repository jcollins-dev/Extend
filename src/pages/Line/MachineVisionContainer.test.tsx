import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import KPIWitContainer from './MachineVisionContainer';

describe('Machine Vision Container', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <KPIWitContainer />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
