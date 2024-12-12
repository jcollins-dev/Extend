import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import KPIPanel from './KPIPanel';
import { MachineVisionKpiItem } from 'types/machine-vision';
import theme from 'themes';

const testData: MachineVisionKpiItem = {
  type: 'mv_kpi',
  id: 'Throughput',
  unit: 'Lbs / hr',
  value: {
    timestamp: '2022-04-15T18:15:00+00:00',
    value: 43184,
    endTimestamp: '2022-04-15T19:15:00+00:00'
  },
  values: [
    {
      timestamp: '2022-04-15T16:15:00+00:00',
      value: 44186,
      endTimestamp: '2022-04-15T17:15:00+00:00'
    },
    {
      timestamp: '2022-04-15T16:20:00+00:00',
      value: 43613,
      endTimestamp: '2022-04-15T17:20:00+00:00'
    },
    {
      timestamp: '2022-04-15T16:25:00+00:00',
      value: 44168,
      endTimestamp: '2022-04-15T17:25:00+00:00'
    },
    {
      timestamp: '2022-04-15T16:30:00+00:00',
      value: 43952,
      endTimestamp: '2022-04-15T17:30:00+00:00'
    },
    {
      timestamp: '2022-04-15T16:35:00+00:00',
      value: 43763,
      endTimestamp: '2022-04-15T17:35:00+00:00'
    },
    {
      timestamp: '2022-04-15T16:40:00+00:00',
      value: 43494,
      endTimestamp: '2022-04-15T17:40:00+00:00'
    },
    {
      timestamp: '2022-04-15T16:45:00+00:00',
      value: 43350,
      endTimestamp: '2022-04-15T17:45:00+00:00'
    },
    {
      timestamp: '2022-04-15T16:50:00+00:00',
      value: 43290,
      endTimestamp: '2022-04-15T17:50:00+00:00'
    },
    {
      timestamp: '2022-04-15T16:55:00+00:00',
      value: 42864,
      endTimestamp: '2022-04-15T17:55:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:00:00+00:00',
      value: 43365,
      endTimestamp: '2022-04-15T18:00:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:05:00+00:00',
      value: 43435,
      endTimestamp: '2022-04-15T18:05:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:10:00+00:00',
      value: 43407,
      endTimestamp: '2022-04-15T18:10:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:15:00+00:00',
      value: 43609,
      endTimestamp: '2022-04-15T18:15:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:20:00+00:00',
      value: 43437,
      endTimestamp: '2022-04-15T18:20:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:25:00+00:00',
      value: 43526,
      endTimestamp: '2022-04-15T18:25:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:30:00+00:00',
      value: 43622,
      endTimestamp: '2022-04-15T18:30:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:35:00+00:00',
      value: 43720,
      endTimestamp: '2022-04-15T18:35:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:40:00+00:00',
      value: 43822,
      endTimestamp: '2022-04-15T18:40:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:45:00+00:00',
      value: 43947,
      endTimestamp: '2022-04-15T18:45:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:50:00+00:00',
      value: 44129,
      endTimestamp: '2022-04-15T18:50:00+00:00'
    },
    {
      timestamp: '2022-04-15T17:55:00+00:00',
      value: 44454,
      endTimestamp: '2022-04-15T18:55:00+00:00'
    },
    {
      timestamp: '2022-04-15T18:00:00+00:00',
      value: 43777,
      endTimestamp: '2022-04-15T19:00:00+00:00'
    },
    {
      timestamp: '2022-04-15T18:05:00+00:00',
      value: 43398,
      endTimestamp: '2022-04-15T19:05:00+00:00'
    },
    {
      timestamp: '2022-04-15T18:10:00+00:00',
      value: 43463,
      endTimestamp: '2022-04-15T19:10:00+00:00'
    },
    {
      timestamp: '2022-04-15T18:15:00+00:00',
      value: 43184,
      endTimestamp: '2022-04-15T19:15:00+00:00'
    }
  ]
};
it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <KPIPanel KPIData={testData} />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
