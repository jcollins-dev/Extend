import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18nForTests';
import theme from 'themes';
import StateOverTimeCard from '.';

describe('StateOverTimeCard', () => {
  it('renders correctly when there are no bars', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <StateOverTimeCard title={'test'} nestedData={[]} stateColors={{}} />
        </I18nextProvider>
      </ThemeProvider>
    );
  });
});
