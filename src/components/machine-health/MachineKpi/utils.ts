import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import _ from 'lodash';
import { useLanguage } from 'providers';
import { useParams } from 'react-router-dom';
import theme from 'themes';

import { useGetMachineOverviewTagsQuery } from 'api';
import { KpiRow } from 'types/machine-health';
import { ProteinMachineRouteQueryParams, MachineOverviewTag, MachineId } from 'types/protein';

/**
 *
 * Group tags by Id and then transform each group into KpiRow[]
 * @return 'main' will be displayed on the overview page
 * @return 'extended' is a flattened array of all the other groups, that will be displayed
 * in the extended list (flyout)
 *
 */

export const formatValueByValueType = (
  value: string | number | null | undefined,
  type: string | undefined
): string | number | null | undefined => {
  if (!type || value === 'undefined' || value === null) return value;

  const valueType = typeof type === 'string' ? type.trim().toLocaleLowerCase() : type;

  switch (valueType) {
    case 'string':
      return value;
    case 'integer':
      return typeof value === 'number' ? Number(value).toFixed(0) : value;
    case 'float':
      return typeof value === 'number' ? Number(value).toFixed(1) : value;
    case 'boolean':
      return value ? 'On' : 'Off';
    default:
      return value;
  }
};

export const formatValueWithUnit = (
  value: string | number | null | undefined,
  unit: string | number | undefined
): string => {
  return `${!value?.toString() ? '--' : value.toString()} ${unit ? unit : ''}`;
};

export const toKpiRows = (tags?: MachineOverviewTag[]): { main: KpiRow[]; extended: KpiRow[] } => {
  if (!tags) {
    return { main: [], extended: [] };
  }

  let main: KpiRow[] = [];
  let extended: KpiRow[] = [];
  const { lightGrey2, darkGrey } = theme.colors;

  // Group tags by their 'tagGroupId'
  const groups = _(tags)
    .groupBy((tag) => tag.tagGroupId)
    .map((value, key) => ({
      tagGroupId: key,
      tags: value
    }))
    .value();

  // If there is a group with no id, lodash will group it under an empty string ''
  // Move this group to the top
  const ungroupedIndex = groups.findIndex((group) => group.tagGroupId === '');
  if (ungroupedIndex !== -1) {
    const ungroupedGroup = groups.splice(ungroupedIndex, 1);
    groups.unshift(ungroupedGroup[0]);
  }

  // Separate main groups from the extended ones
  const mainAndExtendedGroups = () => {
    const mainGroup: MachineOverviewTag[][] = [];
    const extendedGroup: MachineOverviewTag[][] = [];
    for (const group of groups) {
      const main: MachineOverviewTag[] = [];
      const extended: MachineOverviewTag[] = [];

      // Each group could contain main and/or extended tags
      group.tags.forEach((tag) => {
        if (tag.mainTag.toLocaleLowerCase() == 'true') main.push(tag);
        else extended.push(tag);
      });

      mainGroup.push(main);
      extendedGroup.push(extended);
    }

    return {
      mainGroup,
      extendedGroup
    };
  };

  const fromMachineTagsToRowKpisArray = (groups: MachineOverviewTag[][]) => {
    if (groups.length === 0) return [];
    const kpiRows: KpiRow[] = [];
    groups.forEach((group) => {
      if (group.length !== 0) {
        /** init with groupId & groupName */
        const { tagGroupId: id, tagGroupName: name } = group[0];
        // Do not add a header row if the group id is undefined
        if (id) {
          kpiRows.push({
            label: name,
            value: {
              key: id as string,
              bgColor: lightGrey2,
              color: darkGrey,
              weight: 500,
              height: 33
            }
          });
        }
        group.forEach((tag) =>
          kpiRows.push({
            label: tag.name || tag.tagId || '--',
            value: {
              key: `${id}-${tag.tagId}`,
              content: formatValueWithUnit(
                formatValueByValueType(tag.value, tag.valueType),
                tag.unit
              ),
              clickable: true
            }
          })
        );
      }
    });

    return kpiRows;
  };

  const { mainGroup, extendedGroup } = mainAndExtendedGroups();

  main = fromMachineTagsToRowKpisArray(mainGroup);
  extended = fromMachineTagsToRowKpisArray(extendedGroup);
  return { main, extended };
};

const updatePilgrimsWacoFrigoscandiaData = (
  data: MachineOverviewTag[] | undefined,
  machineId: string
): MachineOverviewTag[] | undefined => {
  // Work on a copy of the data since it is not extensible
  const dataCopy = data ? [...data] : undefined;

  // If the machineId matches the Pilgrims Waco Frigoscandia Id, update the data
  if (dataCopy && machineId === MachineId.PilgrimsWacoFrigoscandia) {
    // Determine the index of the tag with the id 'OuterDriveChainTension'
    const insertPosition = dataCopy.findIndex((tag) => tag.tagId === 'OuterDriveChainTension');

    // If we have a match, insert the Maximum Tensioner Position item
    insertPosition >= 0 &&
      dataCopy.splice(insertPosition, 0, {
        ...dataCopy[insertPosition],
        name: 'Maximum Tensioner Position',
        tagId: 'MaximumTensionerPosition',
        unit: 'mm',
        value: 110
      });
  }

  return dataCopy;
};

export const useMachineKpi = (
  pollingInterval: number,
  skip?: boolean
): {
  main: KpiRow[];
  extended: KpiRow[];
  isLoading: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
  machineId: string;
  data?: MachineOverviewTag[];
} => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { languageId } = useLanguage();

  const { data, isLoading, error } = useGetMachineOverviewTagsQuery(
    { machineId, languageId },
    { pollingInterval, skip }
  );

  // TEMP: If the machine is a Pilgrims WACO Frigoscandia, ...
  // ...update the data with a Maximum Tensioner Position item
  const updatedData = updatePilgrimsWacoFrigoscandiaData(data, machineId);

  const { main, extended } = toKpiRows(updatedData);
  return { main, extended, isLoading, error, machineId, data };
};
