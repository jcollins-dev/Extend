import React from 'react';
import { useData } from '../../_hooks';
import { DownloadCSVButton } from 'components';
import { FilteredChartsAndDataProps } from '../FilteredChartsAndData.types';

export const SearchBarCSVButton = ({
  csvButtonSettings
}: FilteredChartsAndDataProps): JSX.Element => {
  const { data } = useData();

  if (!csvButtonSettings) {
    console.log('Error in SearchBarCSVButton: missing csvFileSettings');
    return <>missing csvFileSettings</>;
  }

  return <DownloadCSVButton {...{ data, ...csvButtonSettings }} />;
};
