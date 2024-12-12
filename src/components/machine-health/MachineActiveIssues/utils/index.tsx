/**
 *  This function filters data by given filter. Data is an array of objects.
 * @param filter - obejct with keys and value as an array of values
 *      {
 *        "location":[
 *           "hidden",
 *           "production"
 *        ]
 *      }
 */
import React from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { formatLocaleDate } from 'components/StyledUi/js/dateAndTimeHelpers';
import { getDurationBetweenTimestamps } from 'helpers';
import { v4 as uuidv4 } from 'uuid';

// Expected data format - an object with keys and values as an array
export const filterGivenDataByKeyValue = (
  data: Record<string, unknown>[],
  filter: Record<string, unknown>
): Record<string, unknown>[] => {
  const hasIncludedValues = (
    datObj: Record<string, unknown>,
    filterObject: Record<string, unknown>
  ) => {
    const datObject = datObj;
    return Object.keys(datObject).some((key) => {
      if (Object.prototype.hasOwnProperty.call(filterObject, key)) {
        const filterValues = filterObject[key] as unknown as string[];
        const datValue = datObject[key] as unknown as string;
        return datValue !== 'undefined' && filterValues.indexOf(datValue) > -1 ? true : false;
      } else {
        return false;
      }
    });
  };
  return data.filter((el) => hasIncludedValues(el, filter));
};

export const formatDataForTable = (data: Record<string, unknown>[]): Record<string, unknown>[] => {
  return data.map((el) => {
    const id = el.id ? el.id : uuidv4();
    const duration =
      el.startTimestamp && el.endTimestamp
        ? getDurationBetweenTimestamps(el.startTimestamp as string, el.endTimestamp as string)
        : undefined;

    let timestamp;
    timestamp = el.timestamp && formatLocaleDate(el.timestamp as string, 'short');
    timestamp = el.createdAt && formatLocaleDate(el.createdAt as string, 'short');

    return { ...el, id, duration, timestamp };
  });
};

export const generateTableColumns = (
  configs: Record<string, unknown>[]
): ColumnDef<Record<string, unknown>>[] => {
  const columnHelper = createColumnHelper<Record<string, unknown>>();

  return configs.map((col) => {
    return columnHelper.accessor((row) => row[col.key as string], {
      id: col.key as string,
      header: () => col.label as string,
      footer: (info) => info.column.id,
      cell: (info) => {
        if (typeof col.label === 'string') {
          return info.getValue();
        } else if (typeof col.label === 'function') {
          return <p>{col.label(info.getValue())}</p>;
        } else {
          return col.label;
        }
      }
    });
  });
};
