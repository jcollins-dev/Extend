import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import KPISmallPanel from './KPISmallPanel';
import theme from 'themes';
const data = {
  average: {
    id: 'Surface temp',
    unit: '°F',
    type: 'Average',
    value: {
      timestamp: '2022-10-01T00:00:00.000Z',
      value: 185,
      endTimestamp: '2022-10-26T00:00:00.000Z'
    },
    values: [
      {
        timestamp: '2022-10-01T00:00:00.000Z',
        value: 185,
        endTimestamp: '2022-10-26T00:00:00.000Z'
      }
    ]
  },
  weight: {
    id: 'Cumulative weight',
    unit: 'Lbs',
    type: 'Weight',
    value: {
      timestamp: '2022-10-01T00:00:00.000Z',
      value: 500,
      endTimestamp: '2022-10-26T00:00:00.000Z'
    },
    values: [
      {
        timestamp: '2022-10-01T00:00:00.000Z',
        value: 500,
        endTimestamp: '2022-10-26T00:00:00.000Z'
      }
    ]
  },
  target: {
    id: 'Avg.Piece Size',
    unit: 'Oz',
    type: 'TargetWeight',
    value: {
      timestamp: '2022-10-01T00:00:00.000Z',
      value: 30,
      endTimestamp: '2022-10-26T00:00:00.000Z'
    },
    values: [
      {
        timestamp: '2022-10-01T00:00:00.000Z',
        value: 30,
        endTimestamp: '2022-10-26T00:00:00.000Z'
      }
    ]
  }
};

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <KPISmallPanel KPIData={data} />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
