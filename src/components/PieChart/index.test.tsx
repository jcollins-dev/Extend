import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import PieChart, { PieSliceDatum } from '.';

const testData: PieSliceDatum[] = [
  {
    id: 'slice1',
    label: '35%',
    percent: 35,
    color: '#ff0000',
    tooltip: <span>slice1: 35%</span>
  },
  {
    id: 'slice2',
    label: '35%',
    percent: 35,
    color: '#ff0000',
    tooltip: <span>slice2: 35%</span>
  },
  {
    id: 'slice3',
    label: '30%',
    percent: 30,
    color: '#ff0000',
    tooltip: <span>slice3: 30%</span>
  }
];

describe('PieChart', () => {
  it('Matches snapshot when rendering with data', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <PieChart data={testData} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
