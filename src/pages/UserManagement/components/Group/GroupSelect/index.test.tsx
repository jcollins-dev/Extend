import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { noop } from 'lodash';
import theme from 'themes';
import store from 'store';
import GroupSelect from '.';

describe('GroupSelect', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <GroupSelect onChangeGroup={noop} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
