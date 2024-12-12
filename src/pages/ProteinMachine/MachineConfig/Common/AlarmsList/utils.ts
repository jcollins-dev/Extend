// Types
import { ColumnConfig, SortState } from 'types';

export const generateColumnConfigs = (sortState: Record<string, SortState>): ColumnConfig[] => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'id')
        ? sortState['id']
        : SortState.unsorted
    },
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'text')
        ? sortState['text']
        : SortState.unsorted
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'category')
        ? sortState['category']
        : SortState.unsorted
    },
    {
      title: 'Location Group',
      dataIndex: 'locationGroup',
      key: 'locationGroup',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'locationGroup')
        ? sortState['locationGroup']
        : SortState.unsorted
    }
  ];
};
