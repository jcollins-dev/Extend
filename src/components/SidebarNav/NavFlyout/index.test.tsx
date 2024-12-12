import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import NavFlyout from '.';
import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';
import { Provider } from 'react-redux';
import { default as store } from 'store';
import i18n from 'i18nForTests';
import { I18nextProvider } from 'react-i18next';

it('it should render', () => {
  const div = document.createElement('div');
  const ref = {
    current: null
  };
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NavFlyout showing={true} setShow={jest.fn()} parentRef={ref} />
        </I18nextProvider>
      </Provider>
    </ThemeProvider>,
    div
  );
});
