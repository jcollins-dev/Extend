import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

import BaseMultiSelect from './BaseMultiSelect';
import { default as theme } from 'themes';

const testOptions = [
  { value: 'option1', label: 'test1' },
  { value: 'option2', label: 'test2' }
];
const testPlaceholder = 'test placeholder';

describe('BaseMultiSelect', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <BaseMultiSelect
          options={testOptions}
          handleChange={jest.fn()}
          placeholder={testPlaceholder}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
