import React, { useState } from 'react';
import { PieChart, PieChartProps, ChartsPropsTotalBy, convertToChartData } from '../';
import { demoAlarmsData as data } from './demoAlarmsData';
import { PieChartDemoContainer } from './Demos.elements';
import { convertSecondsToTime } from 'common/helpers/dateAndTimeHelpers';

// todo: add these to style guide
const demoColors = {
  overfed: '#118DFF',
  'Product Alarm': '#009EB3',
  Critical: '#FFB800',
  Warning: '#E66C37'
};

const totalsTypes: ChartsPropsTotalBy[] = ['count', 'average', 'total'];

export const PieChartDemo = ({ isDoughnut, ...props }: PieChartProps): JSX.Element => {
  const [viewTotals, setViewTotals] = useState<ChartsPropsTotalBy>('count');
  const [doughnut, setDoughnut] = useState<boolean>(isDoughnut ? true : false);

  if (!data) return <></>;

  const chartData = convertToChartData(data, {
    groupKey: 'type',
    valueKey: 'duration'
  });

  const SelectGroup = ({ id }: { id: ChartsPropsTotalBy }) => (
    <div className="select-view-totals__group">
      <input
        onChange={() => setViewTotals(id)}
        type="radio"
        id={id}
        name="totalType"
        value={id}
        checked={viewTotals === id ? true : undefined}
      />
      <label htmlFor="totalType">{id}</label>
    </div>
  );

  const demoFormat = {
    tooltip: (props: Record<string, unknown>) => {
      // Type the data for TS
      const datum = props.datum as Record<string, unknown>;
      // get the keys that were used to convert the data
      const groupFrom = datum.groupKey;
      const valuesFrom = datum.valueKey;
      // get all the values to show in the tootip
      const group = datum.group;
      const count = datum.count as number;
      // format the seconds to time
      const total = convertSecondsToTime(datum.total as number);
      const average = convertSecondsToTime(Math.round(datum.average as number));

      return [
        `${groupFrom}: ${group}`,
        `count: ${count}`,
        `total ${valuesFrom}: ${total}`,
        `average ${valuesFrom}: ${average}`
      ];
    }
  };

  return (
    <PieChartDemoContainer>
      <header>Pie Chart Demo</header>
      <div className="select-group">
        {totalsTypes.map((type, i) => (
          <SelectGroup key={i} id={type} />
        ))}
      </div>
      <div className="toggle-group">
        <input
          onChange={() => setDoughnut(!doughnut)}
          type="checkbox"
          checked={doughnut ? true : false}
        />
        <label>doughnut chart</label>
      </div>
      <PieChart
        {...{
          data: chartData,
          groupKey: 'type',
          totalBy: viewTotals,
          isDoughnut: doughnut,
          format: demoFormat,
          colors: demoColors,
          ...props
        }}
      />
    </PieChartDemoContainer>
  );
};
