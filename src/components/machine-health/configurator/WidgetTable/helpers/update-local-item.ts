// Types
import { WidgetTableDataItem, WidgetTableDropdownItem } from 'types/machine-health';

export interface ToggleLocalDataArgs {
  prev: WidgetTableDataItem[];
  itemIds: Record<string, string | undefined>;
  shouldRenderTags: boolean;
  tabId: string;
  updateKey?: keyof WidgetTableDataItem;
  updateValue?: string | number | boolean | WidgetTableDropdownItem;
}

// This method updates local table state on name and toggle active changes
export const updateLocalItem = ({
  prev,
  itemIds,
  shouldRenderTags,
  tabId,
  updateKey,
  updateValue
}: ToggleLocalDataArgs): WidgetTableDataItem[] => {
  // We know what level to traverse to based on which ids are present
  const { id, widgetGroupId, widgetId, tagGroupId } = itemIds;
  const currentRows = prev.find((row) => row.id === tabId)?.members || [];

  let nextRows: WidgetTableDataItem[] = [];

  if (!widgetGroupId) {
    // is widget group
    nextRows = currentRows.map((row) => {
      if (row.id !== id || !updateKey) return row;
      return {
        ...row,
        [updateKey]: updateValue
      };
    });
  } else if (!widgetId) {
    // is widget
    nextRows = currentRows.map((row) => ({
      ...row,
      members: row.members?.map((child) => {
        if (child.id !== id || !updateKey) return child;
        return {
          ...child,
          [updateKey]: updateValue
        };
      })
    }));
  } else if (!shouldRenderTags) {
    // is tag group
    nextRows = currentRows.map((row) => ({
      ...row,
      members: row.members?.map((child) => ({
        ...child,
        members: child.members?.map((grandchild) => {
          if (grandchild.id !== id || !updateKey) return grandchild;
          return {
            ...grandchild,
            [updateKey]: updateValue
          };
        })
      }))
    }));
  } else if (!tagGroupId) {
    // top level tag
    nextRows = currentRows.map((row) => ({
      ...row,
      tags: row.tags?.map((tag) => {
        if (tag?.id !== id) return tag;
        return updateValue as WidgetTableDropdownItem;
      })
    }));
  } else {
    // tag within a tag group
    nextRows = currentRows.map((row) => ({
      ...row,
      members: row.members?.map((child) => {
        if (tagGroupId === child.id) {
          return {
            ...child,
            tags: child.tags?.map((tag) => {
              if (tag?.id !== id) return tag;
              return updateValue as WidgetTableDropdownItem;
            })
          };
        }
        return {
          ...child,
          members: child.members?.map((grandchild) => {
            if (grandchild.id !== tagGroupId) return grandchild;
            return {
              ...grandchild,
              tags: grandchild.tags?.map((tag) => {
                if (tag.id !== id) return tag;
                return updateValue as WidgetTableDropdownItem;
              })
            };
          })
        };
      })
    }));
  }

  // replace the table rows that we've updated, ...
  // ... order does matter because the BE will re-order the rows as it recieves them
  const updateIndex = prev.findIndex((item) => item.id === tabId);

  const next = [...prev];
  updateIndex >= 0 && (next[updateIndex] = { ...next[updateIndex], members: nextRows });

  return next;
};
