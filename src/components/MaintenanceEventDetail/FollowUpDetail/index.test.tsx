import { testMaintenanceEventData } from 'constants/testdata';
import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import FollowUpDetail from '.';
import { Provider } from 'react-redux';
import { default as store } from 'store';

describe('MaintenanceFollowUpDetail', () => {
  it('It should mount', () => {
    render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <FollowUpDetail
            maintenanceEvent={testMaintenanceEventData[0]}
            onClose={jest.fn()}
            onSubmitClick={jest.fn()}
          />
        </Provider>
      </ThemeProvider>
    );
  });
});
