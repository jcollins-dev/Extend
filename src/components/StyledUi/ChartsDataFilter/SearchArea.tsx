import React, { useState, useEffect } from 'react';
import { AlarmChartsAndDataFilterProps } from './AlarmChartsAndDataFilter';
import { StateHistoryButtons } from 'components';
import { SearchForm, DownloadCSVButton, searchForStringAndGetSelected } from 'components';

import { useFilterSelected } from '../FilterSelected';

// This hook uses different search filter than SearchArea
export const SearchArea = ({
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
      console.log({ selected });
      const found = searchForStringAndGetSelected(groupKey, itemKey, data, searchTerm);
      console.log(found);
      //if (found) handle?.('toggle', found);
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
