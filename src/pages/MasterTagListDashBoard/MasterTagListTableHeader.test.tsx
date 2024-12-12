// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

// Constants
import { JBTRoutes } from 'constants/routes';

// Theme
import theme from 'themes';

// Components
import MasterTagListTableHeader from './MasterTagListTableHeader';

// State management
import { default as store } from 'store';
import { authActions } from 'actions';

// Types
import { MasterTagListColumn, WipTagListRowData } from 'types/machine-management';

describe('MasterTagListTableHeader', () => {
  const testColumns: MasterTagListColumn[] = [
    { name: 'id', dataType: 'UUID', required: false },
    { name: 'omniblu_tag_name', dataType: 'str', required: true },
    { name: 'machine_tag_name', dataType: 'str', required: true },
    { name: 'description', dataType: 'str', required: true },
    { name: 'dataType', dataType: 'DataType', required: true },
    { name: 'change_threshold', dataType: 'float', required: true },
    { name: 'scaling', dataType: 'ScalingOptions', required: true },
    { name: 'scaled_data_type', dataType: 'ScaledDataType', required: false },
    { name: 'raw_high', dataType: 'float', required: false },
    { name: 'raw_low', dataType: 'float', required: false },
    { name: 'scaled_high', dataType: 'float', required: false },
    { name: 'scaled_low', dataType: 'float', required: false },
    { name: 'scan_rate', dataType: 'ScanRate', required: true },
    { name: 'unit_of_measure', dataType: 'UnitOfMeasure', required: true },
    { name: 'module', dataType: 'str', required: false },
    { name: 'function', dataType: 'str', required: false },
    { name: 'scope', dataType: 'str', required: false },
    { name: 'used_by', dataType: 'UsedBy', required: true }
  ];
  const testComponent = (
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.machineMasterTagListDashBoard}>
            <MasterTagListTableHeader columnList={testColumns} />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );

  it('It should mount', () => {
    const div = document.createElement('div');
    store.dispatch({ type: authActions.SET_TOKENS, authToken: 'password', refreshToken: null });
    ReactDOM.render(testComponent, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
