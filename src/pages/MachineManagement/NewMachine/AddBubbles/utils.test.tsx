import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { EditedBubbleRecord, PreviousEditRecord } from 'types/machine-management';

import { BaseTable } from 'components';
import {
  editMatchesBubble,
  defaultEditsSortState,
  editsColumnConfigs,
  isBetween,
  EditTableCell
} from './utils';

// Themes
import { default as theme } from 'themes';

// Types
import { Bubble, Id } from 'types';
import { Part } from 'types/parts';

const testData: PreviousEditRecord[] = [
  {
    id: 'edit-record-1',
    checked: false,
    oldSku: 'old-sku-1',
    newSku: 'new-sku-1',
    oldIndex: 'old-index-1',
    newIndex: 'new-index-1',
    oldPartDesc: 'part description',
    newPartDesc: 'new part desc',
    assemblyDesc: 'assembly desc',
    x: 0,
    y: 0,
    radius: 40,
    machineId: 'machine-id',
    missingInBom: false,
    parentSku: 'parent-sku'
  }
];

describe('AddBubbles utility functions', () => {
  it('Specifies default sort state', () => {
    expect(Object.keys(defaultEditsSortState).includes('oldPartDesc')).toBe(true);
    expect(Object.keys(defaultEditsSortState).includes('newPartDesc')).toBe(true);
    expect(Object.keys(defaultEditsSortState).includes('assemblySku')).toBe(true);
    expect(Object.keys(defaultEditsSortState).includes('assemblyDesc')).toBe(true);
    expect(Object.keys(defaultEditsSortState).includes('oldSku')).toBe(true);
    expect(Object.keys(defaultEditsSortState).includes('newSku')).toBe(true);
    expect(Object.keys(defaultEditsSortState).includes('oldIndex')).toBe(true);
    expect(Object.keys(defaultEditsSortState).includes('newIndex')).toBe(true);
  });

  it('EditTableCell renders on its own', () => {
    const div = document.createElement('div');
    const mockFn = jest.fn();
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <EditTableCell>test</EditTableCell>
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Bubble edit column configurations render properly with BaseTable', () => {
    const div = document.createElement('div');
    const mockFn = jest.fn();
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <BaseTable
          columnConfigs={editsColumnConfigs(defaultEditsSortState, mockFn, false)}
          data={testData}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Should properly identify values in between two numbers', () => {
    expect(isBetween(22, 0, 33)).toBe(true);
    expect(isBetween(22, 22, 33)).toBe(true);
    expect(isBetween(20, 22, 33)).toBe(false);
  });

  it('Should properly identify matching bubbles and bubble edit records', () => {
    const resourceId1: Id = 'diagram-page-id';
    const resourceId2: Id = 'diagram-page-id-2';
    const part1: Part = {
      id: 'part-1',
      sku: 'part-sku-1',
      parentSku: 'parent-sku-1',
      description: 'part-description',
      machineId: 'machine-1',
      leadTime: 2,
      stock: 1
    };
    const part2: Part = {
      id: 'part-2',
      sku: 'part-sku-2',
      parentSku: 'parent-sku-2',
      description: 'part-description deux',
      machineId: 'machine-1',
      leadTime: 2,
      stock: 1
    };
    const testBubble1: Bubble = {
      id: 'test-bubble-id-1',
      x: 10,
      y: 10,
      partUuid: 'part-1',
      index: '12',
      radius: 45
    };
    const editMatchesBubble1: EditedBubbleRecord = {
      id: 'edit-matches',
      x: 10,
      y: 10,
      oldIndex: '12',
      oldSku: 'part-sku-1',
      parentSku: 'parent-sku-1',
      machineId: 'machine-1',
      missingInBom: false,
      resourceId: resourceId1
    };
    const editMatchesBubble2: EditedBubbleRecord = {
      id: 'edit-matches-2',
      x: 10,
      y: 10,
      oldIndex: '1',
      newIndex: '12',
      oldSku: 'part-sku-1',
      parentSku: 'parent-sku-1',
      machineId: 'machine-1',
      missingInBom: false,
      resourceId: resourceId1
    };
    const editMatchesAllButPart: EditedBubbleRecord = {
      id: 'edit-matches',
      x: 10,
      y: 10,
      oldIndex: '12',
      newSku: 'part-sku-2',
      parentSku: 'parent-sku-1',
      machineId: 'machine-1',
      missingInBom: false,
      resourceId: resourceId1
    };

    // Matches with old index
    expect(editMatchesBubble(editMatchesBubble1, testBubble1, resourceId1, [part1, part2])).toBe(
      true
    );
    // Does not match because resource is different (i.e. on a different page of the machine's manual)
    expect(editMatchesBubble(editMatchesBubble1, testBubble1, resourceId2, [part1, part2])).toBe(
      false
    );
    // Matches with old index
    expect(editMatchesBubble(editMatchesBubble2, testBubble1, resourceId1, [part1, part2])).toBe(
      true
    );
    // Does not match because part is different
    expect(editMatchesBubble(editMatchesAllButPart, testBubble1, resourceId1, [part1, part2])).toBe(
      false
    );
  });
});
