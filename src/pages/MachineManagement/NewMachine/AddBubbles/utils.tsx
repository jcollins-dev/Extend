// 3rd party libs
import React from 'react';
import styled from 'styled-components';

// Components
import { Checkbox } from 'components';

// Types
import { Bubble, ColumnConfig, Id, SortState } from 'types';
import { EditedBubbleRecord, PreviousEditRecord } from 'types/machine-management';
import { Part } from 'types/parts';

// Styling
export const EditTableCell = styled.div`
  padding: 0.75rem 0;
  display: flex;
  align-items: center;
`;

export const defaultEditsSortState: Record<string, SortState> = {
  oldPartDesc: SortState.unsorted,
  newPartDesc: SortState.unsorted,
  assemblySku: SortState.unsorted,
  assemblyDesc: SortState.unsorted,
  oldSku: SortState.unsorted,
  newSku: SortState.unsorted,
  oldIndex: SortState.unsorted,
  newIndex: SortState.unsorted
};

export const editsColumnConfigs = (
  sortState: Record<string, SortState>,
  onRowCheck: (bubbleEdit: Id, checked: boolean) => void,
  allChecked: boolean
): ColumnConfig[] => {
  return [
    {
      title: (
        <Checkbox
          checked={allChecked}
          onChange={(event) => onRowCheck('all', event.target.checked)}
        />
      ),
      dataIndex: 'checked',
      key: 'checked',
      width: '3.125rem',
      sortState: undefined,
      render: function (value, record) {
        const checked = !!value;
        const editRecord = record as PreviousEditRecord;
        return {
          children: (
            <EditTableCell>
              <Checkbox
                checked={checked}
                onChange={(event) => onRowCheck(editRecord.id, event.target.checked)}
              />
            </EditTableCell>
          )
        };
      }
    },
    {
      title: 'Assembly',
      dataIndex: 'assemblySku',
      key: 'assemblySku',
      width: '23rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'assemblySku')
        ? sortState['assemblySku']
        : SortState.unsorted,
      render(value, record) {
        const edit = record as PreviousEditRecord;
        return {
          children: (
            <EditTableCell>
              {' '}
              {value ? `${value}${edit.assemblyDesc ? ` : ${edit.assemblyDesc}` : ''}` : '-'}
            </EditTableCell>
          )
        };
      }
    },
    {
      title: 'Original Part',
      dataIndex: 'oldSku',
      key: 'oldSku',
      width: '16rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'oldSku')
        ? sortState['oldSku']
        : SortState.unsorted,
      render(value, record) {
        const edit = record as PreviousEditRecord;
        return {
          children: (
            <EditTableCell>
              {value ? `${value}${edit.oldPartDesc ? ` : ${edit.oldPartDesc}` : ''}` : '-'}
            </EditTableCell>
          )
        };
      }
    },
    {
      title: 'Previous Part Edit',
      dataIndex: 'newSku',
      key: 'newSku',
      width: '16rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'newSku')
        ? sortState['newSku']
        : SortState.unsorted,
      render(value, record) {
        const edit = record as PreviousEditRecord;
        return {
          children: (
            <EditTableCell>
              {value ? `${value}${edit.newPartDesc ? ` : ${edit.newPartDesc}` : ''}` : '-'}
            </EditTableCell>
          )
        };
      }
    },
    {
      title: 'Original Bubble Label',
      dataIndex: 'oldIndex',
      key: 'oldIndex',
      width: '10rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'oldIndex')
        ? sortState['oldIndex']
        : SortState.unsorted,
      render(value) {
        return {
          children: <EditTableCell>{value ?? '-'}</EditTableCell>
        };
      }
    },
    {
      title: 'Previous Label Edit',
      dataIndex: 'newIndex',
      key: 'newIndex',
      width: '10rem',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'newIndex')
        ? sortState['newIndex']
        : SortState.unsorted,
      render(value) {
        return {
          children: <EditTableCell>{value ?? '-'}</EditTableCell>
        };
      }
    }
  ];
};

// Between - inclusive of bounds
export const isBetween = (val: number, min: number, max: number): boolean => {
  const actualMin = min > max ? max : min;
  const actualMax = max < min ? min : max;
  return val >= actualMin && val <= actualMax;
};

// A function to check if the given edit bubble record's data matches the given existing one,
// with a given list of parts
export const editMatchesBubble = (
  editRecord: EditedBubbleRecord,
  bubble: Bubble,
  bubbleResourceId: Id,
  parts?: Part[]
): boolean => {
  const pageMatches = editRecord.resourceId ? editRecord.resourceId === bubbleResourceId : false;

  // Check if the edit's values are already present
  const indicesMatch = editRecord.newIndex
    ? editRecord.newIndex === bubble.index
    : editRecord.oldIndex
    ? editRecord.oldIndex === bubble.index
    : false;

  const coordinatesMatch =
    isBetween(editRecord.x, bubble.x - bubble.radius, bubble.x + bubble.radius) &&
    isBetween(editRecord.y, bubble.y - bubble.radius, bubble.y + bubble.radius);

  const correspondingPart = parts?.find((part) => {
    return (
      // If the bubble has a part ID (i.e. not missing in BOM)
      bubble.partUuid &&
      bubble.partUuid === part.id &&
      part.sku ===
        (editRecord.newSku
          ? editRecord.newSku
          : editRecord && editRecord.oldSku
          ? editRecord.oldSku
          : undefined)
    );
  });
  const partsMatch = !!correspondingPart;

  const dataMatches = pageMatches && indicesMatch && coordinatesMatch && partsMatch;

  return dataMatches;
};
