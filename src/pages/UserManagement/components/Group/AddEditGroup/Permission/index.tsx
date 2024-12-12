// 3rd party libs
import React, { ReactElement } from 'react';
import theme from 'themes';
import styled from 'styled-components';

// Components
import { DataRenderer } from 'components/machine-health';
import { Checkbox, Column, KPICard, Typography } from 'components';

// Types
import { GroupPermission } from 'types/user-management';

import { useGetUserManagementPermissionsQuery } from 'api';

interface Props {
  onPermissionChange: (permissions: GroupPermission[]) => void;
  groupPermissions: GroupPermission[];
}

const StyledRow = styled.div`
  display: flex;
  grid-gap: 1.25rem;
  flex-wrap: wrap;
  padding: 0.625rem;
  border-bottom: 0.0625rem solid ${theme.colors.lightMediumGrey};
`;
const MandatoryIndicator = styled.span`
  color: ${({ theme }) => theme.colors.darkRed};
`;

const Permission = ({ onPermissionChange, groupPermissions }: Props): ReactElement => {
  // Get all permissions and render permissions name.
  const {
    data: permissions,
    error: error,
    isFetching: isLoadingPermissions
  } = useGetUserManagementPermissionsQuery();

  const updatePermission = (newPermission: GroupPermission, foundPermissionId: number) => {
    const newPermissions = [...groupPermissions];

    if (foundPermissionId !== -1) {
      // permission exist before
      if (permissions) newPermissions[foundPermissionId] = newPermission;
    } else {
      // permission does not exist before
      newPermissions.push(newPermission);
    }

    onPermissionChange(newPermissions);
  };

  const getIndexOfPermission = (permissionId: string) => {
    return groupPermissions.findIndex((permission) => permission.permissionId === permissionId);
  };

  const renderPermissions = () => {
    return permissions?.map((permission, index) => {
      const permissionId = permission.id;
      // Find the permission for this row in Group Permission
      const groupPermissionItem = groupPermissions.find(
        (groupPermissions) => groupPermissions.permissionId === permissionId
      );
      return (
        <StyledRow key={index}>
          <Column size={10}>
            <Typography
              size="0.8125rem"
              color={theme.colors.darkGrey}
              mb={0}
              style={{ marginTop: '0.3125rem' }}
            >
              {permission.name}
            </Typography>
          </Column>
          <Column size={1}>
            {permission.name !== 'Machine Management' && permission.name !== 'User Management' && (
              <Checkbox
                checked={groupPermissionItem && groupPermissionItem.read}
                onChange={(e: { target: { checked: boolean } }) => {
                  updatePermission(
                    {
                      read: e.target.checked,
                      write: groupPermissionItem?.write ?? false,
                      permissionId
                    },
                    getIndexOfPermission(permissionId)
                  );
                }}
              />
            )}
          </Column>
          <Column size={1}>
            <Checkbox
              checked={groupPermissionItem && groupPermissionItem.write}
              onChange={(e: { target: { checked: boolean } }) => {
                updatePermission(
                  {
                    read: groupPermissionItem?.read ?? false,
                    write: e.target.checked,
                    permissionId
                  },
                  getIndexOfPermission(permissionId)
                );
              }}
            />
          </Column>
        </StyledRow>
      );
    });
  };
  return (
    <>
      <Typography size="1rem" color={theme.colors.darkGrey} weight="bold">
        Permissions <MandatoryIndicator>*</MandatoryIndicator>
      </Typography>
      <KPICard
        component={
          <>
            <Typography
              size="0.8125rem"
              weight="bold"
              color={theme.colors.darkGrey}
              style={{ marginLeft: '17.5rem' }}
            >
              Read
            </Typography>
            <Typography
              size="0.8125rem"
              weight="bold"
              color={theme.colors.darkGrey}
              style={{ marginRight: '0rem' }}
            >
              Write
            </Typography>
          </>
        }
      >
        <DataRenderer isLoading={isLoadingPermissions} error={error && 'Failed to load data'}>
          {renderPermissions()}
        </DataRenderer>
      </KPICard>
    </>
  );
};

export default Permission;
