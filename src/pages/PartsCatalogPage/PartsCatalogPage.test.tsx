// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { default as store } from 'store';

// Components
import PartsCatalogPage from './PartsCatalogPage';
import { CatalogCard } from 'components';

// Theme
import { default as theme } from 'themes';

// Constants
import { JBTRoutes } from 'constants/routes';

// Redux actions
import { authActions } from 'actions';

describe('PartsCatalogPage', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    store.dispatch({ type: authActions.SET_TOKENS, authToken: 'password', refreshToken: null });
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[JBTRoutes.partsCatalog]}>
          <ThemeProvider theme={theme}>
            <Route path={JBTRoutes.partsCatalog}>
              <PartsCatalogPage />
            </Route>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should load zero <CatalogCard> element', () => {
    const testElement = (
      <Provider store={store}>
        <MemoryRouter initialEntries={[JBTRoutes.partsCatalog]}>
          <ThemeProvider theme={theme}>
            <Route path={JBTRoutes.partsCatalog}>
              <PartsCatalogPage />
            </Route>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );

    const testRenderer = TestRenderer.create(testElement);
    const testInstance = testRenderer.root;

    expect(testInstance.findAllByType(CatalogCard).length).toBe(0);
  });
});
