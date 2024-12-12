import React from 'react';
import { useAlarmChartsAndDataFilterContext } from '../AlarmChartsAndDataFilter';
import { filterSelectedData, useFilterSelected } from 'components/StyledUi/FilterSelected';

const DemoTable = () => {
  const { data } = useAlarmChartsAndDataFilterContext();
  const [selected] = useFilterSelected();
  const filteredData = filterSelectedData({ data, selected });

  const Items = filteredData?.map((item, i) => (
    <div key={`item${i}`} className="demo-item">
      {JSON.stringify(item)}
    </div>
  ));

  return <div>{Items}</div>;
};

const DemoChild2 = () => {
  const [selected, handle] = useFilterSelected();

  const demoItems = [
    {
      label: 'show critical',
      handleClick: () => handle('set', { type: 'Critical' })
    },
    {
      label: 'show critical',
      handleClick: () => handle('set', { type: 'critical' })
    }
  ];
};

export const AvureAlarmsInnerDemo = (): JSX.Element => {
  return (
    <div>
      Filtered Data:
      <DemoTable />
    </div>
  );
};
