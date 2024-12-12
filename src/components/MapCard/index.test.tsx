import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18nForTests';

import store from 'store';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MapCard from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <MapCard
            lat={41.886944781182365}
            lng={-87.62542865468959}
            address={'70 W Madison St #4400, Chicago, IL 60602'}
          />
        </I18nextProvider>
      </ThemeProvider>
      ,
    </Provider>,
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
