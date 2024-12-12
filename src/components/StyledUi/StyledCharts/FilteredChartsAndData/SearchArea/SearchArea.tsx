import React from 'react';
import { SearchBarInput } from './SearchBarInput';
import { SearchBarHistoryButtons } from './SearchBarHistoryButtons';
import { SearchBarCSVButton } from './SearchBarCSVButton';
import { FilteredChartsAndDataProps } from '../FilteredChartsAndData.types';

export const SearchBarArea = ({ csvButtonSettings }: FilteredChartsAndDataProps): JSX.Element => {
  return (
    <>
      <SearchBarInput />
      <SearchBarHistoryButtons />
      {csvButtonSettings && <SearchBarCSVButton {...{ csvButtonSettings }} />}
    </>
  );
};
