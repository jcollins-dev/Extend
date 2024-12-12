import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { BodyRow, CustomExpandIcon, RowCrudButtons } from './Row';
import { WidgetType } from 'types/protein';

describe('Widget Table Body Row', () => {
  it('Renders', () => {
    const props = {
      'data-row-key': WidgetType.MatrixWidget,
      editRow: 'test',
      handleCreateNewItem: jest.fn(),
      setIsDirty: jest.fn(),
      tabId: 'test',
      widgetGroupId: 'test'
    };
    render(
      <ThemeProvider theme={theme}>
        <BodyRow {...props} />
      </ThemeProvider>
    );
  });
});

describe('Widget Table Expand Icon', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <CustomExpandIcon expanded={true} onExpand={jest.fn()} record={{}} />
      </ThemeProvider>
    );
  });
});

describe('Widget Table Row Crud Buttons', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <RowCrudButtons
          isCopyTable={false}
          itemIds={{
            id: 'test',
            widgetGroupId: 'test',
            tabId: 'test'
          }}
        />
      </ThemeProvider>
    );
  });
});
