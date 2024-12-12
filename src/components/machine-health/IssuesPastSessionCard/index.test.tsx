import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import IssuesPastSessionCard from './';

it('It should mount', () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <IssuesPastSessionCard
            machineId="machine-id"
            startTimestamp="2022-01-01T00:00:00.000Z"
            endTimestamp="2022-01-01T00:01:00.000Z"
          />
          ,
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
});
