// 3rd party libs
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { skipToken } from '@reduxjs/toolkit/query';
import { sortBy } from 'lodash';

// Components
import Scope from 'pages/UserManagement/components/Group/AddEditGroup/Scope';
import Permission from 'pages/UserManagement/components/Group/AddEditGroup/Permission';
import ScopeDetail from 'pages/UserManagement/components/Group/AddEditGroup/Scope/ScopeDetail';
import GroupInfo from 'pages/UserManagement/components/Group/AddEditGroup/GroupInfo';
import { DataRenderer } from 'components/machine-health';

// Types
import { Id } from 'types';
import { GroupItem, GroupScope, LinesById } from 'types/user-management';
import {
  useGetLinesQuery,
  useGetOrganizationsQuery,
  useGetPlantsQuery,
  useGetUserManagementGroupByIdQuery
} from 'api';
import { GroupModalFooter } from 'pages/UserManagement/components/index';
import { getScopeCounts } from 'pages/UserManagement/components/Group/AddEditGroup/Scope/ScopeUtils';
import { isAlphaNumeric } from 'helpers';

interface Props {
  id?: Id;
  setIsChanged: (isChanged: boolean) => void;
  onClose: () => void;
  onCloseVerifyData: () => void;
  initialGroupInfo: GroupItem;
  isActiveUserPromptMode: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding: 0 0.5rem;
`;

const FormContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 1rem;
`;
const AddEditGroup = ({
  id,
  initialGroupInfo,
  setIsChanged,
  onClose,
  onCloseVerifyData,
  isActiveUserPromptMode
}: Props): ReactElement => {
  const { data: allOrganizations, isFetching: isLoadingOrganizations } = useGetOrganizationsQuery();
  const { data: allPlants, isFetching: isLoadingPlants } = useGetPlantsQuery();
  const { data: lines, isFetching: isLoadingLines } = useGetLinesQuery({ plantIds: [] });
  const {
    data: groupData,
    error: groupError,
    isLoading: isLoadingGroup
  } = useGetUserManagementGroupByIdQuery(id ?? skipToken);

  const sortedOrgs = sortBy(allOrganizations, [
    (o) => {
      return o.name;
    }
  ]);
  const sortedPlants = sortBy(allPlants, [
    (p) => {
      return p.name;
    }
  ]);

  const allLines = useMemo(
    () =>
      lines?.reduce((acc, line) => {
        acc[line.id] = line;
        return acc;
      }, {} as LinesById),
    [lines]
  );

  const [isVisibleScopeDetail, setIsVisibleScopeDetail] = useState(false);

  const initialGroupData = groupData ?? initialGroupInfo;
  const [groupInfoState, setGroupInfoState] = useState(initialGroupData);

  const groupDataScope = {
    organizations: groupData?.organizations ?? [],
    plants: groupData?.plants ?? [],
    machines: groupData?.machines ?? [],
    allOrganizations: groupData?.allOrganizations ?? false,
    allPlants: groupData?.allPlants ?? false,
    allMachines: groupData?.allMachines ?? false
  };

  const [counts, setCounts] = useState({ organizations: '0', plants: '0', machines: '0' });

  useEffect(() => {
    setGroupInfoState(groupData ?? initialGroupInfo);
    setCounts(getScopeCounts(allOrganizations ?? [], allPlants ?? [], groupDataScope));
  }, [groupData]);

  const isLoadingAddEditGroup = id
    ? isLoadingGroup || isLoadingOrganizations || isLoadingPlants || isLoadingLines
    : isLoadingOrganizations || isLoadingPlants || isLoadingLines;

  const onChangeAccessGroup = (internalAccessGroup: boolean) => {
    // When access Group changes, set scope detail to initial
    const scope = {
      organizations: [],
      plants: [],
      machines: [],
      allOrganizations: false,
      allPlants: false,
      allMachines: false
    };
    setCounts({ organizations: '0', plants: '0', machines: '0' });
    setGroupInfoState({
      id: id,
      internalAccessGroup: internalAccessGroup,
      name: groupInfoState.name,
      permissions: groupInfoState.permissions,
      ...scope
    });
  };

  return (
    <Container>
      <FormContainer>
        <DataRenderer
          isLoading={isLoadingAddEditGroup}
          error={id && groupError ? 'Failed to Load' : ''}
        >
          {isVisibleScopeDetail ? (
            <ScopeDetail
              allOrganizations={sortedOrgs ?? []}
              allPlants={sortedPlants ?? []}
              allLines={allLines ?? {}}
              internalAccessGroup={groupInfoState.internalAccessGroup}
              scope={{
                organizations: groupInfoState.organizations ?? [],
                plants: groupInfoState.plants ?? [],
                machines: groupInfoState.machines ?? [],
                allOrganizations: groupInfoState.allOrganizations,
                allPlants: groupInfoState.allPlants,
                allMachines: groupInfoState.allMachines
              }}
              onScopeDetail={setIsVisibleScopeDetail}
              onScopeDetailChange={(scope: GroupScope) => {
                setGroupInfoState({
                  ...groupInfoState,
                  ...scope
                });
                setIsChanged(true);
              }}
              setCounts={setCounts}
            />
          ) : (
            <>
              <GroupInfo
                groupInformation={{
                  name: groupInfoState.name,
                  internalAccessGroup: groupInfoState.internalAccessGroup
                }}
                onGroupNameChange={(groupName: string) => {
                  isAlphaNumeric(groupName) &&
                    setGroupInfoState({
                      ...groupInfoState,
                      name: groupName.trimStart()
                    });
                  setIsChanged(true);
                }}
                onGroupAccessChange={(internalAccessGroup: boolean) => {
                  onChangeAccessGroup(internalAccessGroup);
                  setIsChanged(true);
                }}
              />
              <Scope
                onScopeDetail={setIsVisibleScopeDetail}
                counts={{
                  organizations: counts.organizations,
                  plants: counts.plants,
                  machines: counts.machines
                }}
              />
              <Permission
                groupPermissions={groupInfoState.permissions ?? []}
                onPermissionChange={(permissions) => {
                  setGroupInfoState({ ...groupInfoState, permissions: permissions });
                  setIsChanged(true);
                }}
              />
            </>
          )}
        </DataRenderer>
      </FormContainer>
      {!isVisibleScopeDetail && (
        <GroupModalFooter
          tableItemId={id}
          onClose={onClose}
          onCloseVerifyData={onCloseVerifyData}
          groupInfo={groupInfoState}
          isActiveUserPromptMode={isActiveUserPromptMode}
        />
      )}
    </Container>
  );
};

export default AddEditGroup;
