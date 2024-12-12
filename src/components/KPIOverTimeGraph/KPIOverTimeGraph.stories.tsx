import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import KPIOverTimeGraph from '.';
import { DatePoint, Series } from 'types/graph';
import {
  axisH,
  axisV,
  formatLineSeriesTooltip,
  formatScatterSeriesTooltip,
  toScatterPoints,
  toScatterSeries
} from 'components/machine-health/MachineIndicatorsGraph/utils';

import data, { states as statesRaw } from './testData';
import { getYaxisOffset } from 'helpers/graph';
import { StateCategory } from 'types/protein';

export default {
  title: 'Charting/KPIOverTimeGraph',
  component: KPIOverTimeGraph
} as Meta;

const linesSeries = JSON.parse(data).reduce((a: DatePoint[], b: { data: DatePoint[] }) => {
  const data = { ...b };
  data.data = b.data.map((d: DatePoint) => ({ ...d, x: new Date(d.x) }));
  return [...a, data];
}, []);

const timeZone = 'Europe/Stockholm';

const { min } = getYaxisOffset(linesSeries);
const states = JSON.parse(statesRaw).map((a: StateCategory) => ({
  ...a,
  timeStammp: new Date(a.timestamp),
  endTimeStamp: new Date(a.endTimestamp)
}));

const scatterSeries = toScatterSeries(states || [], Math.round(min));

const Template: Story<ComponentProps<typeof KPIOverTimeGraph>> = (args) => (
  <div style={{ width: '100%' }}>
    <KPIOverTimeGraph {...args} />
  </div>
);

const series = [
  ...formatLineSeriesTooltip(linesSeries, timeZone),
  toScatterPoints(states || []),
  formatScatterSeriesTooltip(scatterSeries as Series)
];

export const Default = Template.bind({});
Default.args = {
  title: 'test-title',
  axisH: axisH(timeZone),
  axisV: axisV(),
  series
};
