import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import store from 'store';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';

import { JBTRoutes } from 'constants/routes';
import { DigitalEdgeType } from 'types';
import ReviewMachineMtlTable from './ReviewMachineMtlTable';
import { ReviewMachineMtlKdm } from 'types/machine-management';

it('It should mount', () => {
  const div = document.createElement('div');

  const testData: ReviewMachineMtlKdm[] = [
    {
      machineTagListId: '1',
      isInvalid: false,
      driverId: 'driver-id-1',
      deviceTypeId: 'device-type-id-1',
      ipAddress: '11.22.33',
      port: 1000,
      attributes: []
    }
  ];

  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.machineManagement}>
            <ReviewMachineMtlTable
              digitalEdgeType={DigitalEdgeType.KDM}
              reviewMachineMtlData={testData}
              updateReviewMachineMtlRow={jest.fn()}
              updateReviewMachineMtlAttrsRow={jest.fn()}
              isLoading={false}
            />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
