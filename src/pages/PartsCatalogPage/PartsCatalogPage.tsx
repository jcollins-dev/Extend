// 3rd party libraries
import React, { ReactElement, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// Types
import { Filter, Machine, Plant } from 'types';
import { Part } from 'types/parts';

// API
import { useGetFilteredOnStockPartsQuery, useGetPlantsQuery, useSearchQuery } from 'api';

// Custom hooks & Providers
import { useFilter, usePaginatedQueryOffset, useSearch, useCooldown } from 'hooks';
import { useLanguage } from 'providers';

// Components
import {
  Loader,
  MachineCard,
  MachinePartsTable,
  PageHeader,
  Pagination,
  SearchInput,
  Typography
} from 'components';

// Icons
import { PartsIcon } from 'icons';

// Constants
import { PAGE_LENGTH, SEARCH_COOLDOWN } from 'constants/search';
import { LanguageCode } from 'constants/languageCode';

// Local types
interface Grouping {
  type: 'machine' | 'category';
}

/* Styling */
const Root = styled.div`
  width: 100%;
  padding: 1.5rem 3.125rem 0 3.125rem;
`;

const GroupingContainer = styled.div`
  margin-bottom: 1.25rem;
`;

const GroupingHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const GroupingHeader = styled.h2`
  color: ${(props) => props.theme.colors.headings.h2 || '#303E47'};
  font-family: ${(props) => props.theme.typography.family};
  font-size: ${(props) => props.theme.typography.components.groupHeader.size || '1.3125rem'};
  font-weight: ${(props) => props.theme.typography.components.groupHeader.weight || '700'};
  letter-spacing: 0;
  line-height: ${(props) =>
    props.theme.typography.components.groupHeader.lineHeight || '1.538125rem'};
  margin: 0 0 0.875rem 0;
`;

const GroupingGrid = styled.div<Grouping>`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
`;

const MachineCardContainer = styled.div`
  width: 18.333125rem;
  height: 14.25rem;
  display: flex;
  background-color: ${(props) => props.theme.colors.background.background1};
  border-radius: 0.625rem;
  border: ${(props) => props.theme.colors.borders.border01.border};
`;

const FilterButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

// const FilterIconButton = styled.button`
//   border: none;
//   background: inherit;
// `;

const PartsTableContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const PartsSearchTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  div {
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 1rem;
    align-items: center;
  }
`;

const PaginationContainer = styled.div`
  padding-bottom: 1.3rem;
`;

/* End styling */

/* Initial states for sorting and filtering */
const defaultFilterState = [
  { property: 'name', value: '' },
  { property: 'parts', value: '' }
];

const ITEMS_PER_PAGE = PAGE_LENGTH.SMALL;

const machineSearchByProps = ['nickname', 'sku', 'description'];
/* End initial states */

const PartsCatalogPage = (): ReactElement => {
  const modeRef = useRef('All');
  const [filterOption, setFilterOption] = useState<string>('none');
  const { data: plants, error, isLoading } = useGetPlantsQuery();
  const { onPageChange, pageNumber } = usePaginatedQueryOffset();
  const [globalSearchTerm, setGlobalSearchTerm] = useState<string>('');
  // Function to be called by search with cooldown
  const updateGlobalSearchValue = (updatedSearchValue: string) => {
    setGlobalSearchTerm(updatedSearchValue);
    // Make sure to reset the page count
    onPageChange(0);
  };
  const { t } = useTranslation(['fpns']);
  const { languageId } = useLanguage();
  const callUpdateWithCooldown = useCooldown<string>(SEARCH_COOLDOWN, updateGlobalSearchValue, '');
  const {
    data: globalPartsData,
    isLoading: globalPartsDataIsLoading,
    isFetching: globalPartsDataIsFetching
  } = useSearchQuery({
    query: globalSearchTerm,
    limit: ITEMS_PER_PAGE,
    languageId:
      globalSearchTerm.length > 0 && languageId !== LanguageCode.English ? languageId : '',
    offset: pageNumber
  });
  const { data: filteredParts, isFetching: filteredPartsLoading } = useGetFilteredOnStockPartsQuery(
    {
      limit: ITEMS_PER_PAGE,
      offset: pageNumber,
      option: filterOption
    }
  );
  const displayData = modeRef.current === 'All' ? globalPartsData?.items : filteredParts?.items;
  const machines = useMemo(
    () => plants?.reduce((acc: Machine[], plant: Plant) => acc.concat(plant?.machines ?? []), []),
    [plants]
  );

  const [searchVal /*, setSearchVal*/] = useState<string>('');
  const [filters /*, setFilters*/] = useState<Filter[]>(defaultFilterState);

  const searchedMachinesFromPlant = useSearch<Machine>(searchVal, machines, machineSearchByProps);
  const filteredMachine = useFilter<Machine>(filters, searchedMachinesFromPlant);

  // prevents search on a cooldown to reduce load on the backend/client browser
  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   setSearchVal(event.target.value);
  // };

  const handleGlobalSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    callUpdateWithCooldown(event.target.value);
  };

  let machinesBody: React.ReactNode = null;
  if (isLoading) {
    machinesBody = <Loader />;
  } else if (error) {
    // TODO: error state
  } else if (machines) {
    machinesBody = filteredMachine.map((machine, i) => {
      if (machine.hasParts) {
        return (
          <MachineCardContainer key={`machine-${i}`}>
            <MachineCard machine={machine} />
          </MachineCardContainer>
        );
      }
    });
  } else {
    // TODO: empty state
  }
  const setSearchMode = (mode: string): void => {
    modeRef.current = mode;
  };
  const updateTableOnFilterChange = (val: string): void => {
    setSearchMode(val);
    setFilterOption(val === 'All' ? 'none' : val);
  };
  return (
    <>
      <PageHeader
        heading={t('parts_catalog')}
        icon={{ iconElement: PartsIcon, iconType: 'custom' }}
      />
      <Root>
        <GroupingContainer>
          <GroupingHeaderContainer>
            <GroupingHeader>
              {t('shop_by_machine', {
                item: filteredMachine.filter((machine) => machine.hasParts).length,
                ns: 'fpns'
              })}
            </GroupingHeader>
            <FilterButtonsContainer>
              {/* commenting out the search bar as not required now. */}
              {/* <SearchInput onChange={handleSearchChange} /> */}
              {/* TODO: make this work and return it to life */}
              {/* <FilterIconButton>
                {(FilterIcon as (color?: string) => JSX.Element)(getIconColor())}
              </FilterIconButton> */}
            </FilterButtonsContainer>
          </GroupingHeaderContainer>
          <GroupingGrid type="machine">{machinesBody}</GroupingGrid>
        </GroupingContainer>

        <PartsSearchTitleContainer>
          <Typography variant="h2">{t('shop_parts_for_all_machines')}</Typography>
          {(globalPartsDataIsLoading || globalPartsDataIsFetching) && <Loader size={32} />}
        </PartsSearchTitleContainer>

        <SearchInput
          placeholder={t('search_product_name_or_sku') as string}
          onChange={handleGlobalSearchChange}
        />

        <PartsTableContainer>
          <MachinePartsTable
            showSearch={false}
            showHeader={false}
            data={(displayData as Part[]) || []}
            isDataLoading={
              modeRef.current === 'All' ? globalPartsDataIsFetching : filteredPartsLoading
            }
            updateTableOnFilterChange={updateTableOnFilterChange}
          />
        </PartsTableContainer>
        {globalPartsData && (
          <PaginationContainer>
            <Pagination
              onPageChange={onPageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              numItems={modeRef.current === 'All' ? globalPartsData?.total : filteredParts?.total}
              forcePage={pageNumber}
              currentPage={pageNumber}
            />
          </PaginationContainer>
        )}
      </Root>
    </>
  );
};

export default PartsCatalogPage;
