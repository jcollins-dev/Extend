// 3rd Party Libraries
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';

// Components
import { BaseTable, PageHeader, SearchInput } from 'components';
import { DataRenderer } from 'components/machine-health';

// Constants
import { SEARCH_COOLDOWN } from 'constants/search';

// API
import { useGetMachinesQuery, useGetMachineStatusByIdsQuery, useGetPlantByIdQuery } from 'api';

// Custom hooks
import { useQueryParams, useSearch, useSort } from 'hooks';
import { default as theme } from 'themes';

// Icons
import { EngineIcon } from 'icons';

// Types
import { SortClickHandler, SortState } from 'types';
import { MachineLineStatus } from 'types/protein';

// Utils
import { addKeyProp, CustomHeader, generateColumnConfigs } from 'components/site/SiteTable/utils';
import { skipToken } from '@reduxjs/toolkit/dist/query';

/* Styling */
const MachineDetailContainer = styled.div`
  font-weight: 700;
`;

const MachinesContainer = styled.div`
  background: white;
  padding: 1.875rem 3.125rem;
`;

const MachinesTitleContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 2rem;
`;

const MachinesTitle = styled.h3`
  color: ${(props) => props.theme.colors.darkGrey};
  margin: 0;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3125rem;
  letter-spacing: 0rem;
  text-align: left;
`;

const FilterContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  justify-content: space-between;
`;

const FilterNumberResult = styled.div`
  background-color: ${(props) => props.theme.colors.primaryBlue4};
  height: 1.5625rem;
  width: 1.5625rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem;
  letter-spacing: 0rem;
  text-align: center;
  margin-right: 0.3125rem;
`;

const StyledSearchWrapper = styled.div`
  height: 2.625rem;
  width: 19.25rem;
`;

/* End styling */

/* Initial states for sorting and filtering */
const defaultSortState: Record<keyof MachineLineStatus, SortState> = {
  description: SortState.unsorted,
  status: SortState.unsorted,
  numCurrentAlarms: SortState.unsorted,
  numAlarmsOverPeriod: SortState.unsorted,
  productionOverPeriod: SortState.unsorted,
  utilizationOverPeriod: SortState.unsorted
};

const searchByProps = ['description', 'status'];

const tableDataType = undefined;
const businessUnit = undefined;

const tableType = 'MACHINE';
/* End initial states */

const FleetDashboard = (): ReactElement => {
  const history = useHistory();
  const query = useQueryParams();
  const plantId = query.get('plantId') || undefined;
  const {
    data: userMachines,
    isLoading: userMachinesLoading,
    error: errorUserMachines,
    isSuccess: successUserMachines
  } = useGetMachinesQuery(plantId ? { plantIds: [plantId] } : {});

  const { t } = useTranslation(['mh']);
  const machineIds = userMachines?.map((machine) => machine.id);
  const { data: accountData } = useGetPlantByIdQuery(plantId ? plantId : skipToken);

  const {
    data: machineStatuses,
    isLoading: statusesLoading,
    error: errorStatuses
  } = useGetMachineStatusByIdsQuery(machineIds || [], { skip: !successUserMachines });

  const [tableData, setTableData] = useState<MachineLineStatus[]>([]);

  // Required to update local state with fetched data once available
  useEffect(() => {
    setTableData(machineStatuses || []);
  }, [machineStatuses]);

  const [searchVal, setSearchVal] = useState<string>('');
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);

  const searchedData = useSearch<MachineLineStatus>(searchVal, tableData, searchByProps);
  const sortedData = useSort<MachineLineStatus>(sortState, searchedData);

  const goto = (path: string) => {
    history.push(path);
  };

  // Interaction handler functions
  const sortHandler: SortClickHandler = (key, currentSortState) => {
    const newSortState = {
      ...defaultSortState,
      [key]:
        currentSortState === SortState.ascending
          ? SortState.descending
          : currentSortState === SortState.descending
          ? SortState.unsorted
          : SortState.ascending
    };

    setSortState(newSortState);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void =>
    setSearchVal(event.target.value);

  return (
    <>
      <PageHeader
        heading={plantId ? '' : t('dashboard')}
        icon={{ iconElement: EngineIcon, iconType: 'custom' }}
        breadcrumbs={
          plantId
            ? [
                {
                  label: accountData ? accountData.name : t('retrieving_customer')
                },
                {
                  label: accountData ? accountData.siteName : t('retrieving_plant')
                }
              ]
            : []
        }
        // TODO: Resolve after Alpha release
        // message="Urgent maintenance required for some machines"
        messageColor={theme.colors.negativeRed}
      />
      <MachineDetailContainer>
        <MachinesContainer>
          <MachinesTitleContainer>
            <MachinesTitle>{t('machines')}</MachinesTitle>
            <FilterContainer>
              <StyledSearchWrapper>
                <SearchInput
                  borderRadius="0.625rem"
                  onChange={debounce(handleSearchChange, SEARCH_COOLDOWN)}
                  placeholder={t('search_by_machine_or_status') as string}
                  variant="white"
                />
              </StyledSearchWrapper>
              <FilterNumberResult>{sortedData.length}</FilterNumberResult>
            </FilterContainer>
          </MachinesTitleContainer>
          <DataRenderer
            isLoading={userMachinesLoading || statusesLoading}
            error={
              (errorUserMachines || errorStatuses) &&
              (t('failed_to_load_data', { ns: 'common' }) as string)
            }
          >
            <BaseTable
              customHeader={CustomHeader}
              columnConfigs={generateColumnConfigs(
                tableType,
                sortState,
                goto,
                t,
                tableDataType,
                businessUnit
              )}
              sortHandler={sortHandler}
              alternatingRowColoring={false}
              data={addKeyProp(sortedData, tableType)}
              borderBottomRow
              outerBorderColor={theme.colors.mediumGrey1}
            />
          </DataRenderer>
        </MachinesContainer>
      </MachineDetailContainer>
    </>
  );
};

export default FleetDashboard;
