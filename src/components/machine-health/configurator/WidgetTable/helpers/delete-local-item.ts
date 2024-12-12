import { WidgetTableDataItem } from 'types/machine-health';

export interface DeleteLocalItemProps {
  id: string;
  prev: WidgetTableDataItem[];
  shouldRenderTags: boolean | undefined;
  tabId: string;
  tagGroupId?: string;
  widgetGroupId?: string;
  widgetId?: string;
}

const deleteLocalItem = ({
  id,
  prev,
  shouldRenderTags,
  tabId,
  tagGroupId,
  widgetGroupId,
  widgetId
}: DeleteLocalItemProps): WidgetTableDataItem[] => {
  // we need to remove the item from the table data state ...
  // ... we will determine how many levels of nesting to travel based on ...
  // ... the ids present in the itemIds map
  const currentRows = prev.find((row) => row.id === tabId)?.members || [];

  let nextRows: WidgetTableDataItem[] = [];

  if (!widgetGroupId) {
    // widget group
    nextRows = currentRows.filter((row) => row.id !== id);
  } else if (!widgetId) {
    // widget
    nextRows = currentRows.map((row) => ({
      ...row,
      members: row.members?.filter((child) => child.id !== id)
    }));
  } else if (!shouldRenderTags) {
    // tag group
    nextRows = currentRows.map((row) => ({
      ...row,
      members: row.members?.map((child) => ({
        ...child,
        members: child.members?.filter((grandchild) => grandchild.id !== id)
      }))
    }));
  } else if (!tagGroupId) {
    // top level tag
    nextRows = currentRows.map((row) => ({
      ...row,
      tags: row.tags?.filter((tag) => tag.id !== id)
    }));
  } else {
    // tag within a tag group
    nextRows = currentRows.map((row) => ({
      ...row,
      members: row.members?.map((child) => {
        if (tagGroupId === child.id) {
          return {
            ...child,
            tags: child.tags?.filter((tag) => tag.id !== id)
          };
        }
        return {
          ...child,
          members: child.members?.map((grandchild) => {
            // confirm that tag parent ids match ...
            // ... otherwise tags could move around between parents
            if (tagGroupId === grandchild.id) {
              return {
                ...grandchild,
                tags: grandchild.tags?.filter((tag) => tag.id !== id)
              };
            }
            return grandchild;
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

export default deleteLocalItem;
