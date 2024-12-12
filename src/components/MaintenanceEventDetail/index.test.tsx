import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18nForTests';

import { testMaintenanceEventData } from 'constants/testdata';
import MaintenanceEventDetail from '.';
import { CartListType } from 'types/parts/cart';
import { Provider } from 'react-redux';
import { default as store } from 'store';

const renderComponent = () => {
  render(
    <Router>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <MaintenanceEventDetail
              maintenanceEventId={testMaintenanceEventData[0].id}
              cartViewType={CartListType.VIEW_TYPE_LESS}
              onClose={jest.fn()}
              onCartViewType={jest.fn()}
            />
          </I18nextProvider>
        </Provider>
      </ThemeProvider>
    </Router>
  );
};

describe('MaintenanceEventDetail', () => {
  it('Renders', () => {
    renderComponent();
  });

  it('should display a button Contact JBT which redirects to help page', () => {
    renderComponent();
    expect(screen.getByText('Contact JBT')).toBeInTheDocument();

    expect(
      screen
        .getByRole('link', {
          name: /contact jbt/i
        })
        .getAttribute('href')
    ).toBe('/help');
  });
});
