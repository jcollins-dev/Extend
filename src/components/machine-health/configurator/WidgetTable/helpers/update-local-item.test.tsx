import { ToggleLocalDataArgs, updateLocalItem } from './update-local-item';

describe('Edit Column configs', () => {
  it('adds actions and expand column configs', () => {
    const widgetTable: ToggleLocalDataArgs = {
      prev: [],
      itemIds: {},
      shouldRenderTags: false,
      tabId: 'test'
    };

    const result = updateLocalItem(widgetTable);

    expect(result).toEqual([]);
  });
});
