import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import DSISite from '.';

describe('DSI', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <DSISite
              isShowEntireFleet={true}
              showEntireFleet={() => {}}
              type="MACHINE"
              plantId="0013600000vxEDNAA2"
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
