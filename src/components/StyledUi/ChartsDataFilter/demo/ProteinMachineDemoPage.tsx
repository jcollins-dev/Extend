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
      selected: selected?.type?.includes('Warning Information'),
      label: 'show Warning Information',
      handleClick: () => handle('set', { type: 'Warning Information' })
    },
    {
      selected: selected?.code?.includes('533'),
      label: 'show 533',
      handleClick: () => handle('set', { code: '533' })
    }
  ];

  const Items = demoItems.map(({ label, handleClick, selected }) => (
    <button key={label} type="button" onClick={() => handleClick()}>
      {selected && `*`} {label}
    </button>
  ));
  return <>{Items}</>;
};

export const ProteinMachineDemoPage = (): JSX.Element => {
  return (
    <div>
      <DemoChild2 />
      <hr />
      Filtered Data:
      <DemoTable />
    </div>
  );
};
