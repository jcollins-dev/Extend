// 3rd party libraries
import { v4 as uuidv4 } from 'uuid';

// Types
import { WidgetTableDataItem } from 'types/machine-health';
import { WidgetType } from 'types/protein';

// Constants
import { TagIdPrefix } from 'constants/machineConfig';

export interface CreateNewWidgetItemProps {
  editRow: string | null;
  isAddTagGroupRow: boolean;
  isAddWidgetRow: boolean;
  isTag?: boolean;
  localRows: WidgetTableDataItem[];
  parentId?: string;
  prev: WidgetTableDataItem[];
  tabId: string;
  value: string;
  widgetType: WidgetType;
}

export const createLocalItem = ({
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
}: CreateNewWidgetItemProps): WidgetTableDataItem[] => {
  // collect the new item, accounting for each type
  const newRow = {
    active: true,
    editable: true,
    // We need a special identifier for tags since they do not have an unique id field, ...
    // ... this is so that the Select component can render the correct label when a tag is added, ...
    // ... the BE ignores the id field on tags; we are not concerned about an invalid uuid.
    id: `${isTag ? TagIdPrefix : ''}${uuidv4()}`,
    name: value,
    tabId: tabId,
    type: widgetType,
    toggleActive: true,
    values: [],
    widgetClass: 'widget',
    widgetId: editRow as string,
    widgetGroupId:
      localRows.find((item) => item.widgetType === WidgetType.MatrixWidgetGroup)?.id || '',
    widgetType: widgetType
  };

  const currentRows = prev.find((row) => row.id === tabId)?.members || [];

  let nextRows: WidgetTableDataItem[] = [];

  nextRows = currentRows.map((row) => {
    if (isAddWidgetRow && row.widgetType === WidgetType.MatrixWidgetGroup) {
      // add a new widget to the matrix widget group
      row.members ? row.members.push(newRow) : (row.members = [newRow]);
    }

    if (isAddTagGroupRow && !isTag) {
      if (row.id === parentId) {
        row?.members ? row.members.push(newRow) : (row.members = [newRow]);
      } else {
        // otherwise, search for the widget parent, insert the tag group into its children
        row.members?.forEach((child) => {
          if (child.id === editRow || child.id === parentId) {
            // add the new item onto the end of the children, or create children if there aren't any
            child.members ? child.members.push(newRow) : (child.members = [newRow]);
          }
        });
      }
    }

    if (isTag && row.id === parentId) {
      // add the new item onto the end of the children, or create children if there aren't any
      row.tags ? row.tags.push(newRow) : (row.tags = [newRow]);
    } else if (isTag) {
      // otherwise, we need to search through two levels of children
      row.members?.forEach((child) => {
        if (child.id === parentId) {
          child.tags ? child.tags.push(newRow) : (child.tags = [newRow]);
        } else {
          child.members?.forEach((grandChild) => {
            if (grandChild.id === parentId) {
              // add the new item onto the end of the children, or create children if there aren't any
              grandChild.tags ? grandChild.tags.push(newRow) : (grandChild.tags = [newRow]);
            }
          });
        }
      });
    }
    return row;
  });

  // replace the table rows that we've updated, ...
  // ... order does matter because the BE will re-order the rows as it recieves them
  const updateIndex = prev.findIndex((item) => item.id === tabId);

  const next = [...prev];
  updateIndex >= 0 && (next[updateIndex] = { ...next[updateIndex], members: nextRows });

  return next;
};
