// 3rd party libraries
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18nForTests';

// Theme
import theme from 'themes';

// Statemanagement
import { default as store } from 'store';

// Components
import ProductDetail from './ProductDetail';

// Types and Enums
import { testProduct, testMachine } from 'constants/testdata';

// Types
import { PriceError, LeadTimeError } from 'types/parts';

const AVURE_TEL = '+1.513.433.2496';
const AVURE_EMAIL = 'sparesHPP@jbtc.com';
const PROTEIN_TEL = '+1.866.JBT.4YOU';
const PROTEIN_EMAIL = 'naparts@jbtc.com';

describe('ProductDetail', () => {
  it('It should display correct data', () => {
    render(
      <Provider store={store}>
        <Router>
          <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
              <ProductDetail product={testProduct} machine={testMachine} />
            </I18nextProvider>
          </ThemeProvider>
        </Router>
      </Provider>
    );

    expect(screen.getByText(testProduct.description as string)).toBeInTheDocument();
    expect(screen.getByText(testProduct.overview as string)).toBeInTheDocument();
    expect(screen.getByText('$2,000.00')).toBeInTheDocument();
    expect(screen.getByText('$195.99')).toBeInTheDocument();
    expect(screen.getByText('Low stock')).toBeInTheDocument();
    expect(
      screen.getByText(`JBT #${testProduct.stockCode || testProduct.sku}`)
    ).toBeInTheDocument();
    expect(screen.getByText('Discontinued.')).toBeInTheDocument();
    expect(screen.getByText('Ships in 22 days')).toBeInTheDocument();
    expect(screen.getByText('Machine 1, Machine 2')).toBeInTheDocument();
  });

  it('Displays errors when present in the response', () => {
    render(
      <Provider store={store}>
        <Router>
          <ThemeProvider theme={theme}>
            <ProductDetail
              product={{
                ...testProduct,
                stock: 0,
                leadTimeError: LeadTimeError.MISSING,
                priceError: PriceError.MISSING,
                businessUnit: 'avure'
              }}
              machine={testMachine}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );
    expect(screen.getByText('Call for availability')).toBeInTheDocument();
    // Shows all 3 errors
    // expect(screen.getByText('Price information is unavailable at this time.')).toBeInTheDocument();
    // expect(screen.getByText('Stock information is unavailable at this time.')).toBeInTheDocument();
    // expect(
    //   screen.getByText('Lead time information is unavailable at this time.')
    // ).toBeInTheDocument();

    // Displays contact information only once
    expect(screen.getAllByText('Please contact JBT for more information')).toHaveLength(1);
  });

  it('Displays correct contact information for a Avure machine part', () => {
    render(
      <Provider store={store}>
        <Router>
          <ThemeProvider theme={theme}>
            <ProductDetail
              product={{
                ...testProduct,
                priceError: PriceError.MISSING,
                businessUnit: 'avure'
              }}
              machine={testMachine}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    expect(screen.getByText(AVURE_TEL)).toBeInTheDocument();
    expect(screen.getByText(AVURE_TEL)).toHaveAttribute('href', `tel:${AVURE_TEL}`);

    expect(screen.getByText(AVURE_EMAIL)).toBeInTheDocument();
    expect(screen.getByText(AVURE_EMAIL)).toHaveAttribute('href', `mailto:${AVURE_EMAIL}`);
  });

  it('Displays correct contact information for a protein machine part', () => {
    render(
      <Provider store={store}>
        <Router>
          <ThemeProvider theme={theme}>
            <ProductDetail
              product={{
                ...testProduct,
                priceError: PriceError.MISSING,
                businessUnit: 'pna'
              }}
              machine={{
                ...testMachine,
                businessUnit: 'pna'
              }}
            />
          </ThemeProvider>
        </Router>
      </Provider>
    );

    expect(screen.getByText(PROTEIN_TEL)).toBeInTheDocument();
    expect(screen.getByText(PROTEIN_TEL)).toHaveAttribute('href', `tel:${PROTEIN_TEL}`);

    expect(screen.getByText(PROTEIN_EMAIL)).toBeInTheDocument();
    expect(screen.getByText(PROTEIN_EMAIL)).toHaveAttribute('href', `mailto:${PROTEIN_EMAIL}`);
  });
});
