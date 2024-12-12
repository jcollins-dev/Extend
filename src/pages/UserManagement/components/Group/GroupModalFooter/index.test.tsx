import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { noop } from 'lodash';
import theme from 'themes';
import store from 'store';
import GroupModalFooter from '.';

describe('GroupModalFooter', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <GroupModalFooter onClose={noop} onCloseVerifyData={noop} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
