import React, { useState } from 'react';
//import { useFilterSelected } from 'components/StyledUi/FilterSelected';
import { useData } from '../hooks';
import { SearchForm } from 'components/StyledUi/SearchForm';

export const SearchBarInput = (): JSX.Element => {
  const { data, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  //const [selected, handle, { hasUndo, hasRedo, hasClear }] = useFilterSelected();

  if (!isLoading && !data) {
    console.log('Error in SearchBarInput: no data to search', searchTerm);
  }

  /*
  useEffect(() => {
    if (searchTerm && data) {
      const found = searchForStringAndGetSelected(
        groupKey as string,
        itemKey as string,
        data,
        searchTerm
      );
      if (found) alert('found');
    }
  }, [searchTerm])
  */

  const searchFormSettings = {
    handleSubmit: (x?: string) => setSearchTerm(x),
    placeHolder: 'Search Recipes',
    data,
    hasSuggestions: true
  };

  return <SearchForm {...searchFormSettings} />;
};
