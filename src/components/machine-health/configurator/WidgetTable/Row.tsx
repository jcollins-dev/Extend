// 3rd party libraries
import React from 'react';
import {
  faArrowDown,
  faArrowUp,
  faFolderPlus,
  faPen,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { faCircleUp, faCopy, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { useTheme } from 'styled-components';

// Components
import { Switch } from 'components';

// Types
import {
  CreateNewWidgetItemProps,
  WidgetRowCrudProps,
  WidgetTableCustomExpandIcon
} from 'types/machine-health';
import { WidgetType } from 'types/protein';
import { Order, WidgetTableDataItem } from 'types/machine-health/widget-table';

// Context
import { useWidgetTableContext } from './WidgetTableContext';

// Constants
import { RowIdDelimiter } from 'constants/machineConfig';

// Helpers
import { deleteLocalItem, updateLocalItem } from './helpers';

/* Styled components */

const StyledBodyRow = styled.tr<{ isEditing?: boolean }>`
  background-color: ${(props) => props.theme.colors.background.background2};
  border-bottom: ${({ theme }) => theme.colors.borders.border02.border};
  border-top: ${({ theme }) => theme.colors.borders.border02.border};
  height: 3.85rem;
`;

export const RowButtonGroup = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const IconHover = styled.div`
  cursor: pointer;

  svg {
    transition: all 0.3s ease-in-out;
  }

  & :hover {
    color: ${({ theme }) => theme.colors.mediumBlue};
    transition: all 0.3s ease-in-out;
  }
`;

const RotateIconWrapper = styled(IconHover)<{ isExpanded?: boolean }>`
  margin-left: auto;
  transition: all 0.3s ease-in-out;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(0deg)' : 'rotate(180deg)')};
  width: fit-content;
`;

export const StyledCrudButtonWrapper = styled(IconHover)`
  font-size: 1rem;
`;

const StyledAddChildRow = styled.tr<{ isAddWidgetRow?: boolean; isAddTagGroupRow?: boolean }>`
  td {
    border-bottom: ${({ isAddWidgetRow, isAddTagGroupRow, theme }) =>
      (isAddWidgetRow || isAddTagGroupRow) && theme.colors.borders.border02.border};
    border-top: ${({ isAddWidgetRow, isAddTagGroupRow, theme }) =>
      (isAddWidgetRow || isAddTagGroupRow) && theme.colors.borders.border02.border};
    height: 3rem;
    padding-bottom: 0.75rem;
    padding-left: ${({ isAddTagGroupRow }) => (isAddTagGroupRow ? '1.75rem' : '1rem')};
    padding-right: 1.5rem;
    padding-top: 0.75rem;
    text-align: left;
  }
`;

const StyledAddChildCell = styled.td`
  background-color: transparent;
`;

const StyledAddChildText = styled.span`
  padding-left: 0.5rem;
`;

const StyledButtonGroup = styled.div<{ indent: boolean }>`
  align-items: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.mediumBlue};
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: ${(props) => props.theme.typography.components.tableHeader.size};
  font-weight: ${(props) => props.theme.typography.components.tableRowLight.weight};
  line-height: ${(props) => props.theme.typography.components.tableRowLight.lineHeight};
  padding: 0;
  padding-left: ${({ indent }) => indent && '1.5rem'};
  transition: all 0.2s ease-in-out;
  width: fit-content;

  svg,
  span {
    transition: color 0.3s ease-in-out;
  }

  :hover {
    svg,
    span {
      color: ${({ theme }) => theme.colors.mediumBlue2};
      transition: color 0.3s ease-in-out;
    }
  }
`;

/* End of styled components */

interface BodyRowProps {
  'data-row-key': WidgetType;
  editRow: string;
  handleCreateNewItem: ({ value, widgetType, tabId, isTag }: CreateNewWidgetItemProps) => void;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
  tabId: string;
  widgetGroupId: string;
}

export const BodyRow = (props: BodyRowProps): JSX.Element => {
  const { setIsModalOpenById, setModalTitle, setModalType, setTagGroupParentId } =
    useWidgetTableContext();

  const isEditing = props['data-row-key'] === props.editRow;
  const isAddTagRow = props['data-row-key']?.startsWith(WidgetType.TagRow);
  const isAddTagGroupRow = props['data-row-key']?.startsWith(WidgetType.TagGroupRow);
  const isAddWidgetRow = props['data-row-key']?.includes(WidgetType.WidgetRow);

  const labelMap: { [key in WidgetType]?: Record<string, string> } = {
    [WidgetType.TagGroupRow]: { button: 'Add Tag Group', modal: 'Create new Tag Group' },
    [WidgetType.WidgetRow]: { button: 'Add Matrix Table', modal: 'Create new Matrix Table' }
  };

  const labelKey: WidgetType = props['data-row-key']?.split(RowIdDelimiter)?.[0] as WidgetType;
  const parentId = props['data-row-key']?.split(RowIdDelimiter)?.[1];

  const handleAddChildClick = () => {
    props.setIsDirty?.(true);

    if (isAddTagRow) {
      return props.handleCreateNewItem({
        isTag: true,
        parentId,
        tabId: props.tabId,
        value: '',
        widgetType: WidgetType.State
      });
    }

    setModalType(labelKey);
    setIsModalOpenById(props.tabId);
    setModalTitle(labelMap[labelKey]?.modal ?? 'Add new Item');
    setTagGroupParentId(parentId);
  };

  return isAddTagGroupRow || isAddWidgetRow || isAddTagRow ? (
    <StyledAddChildRow isAddWidgetRow={isAddWidgetRow} isAddTagGroupRow={isAddTagGroupRow}>
      <StyledAddChildCell colSpan={5}>
        <StyledButtonGroup indent={!labelMap[labelKey]} onClick={handleAddChildClick}>
          <FontAwesomeIcon icon={isAddTagGroupRow || isAddTagRow ? faFolderPlus : faPlus} />
          <StyledAddChildText>{labelMap[labelKey]?.button ?? 'Add Tag'}</StyledAddChildText>
        </StyledButtonGroup>
      </StyledAddChildCell>
    </StyledAddChildRow>
  ) : (
    <StyledBodyRow {...props} isEditing={isEditing} />
  );
};

export const RowCrudButtons = ({
  active,
  deleteable,
  editable,
  handleCopyCallback,
  isCopyTable,
  itemIds: { id, tabId, widgetId, widgetGroupId, tagGroupId },
  orderable,
  setEditRow,
  setIsDirty,
  setIsEditingName,
  shouldRenderTags,
  toggleActive,
  typeMatch
}: WidgetRowCrudProps): JSX.Element => {
  const theme = useTheme();
  const { setLocalTableRows } = useWidgetTableContext();

  const handleDeleteClick = () => {
    setEditRow?.(null);
    setLocalTableRows?.((prev) =>
      deleteLocalItem({
        id,
        prev,
        shouldRenderTags,
        tabId,
        tagGroupId,
        widgetGroupId,
        widgetId
      })
    );

    setIsDirty?.(true);
  };

  const handleEnableClick = () => {
    setLocalTableRows?.((prev) =>
      updateLocalItem({
        prev,
        itemIds: { id, tabId, widgetId, widgetGroupId },
        shouldRenderTags: false,
        tabId,
        updateKey: 'active',
        updateValue: !active
      })
    );

    setIsDirty?.(true);
  };

  // Method to perform the reodering of tag groups and matrix widgets.
  // Reordering of tags is accomplished in
  // src/components/machine-health/configurator/WidgetTable/helpers/edit-column-configs.tsx
  // by a similar method.
  const handleOrderChange = (order: Order) => {
    setLocalTableRows?.((prev) => {
      const currentRows = prev.find((row) => row.id === tabId);

      if (!currentRows) return prev;

      const reorderItems = (currentItem: WidgetTableDataItem, items: WidgetTableDataItem[]) => {
        const indexCurrentItem = items.indexOf(currentItem);

        const elm = items.splice(indexCurrentItem, 1)[0];
        items.splice(
          order === Order.DOWN
            ? Math.min(items.length + 1, indexCurrentItem + 1)
            : Math.max(0, indexCurrentItem - 1),
          0,
          elm
        );
      };

      if (!widgetId && !tagGroupId && widgetGroupId) {
        // reorder matrix-widget or top level tag group
        const currentWidget = currentRows.members?.find((member) => member.id === widgetGroupId);
        const currentTagGroup = currentWidget?.members?.find((member) => member.id === id);

        if (!currentTagGroup || !currentWidget?.members) return prev;

        reorderItems(currentTagGroup, currentWidget.members);
      } else if (!tagGroupId) {
        // reorder nested tag group
        const currentWidgetGroup = currentRows.members?.find(
          (member) => member.id === widgetGroupId
        );
        const currentWidget = currentWidgetGroup?.members?.find((member) => member.id === widgetId);
        const currentTagGroup = currentWidget?.members?.find((member) => member.id === id);

        if (!currentTagGroup || !currentWidget?.members) return prev;

        reorderItems(currentTagGroup, currentWidget.members);
      } else {
        return prev;
      }

      return updateLocalItem({
        prev,
        itemIds: { id, tabId, widgetId, widgetGroupId, tagGroupId },
        shouldRenderTags: false,
        tabId
      });
    });

    setIsDirty?.(true);
  };

  if (isCopyTable) {
    return typeMatch ? (
      <RowButtonGroup>
        <StyledCrudButtonWrapper>
          <FontAwesomeIcon icon={faCopy} onClick={() => handleCopyCallback?.()} />
        </StyledCrudButtonWrapper>
      </RowButtonGroup>
    ) : (
      <></>
    );
  }

  return (
    <RowButtonGroup>
      {toggleActive && (
        <Switch
          checked={!!active}
          handleDiameter={14}
          height={10}
          onChange={handleEnableClick}
          width={26}
          offColor={theme.colors.mediumGrey2}
          offHandleColor={theme.colors.mediumGrey3}
        />
      )}
      {orderable && (
        <RowButtonGroup>
          <StyledCrudButtonWrapper>
            <FontAwesomeIcon icon={faArrowDown} onClick={() => handleOrderChange(Order.DOWN)} />
          </StyledCrudButtonWrapper>
          <StyledCrudButtonWrapper>
            <FontAwesomeIcon icon={faArrowUp} onClick={() => handleOrderChange(Order.UP)} />
          </StyledCrudButtonWrapper>
        </RowButtonGroup>
      )}
      {editable && (
        <StyledCrudButtonWrapper>
          <FontAwesomeIcon
            icon={faPen}
            onClick={() => {
              setEditRow?.((prev) => (prev === id ? null : id));
              setIsEditingName?.(false);
            }}
          />
        </StyledCrudButtonWrapper>
      )}
      {deleteable && (
        <StyledCrudButtonWrapper>
          <FontAwesomeIcon icon={faTrashCan} onClick={handleDeleteClick} />
        </StyledCrudButtonWrapper>
      )}
    </RowButtonGroup>
  );
};

export const CustomExpandIcon = ({
  expanded,
  onExpand,
  record
}: WidgetTableCustomExpandIcon): JSX.Element => {
  return (
    <RotateIconWrapper isExpanded={!!expanded}>
      <StyledCrudButtonWrapper>
        <FontAwesomeIcon
          icon={faCircleUp}
          onClick={(e) => {
            onExpand?.(record, e);
          }}
        />
      </StyledCrudButtonWrapper>
    </RotateIconWrapper>
  );
};
