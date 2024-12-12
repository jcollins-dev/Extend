import React from 'react';
import { SearchBarInput } from './SearchBarInput';

import { SearchBarHistoryButtons } from './SearchBarHistoryButtons';
import { UiChartsAndFiltersPageProps } from '../../UiChartsAndFiltersPage';
import { SearchBarCSVButton } from './SearchBarCSVButton';
import { useChartsAndFiltersPageData } from '../../_hooks/useChartsAndFiltersPageData';

export const AreaSearchBar = ({ csvSettings }: UiChartsAndFiltersPageProps): JSX.Element => {
  const { data } = useChartsAndFiltersPageData();

  return (
    <>
      <SearchBarInput />
      <SearchBarHistoryButtons />
      {csvSettings && <SearchBarCSVButton {...{ csvSettings: { ...csvSettings, data } }} />}
    </>
  );
};
