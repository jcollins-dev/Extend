import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { RangeGroup } from './RangeGroup';
import { default as theme } from 'themes';

describe('RangeGroup', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <RangeGroup
          dayRangeGroups={{ '1 Day': 1, '2 Days': 2, '3 Days': 3 }}
          handleUpdate={jest.fn()}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
