// 3rd party libraries
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

// Components
import { RowCrudButtons } from '../Row';

// Types
import { WidgetTableDataItem } from 'types/machine-health';
import { WidgetType } from 'types/protein';

// Helpers
import { kebabOrSnakeToUpperCase } from '.';

export interface AddCrudArgs {
  copyWidgetType?: WidgetType;
  handleCopyCallback?: (item: WidgetTableDataItem) => void;
  hideCrudButtons: boolean;
  isCopyTable: boolean;
  rows: WidgetTableDataItem[];
  setEditRow?: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDirty?: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalRows?: React.Dispatch<React.SetStateAction<WidgetTableDataItem[]>>;
  setIsEditingName?: React.Dispatch<React.SetStateAction<boolean>>;
  shouldRenderTags: boolean;
  tabId: string;
}

interface AddCrudReturn {
  hasChildren: boolean;
  nextRowsWithButtons: WidgetTableDataItem[];
}

export const addRowCrudButtons = ({
  copyWidgetType,
  handleCopyCallback,
  hideCrudButtons,
  isCopyTable,
  rows,
  setEditRow,
  setIsDirty,
  setIsEditingName,
  shouldRenderTags,
  tabId
}: AddCrudArgs): AddCrudReturn => {
  const nextRowData: WidgetTableDataItem[] = [];

  // store hasChildren in a variable to tell the table if at least one column
  // has show the expand icon column
  let hasChildren = false;

  rows.forEach((row) => {
    // when we come across a matrix widget group, we need to add a row for each widget in the group ...
    // ... we are skipping the render of the widget group row itself
    if (row.widgetType === WidgetType.MatrixWidgetGroup) {
      row.members?.forEach((widget) => {
        nextRowData.push({
          ...widget,
          actions: hideCrudButtons ? (
            <></>
          ) : (
            <RowCrudButtons
              active={widget.active}
              deleteable={widget.editable}
              editable={widget.editable}
              handleCopyCallback={() => handleCopyCallback?.(widget)}
              isCopyTable={isCopyTable}
              itemIds={{
                id: widget.id,
                tabId,
                widgetGroupId: row.id
              }}
              orderable={true}
              setEditRow={setEditRow}
              setIsDirty={setIsDirty}
              setIsEditingName={setIsEditingName}
              toggleActive={widget.toggleActive}
              typeMatch={widget.widgetType === copyWidgetType}
            />
          ),
          canBeExpanded: !!widget.members?.length,
          children: widget.members?.map((tagGroup: WidgetTableDataItem) => {
            hasChildren = true;
            return {
              ...tagGroup,
              actions: hideCrudButtons ? (
                <></>
              ) : (
                <RowCrudButtons
                  deleteable={!!tagGroup.editable}
                  editable={!!tagGroup.editable}
                  handleCopyCallback={() => handleCopyCallback?.(tagGroup)}
                  isCopyTable={isCopyTable}
                  itemIds={{
                    id: tagGroup.id,
                    tabId,
                    widgetGroupId: row.id,
                    widgetId: widget.id
                  }}
                  orderable={true}
                  setEditRow={setEditRow}
                  setIsDirty={setIsDirty}
                  setIsEditingName={setIsEditingName}
                  typeMatch={tagGroup.widgetType === copyWidgetType}
                />
              ),
              canBeExpanded: shouldRenderTags,
              children: shouldRenderTags
                ? tagGroup.tags?.map((tag) => ({
                    ...tag,
                    actions: (
                      <RowCrudButtons
                        deleteable={true}
                        editable={false}
                        isCopyTable={isCopyTable}
                        itemIds={{
                          id: tag?.id,
                          tabId,
                          tagGroupId: tagGroup.id,
                          widgetGroupId: row.id,
                          widgetId: widget.id
                        }}
                        orderable={false}
                        setIsDirty={setIsDirty}
                        shouldRenderTags={shouldRenderTags}
                        toggleActive={false}
                        typeMatch={tag.type === copyWidgetType}
                      />
                    ),
                    isTag: true,
                    key: uuidv4(), // tag ids are not unique, so we need to generate a unique key
                    tagType: tag.name || '--',
                    widgetType: WidgetType.State // tag icon display
                  }))
                : undefined,
              key: tagGroup.id,
              tagType: kebabOrSnakeToUpperCase(tagGroup?.widgetType),
              tagsZones: `${tagGroup.tags?.length || 0} Tags`, // parse number of tags to a string
              type: kebabOrSnakeToUpperCase(tagGroup?.widgetType)
            };
          }),
          key: widget.id, // necessary to make react happy
          tagType: kebabOrSnakeToUpperCase(widget?.widgetType),
          tagsZones: widget.members?.length.toString() || '', // parse number of children to string
          toggleActive: true,
          type: kebabOrSnakeToUpperCase(widget?.widgetType)
        });
      });
    } else {
      // For other row types, we are going to combine tag groups ...
      // ... and tags together into the children array so that we can ...
      // ... show tags and groups on the same level
      const children = [];

      // Tag groups can only be edited, toggled, deleted when shouldRenderTags is true, so we check
      // for that in several places below
      const tagGroups = row.members?.map((tagGroup) => ({
        ...tagGroup,
        actions: hideCrudButtons ? (
          <></>
        ) : (
          <RowCrudButtons
            active={tagGroup.active}
            deleteable={tagGroup.editable}
            editable={tagGroup.editable}
            handleCopyCallback={() => handleCopyCallback?.(tagGroup)}
            isCopyTable={isCopyTable}
            itemIds={{
              id: tagGroup.id,
              tabId,
              widgetGroupId: row.id
            }}
            orderable={true}
            setEditRow={setEditRow}
            setIsDirty={setIsDirty}
            setIsEditingName={setIsEditingName}
            toggleActive={false}
            typeMatch={tagGroup.type === copyWidgetType}
          />
        ),
        canBeExpanded: shouldRenderTags,
        children: tagGroup.tags?.map((tag) => ({
          ...tag,
          actions: (
            <RowCrudButtons
              isCopyTable={isCopyTable}
              deleteable={true}
              editable={false}
              itemIds={{
                id: tag?.id,
                tabId,
                tagGroupId: tagGroup.id,
                widgetGroupId: row.id,
                widgetId: row.id
              }}
              orderable={false}
              setIsDirty={setIsDirty}
              shouldRenderTags={shouldRenderTags}
              toggleActive={false}
              typeMatch={tag.type === copyWidgetType}
            />
          ),
          isTag: true,
          key: uuidv4(), // tag ids are not unique, so we need to generate a unique key
          tagType: tag.name || '--',
          widgetType: WidgetType.State // tag icon display
        })),
        key: tagGroup.id, // necessary to make react happy
        tagType: kebabOrSnakeToUpperCase(tagGroup?.widgetType),
        tagsZones: tagGroup.tags?.length.toString() || '', // parse number of children to string
        toggleActive: true,
        type: kebabOrSnakeToUpperCase(tagGroup?.widgetType)
      }));

      const tags = row.tags?.map((tag) => ({
        ...tag,
        actions: (
          <RowCrudButtons
            deleteable={true}
            editable={false}
            isCopyTable={isCopyTable}
            itemIds={{
              id: tag?.id,
              tabId,
              widgetId: row.id,
              widgetGroupId: row.id // fill this in for tag parsing
            }}
            orderable={false}
            shouldRenderTags={shouldRenderTags}
            setIsDirty={setIsDirty}
            toggleActive={false}
            typeMatch={tag.type === copyWidgetType}
          />
        ),
        isTag: true,
        key: uuidv4(), // tag ids are not unique, so we need to generate a unique key
        tagType: tag?.name || '--',
        widgetType: WidgetType.State // tag icon display
      }));

      tags && children.push(...tags);
      tagGroups && children.push(...tagGroups);

      // If shouldRenderTags is false, we still want to render tag groups, as we should be able to read them
      // when in the configurator view, even though we cannot edit them
      const childrenToRender = shouldRenderTags ? children : tagGroups;

      nextRowData.push({
        ...row,
        actions: hideCrudButtons ? (
          <></>
        ) : (
          <RowCrudButtons
            active={row.active}
            deleteable={shouldRenderTags ? false : row.editable}
            editable={shouldRenderTags ? false : row.editable}
            handleCopyCallback={() => handleCopyCallback?.(row)}
            isCopyTable={isCopyTable}
            itemIds={{ id: row.id, tabId }}
            orderable={false}
            setEditRow={setEditRow}
            setIsDirty={setIsDirty}
            setIsEditingName={setIsEditingName}
            toggleActive={shouldRenderTags ? false : row.toggleActive}
            typeMatch={row.widgetType === copyWidgetType}
          />
        ),
        canBeExpanded: !!childrenToRender?.length,
        children: childrenToRender,
        key: row.id, // necessary to make react happy
        tagType: kebabOrSnakeToUpperCase(row?.widgetType),
        tagsZones: row.tags?.length.toString() || '', // parse number of tags to string -- is this a zone when on the parent item?
        type: kebabOrSnakeToUpperCase(row?.widgetType)
      });
    }
  });

  return { nextRowsWithButtons: nextRowData, hasChildren };
};
