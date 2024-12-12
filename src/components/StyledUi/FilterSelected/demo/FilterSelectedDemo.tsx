import React, { ReactNode } from 'react';
import { FilterSelectedDemoContainer } from './FilterSelectedDemo.elements';
import { convertToChartData } from 'components/StyledUi/ChartsV2';
import { recipesHistoryDemoTableData } from 'components/StyledUi/demoData/recipesHistoryDemoTableData';
import { useFilterSelected } from '../hooks/useFilterSelected';
import { filterSelectedData } from '../helpers/filterSelectedData';

interface DataColProps {
  children?: ReactNode | ReactNode[];
  title?: string;
  groupKey?: string;
  data?: Record<string, unknown>[];
}

const DataCol = ({ data, title, children, groupKey }: DataColProps) => {
  if (!data) return <>error</>;

  const [selected, handle] = useFilterSelected();

  const chartData = !groupKey ? undefined : convertToChartData(data, groupKey);

  const handleSelect = (val?: string) =>
    !groupKey || !val ? undefined : handle(`toggle`, { [groupKey]: val });

  const DataDisplay = !chartData
    ? undefined
    : chartData.map((item, i) => {
        return (
          <div
            key={`title${i}`}
            className="data-item"
            onClick={() => handleSelect(item.x as string)}
          >
            {groupKey && selected?.[groupKey]?.includes(item.x as string) && `* `} {item.x}:{' '}
            {item.y}
          </div>
        );
      });

  return (
    <div className="demo-col">
      <h2>
        {title || `Pie Data [x: ${groupKey}]`} <br /> {groupKey && <div>x: y</div>}
      </h2>
      <div className="scroll-area">
        {children}
        {DataDisplay}
      </div>
    </div>
  );
};

interface DataDisplayProps {
  data?: Record<string, unknown>[];
  title?: string;
  filter?: boolean;
}

const DataDisplay = ({ data, title, filter }: DataDisplayProps): JSX.Element => {
  const [selected] = useFilterSelected();

  const filteredItems = !filter || !data ? undefined : filterSelectedData({ data, selected });

  let Items = !data ? (
    <>no data</>
  ) : filteredItems ? (
    filteredItems.map((item, i) => (
      <div className="item" key={i}>
        {JSON.stringify(item)}
      </div>
    ))
  ) : (
    data.map((item, i) => (
      <div className="item" key={i}>
        {JSON.stringify(item)}
      </div>
    ))
  );

  if (filteredItems?.length == 0) Items = <>no data within filters</>;

  return (
    <div className="data-holder">
      <h2>{title}</h2>
      <div className="data-items">{Items}</div>
    </div>
  );
};

const SelectedItems = (): JSX.Element => {
  const [selected] = useFilterSelected();

  const Printed = !selected
    ? `none selected`
    : Object.entries(selected).map(([key, vals]) => (
        <div key={key}>
          <h3>{key}</h3>
          <div>{JSON.stringify(vals as string[])}</div>
        </div>
      ));

  return (
    <div>
      <h2>Selected Items</h2>
      <div>{Printed}</div>
    </div>
  );
};

export interface FilterSelectDemoProps {
  data?: Record<string, unknown>[];
  groupKeys: string[];
}

export const FilterSelectedDemo = ({ data, groupKeys }: FilterSelectDemoProps): JSX.Element => {
  return (
    <FilterSelectedDemoContainer>
      <div className="demo-col-wrapper">
        <SelectedItems />
        {groupKeys.map((id) => (
          <DataCol data={data} key={id} groupKey={id} />
        ))}
      </div>

      <div className="demo-data-wrapper">
        <DataDisplay title="Raw Data" data={data} />
        <DataDisplay title="Filtered Data" data={data} filter />
      </div>
    </FilterSelectedDemoContainer>
  );
};
