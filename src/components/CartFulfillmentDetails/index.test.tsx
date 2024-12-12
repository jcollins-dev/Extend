// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';

// Theme
import { default as theme } from 'themes';

// Components
import CartFulfillmentDetails from '.';

// Types
import { CartOrderDetails } from 'types';

// Statemanagement
import { default as store } from 'store';

it('It should mount', () => {
  const cartOrderDetails: CartOrderDetails = {
    billingAddress: {
      streetAddress: '',
      city: '',
      state: '',
      postalCode: ''
    },
    billee: {
      firstName: '',
      lastName: ''
    },
    creator: '',
    approver: '',
    customerPoNumber: ''
  };

  const mock = jest.fn();
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CartFulfillmentDetails orderDetails={cartOrderDetails} handleUpdate={mock} />
      </ThemeProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
