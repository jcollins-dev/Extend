import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import { testMaintenanceEventData } from 'constants/testdata';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import MaintenanceEventPartsDetail from '.';
import { default as store } from 'store';
import { CartListType } from 'types/parts/cart';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MaintenanceEventPartsDetail
          maintenanceEvent={testMaintenanceEventData[0]}
          cartViewType={CartListType.VIEW_TYPE_LESS}
          onCartViewType={jest.fn()}
          onSubmitClick={jest.fn()}
        />
      </ThemeProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});

describe('PMParts', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MaintenanceEventPartsDetail
            maintenanceEvent={testMaintenanceEventData[0]}
            cartViewType={CartListType.VIEW_TYPE_LESS}
            onCartViewType={jest.fn()}
            onSubmitClick={jest.fn()}
          />
        </ThemeProvider>
      </Provider>
    );
  });
});
