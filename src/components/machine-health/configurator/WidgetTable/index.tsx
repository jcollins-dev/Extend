// 3rd party libraries
import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import Table from 'rc-table';
import { DefaultRecordType, RenderExpandIcon } from 'rc-table/lib/interface';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';

// Components
import Title from './Title';
import { BodyRow, CustomExpandIcon } from './Row';
import { StyledCell, StyledHeaderCell } from './Cell';
import { StyledHeaderWrapper, StyledHeaderRow, StyledHeaderWrapperNoChildren } from './Headers';
import TableModal from './Modal';
import { Loader } from 'components';

// Types
import { TableProps } from 'types';
import {
  CreateNewWidgetItemProps,
  WidgetTableDropdownItem,
  WidgetTableProps
} from 'types/machine-health';
import { WidgetType } from 'types/protein';

// Context
import { useWidgetTableContext } from './WidgetTableContext';

// Constants
import { MaxTagLength, RowIdDelimiter } from 'constants/machineConfig';
import { testMatrixTableTypes, testWidgetTypes } from 'constants/testdata/protein';

// Helpers
import { addRowCrudButtons, createLocalItem, editColumnConfigs } from './helpers';

/* Styled components */

// Style the base rc-table component (which is a actually a div)
const StyledTableComponent = styled(Table)<{
  borderBottomRow?: boolean;
  cellPadding?: string;
  hideScroll?: boolean;
  isExpanded?: boolean;
  outerBorderColor?: string;
  tableHeight?: number;
}>`
  border-radius: 0.5rem;
  border: ${({ theme }) => theme.colors.borders.border01.border};
  ${({ outerBorderColor }) => outerBorderColor && `border-color: ${outerBorderColor}`};

  table {
    border-spacing: 0;
    border-radius: 0.5rem;
  }

  .rc-table-container {
    border-radius: 0.5rem;
    overflow: ${({ isExpanded }) => (isExpanded ? 'visible' : 'hidden')};
    /*transition: max-height 0.3s ease-in-out;*/
    ${({ isExpanded, tableHeight }) =>
      isExpanded ? `max-height: ${tableHeight}px;` : `max-height: 0px;`}
  }

  /* Apply styling to child rows */
  & .rc-table-row-level-1,
  .rc-table-row-level-2 {
    background-color: transparent;
    height: 3rem;

    th:first-child {
      padding-left: 1.75rem;
    }
  }

  & .rc-table-row-level-2 {
    th:first-child {
      padding-left: 2.5rem;
    }
  }

  tbody {
    /* Adjust expand button padding */
    tr {
      th:last-child {
        padding-left: 0;
      }
    }

    /* Remove last child border */
    tr:last-child {
      border-bottom: none;
      & th,
      td {
        border-bottom: none;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
      }
    }
  }

  /* Override default padding on cell */
  .rc-table-cell {
    padding: ${({ cellPadding }) => cellPadding ?? ''};
  }

  /* Hide scrollbar */
  .rc-table-body {
    ${({ hideScroll }) =>
      hideScroll
        ? `scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
        -ms-overflow-style: none;
        `
        : ``}
  }

  /* Reduce scrollbar header padding*/
  .rc-table-cell-scrollbar {
    ${({ hideScroll }) => (hideScroll ? `padding: 0;` : ``)}
  }
`;

const StyledTable = styled.table`
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-collapse: collapse;
  border-top: none; /* get rid of top border */
  min-width: 100%;

  .rc-table-expand-icon-col {
    width: 1rem;
  }
`;

const StyledTableNoName = styled.table`
  min-width: 100%;
  border-collapse: collapse;

  .rc-table-expand-icon-col {
    width: 1rem;
  }
`;

const StyledNoDataMessage = styled.div`
  padding-left: 1rem;
`;

/* End of styled components */

// Documentation for the WidgetTable component:
// https://dev.azure.com/jbtciops/Extend/_wiki/wikis/Extend.wiki/172/Components-WidgetTable-(Configurator-table)

const WidgetTable = ({
  columnConfigs,
  copyTable,
  data,
  displayOnlyRows,
  hideCrudButtons = false,
  hideScroll,
  isDataLoading,
  parent,
  rowKey,
  scroll,
  setIsDirty,
  shouldRenderTags,
  tags
}: WidgetTableProps): ReactElement => {
  const {
    localTableNames,
    localTableRows,
    modalType,
    setLocalTableActive,
    setLocalTableNames,
    setLocalTableRows
  } = useWidgetTableContext();

  const [dataHasChildren, setDataHasChildren] = useState(false);
  const [editRow, setEditRow] = useState<null | string>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameIsExpanded, setNameIsExpanded] = useState(false);
  const [tableHeight, setTableHeight] = useState(0);

  const { active, editable, id, name, toggleActive } = parent ?? {
    active: false,
    editable: false,
    id: '',
    name: '',
    toggleActive: false
  };

  const { isCopyTable, handleCopyCallback, copyWidgetType } = copyTable ?? {};

  useEffect(() => {
    setLocalTableNames((prev) => [...prev, { id, name: name || '' }]);
    setLocalTableActive((prev) => [...prev, { id, active: !!active }]);
  }, [name, active]);

  // Set a marker for the presence of data
  const hasData = useRef(false);

  useEffect(() => {
    // If we already have data, do nothing.
    // Prevent inner state from running repeatedly on tag tables.
    if (hasData.current && shouldRenderTags) {
      return;
    }

    // Set hasData to true on the first render
    if (data) {
      hasData.current = true;
    }

    // If we have data, we want to set the local rows, ...
    // ... specifically, we want to make a deep copy of the members
    data &&
      setLocalTableRows((prev) => {
        const next = [...prev];

        // check for an insertion index
        const insertLocation = next.findIndex((item) => item.id === id);
        const insertData = { ...parent, members: cloneDeep(data) };
        // if we have a location, insert the data, otherwise push it to the end
        insertLocation === -1 ? next.push(insertData) : (next[insertLocation] = insertData);
        return next;
      });
  }, [data]);

  const localRows = useMemo(() => {
    return localTableRows.find((item) => item.id === id)?.members || [];
  }, [localTableRows, id]);

  useEffect(() => {
    tags?.forEach((tag) => {
      tag.disabled = false;
    });

    localTableRows.forEach((item) => {
      item?.members?.forEach((child) => {
        child.tags?.forEach((childTag) => {
          const memberTagMatch = tags?.find((option) => option.id === childTag?.id);
          memberTagMatch && (memberTagMatch.disabled = true);
        });
        child.members?.forEach((grandChild) => {
          grandChild.tags?.forEach((grandChildTag) => {
            const tagMatch = tags?.find((option) => option.id === grandChildTag?.id);
            tagMatch && (tagMatch.disabled = true);
          });
        });
      });
    });
  }, [localTableRows]);

  // attach CRUD buttons to widget rows and add widget/child action rows
  const rowsWithButtons = useMemo(() => {
    // This function adds the right hand 'Actions' buttons
    const { nextRowsWithButtons, hasChildren } = addRowCrudButtons({
      copyWidgetType,
      handleCopyCallback,
      hideCrudButtons,
      isCopyTable: !!isCopyTable,
      rows: localRows,
      setEditRow,
      setIsDirty,
      setIsEditingName,
      shouldRenderTags,
      tabId: id
    });

    setDataHasChildren(hasChildren);

    if (isCopyTable) {
      return nextRowsWithButtons;
    }

    const buttonRow = {
      actions: <></>,
      canBeExpanded: false,
      children: undefined,
      tagsZones: ''
    };

    if (shouldRenderTags) {
      nextRowsWithButtons.forEach((row) => {
        // If we see a specific subset of widget types, ...
        if (
          row.widgetType === WidgetType.MatrixWidget ||
          row.widgetType === WidgetType.MachineOverview ||
          row.widgetType === WidgetType.MachineOverviewFlyout
        ) {
          // Add a blank row after each of its children, this holds the 'add tag' button
          row.children?.forEach((child) => {
            const childButtonRow = {
              ...buttonRow,
              id: `${WidgetType.TagRow}${RowIdDelimiter}${child.id}`,
              key: `${WidgetType.TagRow}${RowIdDelimiter}${child.id}`
            };
            const tagCount = child.tags?.length || 0;
            child.children
              ? tagCount < MaxTagLength && child.children.push(childButtonRow)
              : (child.children = [childButtonRow]);
          });
        }

        // Add a blank row to its children, similar to above
        const tagRow = {
          ...buttonRow,
          id: `${WidgetType.TagRow}${RowIdDelimiter}${row.id}`,
          key: `${WidgetType.TagRow}${RowIdDelimiter}${row.id}`
        };

        let tagCount = 0;
        row.children?.forEach((child) => {
          child.isTag && tagCount++;
        });

        if (
          row.children &&
          (row.widgetType === WidgetType.MachineOverview ||
            row.widgetType === WidgetType.MachineOverviewFlyout)
        ) {
          // Find the last location of a tag in the row, this is where we will add ...
          // ... the 'add tag' button.
          let insertLocation = -1;

          for (let i = row.children.length - 1; i >= 0; i--) {
            if (row.children[i].isTag) {
              insertLocation = i;
              break;
            }
          }

          insertLocation >= 0
            ? tagCount < MaxTagLength && row.children.splice(insertLocation + 1, 0, tagRow)
            : row.children.unshift(tagRow);
        } else if (tagCount < MaxTagLength && row.widgetType !== WidgetType.MatrixWidget) {
          row.children = row.children ? [...row.children, tagRow] : [tagRow];
        }
      });
    } else {
      // Add a blank row at the end of the hidden matrix-widget-group ...
      // ... this blank row is used to display the 'add matrix table' button

      const matrixGroupLocation = localRows.findIndex(
        (item) => item.widgetType === WidgetType.MatrixWidgetGroup
      );

      const insertLocation =
        matrixGroupLocation + (localRows?.[matrixGroupLocation]?.members?.length || 0);

      // Calculate the number of matrix widgets, ...
      // ... we won't render an add matrix table button if there are 5 or more
      let matrixWidgetCount = 0;
      nextRowsWithButtons.forEach((row) => {
        if (row.widgetType === WidgetType.MatrixWidget) {
          matrixWidgetCount += 1;
        }
      });

      insertLocation >= 0 &&
        matrixWidgetCount < 5 &&
        nextRowsWithButtons.splice(insertLocation, 0, {
          // Add the item in the matrix-widget-group
          actions: <></>,
          children: undefined,
          id: WidgetType.WidgetRow,
          key: WidgetType.WidgetRow,
          tagsZones: ''
        });
    }

    // Perform a similar operation for the specific subset of widget types ...
    // ... using a for loop since we are adding items to the array while iterating
    for (let i = 0; i < nextRowsWithButtons.length; i++) {
      const row = nextRowsWithButtons[i];
      if (
        row.widgetType === WidgetType.MatrixWidget ||
        row.widgetType === WidgetType.MachineOverview ||
        row.widgetType === WidgetType.MachineOverviewFlyout
      ) {
        nextRowsWithButtons.splice(i + 1, 0, {
          ...buttonRow,
          id: `${WidgetType.TagGroupRow}${RowIdDelimiter}${row.id}`,
          key: `${WidgetType.TagGroupRow}${RowIdDelimiter}${row.id}`
        });
      }
    }

    // displayOnlyRows is a special case to handle machine_overview_widget widget type.
    // They are added as the first child in the first row
    nextRowsWithButtons[0]?.children &&
      displayOnlyRows &&
      (nextRowsWithButtons[0].children = [...displayOnlyRows, ...nextRowsWithButtons[0]?.children]);

    return nextRowsWithButtons;
  }, [localRows, isEditingName]);

  // Modify column configs based on edit state ...
  // ... see comments in editColumnConfigs for details
  const transformedColumns = useMemo(() => {
    const nextEditColumns = editColumnConfigs({
      columnConfigs,
      dataSize: data?.length || 0,
      editRow,
      setEditRow,
      setIsDirty,
      setLocalTableRows,
      shouldRenderTags,
      tabId: id,
      tags
    });
    return nextEditColumns;
  }, [columnConfigs, data, editRow, isEditingName]);

  useEffect(() => {
    // calculate height of table
    if (isDataLoading) {
      return setTableHeight(175);
    }
    const rem = 16;
    let totalRows = 0;
    // iterate over rows ...
    rowsWithButtons.forEach((row) => {
      // increment count for the row
      totalRows += 1;
      // if the current row is expanded, increment count for each of its children
      expandedRows[row.id] && (totalRows += row.children?.length || 0);

      row?.children?.forEach((child) => {
        expandedRows[child.id] && (totalRows += child.children?.length || 0);
      });
    });
    const height = (totalRows || 1) * rem * 4 + 64;
    setTableHeight(height);
  }, [rowsWithButtons, expandedRows, isDataLoading]);

  const handleCreateNewItem = ({
    isTag,
    parentId,
    tabId,
    value,
    widgetType
  }: CreateNewWidgetItemProps) => {
    const isAddTagGroupRow = modalType === WidgetType.TagGroupRow;
    const isAddWidgetRow = modalType === WidgetType.WidgetRow;

    setLocalTableRows?.((prev) =>
      createLocalItem({
        editRow,
        isAddTagGroupRow,
        isAddWidgetRow,
        isTag,
        localRows,
        parentId,
        prev,
        tabId,
        value,
        widgetType
      })
    );
  };
  // Define the components to override the defaults of rc-table
  const components = useMemo(() => {
    return {
      table: name ? StyledTable : StyledTableNoName,
      header: {
        wrapper: dataHasChildren ? StyledHeaderWrapper : StyledHeaderWrapperNoChildren,
        row: StyledHeaderRow,
        cell: StyledHeaderCell
      },
      body: {
        row: BodyRow,
        cell: StyledCell
      }
    };
  }, [dataHasChildren]);

  const modalOptionMap: {
    [key in WidgetType]?: { value: string; label: string }[] | WidgetTableDropdownItem[];
  } = {
    [WidgetType.TagRow]: tags || [],
    [WidgetType.TagGroupRow]: testWidgetTypes,
    [WidgetType.WidgetRow]: testMatrixTableTypes
  };

  return (
    <>
      <StyledTableComponent
        columns={transformedColumns}
        components={components}
        data={rowsWithButtons}
        emptyText={
          isDataLoading ? <Loader size={40} /> : <StyledNoDataMessage>No data</StyledNoDataMessage>
        }
        expandable={{
          expandIcon: CustomExpandIcon as unknown as RenderExpandIcon<DefaultRecordType>,
          expandIconColumnIndex: transformedColumns.length - 1
        }}
        hideScroll={hideScroll}
        isExpanded={!name ? true : nameIsExpanded}
        onExpand={(expanded, record) => {
          // when a row is expanded, store it in state for table height calculation
          setExpandedRows((prev) => ({
            ...prev,
            [record.id]: expanded
          }));
        }}
        onRow={() => {
          // Pass through the row edit props
          return {
            editRow,
            handleCreateNewItem,
            setEditRow,
            setIsDirty,
            tabId: id
          } as React.HTMLAttributes<TableProps>;
        }}
        rowKey={rowKey}
        scroll={scroll}
        tableHeight={tableHeight}
        title={() => {
          return name ? (
            <Title
              editable={editable}
              id={id}
              isEditingName={isEditingName}
              isExpanded={nameIsExpanded} // we need isExpanded in the title for animation purposes
              name={localTableNames.find((item) => item.id === id)?.name || ''}
              onExpandCallback={() => setNameIsExpanded((prev) => !prev)}
              setEditRow={setEditRow}
              setIsDirty={setIsDirty}
              setIsEditingName={setIsEditingName}
              toggleActive={toggleActive}
            />
          ) : null;
        }}
      />
      <TableModal
        hideFields={{ type: true }}
        modalType={modalType}
        options={(modalOptionMap[modalType] as WidgetTableDropdownItem[]) ?? []}
        submitCallback={handleCreateNewItem}
        tabId={id}
      />
    </>
  );
};

export default WidgetTable;
