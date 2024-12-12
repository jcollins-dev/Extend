import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { default as store } from 'store';
import CartOrderReview from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <CartOrderReview />
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
