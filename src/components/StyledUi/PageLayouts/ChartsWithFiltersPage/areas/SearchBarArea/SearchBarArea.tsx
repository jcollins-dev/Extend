import React from 'react';
import { SearchBarInput } from './SearchBarInput';
import { SearchBarHistoryButtons } from './SearchBarHistoryButtons';
import { SearchBarCSVButton } from './SearchBarCSVButton';
import { useSettings } from '../../';

export const SearchBarArea = (): JSX.Element => {
  const { hideSearch } = useSettings();

  return (
    <>
      {!hideSearch && <SearchBarInput />}
      <SearchBarHistoryButtons />
      <SearchBarCSVButton />
    </>
  );
};
