// 3rd party
import { TFunction } from 'i18next';
import { uniqueId } from 'lodash';

// Type
import { BaseType } from 'types';
import { ColumnConfig, SortState } from 'types';

// Helpers
import { getDurationBetweenTimestamps, formatDate } from 'helpers';

export interface ColumnConfgurationProps {
  columnsOrder: string[];
  columnSettings: BaseType;
}

interface DataForTableProps {
  columnsArray: (string | number)[];
  dataArray?: BaseType[];
}

// Helper function for typescript to not throw errors :) when dynamicly creating columns
function typedKeys<T extends BaseType>(o: T): (keyof T)[] {
  // type cast should be safe because that's what really Object.keys() does
  return Object.keys(o) as (keyof T)[];
}

export const generateTableColumns = (
  tableColumns?: ColumnConfgurationProps,
  dataColumns?: (number | string)[],
  sortState?: Record<string, SortState>,
  t?: TFunction<'mh'[], undefined>
): ColumnConfig[] => {
  if (!dataColumns || !tableColumns || !sortState || !t) return [];

  const columns: ColumnConfig[] = [];
  tableColumns.columnsOrder.map((item) => {
    const x = item as string;
    if (dataColumns.indexOf(x) > -1) {
      typedKeys(tableColumns.columnSettings).filter((k) => {
        if (k === x) {
          // @ts-expect-error: ignore this error
          typedKeys(tableColumns.columnSettings[k]).filter((colProp) => {
            // @ts-expect-error: ignore this error
            const title = tableColumns.columnSettings[k][colProp];
            columns.push({
              title: t(title) as string,
              dataIndex: x,
              key: x,
              sortState: Object.prototype.hasOwnProperty.call(sortState, x)
                ? sortState[x]
                : SortState.unsorted
            });
          });
        }
      });
    }
  });

  return columns;
};

// This functions adds keys to the table rows and formats timestamps if it has any
// Returns array of table rows and an array of columns for this data
export const formatDataForTable = (data?: BaseType[], timezone?: string): DataForTableProps => {
  if (!data || !data?.length) return { columnsArray: [], dataArray: [] };

  const columnsArray: (string | number)[] = [];
  const dataArray = data.map((item: BaseType) => {
    // This block tries to accomodate different names for start date: startTime, startTimestamp... ,
    // We are trying to account for all possible variations and calculate duration
    const itemKeys = Object.keys(item);
    const hasStartTime = itemKeys.indexOf('startTime') != -1;
    const hasStartTimestamp = itemKeys.indexOf('startTimestamp') != -1;
    const hasEndTimestamp = itemKeys.indexOf('endTimestamp') != -1;
    const hasEndTime = itemKeys.indexOf('endTime') != -1;
    const hasTimestamp = itemKeys.indexOf('timestamp') != -1;

    const mappedItem = { ...item } as BaseType;
    //Mapping to startTime key
    if (hasStartTime)
      mappedItem['startTime'] = formatDate(
        new Date(item['startTime'] as unknown as number),
        'numeric-date-time',
        timezone
      );
    if (hasStartTimestamp)
      mappedItem['startTime'] = formatDate(
        new Date(item['startTimestamp'] as unknown as number),
        'numeric-date-time',
        timezone
      );

    //Mapping to endTime key
    if (hasEndTime)
      mappedItem['endTime'] = formatDate(
        new Date(item['endTime'] as unknown as number),
        'numeric-date-time',
        timezone
      );
    if (hasEndTimestamp)
      mappedItem['endTime'] = formatDate(
        new Date(item['endTimestamp'] as unknown as number),
        'numeric-date-time',
        timezone
      );

    //if no start or end, map it to timestamp
    if (hasTimestamp) {
      // Check format if timestamp first
      // Timestamp "2023-05-20T00:02:08+00:00"
      const ts = item['timestamp'] as unknown as string;
      if (ts[10] == 'T') {
        mappedItem['timestamp'] = formatDate(ts, 'numeric-date-time', timezone);
      } else {
        const timestampValue = item['timestamp'] as unknown as number;
        mappedItem['timestamp'] = formatDate(
          new Date(timestampValue * 1000),
          'numeric-date-time',
          timezone
        );
      }
    }

    //calc duration, map it to duration
    if (hasStartTime && hasEndTime)
      mappedItem['duration'] = getDurationBetweenTimestamps(
        item['startTime'] as unknown as string,
        item['endTime'] as unknown as string
      );
    if (hasStartTimestamp && hasEndTimestamp)
      mappedItem['duration'] = getDurationBetweenTimestamps(
        item['startTimestamp'] as unknown as string,
        item['endTimestamp'] as unknown as string
      );

    const updatedItemKeys = Object.keys(mappedItem);
    updatedItemKeys.map((key) =>
      columnsArray.indexOf(key) === -1 ? columnsArray.push(key) : null
    );

    return {
      ...mappedItem,
      key: uniqueId()
    };
  });

  return { dataArray, columnsArray };
};
