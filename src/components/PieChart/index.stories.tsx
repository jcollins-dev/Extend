import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import PieChart, { PieSliceDatum } from '.';

const testData: PieSliceDatum[] = [
  {
    color: 'hsl(222, 70%, 50%)',
    hidden: false,
    id: '801',
    label: '4.2 (20.9%)',
    percent: 20.9,
    tooltip: <span>20.9%</span>
  },
  {
    color: 'hsl(84, 70%, 50%)',
    hidden: false,
    id: '230',
    label: '2.7 (13.5%)',
    percent: 13.5,
    tooltip: <span>13.5%</span>
  },
  {
    color: 'hsl(307, 70%, 50%)',
    hidden: false,
    id: '1',
    label: '2.7 (13.4%)',
    percent: 13.4,
    tooltip: <span>13.4%</span>
  },
  {
    color: 'hsl(169, 70%, 50%)',
    hidden: false,
    id: '101',
    label: '2.4 (11.7%)',
    percent: 11.7,
    tooltip: <span>11.7%</span>
  },

  {
    color: '#000000',
    hidden: false,
    id: 'other',
    label: '8.2 (40.6%)',
    percent: 40.6,
    tooltip: <span>40.6%</span>
  }
];

export default {
  title: 'Charting/PieChart',
  component: PieChart
} as Meta;

export const SimplePieChart = (): JSX.Element => (
  <div style={{ width: '400px' }}>
    <PieChart data={testData} />
  </div>
);
