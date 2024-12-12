import { MachineBusinessUnit, Machine, Plant } from 'types';
import { useGetPlantsQuery } from 'api';
import { useMemo } from 'react';

const businessUnitMap: Record<number, MachineBusinessUnit> = {
  1: 'pna',
  2: 'avure',
  3: 'pemea',
  4: 'aseptic',
  5: 'proseal',
  6: 'dsi'
};

export function mapBusinessUnit(
  businessUnit: number | MachineBusinessUnit | undefined
): MachineBusinessUnit | undefined {
  if (typeof businessUnit === 'number') {
    return businessUnitMap[businessUnit];
  }
  return businessUnit;
}

export function mapBusinessUnitId(
  businessUnit: MachineBusinessUnit | number | undefined
): number | undefined {
  let parsedId: number | undefined;
  // Handle business unit id as a string; look up the id from the businessUnitMap
  if (typeof businessUnit === 'string') {
    Object.entries(businessUnitMap).forEach(([key, value]) => {
      const typedKey = Number(key);
      value === (businessUnit as string).toLowerCase() && (parsedId = typedKey);
    });
  } else if (typeof businessUnit === 'number') {
    parsedId = businessUnit;
  }
  return parsedId;
}

export function useAllUserMachines(): Machine[] | undefined {
  const { data: plants } = useGetPlantsQuery();
  const machines = useMemo(
    () => plants?.reduce((acc: Machine[], plant: Plant) => acc.concat(plant?.machines ?? []), []),
    [plants]
  );
  return machines;
}
