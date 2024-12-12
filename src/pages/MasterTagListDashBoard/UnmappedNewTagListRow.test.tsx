// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen, waitFor } from '@testing-library/react';

// Theme
import theme from 'themes';

// State management
import { default as store } from 'store';
import { authActions } from 'actions';

// Types
import { MasterTagListColumn, TagListRowStatus, WipTagListRowData } from 'types/machine-management';
import UnmappedNewTagListRow from './UnmappedNewTagListRow';

const testRowData: WipTagListRowData = {
  row: 0,
  rowStatus: TagListRowStatus.Draft,
  data: {
    omniblu_tag_name: 'ob-tag-4',
    machine_tag_name: 'tag-4',
    description: 'Description of tag-4',
    data_type: 'Float',
    change_threshold: 0.5,
    scaling: 'No',
    scaled_data_type: 'Float',
    raw_high: null,
    raw_low: null,
    scaled_high: 0.1,
    scaled_low: null,
    scan_rate: 1000,
    unit_of_measure: 'Liter',
    module: 'Hour',
    function: 'Hour',
    scope: null,
    used_by: 'Other'
  }
};
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

describe('NewTagListRow', () => {
  it('It should mount', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <UnmappedNewTagListRow
          rowData={testRowData}
          updateRowData={jest.fn()}
          columnList={testColumns}
          isSelected={false}
        />
      </ThemeProvider>
    );
    const div = document.createElement('div');
    store.dispatch({ type: authActions.SET_TOKENS, authToken: 'password', refreshToken: null });
    ReactDOM.render(testComponent, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Displays expected number of columns', () => {
    render(
      <ThemeProvider theme={theme}>
        <table>
          <tr>
            <UnmappedNewTagListRow
              rowData={testRowData}
              updateRowData={jest.fn()}
              columnList={testColumns}
              isSelected={false}
            />
          </tr>
        </table>
      </ThemeProvider>
    );

    expect(screen.getAllByRole('cell').length).toBe(testColumns.length);
  });

  it('Scrolls into view if selected.', async () => {
    // The scrollIntoView is called with a setTimeout call, so make sure ot use fake timers
    jest.useFakeTimers();

    const scrollIntoViewMock = jest.fn();
    window.HTMLTableCellElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(
      <ThemeProvider theme={theme}>
        <table>
          <tr>
            <UnmappedNewTagListRow
              rowData={testRowData}
              updateRowData={jest.fn()}
              columnList={testColumns}
              isSelected={true}
            />
          </tr>
        </table>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(scrollIntoViewMock).not.toBeCalled();
      jest.runAllTimers();
      expect(scrollIntoViewMock).toBeCalled();
      expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    });
  });
});
