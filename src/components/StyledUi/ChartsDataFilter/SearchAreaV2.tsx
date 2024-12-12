import React, { useState, useEffect } from 'react';
import { AlarmChartsAndDataFilterProps } from './AlarmChartsAndDataFilter';
import { StateHistoryButtons, searchForStringAndGetSelectedV1 } from 'components';
import { SearchForm, DownloadCSVButton } from 'components';

import { useFilterSelected } from '../FilterSelected';

// This hook uses different search filter than SearchArea, currently used by Alarms tab
export const SearchAreaV2 = ({
  data,
  groupKey,
  itemKey,
  csvFileName,
  title
}: AlarmChartsAndDataFilterProps): JSX.Element => {
  // search inpuet box
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  if (!data) return <></>;

  //const { setSelected } = useGroupSelectList();
  const [selected, handle, { hasUndo, hasRedo, hasClear }] = useFilterSelected();

  useEffect(() => {
    if (searchTerm && groupKey && itemKey) {
      const found = searchForStringAndGetSelectedV1(groupKey, itemKey, data, searchTerm);
      console.log('found', found, selected);
      // expecting: FilterSelectedPropsSelected
    }
  }, [searchTerm]);

  const csvBtnSettings = {
    headers: {
      activerecipe: `Active Recipe`,
      date: `Date`,
      starttime: `Start Time`,
      duration: `Duration`
    },
    fileName: `${csvFileName || title}.csv`,
    data
  };

  const stateHistoryButtonsSettings = {
    undo: {
      disabled: !hasUndo,
      handleClick: () => handle?.('undo')
    },
    redo: {
      disabled: !hasRedo,
      handleClick: () => handle?.('redo')
    },
    clear: {
      disabled: !hasClear,
      handleClick: () => handle?.('clear')
    }
  };
  return (
    <>
      <SearchForm
        handleSubmit={(x?: string) => setSearchTerm(x)}
        placeHolder="Search"
        data={data}
        hasSuggestions
      />
      <DownloadCSVButton {...csvBtnSettings} />
      <StateHistoryButtons {...stateHistoryButtonsSettings} />
    </>
  );
};
