import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MatrixWidget from './MatrixWidget';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

describe('Chart Tag Data', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MatrixWidget
              data={{
                id: 'test',
                widgetClass: 'test',
                active: true
              }}
              machineId="test"
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
