// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// Constants
import { JBTRoutes } from 'constants/routes';

// Theme
import theme from 'themes';

// Components
import MasterTagListDashBoard, { hasAllRequiredData } from '.';

// State management
import { default as store } from 'store';
import { authActions } from 'actions';

// Types
import { MasterTagListColumn, TagListRowStatus, WipTagListRowData } from 'types/machine-management';

describe('MasterTagListDashBoard', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    store.dispatch({ type: authActions.SET_TOKENS, authToken: 'password', refreshToken: null });
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Route path={JBTRoutes.machineMasterTagListDashBoard}>
              <MasterTagListDashBoard />
            </Route>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should handle properly process required MTL columns', () => {
    const emptyRowData: WipTagListRowData[] = [
      {
        row: 0,
        rowStatus: TagListRowStatus.Draft,
        data: {}
      }
    ];
    const partialRowData: WipTagListRowData[] = [
      {
        row: 0,
        rowStatus: TagListRowStatus.Draft,
        data: {}
      }
    ];
    const completeRowDataSingle: WipTagListRowData[] = [
      {
        row: 0,
        rowStatus: TagListRowStatus.Draft,
        data: {
          omniblu_tag_name: 'test-tag-name',
          machine_tag_name: 'test-machine-tag',
          description: 'test-description',
          dataType: 'Integer',
          change_threshold: '0.5',
          scaling: 'No',
          scan_rate: '1000',
          unit_of_measure: 'Count',
          used_by: 'Other'
        }
      }
    ];
    const partialRowDataMulti: WipTagListRowData[] = [
      {
        row: 0,
        rowStatus: TagListRowStatus.Draft,
        data: {
          omniblu_tag_name: 'test-tag-name',
          machine_tag_name: 'test-machine-tag',
          description: 'test-description',
          dataType: 'Integer',
          change_threshold: '1',
          scaling: 'No',
          scan_rate: '1000',
          unit_of_measure: 'Count',
          used_by: 'Other'
        }
      },
      {
        row: 1,
        rowStatus: TagListRowStatus.Draft,
        data: {
          omniblu_tag_name: 'test-tag-name2',
          machine_tag_name: 'test-machine-tag2',
          //description: 'test-description2',
          dataType: 'Integer',
          change_threshold: '1',
          scaling: 'No',
          scan_rate: '1000',
          //unit_of_measure: 'Count',
          used_by: 'Other'
        }
      }
    ];
    const completeRowDataMulti: WipTagListRowData[] = [
      {
        row: 0,
        rowStatus: TagListRowStatus.Draft,
        data: {
          omniblu_tag_name: 'test-tag-name',
          machine_tag_name: 'test-machine-tag',
          description: 'test-description',
          dataType: 'Integer',
          change_threshold: '1',
          scaling: 'No',
          scan_rate: '1000',
          unit_of_measure: 'Count',
          used_by: 'Other'
        }
      },
      {
        row: 1,
        rowStatus: TagListRowStatus.Draft,
        data: {
          omniblu_tag_name: 'test-tag-name2',
          machine_tag_name: 'test-machine-tag2',
          description: 'test-description2',
          dataType: 'Integer',
          change_threshold: '1',
          scaling: 'No',
          scan_rate: '1000',
          unit_of_measure: 'Count',
          used_by: 'Other'
        }
      }
    ];
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

    expect(hasAllRequiredData(emptyRowData, testColumns)).toBe(false);
    expect(hasAllRequiredData(partialRowData, testColumns)).toBe(false);
    expect(hasAllRequiredData(completeRowDataSingle, testColumns)).toBe(true);
    expect(hasAllRequiredData(partialRowDataMulti, testColumns)).toBe(false);
    expect(hasAllRequiredData(completeRowDataMulti, testColumns)).toBe(true);
  });
});
