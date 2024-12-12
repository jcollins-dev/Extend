import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import AlertInspectionResultCard from './index';

describe('AlertInspectionResultCard', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertInspectionResultCard
              onIssueSelect={jest.fn}
              confirmable={false}
              onIssueSelectConfirm={jest.fn}
              onNoIssueSelectConfirm={jest.fn}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
