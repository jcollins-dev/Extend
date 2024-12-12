import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import VersionHistoryFlyout from '.';
import store from 'store';
import { Provider } from 'react-redux';

describe('< VersionHistoryFlyout />', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <VersionHistoryFlyout onClose={() => jest.fn()} />
        </ThemeProvider>
      </Provider>
    );
  });
});
