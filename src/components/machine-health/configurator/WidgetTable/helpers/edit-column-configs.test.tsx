import React from 'react';
import { EditConfigArgs, editColumnConfigs } from './edit-column-configs';

describe('Edit Column configs', () => {
  it('adds actions and expand column configs', () => {
    const widgetTable: EditConfigArgs = {
      columnConfigs: [],
      dataSize: 0,
      editRow: null,
      setEditRow: jest.fn(),
      setLocalTableRows: jest.fn(),
      shouldRenderTags: true,
      tabId: 'test'
    };

    const result = editColumnConfigs(widgetTable);

    expect(result).toEqual([
      {
        dataIndex: 'actions',
        key: 'actions',
        onCell: expect.any(Function),
        render: expect.any(Function),
        title: expect.any(Object),
        width: 100
      },
      {
        dataIndex: 'expand',
        key: 'expand',
        onCell: expect.any(Function),
        render: expect.any(Function),
        title: <span />,
        width: 0
      }
    ]);
  });
});
