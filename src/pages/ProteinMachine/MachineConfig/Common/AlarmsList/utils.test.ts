import { SortState } from 'types';
import { generateColumnConfigs } from './utils';

describe('generateColumnConfigs', () => {
  it('should return the correct column configs', () => {
    const sortState = {
      id: SortState.ascending,
      text: SortState.descending,
      category: SortState.none,
      locationGroup: SortState.unsorted
    };

    const expectedColumnConfigs = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sortState: 2
      },
      {
        title: 'Text',
        dataIndex: 'text',
        key: 'text',
        sortState: 3
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        sortState: 0
      },
      {
        title: 'Location Group',
        dataIndex: 'locationGroup',
        key: 'locationGroup',
        sortState: 1
      }
    ];

    expect(generateColumnConfigs(sortState)).toEqual(expectedColumnConfigs);
  });
});
