import { createLocalItem, CreateNewWidgetItemProps } from './create-local-item';
import { WidgetType } from 'types/protein';

describe('Create Local Item', () => {
  it('adds a new item to the local table', () => {
    const widgetTable: CreateNewWidgetItemProps = {
      editRow: null,
      isAddTagGroupRow: false,
      isAddWidgetRow: false,
      localRows: [],
      prev: [],
      tabId: 'test',
      value: 'test',
      widgetType: WidgetType.Alerts
    };

    const result = createLocalItem(widgetTable);

    expect(result).toEqual([]);
  });
});
