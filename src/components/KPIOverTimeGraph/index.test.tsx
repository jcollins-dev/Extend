import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import KPIOverTimeGraph from '.';
// Types
import { Series } from 'types/graph';

const testData: Series[] = [
  {
    mode: 'LINE',
    id: 'kpi-1',
    label: 'KPI 1',
    color: 'red',
    data: [
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 100 },
      { x: new Date('2020-01-01T05:00:00.000Z'), y: 90 }
    ]
  }
];

describe('KPIOverTimeGraph', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <KPIOverTimeGraph
          title="test-title"
          axisH={{
            orientation: 'top'
          }}
          axisV={{}}
          series={testData}
        />
      </ThemeProvider>
    );
  });
});
