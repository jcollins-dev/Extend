import deleteLocalItem, { DeleteLocalItemProps } from './delete-local-item';

describe('Delete Local Item', () => {
  it('removes a local item', () => {
    const widgetTable: DeleteLocalItemProps = {
      id: 'test',
      prev: [],
      shouldRenderTags: true,
      tabId: 'test'
    };

    const result = deleteLocalItem(widgetTable);

    expect(result).toEqual([]);
  });
});
