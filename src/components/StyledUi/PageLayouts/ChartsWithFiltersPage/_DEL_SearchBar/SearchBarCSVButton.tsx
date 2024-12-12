import React from 'react';
import { useData, useSettings } from '../hooks';
import { DownloadCSVButton } from 'components/StyledUi/DownloadCSVButton';

export const SearchBarCSVButton = (): JSX.Element => {
  const { csvFileSettings } = useSettings();
  const { data } = useData();

  if (!csvFileSettings) {
    console.log('Error in SearchBarCSVButton: missing csvFileSettings');
    return <>missing csvFileSettings</>;
  }

  return <DownloadCSVButton {...{ data, ...csvFileSettings }} />;
};
