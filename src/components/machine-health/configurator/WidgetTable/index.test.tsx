import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import WidgetTable from '.';
import { default as theme } from 'themes';

import { WidgetTableDataItem } from 'types/machine-health';
import { WidgetTableProvider } from './WidgetTableContext';
import { WidgetType } from 'types/protein';
import { WidgetTableColumnConfigs } from 'constants/machineConfig';

const testData: WidgetTableDataItem[] = [
  {
    active: true,
    editable: true,
    members: [
      {
        active: true,
        editable: true,
        members: [...new Array(3)].map((_, j) => ({
          id: `Tag ${j}`,
          name: `Tag ${j}`,
          type: WidgetType.TagGroup
        })),
        id: '1-1',
        name: 'SD HX 1',
        tags: [...new Array(3)].map((_, k) => ({
          id: `Tag ${k}`,
          name: `Tag ${k}`,
          type: WidgetType.State
        })),
        toggleActive: true,
        widgetType: WidgetType.MatrixWidget
      }
    ],
    id: '1',
    name: 'SD HX 1',
    tags: [...new Array(3)].map((_, k) => ({
      id: `Tag ${k}`,
      name: `Tag ${k}`,
      type: WidgetType.State
    })),
    tagsZones: '3',
    toggleActive: true,
    tagType: 'Matrix Widget',
    widgetType: WidgetType.MatrixWidgetGroup
  },
  {
    active: true,
    editable: true,
    toggleActive: true,
    id: '2',
    isParent: true,
    key: '2',
    name: 'SD HX 2',
    tags: [...new Array(4)].map((_, k) => ({
      id: `Tag ${k}`,
      name: `Tag ${k}`,
      type: WidgetType.State
    })),
    tagsZones: '4',
    tagType: 'Matrix Widget',
    widgetType: WidgetType.MatrixWidget
  },
  {
    active: true,
    editable: true,
    toggleActive: true,
    id: '3',
    isParent: true,
    key: '3',
    name: 'SD HX 2',
    tags: [{ id: `Tag `, name: `Tag `, type: WidgetType.State }],
    tagsZones: '1',
    tagType: 'Matrix Widget',
    widgetType: WidgetType.MatrixWidget
  }
];

const testWidgetTableData = {
  editable: true,
  id: 'test-id-1',
  name: 'Test Table',
  shouldRenderTags: false,
  toggleActive: true
};

describe('WidgetTable', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <WidgetTableProvider>
          <WidgetTable
            {...testWidgetTableData}
            columnConfigs={WidgetTableColumnConfigs}
            data={testData}
            parent={{ id: testWidgetTableData.id }}
          />
        </WidgetTableProvider>
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should have: a table, 8 rows (1 header row, 4 content rows, 3 add rows), and 18 header columns (5 for header labels, 5 for an expandable row, and 4 for the remaining 2 rows)', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <WidgetTableProvider>
          <WidgetTable
            {...testWidgetTableData}
            columnConfigs={WidgetTableColumnConfigs}
            data={testData}
            parent={{ id: testWidgetTableData.id }}
          />
        </WidgetTableProvider>
      </ThemeProvider>
    );

    render(testComponent);
    expect(screen.getByRole('table')).toBeTruthy();
    expect(screen.getAllByRole('row').length).toBe(8);
    expect(screen.getAllByRole('columnheader').length).toBe(18);
  });

  it('It should have the expected values for headers', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <WidgetTableProvider>
          <WidgetTable
            {...testWidgetTableData}
            columnConfigs={WidgetTableColumnConfigs}
            data={testData}
            parent={{ id: testWidgetTableData.id }}
          />
        </WidgetTableProvider>
      </ThemeProvider>
    );

    render(testComponent);
    const table = screen.getByRole('table');

    // Get the header row
    const headerRow = within(table).getAllByRole('row')[0];
    WidgetTableColumnConfigs.forEach((col) => {
      expect(within(headerRow).getByText(col.title as string)).toBeInTheDocument();
    });
  });
});
