import React, { useState, useEffect } from 'react';
import { useFilterSelected, SearchForm } from 'components';
import { useChartsAndFiltersPageData } from '../../_hooks/useChartsAndFiltersPageData';

export interface SearchBarInputProps {
  groupKey: string;
}

export const SearchBarInput = (): JSX.Element => {
  const { data } = useChartsAndFiltersPageData();

  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const [selected, handle] = useFilterSelected();

  useEffect(() => {
    if (searchTerm) {
      handle('toggle', { searchTerm });
    }
  }, [searchTerm]);

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
