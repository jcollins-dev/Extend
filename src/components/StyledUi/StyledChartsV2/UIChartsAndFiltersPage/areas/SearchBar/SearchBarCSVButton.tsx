import React from 'react';

import { DownloadCSVButton } from 'components';
import { useChartsAndFiltersPageData } from '../../_hooks/useChartsAndFiltersPageData';
import { UiChartsAndFiltersPageProps } from '../../UiChartsAndFiltersPage';

export const SearchBarCSVButton = ({ csvSettings }: UiChartsAndFiltersPageProps): JSX.Element => {
  const { data } = useChartsAndFiltersPageData();

  if (!csvSettings) {
    console.log('Error in SearchBarCSVButton: missing csvFileSettings');
    return <>missing csvFileSettings</>;
  }

  return <DownloadCSVButton {...{ data, ...csvSettings }} />;
};
