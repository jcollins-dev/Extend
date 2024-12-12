import React from 'react';
import { SearchBarInput } from './SearchBarInput';
import { SearchBarHistoryButtons } from './SearchBarHistoryButtons';
import { SearchBarCSVButton } from './SearchBarCSVButton';

export const SearchBar = (): JSX.Element => {
  return (
    <>
      <SearchBarInput />
      <SearchBarHistoryButtons />
      <SearchBarCSVButton />
    </>
  );
};
