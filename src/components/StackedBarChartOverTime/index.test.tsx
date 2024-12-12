import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import StackedBarChartOverTime from '.';
import { mockStackedBarChartOverTimeData } from 'constants/testdata/protein';

describe('StackedBarChartOverTime', () => {
  it('Matches snapshot when rendering with data', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <StackedBarChartOverTime
          stackedData={mockStackedBarChartOverTimeData}
          width={400}
          height={400}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
