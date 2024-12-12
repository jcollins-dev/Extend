// 3rd party libraries
import React, { ReactNode } from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

// Components
import TableForm from '../Form';
import { StyledIconCellText, StyledIconCell } from '../Cell';
import { Header } from '../Headers';
import { BaseSelect } from 'components';
import { CustomContentRenderer, CustomDropdownRenderer } from '../Dropdown';
import { RowButtonGroup, StyledCrudButtonWrapper } from '../Row';

// Types
import { ColumnConfig } from 'types';
import { TableRowProps, WidgetTableDataItem, WidgetTableDropdownItem } from 'types/machine-health';
import { WidgetType } from 'types/protein';
import { Order } from 'types/machine-health/widget-table';

// Helpers
import { updateLocalItem } from '.';

// Constants
import { TagIdPrefix, WidgetTypeToIconMap } from 'constants/machineConfig';

// Styled Components
const StyledSelectWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
`;

export interface EditConfigArgs {
  columnConfigs: ColumnConfig[];
  dataSize: number;
  editRow: string | null;
  setEditRow: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDirty?: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalTableRows: React.Dispatch<React.SetStateAction<WidgetTableDataItem[]>>;
  shouldRenderTags: boolean;
  tabId: string;
  tags?: WidgetTableDropdownItem[] | null;
}

export const editColumnConfigs = ({
  columnConfigs,
  dataSize = 0,
  editRow,
  setEditRow,
  setIsDirty,
  setLocalTableRows,
  shouldRenderTags,
  tabId,
  tags
}: EditConfigArgs): ColumnConfig[] => {
  // Define submit callback to pass into form components
  const handleSubmit = (
    value: string | WidgetTableDropdownItem,
    itemIds: Record<string, string>
  ) => {
    setLocalTableRows?.((prev) =>
      updateLocalItem({
        prev,
        itemIds,
        shouldRenderTags,
        tabId,
        updateKey: 'name',
        updateValue: value
      })
    );

    setIsDirty?.(true);
    setEditRow(null);
  };

  // Method to perform the reodering of tags.
  // Reordering of tag groups and matrix widgets is accomplished in
  // src/components/machine-health/configurator/WidgetTable/Row.tsx
  // by a similar method.
  const handleOrderChange = (
    order: Order,
    itemIds: {
      id: string;
      tabId?: string | undefined;
      tagGroupId?: string | undefined;
      widgetGroupId?: string | undefined;
      widgetId?: string | undefined;
    }
  ) => {
    setLocalTableRows?.((prev) => {
      const row = prev.find((p) => p.id === tabId);

      if (!row || !row.members) return prev;

      const members = row.members.find((m) => m.id === itemIds.widgetId);
      const tagGroups = members?.members?.find((tagGroup) => tagGroup.id === itemIds.tagGroupId);

      const reorderTags = (
        currentTag: WidgetTableDropdownItem,
        items: WidgetTableDropdownItem[]
      ) => {
        const indexCurrentTag = items.indexOf(currentTag);

        const elm = items.splice(indexCurrentTag, 1)[0];
        items.splice(
          order === Order.DOWN
            ? Math.min(items.length + 1, indexCurrentTag + 1)
            : Math.max(0, indexCurrentTag - 1),
          0,
          elm
        );
      };

      if (tagGroups?.tags) {
        const currentTag = tagGroups.tags.find((tagGroup) => tagGroup.id === itemIds.id);

        if (!currentTag) return prev;

        reorderTags(currentTag, tagGroups.tags);
      } else if (members?.tags) {
        const currentTag = members.tags.find((d) => d.id === itemIds.id);

        if (!currentTag) return prev;

        reorderTags(currentTag, members.tags);
      } else {
        return prev;
      }

      return updateLocalItem({
        prev,
        itemIds,
        shouldRenderTags: false,
        tabId
      });
    });

    setIsDirty?.(true);
  };

  const nextConfigs = [...columnConfigs];

  // Add the actions column
  nextConfigs.push({
    dataIndex: 'actions',
    key: 'actions',
    title: Header({
      title: dataSize > 0 ? 'Actions' : ''
    }),
    width: 100
  });

  // Add the expand button column
  nextConfigs.push({
    dataIndex: 'expand',
    key: 'expand',
    title: <span></span>,
    width: 0
  });

  // Iterate over the columns, if we come across a row that is being edited, ...
  // ... we want to render a form and change our column-span properties ...
  // ... (the form needs extra space, and some column data is hidden during an edit)
  const updatedColumnConfigs = nextConfigs.map((colCfg, configIndex) => {
    return {
      ...colCfg,
      render(item: string | number | boolean | JSX.Element, rowProps: unknown) {
        const typedProps = rowProps as TableRowProps;

        // collect the edit state
        const isEditing = editRow === typedProps.id;
        const isTagTable = shouldRenderTags && typedProps.widgetType === WidgetType.State;

        const {
          actions,
          id: selectedId,
          name: selectedName,
          widgetType: selectedType,
          values: selectedValues
        } = typedProps ?? { actions: null, id: '', name: '--', type: WidgetType.State, values: [] };
        const { props } = actions ?? { props: null };
        const { itemIds } = props ?? { itemIds: null };

        // render map -> we will use our current column index to look up ...
        // ... what we should be rendering during a given table state
        const renderMap: Record<number, JSX.Element | null> = {
          // In the first column, add the display icon to the first column
          0: WidgetTypeToIconMap[typedProps.widgetType] ? (
            <StyledIconCell>
              <FontAwesomeIcon
                icon={WidgetTypeToIconMap[typedProps.widgetType] as IconDefinition}
              />
              <StyledIconCellText>{item}</StyledIconCellText>
            </StyledIconCell>
          ) : null,
          // if the row is being edited, render a form instead of data at index 1
          2:
            isTagTable && tags && (tags?.length || 0) > 0 ? (
              <StyledSelectWrapper>
                <BaseSelect
                  contentRenderer={(item: Record<string, unknown>) => (
                    <CustomContentRenderer item={item as unknown as WidgetTableDropdownItem} />
                  )}
                  dropdownRenderer={(props, state, methods) => (
                    <CustomDropdownRenderer props={props} state={state} methods={methods} />
                  )}
                  disabledLabel="Tag already assigned"
                  handleChangeSearch={(value: (string | Record<string, unknown> | undefined)[]) => {
                    // We need to account for the case when value = undefined ...
                    // ... which can happen when the user clears the search field
                    const updateValue = value[0] as unknown as WidgetTableDropdownItem | undefined;
                    return updateValue && handleSubmit(updateValue, itemIds);
                  }}
                  labelField="id"
                  options={tags as { id: string; label: string }[]}
                  placeholder="Select a tag..."
                  searchable
                  searchBy="label" // label is assigned as friendlyName value
                  value={
                    !selectedId?.startsWith(TagIdPrefix)
                      ? {
                          label: selectedName,
                          id: selectedId,
                          name: selectedName,
                          type: selectedType,
                          values: selectedValues
                        }
                      : ''
                  }
                  valueField="id"
                />
                <RowButtonGroup>
                  <StyledCrudButtonWrapper>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      onClick={() => handleOrderChange(Order.DOWN, itemIds)}
                    />
                  </StyledCrudButtonWrapper>
                  <StyledCrudButtonWrapper>
                    <FontAwesomeIcon
                      icon={faArrowUp}
                      onClick={() => handleOrderChange(Order.UP, itemIds)}
                    />
                  </StyledCrudButtonWrapper>
                </RowButtonGroup>
              </StyledSelectWrapper>
            ) : isEditing ? (
              <TableForm
                cancelCallback={() => {
                  setEditRow(null);
                }}
                id={itemIds.id}
                item={item as string}
                placeholder="Widget name"
                submitCallback={(value) => handleSubmit(value, itemIds)}
              />
            ) : null
        };

        // look up our render alternate based on which column we're in ...
        // ... if nothing is found, return the item as is (render text per column as usual)
        return (renderMap[configIndex] || item) as Element | ReactNode;
      },
      onCell: (rowData: Record<string, string>) => {
        // collect the edit state
        const isEditing = editRow === rowData.id;
        const isTagTable = shouldRenderTags && rowData.widgetType === WidgetType.State;

        // init new props: we will return this at the end of the function
        // https://table-react-component.vercel.app/demo/colspan-rowspan
        const props: React.TdHTMLAttributes<HTMLTableCellElement> = {};

        if (isEditing || isTagTable) {
          // update column span values based on index ->
          // extra space for index 2 (name), hide indeces 1 (tags), and 3 (actions)
          if (configIndex === 2) {
            props.colSpan = 3;
          }
          if (configIndex === 1 || configIndex === 3) {
            props.colSpan = 0;
          }
        }

        // For rows that aren't of subtype 'matrix-widget-group' or are without children, ...
        // ... we want to remove the spacing created by the expand button ...
        // ... since it isn't present on child rows. To do this, we will ...
        // ... have the second to last child take up two col-spans, and the last none.
        // ... we only do this when we are not in edit mode

        if ((!rowData.children?.length || !rowData.canBeExpanded) && !isEditing) {
          if (configIndex === 3) {
            props.colSpan = 2;
          } else if (configIndex === 4) {
            props.colSpan = 0;
          }
        }

        return props;
      }
    };
  });

  return updatedColumnConfigs;
};
