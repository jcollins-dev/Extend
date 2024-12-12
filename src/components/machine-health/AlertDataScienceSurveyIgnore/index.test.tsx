import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import AlertDataScienceSurveyIgnore from './index';

describe('AlertDataScienceSurveyIgnore', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertDataScienceSurveyIgnore
              onConfirmClick={jest.fn}
              confirmable={true}
              onIgnoredReasonDetailChange={jest.fn}
              onIgnoredReasonChange={jest.fn}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
