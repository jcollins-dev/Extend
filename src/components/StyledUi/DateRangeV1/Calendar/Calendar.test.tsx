import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { Calendar } from './Calendar';
import { default as theme } from 'themes';

describe('Calendar', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <Calendar
          dateRange={{
            startTime: new Date(),
            endTime: new Date()
          }}
          setDateRange={jest.fn()}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
