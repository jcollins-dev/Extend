import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import OEETooltip from './OEETooltip';
import moment from 'moment';

describe('OEE Tooltip', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <OEETooltip
              dateDomain={[moment(new Date())]}
              oee={{
                data: [1],
                color: 'red'
              }}
              performance={{
                data: [1],
                color: 'red'
              }}
              availability={{
                data: [1],
                color: 'red'
              }}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
