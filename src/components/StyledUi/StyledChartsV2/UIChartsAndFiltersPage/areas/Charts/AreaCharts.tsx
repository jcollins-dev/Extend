import React from 'react';
import { useStyledCharts, UseStyledChartsProps } from 'components/StyledUi/StyledChartsV2/hooks';
import { useChartsAndFiltersPageData } from '../../_hooks/useChartsAndFiltersPageData';

export const AreaCharts = (props: UseStyledChartsProps): JSX.Element => {
  const apiCall = useChartsAndFiltersPageData();
  if (!props?.charts) return <div>error: `charts` not found</div>;
  const ChartsToUse = useStyledCharts({ ...props, ...apiCall });
  return ChartsToUse;
};
