// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import theme from 'themes';
import { isEmpty } from 'lodash';

// Components
import { Button } from 'components';
import { SortableHeader } from 'components/BaseTable/BaseTable';

// User Management Components
import { Group, User, UserManagementTableType } from 'types/user-management';
import { GroupSelect } from 'pages/UserManagement/components';

// Types
import { ColumnConfig, SortClickHandler, SortState } from 'types';

// Styling
const TableCell = styled.div`
  max-width: 12rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  word-wrap: break-all;
`;
const TableCellButton = styled.div`
  height: 3.625rem;
  align-items: right;
`;
const EditButton = styled(Button)`
  float: right;
`;
const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 7.5rem;
`;
const FilterTitle = styled.div`
  padding: 1.25rem 0.75rem;
  height: 3.75rem;
`;
const FilterBody = styled.div`
  height: 3.75rem;
  padding: 0.6875rem 0.75rem;
  background-color: ${theme.colors.lightGrey3};
  box-shadow: 0 -0.0625rem 0 ${theme.colors.lightMediumGrey};
`;
const StyledGroupSelect = styled.div`
  position: absolute;
  min-width: 11.625rem;
`;

export const CustomUserHeader = styled.thead(({ theme }) => ({
  tr: {
    background: theme.colors.lightGrey1,
    th: {
      fontSize: '0.8125rem',
      fontWeight: 'bold',
      lineHeight: theme.typography.components.tableHeader.lineHeight,
      borderBottom: theme.colors.borders.border02.border,
      padding: '0',
      height: '7.5rem',
      ':first-child': {
        borderTopLeftRadius: '0.5rem'
      },
      ':last-child': {
        borderTopRightRadius: '0.5rem'
      }
    }
  }
}));

export const CustomGroupHeader = styled.thead(({ theme }) => ({
  tr: {
    background: theme.colors.lightGrey1,
    th: {
      fontSize: '0.8125rem',
      fontWeight: 'bold',
      lineHeight: theme.typography.components.tableHeader.lineHeight,
      borderBottom: theme.colors.borders.border02.border,
      padding: '0.75rem',
      height: '4.625rem',
      ':first-child': {
        borderTopLeftRadius: '0.5rem'
      },
      ':last-child': {
        borderTopRightRadius: '0.5rem'
      }
    }
  }
}));

export const generateUserManagementColumnConfigs = (
  tableType: UserManagementTableType,
  sortState: Record<string, SortState>,
  onClickButton: (tableType: UserManagementTableType, id?: string) => void,
  onFilter: (tableType: UserManagementTableType, columnName: string, id?: string) => void,
  sortClickHandler: SortClickHandler
): ColumnConfig[] => {
  return tableType == UserManagementTableType.GROUP
    ? groupsColumnConfigs(tableType, sortState, onClickButton)
    : usersColumnConfigs(tableType, sortState, onClickButton, onFilter, sortClickHandler);
};

const groupsColumnConfigs = (
  tableType: UserManagementTableType,
  sortState: Record<string, SortState>,
  onClickButton: (tableType: UserManagementTableType, id?: string) => void
): ColumnConfig[] => {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'name')
        ? sortState['name']
        : SortState.unsorted
    },
    {
      title: 'Customer/Location',
      dataIndex: 'organizationsCount',
      key: 'organizationsCount',
      width: '20%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'organizationsCount')
        ? sortState['organizationsCount']
        : SortState.unsorted,
      render: function (value, record) {
        const row = record as Group;
        const count = (row && row.organizationsCount) ?? 0;
        return {
          children: <TableCell>{row && row.allOrganizations ? 'All' : count}</TableCell>
        };
      }
    },
    {
      title: 'Number of Users',
      dataIndex: 'usersCount',
      key: 'usersCount',
      width: '20%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'usersCount')
        ? sortState['usersCount']
        : SortState.unsorted
    },
    {
      title: 'Access Group',
      dataIndex: 'internalAccessGroup',
      key: 'internalAccessGroup',
      width: '20%',
      sortState: Object.prototype.hasOwnProperty.call(sortState, 'internalAccessGroup')
        ? sortState['internalAccessGroup']
        : SortState.unsorted,
      render(value) {
        return {
          children: <TableCell>{value ? 'Internal' : 'External'}</TableCell>
        };
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      render(value) {
        const id = value as string;
        return {
          children: (
            <TableCellButton>
              <EditButton
                variant="primary"
                width="5rem"
                onClick={() => {
                  onClickButton(UserManagementTableType.GROUP, id);
                }}
              >
                Edit
                <FontAwesomeIcon
                  style={{ marginLeft: '0.5rem' }}
                  icon={faChevronRight}
                  color={theme.colors.white}
                />
              </EditButton>
            </TableCellButton>
          )
        };
      }
    }
  ];
};

const usersColumnConfigs = (
  tableType: UserManagementTableType,
  sortState: Record<string, SortState>,
  onClickButton: (tableType: UserManagementTableType, id?: string) => void,
  onFilter: (
    tableType: UserManagementTableType,
    columnName: string,
    id?: string,
    label?: string
  ) => void,
  sortClickHandler: SortClickHandler
): ColumnConfig[] => {
  return [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: '20%',
      customHeader: (
        <FilterContainer>
          <FilterTitle>
            {SortableHeader({
              key: 'firstName',
              title: 'Name',
              subtitle: '',
              sortState: Object.prototype.hasOwnProperty.call(sortState, 'firstName')
                ? sortState['firstName']
                : SortState.unsorted,
              clickHandler: sortClickHandler
            })}
          </FilterTitle>
          <FilterBody />
        </FilterContainer>
      ),
      render: function (value, record) {
        const row = record as User;
        const firstName = (row && row.firstName) ?? '';
        const lastName = (row && row.lastName) ?? '';
        const name = `${firstName} ${lastName}`;
        return {
          children: (
            <TableCell title={firstName || lastName ? name : '-'}>
              {firstName || lastName ? name : '-'}
            </TableCell>
          )
        };
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      customHeader: (
        <FilterContainer>
          <FilterTitle>
            {SortableHeader({
              key: 'email',
              title: 'Email',
              subtitle: '',
              sortState: Object.prototype.hasOwnProperty.call(sortState, 'email')
                ? sortState['email']
                : SortState.unsorted,
              clickHandler: sortClickHandler
            })}
          </FilterTitle>
          <FilterBody />
        </FilterContainer>
      ),
      render(value) {
        return {
          children: (
            <TableCell title={typeof value === 'string' ? value : ''}>{value ?? '-'}</TableCell>
          )
        };
      }
    },
    {
      title: '',
      customHeader: (
        <FilterContainer>
          <FilterTitle>
            {SortableHeader({
              key: 'groupName',
              title: 'Group',
              subtitle: '',
              sortState: Object.prototype.hasOwnProperty.call(sortState, 'groupName')
                ? sortState['groupName']
                : SortState.unsorted,
              clickHandler: sortClickHandler
            })}
          </FilterTitle>
          <FilterBody>
            <StyledGroupSelect>
              <GroupSelect
                isViewFilterIcon
                onChangeGroup={({ value, label }) => {
                  onFilter(UserManagementTableType.USER, 'groupName', value, label);
                }}
              />
            </StyledGroupSelect>
          </FilterBody>
        </FilterContainer>
      ),
      dataIndex: 'groupName',
      key: 'groupName',
      width: '20%',
      render(value) {
        return {
          children: <TableCell>{value ?? '-'}</TableCell>
        };
      }
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: '20%',
      customHeader: (
        <FilterContainer>
          <FilterTitle>Phone</FilterTitle>
          <FilterBody />
        </FilterContainer>
      ),
      render(value) {
        return {
          children: <TableCell>{value ?? '-'}</TableCell>
        };
      }
    },
    {
      title: 'Alert Notification',
      dataIndex: 'textAlert',
      key: 'textAlert',
      width: '20%',
      customHeader: (
        <FilterContainer>
          <FilterTitle>Alert Notification</FilterTitle>
          <FilterBody />
        </FilterContainer>
      ),
      render(value, record) {
        const row = record as User;
        const textAlert = row && row.textAlert ? 'Text' : '';
        const emailAlert = row && row.emailAlert ? 'Email' : '';
        return {
          children: (
            <TableCell>
              {textAlert}
              {!isEmpty(textAlert) && !isEmpty(emailAlert) && ', '}
              {emailAlert}
              {isEmpty(textAlert) && isEmpty(emailAlert) && '-'}
            </TableCell>
          )
        };
      }
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      customHeader: (
        <FilterContainer>
          <FilterTitle />
          <FilterBody />
        </FilterContainer>
      ),
      render(value) {
        const id = value as string;
        return {
          children: (
            <TableCellButton>
              <EditButton
                variant="primary"
                width="5rem"
                onClick={() => {
                  onClickButton(UserManagementTableType.USER, id);
                }}
              >
                Edit
                <FontAwesomeIcon
                  style={{ marginLeft: '0.5rem' }}
                  icon={faChevronRight}
                  color={theme.colors.white}
                />
              </EditButton>
            </TableCellButton>
          )
        };
      }
    }
  ];
};

export const addKeyProp = (
  data: (Group | User)[],
  type: UserManagementTableType
): (Group | User)[] =>
  data.map((d, i) => {
    return { ...d, key: `${type}-${i}` };
  });
