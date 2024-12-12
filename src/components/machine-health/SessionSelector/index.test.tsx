import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import SessionSelector from './';

describe('SessionSelector', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <SessionSelector
          close={jest.fn}
          dateRange={{}}
          onSelectSession={jest.fn()}
          onDateRangeChange={jest.fn()}
          onAverageDurationChange={jest.fn()}
          averageDuration={0}
        />
      </ThemeProvider>
    );
  });
});
