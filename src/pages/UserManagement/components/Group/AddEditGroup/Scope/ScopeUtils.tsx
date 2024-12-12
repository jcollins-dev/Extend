import { filter, isEmpty, uniq } from 'lodash';
import { Machine, Organization, Plant } from 'types';
import {
  GroupItem,
  GroupOrganization,
  GroupPlant,
  GroupScope,
  LinesById
} from 'types/user-management';

export const getOrgById = (
  allOrganizations: Organization[],
  id: string
): Organization | undefined => {
  return allOrganizations.find((org) => org.id === id);
};

export const getPlantById = (allPlants: Plant[], id: string): Plant | undefined => {
  return allPlants.find((plant) => plant.id === id);
};

export const getMachineByPlantId = (
  allPlants: Plant[],
  plantId: string,
  machineId: string
): Machine | undefined => {
  const plant = getPlantById(allPlants, plantId);
  return plant?.machines.find((machine) => machine.id === machineId);
};

export const getMachinesByPlantId = (allPlants: Plant[], plantId: string): Machine[] => {
  const plant = getPlantById(allPlants, plantId);
  return plant?.machines ?? [];
};

export const getGroupPlantsByOrg = (
  allPlants: Plant[],
  organization: GroupOrganization
): GroupPlant[] => {
  const groupPlants: GroupPlant[] = [];
  const plants = filter(allPlants, function (p) {
    return p.orgId === organization.organizationId;
  });
  plants.forEach((plant) => {
    groupPlants.push({
      plantId: plant.id,
      machines: getMachinesByPlant(allPlants, plant),
      allMachines: false
    });
  });
  return groupPlants;
};

export const getMachinesByPlant = (allPlants: Plant[], plant?: Plant): string[] => {
  const machines: string[] = [];
  plant?.machines.forEach((machine) => {
    machines.push(machine.id);
  });
  return machines;
};

export const getMachinesByOrg = (allPlants: Plant[], organization?: Organization): string[] => {
  const machines: string[] = [];
  organization?.plants.forEach((plant) => {
    const machinesByPlant = getMachinesByPlantId(allPlants, plant.id);
    machinesByPlant.forEach((machine) => {
      machines.push(machine.id);
    });
  });
  return uniq(machines);
};

export const getMachinesByGroupOrg = (organization: GroupOrganization): string[] => {
  const machines: string[] = [];
  organization.plants.forEach((plant) => {
    plant.machines.forEach((machine) => {
      machines.push(machine);
    });
  });
  return uniq(machines);
};

export const getSelectOptions = (
  elements: (Organization | Plant)[]
): { value: string; label: string }[] => {
  return Array.from(elements).map((element) => ({
    value: element.id,
    label: element.name
  }));
};

export const getGroupOrgOptions = (
  allOrgs: Organization[],
  elements: GroupOrganization[]
): { value: string; label: string }[] => {
  return Array.from(elements).map((element) => ({
    value: element.organizationId ?? '',
    label:
      (getOrgById(allOrgs, element.organizationId) &&
        getOrgById(allOrgs, element.organizationId)?.name) ??
      ''
  }));
};

export const getGroupPlantOptions = (
  allPlants: Plant[],
  elements: GroupPlant[]
): { value: string; label: string }[] => {
  return Array.from(elements).map((element) => ({
    value: element.plantId,
    label: `${
      getPlantById(allPlants, element.plantId) && getPlantById(allPlants, element.plantId)?.siteName
    }`
  }));
};

export const getGroupPlantOption = (
  allPlants: Plant[],
  element: GroupPlant
): { value: string; label: string } => {
  return {
    value: element?.plantId ?? '',
    label: `${
      getPlantById(allPlants, element?.plantId) &&
      !isEmpty(getPlantById(allPlants, element?.plantId)?.siteName)
        ? getPlantById(allPlants, element?.plantId)?.siteName
        : ''
    }`
  };
};

const getMachineLabel = (machine: Machine | undefined, allLines: LinesById): string => {
  const lineLabel =
    (machine?.lineId && allLines[machine.lineId] && allLines[machine.lineId].name) ?? undefined;
  return lineLabel ? `${machine?.description ?? ''} (${lineLabel})` : machine?.description ?? '';
};

export const getMachinesByGroupPlantOptions = (
  allPlants: Plant[],
  allLines: LinesById,
  plant: GroupPlant
): { value: string; label: string }[] => {
  if (!isEmpty(plant) && !isEmpty(plant.machines)) {
    return Array.from(plant?.machines).map((machine) => ({
      label: getMachineLabel(
        getMachineByPlantId(allPlants, plant?.plantId ?? '', machine),
        allLines
      ),
      value: machine ?? ''
    }));
  } else {
    return [];
  }
};

export const getMachinesByPlantOptions = (
  allPlants: Plant[],
  allLines: LinesById,
  plant?: Plant
): { value: string; label: string }[] => {
  return Array.from(plant?.machines ?? []).map((machine) => {
    return {
      label: getMachineLabel(getMachineByPlantId(allPlants, plant?.id ?? '', machine.id), allLines),
      value: machine.id ?? ''
    };
  });
};

export const getMachinesByOrgOptions = (
  allPlants: Plant[],
  allLines: LinesById,
  organizationId: string
): { label: string; value: string }[] => {
  const machinesOptions: { label: string; value: string }[] = [];
  allPlants.forEach((plant) => {
    if (plant.orgId === organizationId) {
      plant.machines.forEach((machine) => {
        machinesOptions.push({
          label: getMachineLabel(
            getMachineByPlantId(allPlants, plant?.id ?? '', machine.id),
            allLines
          ),
          value: machine.id
        });
      });
    }
  });
  return machinesOptions;
};

export const getMachinesByGroupOrgOptions = (
  allPlants: Plant[],
  allLines: LinesById,
  organization: GroupOrganization
): { label: string; value: string }[] => {
  const machinesOptions: { label: string; value: string }[] = [];
  allPlants.forEach((plant) => {
    if (plant.orgId === organization.organizationId) {
      plant.machines.forEach((machine) => {
        if (!isEmpty(organization.machines) && organization.machines.includes(machine.id)) {
          machinesOptions.push({
            label: getMachineLabel(
              getMachineByPlantId(allPlants, plant?.id ?? '', machine.id),
              allLines
            ),
            value: machine.id
          });
        }
      });
    }
  });
  return machinesOptions;
};

export const getScopeCounts = (
  allOrganizations: Organization[],
  allPlants: Plant[],
  scope: GroupScope
): { organizations: string; plants: string; machines: string } => {
  let plantCount = 0;
  let machinesCount = 0;
  scope.organizations?.forEach((organization) => {
    const organizationItem = getOrgById(allOrganizations, organization.organizationId);
    if (organization.allPlants) {
      plantCount = (organizationItem?.plants?.length ?? 0) + plantCount;
    }
    if (organization.allMachines) {
      const machines = getMachinesByOrg(allPlants ?? [], organizationItem);
      machinesCount = (machines?.length ?? 0) + machinesCount;
    }
    if (organization.allPlants && !organization.allMachines) {
      machinesCount = (organization.machines?.length ?? 0) + machinesCount;
    }
    organization?.plants?.forEach((plant) => {
      if (plant.allMachines && !organization.allMachines) {
        const machines = getMachinesByPlantId(allPlants, plant.plantId);
        machinesCount = (machines?.length ?? 0) + machinesCount;
      }
      if (!organization.allPlants) plantCount++;
      if (!plant.allMachines)
        machinesCount = machinesCount + (!isEmpty(plant?.machines) ? plant.machines.length : 0);
    });
  });
  return {
    organizations: scope.allOrganizations ? 'All' : `${scope?.organizations.length}`,
    plants: scope.allOrganizations ? 'All' : `${plantCount}`,
    machines: scope.allOrganizations ? 'All' : `${machinesCount}`
  };
};

export const isValidGroup = (group: GroupItem): boolean => {
  let isValid = group.allOrganizations || !isEmpty(group.organizations);
  group.organizations?.forEach((organization) => {
    if (!organization.allPlants && isEmpty(organization.plants)) isValid = false;
    organization.plants?.forEach((plant) => {
      if (isEmpty(plant.plantId)) isValid = false;
      if (!plant.allMachines && isEmpty(plant.machines)) isValid = false;
    });
  });
  return isValid;
};

export const getNewPlants = (
  option: { label: string; value: string },
  plants: GroupPlant[],
  plantIndex: number
): GroupPlant[] => {
  let groupPlants: GroupPlant[] = !isEmpty(plants) ? [...plants] : [];
  const plantItem = {
    plantId: option.value,
    value: option.value,
    label: option.label,
    machines: [],
    allMachines: false
  };
  if (option.value === 'All') {
    groupPlants = [plantItem];
  } else {
    groupPlants[plantIndex] = plantItem;
  }
  return groupPlants;
};
