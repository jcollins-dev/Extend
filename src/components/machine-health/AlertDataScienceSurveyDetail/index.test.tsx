import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import AlertDataScienceSurveyDetail from './index';
import { AlertCriticality, AlertStatus, AlertType } from 'types/machine-health/alerts';
import moment from 'moment';

describe('AlertDataScienceSurveyDetail', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AlertDataScienceSurveyDetail
              onIssueSelectConfirm={jest.fn}
              onIssueSelect={jest.fn}
              onIgnoreClick={jest.fn}
              onNoIssueSelectConfirm={jest.fn}
              alertDetail={{
                id: 'test-id',
                alertType: AlertType.Operations,
                criticality: AlertCriticality.High,
                description: 'Test',
                detailedInstructions: 'Test Details',
                status: AlertStatus.NotComplete,
                subcomponent: 'test-subcomponent',
                createdAt: moment().toDate().toDateString()
              }}
              confirmable={true}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
