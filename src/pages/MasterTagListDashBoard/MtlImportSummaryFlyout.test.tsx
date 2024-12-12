import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MtlImportSummaryFlyout from './MtlImportSummaryFlyout';
import store from 'store';
import { Provider } from 'react-redux';

// Types
import { TagListRowStatus, WipTagListRowData } from 'types/machine-management';

describe('< MtlImportSummaryFlyout />', () => {
  it('Renders', () => {
    const importData: WipTagListRowData[] = [];
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MtlImportSummaryFlyout
            visible={true}
            onClose={() => jest.fn()}
            importData={importData}
            onErrorSelect={() => jest.fn()}
          />
        </ThemeProvider>
      </Provider>
    );
  });

  it('Renders expected summary information', () => {
    const hexToRgb = (hex: string): string | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
        : null;
    };
    const importData: WipTagListRowData[] = [
      {
        row: 0,
        rowStatus: TagListRowStatus.Error,
        data: {
          id: null,
          omniblu_tag_name: 'ob-tag-1',
          machine_tag_name: 'tag-1',
          description: 'Description of tag-1',
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
      },
      {
        row: 1,
        rowStatus: TagListRowStatus.Valid,
        data: {
          id: null,
          omniblu_tag_name: 'ob-tag-2',
          machine_tag_name: 'tag-2',
          description: 'Description of tag-2',
          data_type: 'Float',
          change_threshold: null,
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
      },
      {
        row: 2,
        rowStatus: TagListRowStatus.Valid,
        data: {
          id: null,
          omniblu_tag_name: 'ob-tag-3',
          machine_tag_name: 'tag-3',
          description: 'Description of tag-3',
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
      },
      {
        row: 3,
        rowStatus: TagListRowStatus.Valid,
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
      }
    ];

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MtlImportSummaryFlyout
            visible={true}
            onClose={() => jest.fn()}
            importData={importData}
            onErrorSelect={() => jest.fn()}
          />
        </ThemeProvider>
      </Provider>
    );

    // Summary labels
    expect(screen.getByText('Tags in File')).toBeInTheDocument();
    expect(screen.getByText('Tags with Errors')).toBeInTheDocument();
    expect(screen.getByText('Valid')).toBeInTheDocument();

    // Summary information
    const tagsWithErrorsNode = screen.getByText('Tags with Errors').parentNode;
    const errorNumber = tagsWithErrorsNode?.children[0];
    const errorNumberStyles = errorNumber ? getComputedStyle(errorNumber) : undefined;
    expect(errorNumberStyles).not.toBeUndefined();
    if (errorNumberStyles) expect(errorNumberStyles.color).toBe(hexToRgb(theme.colors.negativeRed));
    expect(errorNumber?.textContent).toBe('1');

    const validTagsNode = screen.getByText('Valid').parentNode;
    const validNumber = validTagsNode?.children[0];
    const validNumberStyles = validNumber ? getComputedStyle(validNumber) : undefined;
    expect(validNumberStyles).not.toBeUndefined();
    if (validNumberStyles)
      expect(validNumberStyles.color).toBe(hexToRgb(theme.colors.onTrackGreen));
    expect(validNumber?.textContent).toBe('3');

    // Error list
    expect(screen.getByText('Errors')).toBeInTheDocument();
    // Expect to be one row for the header and two for the given errors
    expect(screen.getAllByRole('row').length).toBe(1);
  });
});
