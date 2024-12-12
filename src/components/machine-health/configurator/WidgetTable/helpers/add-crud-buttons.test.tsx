import { addRowCrudButtons, AddCrudArgs } from './add-crud-buttons';

describe('addCrudButtons', () => {
  it('adds crud buttons to a widget table', () => {
    const widgetTable: AddCrudArgs = {
      hideCrudButtons: true,
      isCopyTable: false,
      rows: [],
      shouldRenderTags: true,
      tabId: 'test'
    };

    const result = addRowCrudButtons(widgetTable);

    expect(result).toEqual({
      hasChildren: false,
      nextRowsWithButtons: []
    });
  });
});
