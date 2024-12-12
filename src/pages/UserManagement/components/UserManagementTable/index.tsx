// 3rd party libs
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import theme from 'themes';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { lowerCase, sortBy } from 'lodash';

// Components
import { BaseTable, Button, Pagination, SearchInput } from 'components';

// Types
import { Id, SortClickHandler, SortState } from 'types';

// Utils
import {
  addKeyProp,
  CustomGroupHeader,
  CustomUserHeader,
  generateUserManagementColumnConfigs
} from 'pages/UserManagement/components/utils';

// Types
import { Group, User, UserManagementTableType } from 'types/user-management';

// API
import { useGetUserManagementQuery } from 'api';
import { useCooldown, usePaginatedQueryOffset, useSort } from 'hooks';
import { PAGE_LENGTH, SEARCH_COOLDOWN } from 'constants/search';

interface Props {
  tableType: UserManagementTableType;
  onClickButton: (tableType: UserManagementTableType, id?: Id) => void;
}

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.lightGrey1};
  border: 0.0625rem solid ${theme.colors.lightGrey3};
  border-top: none;
`;

const SearchContainer = styled.div`
  margin-bottom: 1.25rem;
`;

const ButtonContainer = styled.div`
  position: fixed;
  right: 2rem;
  bottom: 2.1rem;
`;

const defaultGroupSortState: Record<string, SortState> = {
  name: SortState.unsorted,
  organizationsCount: SortState.unsorted,
  usersCount: SortState.unsorted,
  internalAccessGroup: SortState.unsorted
};
const defaultUserSortState: Record<string, SortState> = {
  name: SortState.unsorted,
  email: SortState.unsorted,
  group: SortState.unsorted,
  textAlert: SortState.unsorted,
  emailAlert: SortState.unsorted,
  phone: SortState.unsorted
};

const UserManagementTable = ({ tableType, onClickButton }: Props): JSX.Element => {
  const theme = useTheme();

  const [sortState, setSortState] = useState<Record<string, SortState>>(
    tableType === UserManagementTableType.GROUP ? defaultGroupSortState : defaultUserSortState
  );
  const [searchValue, setSearchValue] = useState('');
  const [groupId, setGroupId] = useState('');
  const [inputValue, setInputValue] = useState('');
  const { onPageChange, pageNumber } = usePaginatedQueryOffset();
  const [pageNumberState, setPageNumber] = useState(pageNumber);
  // Function to be called by search with cooldown
  const updateSearchValue = (updatedSearchValue: string) => {
    setSearchValue(updatedSearchValue);
    // Make sure to reset the page count
    onPageChange(0);
  };
  const callUpdateSearchValueWithCooldown = useCooldown<string>(
    SEARCH_COOLDOWN,
    updateSearchValue,
    ''
  );
  const { data: result, isFetching: isLoading } = useGetUserManagementQuery({
    type: lowerCase(tableType),
    nameSearchQuery: searchValue.trim(),
    groupId,
    limit: tableType === UserManagementTableType.GROUP ? PAGE_LENGTH.SMALL : PAGE_LENGTH.MEDIUM,
    offset: pageNumberState
  });

  const tableData = useMemo(() => {
    if (!result) return [];
    else {
      return result && result.items
        ? sortBy(result.items, [
            (p: User | Group) => {
              return tableType === UserManagementTableType.GROUP ? p.name : p.firstName;
            }
          ])
        : [];
    }
  }, [result]);

  // To set the page number to 0 and clear search when tab changes.
  useEffect(() => {
    setPageNumber(0);
    setSearchValue('');
    setInputValue('');
    setGroupId('');
  }, [tableType]);

  useEffect(() => {
    setPageNumber(pageNumber);
  }, [pageNumber]);

  const sortHandler: SortClickHandler = (key, currentSortState) => {
    const newSortState = {
      ...(UserManagementTableType.GROUP ? defaultGroupSortState : defaultUserSortState),
      [key]:
        currentSortState === SortState.ascending
          ? SortState.descending
          : currentSortState === SortState.descending
          ? SortState.unsorted
          : SortState.ascending
    };
    setSortState(newSortState);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
    callUpdateSearchValueWithCooldown(event.target.value);
  };

  const sortedData = useSort<Group | User>(sortState, tableData);
  const dataWithKeys = addKeyProp(sortedData, tableType);

  const onFilter = (tableType: UserManagementTableType, columnName: string, id?: string) => {
    setGroupId(id ?? '');
  };

  return (
    <>
      <SearchContainer>
        <SearchInput
          variant="white"
          borderRadius="0.5rem"
          placeholder={`Search ${tableType === UserManagementTableType.GROUP ? 'groups' : 'users'}`}
          onChange={handleSearchChange}
          value={inputValue.trimStart()}
        />
      </SearchContainer>
      <ButtonContainer>
        <Button
          onClick={() => {
            onClickButton(tableType);
          }}
          title={`Add ${tableType === UserManagementTableType.GROUP ? 'Group' : 'User'}`}
          variant="primary"
          icon={
            <FontAwesomeIcon
              style={{ marginLeft: '0.125rem' }}
              icon={faAdd}
              color={theme.colors.white}
            />
          }
          width="3.125rem"
          height="3.125rem"
          borderRadius="50%"
          size="normal"
        />
      </ButtonContainer>
      <BaseTable
        isDataLoading={isLoading}
        scroll={{ y: 600 }}
        customHeader={
          tableType === UserManagementTableType.GROUP ? CustomGroupHeader : CustomUserHeader
        }
        columnConfigs={generateUserManagementColumnConfigs(
          tableType,
          sortState,
          onClickButton,
          onFilter,
          sortHandler
        )}
        alternatingRowColoring={false}
        sortHandler={sortHandler}
        data={isLoading ? [] : dataWithKeys}
        borderBottomRow
        outerBorderColor={theme.colors.lightGrey3}
        borderRadius="0.5rem 0.5rem 0 0 "
      />
      {result && (
        <PaginationContainer>
          <Pagination
            onPageChange={onPageChange}
            itemsPerPage={
              tableType === UserManagementTableType.GROUP ? PAGE_LENGTH.SMALL : PAGE_LENGTH.MEDIUM
            }
            numItems={result?.total}
            forcePage={pageNumberState}
            currentPage={pageNumber}
          />
        </PaginationContainer>
      )}
    </>
  );
};

export default UserManagementTable;
