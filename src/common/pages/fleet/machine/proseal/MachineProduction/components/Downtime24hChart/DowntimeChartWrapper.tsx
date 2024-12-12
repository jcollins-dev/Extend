import React, { useState } from 'react';
import { useDowntimeData } from '../../../hooks/useDowntimeData';
import { Downtime24hChartContainer } from './elements/Chart.elements';
import { Data } from './elements/Chart.types';
import { BarsList } from './elements/Bars';
import { CategoriesList } from './elements/Categories';
import { Icon8 } from 'icons/Icon8';
import { styledTheme } from 'common/theme';

export const Downtime24hChart = (): JSX.Element => {
  const [showDetailedView, setShowDetailedView] = useState<boolean>(true);
  const { data, isLoading, hasMessage, hasError } = useDowntimeData();

  if (!data || data.length === 1) return <>No data</>;
  if (isLoading) return <>Loading</>;
  if (hasMessage) return <>{hasMessage}</>;
  if (hasError) return <>Error loading data</>;

  const v = data as unknown as Data[];

  return (
    <Downtime24hChartContainer
      className={showDetailedView ? 'view--downtimedetails' : 'view--categories'}
    >
      <div className="bars-header">
        <div>
          <h3>Last 24 hours</h3>
          <p>Top status downtime</p>
        </div>
        <button
          className="bars-header--switch"
          onClick={() => setShowDetailedView(!showDetailedView)}
        >
          <Icon8 color={styledTheme.colors.secondary} />
        </button>
      </div>
      {showDetailedView ? <BarsList data={v} /> : <CategoriesList />}
    </Downtime24hChartContainer>
  );
};
