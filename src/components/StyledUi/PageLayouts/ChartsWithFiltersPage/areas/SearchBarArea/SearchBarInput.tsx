import React, { useState, useEffect } from 'react';
import { useFilterSelected, SearchForm } from 'components';
import { useData } from '../../';

export interface SearchBarInputProps {
  groupKey: string;
}

export const SearchBarInput = (): JSX.Element => {
  const { data } = useData();

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const [selected, handle] = useFilterSelected();

  useEffect(() => {
    if (data && searchTerm) {
      handle('set', { searchTerm });
    }
  }, [data, searchTerm]);

  const searchFormSettings = {
    handleSubmit: (x?: string) => setSearchTerm(x),
    placeHolder: 'Search Recipes',
    data,
    hasSuggestions: true
  };

  return (
    <SearchForm
      {...searchFormSettings}
      clear={selected?.searchTerm ? false : true}
      handleClear={() => handle('clear')}
    />
  );
};
