import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

// Theme
import theme from 'themes';

import FilterOption from './FilterOption';

describe('FilterOption', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <FilterOption
          options={[
            { value: 'testValue', label: 'testLabel' },
            { value: 'test2Value', label: 'test2Label' }
          ]}
          value="test"
          placeholder="test"
          handleChange={jest.fn()}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
