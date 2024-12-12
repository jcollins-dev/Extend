// 3rd party libs
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from 'themes';
import { faAngleLeft, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import styled from 'styled-components';
import { isEmpty, lowerCase, sortBy } from 'lodash';

// Components
import { Button, Column, KPICard, Row, Typography } from 'components';

import { DropdownWithCheckboxes } from 'pages/ProteinMachine/MachineConfig/Common/Alerts/DropdownWithCheckboxes';

// Types
import {
  GroupOrganization,
  GroupPlant,
  GroupScope,
  LinesById,
  ScopeCount
} from 'types/user-management';

// Utils
import {
  getGroupOrgOptions,
  getGroupPlantOption,
  getGroupPlantOptions,
  getGroupPlantsByOrg,
  getMachinesByGroupOrgOptions,
  getMachinesByGroupPlantOptions,
  getMachinesByOrgOptions,
  getMachinesByPlantOptions,
  getNewPlants,
  getOrgById,
  getPlantById,
  getScopeCounts,
  getSelectOptions
} from 'pages/UserManagement/components/Group/AddEditGroup/Scope/ScopeUtils';
import { Organization, Plant } from 'types';

interface Props {
  onScopeDetail: (isVisibleScopeDetail: boolean) => void;
  onScopeDetailChange: (scope: GroupScope) => void;
  allOrganizations: Organization[];
  allPlants: Plant[];
  allLines: LinesById;
  scope: GroupScope;
  internalAccessGroup: boolean;
  setCounts: (counts: ScopeCount) => void;
}

const OrganizationContainer = styled.div`
  margin-bottom: 1rem;
`;

const PlantsContainer = styled.div`
  padding: 1rem;
`;

const StyledTrashIcon = styled(FontAwesomeIcon)`
  margin-top: 0.6rem;
  cursor: pointer;
`;

const StyledScopeIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-right: 1rem;
`;

const ScopeDetail = ({
  allOrganizations,
  allPlants,
  allLines,
  onScopeDetail,
  scope,
  onScopeDetailChange,
  internalAccessGroup,
  setCounts
}: Props): ReactElement => {
  const [scopeState, setScopeState] = useState<GroupScope>(scope);
  const activeSelection = useRef({ value: '', plantIndex: 0 });
  useEffect(() => {
    setScopeState(scope);
  }, [scope]);

  const updateOrganizations = (items: { label: string; value: string }[]) => {
    const orgItems: GroupOrganization[] = [];
    let isAllOrg = false;
    items.forEach((item) => {
      if (item.value === 'All') isAllOrg = true;
      const groupOrg = scopeState.organizations.find((org) => org.organizationId === item.value);
      const orgItem = {
        organizationId: item.value,
        value: item.value,
        label: item.label,
        allPlants: groupOrg?.allPlants ?? false,
        allMachines: groupOrg?.allMachines ?? false,
        plants: groupOrg?.plants ?? [],
        machines: [],
        selectedPlants: []
      };
      orgItems.push(orgItem);
    });

    const newScopeState = {
      ...scopeState,
      organizations: isAllOrg ? [] : orgItems,
      allOrganizations: isAllOrg
    };
    setScopeState(newScopeState);
  };

  const updatePlants = (organizationId: string, newPlants: GroupPlant[], isAllPlants: boolean) => {
    setScopeState((scopeState) => ({
      ...scopeState,
      organizations: scopeState.organizations.map((organization) => {
        if (organization.organizationId === organizationId) {
          return {
            ...organization,
            allPlants: isAllPlants,
            allMachines: false,
            plants: isAllPlants ? [] : newPlants
          };
        }
        return organization;
      })
    }));
  };

  const updateMachines = (
    organizationId: string,
    plantId: string,
    newMachines: string[],
    isAllMachines: boolean,
    isAllPlants: boolean
  ) => {
    setScopeState((scopeState) => ({
      ...scopeState,
      organizations: scopeState.organizations.map((organization) => {
        if (organization.organizationId === organizationId) {
          return {
            ...organization,
            machines: isAllPlants && !isAllMachines ? newMachines : [],
            allMachines: isAllPlants && isAllMachines,
            plants: organization?.plants?.map((plant) => {
              if (plant.plantId === plantId) {
                return {
                  ...plant,
                  allMachines: isAllMachines,
                  machines: isAllMachines || isAllPlants ? [] : newMachines
                };
              }
              return plant;
            })
          };
        }
        return organization;
      })
    }));
  };

  const onGoBackToGroup = useCallback(() => {
    const counts = getScopeCounts(allOrganizations ?? [], allPlants ?? [], scopeState);
    setCounts(counts);
    onScopeDetail(false);
    onScopeDetailChange(scopeState);
  }, [scopeState]);

  const renderPlant = (
    organization: GroupOrganization,
    plantOptions: { label: string; value: string }[],
    orgIndex: number
  ) => {
    const plantItem = getPlantById(allPlants ?? [], plantOptions[0] && plantOptions[0]?.value);
    const groupPlant = scopeState?.organizations?.[orgIndex]?.plants?.[0];
    let machineOptions: { value: string; label: string }[];
    if (organization.allMachines || organization.allPlants) {
      machineOptions = getMachinesByOrgOptions(allPlants, allLines, organization.organizationId);
    } else {
      machineOptions = getMachinesByPlantOptions(allPlants, allLines, plantItem);
    }

    let machineOptionsValue: { label: string; value: string }[];
    if (organization.allMachines || groupPlant?.allMachines) {
      machineOptionsValue = [{ value: 'All', label: 'All Machines' }];
    } else if (organization?.allPlants) {
      machineOptionsValue = getMachinesByGroupOrgOptions(allPlants, allLines, organization);
    } else {
      machineOptionsValue = getMachinesByGroupPlantOptions(allPlants, allLines, groupPlant ?? {});
    }

    const plantOptionsValue =
      scopeState?.organizations?.[orgIndex]?.plants &&
      !isEmpty(scopeState.organizations[orgIndex].plants) &&
      scopeState.organizations[orgIndex].plants[0]
        ? getGroupPlantOption(allPlants, scopeState.organizations[orgIndex].plants[0])
        : null;

    return (
      <Row>
        <StyledTrashIcon
          color={theme.colors.negativeRed}
          icon={faTrashCan}
          onClick={() => {
            updatePlants(organization.organizationId, [], false);
          }}
        />
        <Column size={6}>
          <Select
            options={[
              { value: 'All', label: 'All Sites' },
              ...sortBy(plantOptions, [
                (p) => {
                  return lowerCase(p.label);
                }
              ])
            ]}
            value={
              organization.allPlants ? { value: 'All', label: 'All Sites' } : plantOptionsValue
            }
            placeholder="Select Site"
            hideSelectedOptions={false}
            onChange={(option) => {
              const newPlants = getNewPlants(
                { value: option?.value ?? '', label: option?.label ?? '' },
                organization.plants,
                0
              );
              updatePlants(organization.organizationId, newPlants, option?.value === 'All');
            }}
          />
        </Column>
        <Column size={6}>
          <Select
            value={sortBy(machineOptionsValue, [(p) => lowerCase(p.label)])}
            options={[
              { value: 'All', label: 'All Machines' },
              ...sortBy(machineOptions, [
                (p) => {
                  return lowerCase(p.label);
                }
              ])
            ]}
            isMulti
            placeholder="Select Machines"
            onChange={(machineOptions) => {
              const machineItems = Array.from(machineOptions).map(
                (machineOption) => machineOption.value
              );
              updateMachines(
                organization.organizationId,
                plantItem?.id ?? '',
                machineItems,
                machineOptions.some((machineOption) => machineOption.value === 'All'),
                organization.allPlants
              );
            }}
          />
        </Column>
      </Row>
    );
  };

  const renderPlants = (
    organization: GroupOrganization,
    plantOptions: { label: string; value: string }[],
    orgIndex: number
  ) => {
    return organization.plants?.map((plant, plantIndex) => {
      const plantItem = getPlantById(allPlants ?? [], plant.plantId);
      const groupPlant = scopeState?.organizations?.[orgIndex]?.plants?.[plantIndex];
      let machineOptions: { value: string; label: string }[];
      if (organization.allMachines || organization.allPlants) {
        machineOptions = getMachinesByOrgOptions(allPlants, allLines, organization.organizationId);
      } else {
        machineOptions = getMachinesByPlantOptions(allPlants, allLines, plantItem);
      }

      const machineOptionsValue = getMachinesByGroupPlantOptions(
        allPlants,
        allLines,
        groupPlant ?? {}
      );

      const plantOptionsValue =
        scopeState?.organizations?.[orgIndex]?.plants &&
        !isEmpty(scopeState.organizations[orgIndex].plants) &&
        scopeState.organizations[orgIndex].plants[plantIndex]
          ? getGroupPlantOption(allPlants, scopeState.organizations[orgIndex].plants[plantIndex])
          : null;
      activeSelection.current = {
        value: plantOptionsValue?.value as string,
        plantIndex: plantIndex
      };

      organization.selectedPlants.forEach((selection, index) => {
        if (selection.plantIndex === activeSelection.current.plantIndex) {
          organization.selectedPlants.splice(index, 1);
        }
      });
      organization.selectedPlants.push(activeSelection.current);
      const filteredOptions: { label: string; value: string }[] = [];
      plantOptions.forEach((opt) => {
        const selected = organization.selectedPlants.find((p) => p.value === opt.value);
        if (!selected) {
          filteredOptions.push(opt);
        }
      });
      return (
        <Row key={plantIndex}>
          <StyledTrashIcon
            color={theme.colors.negativeRed}
            icon={faTrashCan}
            onClick={() => {
              organization.selectedPlants.forEach((selection, index) => {
                if (selection.plantIndex === plantIndex) {
                  organization.selectedPlants.splice(index, 1);
                }
              });
              updatePlants(
                organization.organizationId,
                [
                  ...organization.plants.slice(0, plantIndex),
                  ...organization.plants.slice(plantIndex + 1)
                ],
                organization.allPlants
              );
            }}
          />
          <Column size={6}>
            <Select
              options={[{ value: 'All', label: 'All Sites' }, ...filteredOptions]}
              value={
                organization?.allPlants ? { value: 'All', label: 'All Sites' } : plantOptionsValue
              }
              placeholder="Select Site"
              hideSelectedOptions={false}
              onChange={(option) => {
                const newPlants = getNewPlants(
                  { value: option?.value ?? '', label: option?.label ?? '' },
                  organization.plants,
                  plantIndex
                );
                updatePlants(organization.organizationId, newPlants, option?.value === 'All');
              }}
            />
          </Column>
          <Column size={6}>
            <Select
              options={[
                { value: 'All', label: 'All Machines' },
                ...sortBy(machineOptions, [
                  (p) => {
                    return lowerCase(p.label);
                  }
                ])
              ]}
              value={
                groupPlant?.allMachines
                  ? [{ value: 'All', label: 'All Machines' }]
                  : sortBy(machineOptionsValue, [
                      (p) => {
                        return lowerCase(p.label);
                      }
                    ])
              }
              isMulti
              placeholder="Select Machines"
              onChange={(machineOptions) => {
                const machineItems = Array.from(machineOptions).map(
                  (machineOption) => machineOption.value
                );
                updateMachines(
                  organization.organizationId,
                  plantItem?.id ?? '',
                  machineItems,
                  machineOptions.some((machineOption) => machineOption.value === 'All'),
                  organization.allPlants
                );
              }}
            />
          </Column>
        </Row>
      );
    });
  };

  const renderOrganizations = () => {
    return scopeState.organizations?.map((organization: GroupOrganization, orgIndex) => {
      const plantOptions = getGroupPlantOptions(
        allPlants,
        getGroupPlantsByOrg(allPlants ?? [], organization)
      );
      return (
        <OrganizationContainer key={orgIndex}>
          <Typography size="1rem" weight="semi-bold">
            {!isEmpty(organization.label)
              ? organization.label
              : getOrgById(allOrganizations, organization.organizationId)?.name}
          </Typography>
          <KPICard
            style={{ overflow: 'visible' }}
            key={orgIndex}
            component={
              <>
                <Typography
                  size="0.8125rem"
                  weight="bold"
                  color={theme.colors.darkGrey}
                  style={{ marginLeft: '2rem' }}
                >
                  Site
                </Typography>
                <Typography
                  size="0.8125rem"
                  weight="bold"
                  color={theme.colors.darkGrey}
                  style={{ marginRight: '5rem' }}
                >
                  Machines
                </Typography>
              </>
            }
          >
            <PlantsContainer>
              <>
                {organization.allPlants || isEmpty(organization.plants)
                  ? renderPlant(organization, plantOptions, orgIndex)
                  : renderPlants(organization, plantOptions, orgIndex)}
              </>
            </PlantsContainer>
            <Button
              onClick={() => {
                updatePlants(
                  organization.organizationId,
                  [
                    ...organization.plants,
                    {
                      plantId: '',
                      value: '',
                      label: '',
                      allMachines: false,
                      machines: []
                    }
                  ],
                  organization.allPlants
                );
              }}
              // If the limit of org plants is reached , do not allow adding new one
              disabled={
                organization.allPlants ||
                isEmpty(organization.plants) ||
                plantOptions.length === organization.plants.length
              }
              color={theme.colors.mediumBlue2}
            >
              Add new +
            </Button>
          </KPICard>
        </OrganizationContainer>
      );
    });
  };
  return (
    <>
      <Typography
        size="1rem"
        color={theme.colors.darkGrey}
        weight="bold"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          onGoBackToGroup();
        }}
      >
        <StyledScopeIcon color={theme.colors.darkGrey} icon={faAngleLeft} />
        Back
      </Typography>
      <Typography size="1rem" color={theme.colors.darkGrey} weight="semi-bold">
        Customer
      </Typography>
      <DropdownWithCheckboxes
        placeholder="Select Organizations"
        value={
          scopeState.allOrganizations
            ? [{ value: 'All', label: 'All organizations' }]
            : getGroupOrgOptions(allOrganizations, scopeState.organizations)
        }
        options={
          internalAccessGroup
            ? [
                { value: 'All', label: 'All organizations' },
                ...getSelectOptions(allOrganizations ?? [])
              ]
            : getSelectOptions(allOrganizations ?? [])
        }
        handleMultiSelect={(items) => {
          updateOrganizations(items);
        }}
      />
      <Row />
      {scopeState.allOrganizations ? (
        <Row>
          <Column>
            <Select
              isMulti
              options={[]}
              placeholder="All Sites"
              isDisabled={scopeState.allOrganizations}
            />
          </Column>
          <Column>
            <Select
              isMulti
              options={[]}
              placeholder="All Machines"
              isDisabled={scopeState.allOrganizations}
            />
          </Column>
        </Row>
      ) : (
        <>{renderOrganizations()}</>
      )}
    </>
  );
};
export default ScopeDetail;
