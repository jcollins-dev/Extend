import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';

import { FleetBreadCrumbs } from './FleetBreadCrumbs';
import { default as theme } from 'themes';

describe('FleetBreadCrumbs', () => {
  it('It renders', () => {
    const handleEdit = jest.fn();
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <FleetBreadCrumbs
              handleEdit={handleEdit}
              paths={{
                customer: {
                  label: `customer`,
                  slug: `/fleet`
                },
                site: {
                  label: 'site',
                  slug: `/fleet/site`
                },
                line: {
                  label: 'line',
                  slug: `/customer/line/234sdfw234sdfcv`
                },
                machine: {
                  label: 'machine',
                  slug: `/customer/line/234sdfw234sdfcv`
                }
              }}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
