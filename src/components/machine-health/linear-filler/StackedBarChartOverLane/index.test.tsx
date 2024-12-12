import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { AsepticmockStackedBarChartOverTimeData } from 'constants/testdata/';
import StackedBarChartOverLane from '.';

describe('StackedBarChartOverTime', () => {
  it('Matches snapshot when rendering with data', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <StackedBarChartOverLane
          stackedData={AsepticmockStackedBarChartOverTimeData}
          width={400}
          height={400}
        />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
