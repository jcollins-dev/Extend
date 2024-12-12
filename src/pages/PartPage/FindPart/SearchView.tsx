// 3rd party libs
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

// Api
import { useGetFilteredOnStockPartsQuery, useSearchQuery } from 'api';

// Components
import { SearchInput, MachinePartsTable, Typography, Pagination } from 'components';

// Hooks & Providers
import { usePaginatedQueryOffset, useCooldown } from 'hooks';
import { useLanguage } from 'providers';
import { useTranslation } from 'react-i18next';

// Types
import { Part, Product } from 'types/parts';

// Constants
import { PAGE_LENGTH, SEARCH_COOLDOWN } from 'constants/search';
import { LanguageCode } from 'constants/languageCode';

interface Props {
  machineId: string;
  part?: Part;
}

const SearchAreaContainer = styled.div`
  padding: 1.25rem;
`;

const SearchContainer = styled.div`
  height: 2.5rem;
  margin-bottom: 1.25rem;
`;

const ITEMS_PER_PAGE = PAGE_LENGTH.SMALL;

const SearchView = ({ machineId, part }: Props): JSX.Element => {
  const [searchVal, setSearchVal] = useState<string>('');
  const [filterOption, setFilterOption] = useState<string>('none');
  const { languageId } = useLanguage();
  const { t } = useTranslation(['common']);
  const modeRef = useRef('All');
  const { onPageChange, pageNumber } = usePaginatedQueryOffset();
  // Function to be called by search with cooldown
  const updateSearchValue = (updatedSearchValue: string) => {
    setSearchVal(updatedSearchValue);
    // Make sure to reset the page count
    onPageChange(0);
  };
  const callUpdateWithCooldown = useCooldown<string>(SEARCH_COOLDOWN, updateSearchValue, '');
  const {
    data: productsByMachineIdResult,
    error: partsError,
    isFetching: allAreLoading
  } = useSearchQuery({
    query: searchVal,
    limit: ITEMS_PER_PAGE,
    offset: pageNumber,
    machineId: machineId,
    languageId: searchVal.length > 0 && languageId !== LanguageCode.English ? languageId : '',
    startNodeSku: part ? part.sku : undefined
  });
  const { data: filteredParts, isFetching: filteredPartsLoading } = useGetFilteredOnStockPartsQuery(
    {
      limit: ITEMS_PER_PAGE,
      offset: pageNumber,
      machineId: machineId,
      option: filterOption
    }
  );

  const displayData =
    modeRef.current === 'All' ? productsByMachineIdResult?.items : filteredParts?.items;
  // prevents search on a cooldown to reduce load on the backend/client browser
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    callUpdateWithCooldown(event.target.value);
  };
  if (!part && partsError) {
    return <Typography>Failed to load part data</Typography>;
  }
  const setSearchMode = (mode: string): void => {
    modeRef.current = mode;
  };
  const updateTableOnFilterChange = (val: string): void => {
    setSearchMode(val);
    setFilterOption(val === 'All' ? 'none' : val);
  };
  return (
    <SearchAreaContainer>
      {
        <SearchContainer>
          <SearchInput
            onChange={handleSearchChange}
            placeholder={t('search_part_number_description') as string}
          />
        </SearchContainer>
      }
      <MachinePartsTable
        data={(displayData as Product[]) ?? []}
        showHeader={true}
        isDataLoading={modeRef.current === 'All' ? allAreLoading : filteredPartsLoading}
        machineId={machineId}
        updateTableOnFilterChange={updateTableOnFilterChange}
      />
      <Pagination
        numItems={
          modeRef.current === 'All' ? productsByMachineIdResult?.total : filteredParts?.total
        }
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={onPageChange}
        forcePage={pageNumber}
        currentPage={pageNumber}
      />
    </SearchAreaContainer>
  );
};

export default SearchView;
