import React, { useMemo } from 'react';

import { TotalsBar } from '../../TotalsBar';
import { useChartsAndFiltersPageData } from '../../_hooks/useChartsAndFiltersPageData';
import { UiChartsAndFiltersPageProps } from '../../UiChartsAndFiltersPage';
import { filterSelectedData, useFilterSelected } from 'components/StyledUi/FilterSelected';

export const AreaTotalsBar = ({ totalsBarSettings }: UiChartsAndFiltersPageProps): JSX.Element => {
  if (!totalsBarSettings) return <></>;

  const { cells, groupKey } = totalsBarSettings;

  if (!cells || !groupKey) return <>error: missing cells or groupKey</>;

  const { data, ...status } = useChartsAndFiltersPageData();
  const [selected] = useFilterSelected();

  const cachedData = useMemo(() => data, [data]);

  const filteredData = useMemo(
    () => (!selected ? cachedData : filterSelectedData({ data: cachedData, selected })),
    [cachedData, selected]
  );

  const currentGroup = selected?.code ? 'code' : 'type';
  const currentGroupKey = selected?.[currentGroup]?.[0] || 'All';

  if (cells.count) {
    cells.count.title = `${currentGroup === 'code' ? 'Alarm ID: ' : ``}${currentGroupKey}`;
    cells.count.label = `Total`;
    if (cells.count.excludeKeys?.includes(selected?.[groupKey]?.[0] as string))
      cells.count.excludeKeys = undefined;
  }
  if (cells.sum) {
    cells.sum.title = `${currentGroup === 'code' ? 'Alarm ID: ' : ``}${currentGroupKey}`;
    cells.sum.label = `Total Duration${
      currentGroup === 'type' && selected?.type?.[0] !== 'Warning' ? ` (excluding warning)` : ``
    }`;
    if (cells.sum.excludeKeys?.includes(selected?.[groupKey]?.[0] as string))
      cells.sum.excludeKeys = undefined;
  }
  if (cells.average) {
    cells.average.title = `${currentGroup === 'code' ? 'Alarm ID: ' : ``}${currentGroupKey}`;
    cells.average.label = `Average Duration ${
      currentGroup === 'type' && selected?.type?.[0] !== 'Warning' ? ` (excluding warning)` : ``
    }`;
    if (cells.average.excludeKeys?.includes(selected?.[groupKey]?.[0] as string))
      cells.average.excludeKeys = undefined;
  }

  return (
    <TotalsBar
      {...{ data: filteredData, ...status, groupKey: currentGroup, ...totalsBarSettings }}
    />
  );
};
