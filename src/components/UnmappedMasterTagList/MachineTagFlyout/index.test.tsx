import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import store from 'store';
import { Provider } from 'react-redux';
import MachineTagFlyout from '.';

describe('< MachineTagFlyout />', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MachineTagFlyout onClose={() => jest.fn()} />
        </ThemeProvider>
      </Provider>
    );
  });
});
