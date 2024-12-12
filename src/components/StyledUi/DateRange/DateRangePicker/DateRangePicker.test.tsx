import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { DateRangePicker } from './DateRangePicker';
import { default as theme } from 'themes';

describe('DateRangePicker', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <DateRangePicker
          dateRange={{
            startTime: new Date(),
            endTime: new Date()
          }}
          handleCancel={jest.fn()}
          handleSubmit={jest.fn()}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
