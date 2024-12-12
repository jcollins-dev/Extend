import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import ConfigFileModal from '.';
import { noop } from 'lodash';

describe('UserManagement', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ConfigFileModal open={true} machineId="" onClose={noop} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
