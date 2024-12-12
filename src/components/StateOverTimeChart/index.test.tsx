import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import StateOverTimeChart from '.';
import {
  testCleaningStepsOverTimeBars,
  testStateOverTimeSpanPeriods
} from 'constants/testdata/protein';

describe('StateOverTimeChart', () => {
  it('Renders', () => {
    const testRows = [
      {
        label: 'Defrost',
        state: 'defrost',
        bars: testCleaningStepsOverTimeBars.filter((bar) => bar.state === 'defrost'),
        isButton: true,
        isExpanded: true
      },
      {
        label: 'Foaming',
        state: 'foaming',
        bars: testCleaningStepsOverTimeBars.filter((bar) => bar.state === 'foaming')
      }
    ];
    render(
      <ThemeProvider theme={theme}>
        <StateOverTimeChart rows={testRows} spanPeriods={testStateOverTimeSpanPeriods} />
      </ThemeProvider>
    );
  });
});
