import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import KPIInformationWidget from 'components/machine-health/widget/KPIInformationWidget/index';

describe('KPIInformationWidget', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <KPIInformationWidget>
              <div />
            </KPIInformationWidget>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
