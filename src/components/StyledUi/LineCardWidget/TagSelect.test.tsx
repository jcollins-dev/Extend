import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import TagSelect from './TagSelect';
import { default as theme } from 'themes';

describe('Tag Select', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TagSelect
          handleDelete={jest.fn()}
          handleOrderChange={jest.fn()}
          handleSetSelectValue={jest.fn()}
          index={0}
          tagList={[]}
          total={0}
          valuesAreSet={false}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
