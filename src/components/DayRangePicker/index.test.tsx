import React from 'react';
import DayRangePicker from './index';
import ReactDOM from 'react-dom';

import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <DayRangePicker dateRange={{}} onDateRangeChange={() => jest.fn} />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
