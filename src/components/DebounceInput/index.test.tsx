import React from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';
import DebounceInput from './index';

it('It DebounceInput should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <DebounceInput value={'Hi'} onChange={jest.fn()} debounce={200} />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
