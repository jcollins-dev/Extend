// Lodash
import merge from 'lodash/merge';
import orderBy from 'lodash/orderBy';
import moment from 'moment';

// Helpers
//import { addQuotes } from 'helpers/strings';
import { formatDate, formatDuration } from 'helpers';

// Types
import { BaseTag } from 'types/protein';

// Constants
import { NO_SELECTION } from 'constants/machineTags';

interface ArgsTable extends Props {
  numberTags?: BaseTag[];
  separator?: string;
  emptyValueSymbol?: string;
  headersOrder?: { columnName: string; columnPosition: number }[];
}

interface Props {
  endTime: Date;
  showDatestamp?: boolean;
  showDuration?: boolean;
  states?: BaseTag[];
  stringTags: BaseTag[];
  timeZone?: string;
  tableColumns?: string;
}

export const transformDataToUniqueRows = ({
  endTime,
  numberTags,
  stringTags,
  showDatestamp,
  showDuration,
  states,
  timeZone,
  emptyValueSymbol,
  headersOrder
}: ArgsTable): string[] => {
  const data: string[] = [];
  const headers: string[] = [];

  const emptyValue = emptyValueSymbol ? emptyValueSymbol : '';

  showDatestamp && headers.push('Date');
  showDatestamp ? headers.push('Start Time') : headers.push('Timestamp');
  showDuration && headers.push('Duration');

  const columnNamesStringTag = stringTags.map((tag) => tag.name?.trim() || tag.id.trim());
  const columnNamesStates = states?.map((state) => state.name || state.id) || [];
  const columnNamesNumberTags = numberTags?.map((tag) => tag.name || tag.id) || [];

  const columnNames = [...columnNamesStringTag, ...columnNamesStates, ...columnNamesNumberTags];

  // Re-order headers if needed
  if (headersOrder) {
    headersOrder.map((header) => {
      if (columnNames.indexOf(header.columnName.trim()) > -1) {
        const prevIndex = columnNames.indexOf(header.columnName.trim());
        const newIndex = header.columnPosition;
        if (prevIndex !== newIndex) {
          const removedHeader = columnNames.splice(prevIndex, 1);
          columnNames.splice(newIndex, 0, removedHeader[0]);
        }
      }
    });
  }

  headers.push(...columnNames);
  headers && data.push(headers.join(';'));

  // Mapping function to reshape tags into a format that can be merged
  const timeMapper = (item: BaseTag) => {
    const itemName = item.name?.trim() || item.id.trim();
    return item.values.map((tagValue) => ({
      timestamp: tagValue.timestamp,
      [itemName]: tagValue.value
    }));
  };

  const stringTagData = stringTags.map(timeMapper);
  const numberTagData = numberTags?.map(timeMapper) || [];
  const stateTagData = states?.map(timeMapper) || [];

  // Mapper to combine the data into a single array of objects
  const combineMapper = (
    items: {
      [x: string]: string | number;
      timestamp: string;
    }[]
  ) => {
    const tagsByTimestamp: {
      [key: string]: {
        [key: string]: string | number;
        timestamp: string;
      };
    } = {};
    items.forEach((item) => {
      tagsByTimestamp[item.timestamp] = {
        ...tagsByTimestamp[item.timestamp],
        ...item
      };
    });
    return tagsByTimestamp;
  };

  const combinedData = [
    ...stringTagData.map(combineMapper),
    ...numberTagData.map(combineMapper),
    ...stateTagData.map(combineMapper)
  ];

  const mergedData: { [key: string]: string | number }[] = Object.values(
    merge({}, ...combinedData)
  );

  const sortedDataTags = orderBy(mergedData, ['timestamp'], ['asc']);

  /**
   * Store the last known value per column in a map,
   * we will use the map to populate a value for every tag each time
   * any tag has a value
   **/
  const lastKnownValueMap = new Map();

  columnNames.forEach((columnName) => {
    lastKnownValueMap.set(columnName, '');
  });

  const userLocale = navigator?.languages?.[0];

  let lastIndexWithUniqueValues = 0;

  sortedDataTags.forEach((sortedDataTag, i) => {
    let skipRow = true;

    // Check if there is a new value for any of the tags
    columnNames.forEach((columnName) => {
      let value = sortedDataTag[columnName];
      value = typeof value === 'number' ? value.toLocaleString(userLocale) : value;

      // Expicitly set empty string values to 'No Selection'
      value === '' && (value = NO_SELECTION);

      // check for a change in value
      const lastKnownValue = lastKnownValueMap.get(columnName);
      if (value !== undefined && lastKnownValue !== value) {
        skipRow = false;
      }
    });

    // If we did not find a new tag value, skip the row
    if (skipRow) {
      return;
    }

    let row: string[] = [];

    // Add the timestamp depending on format
    if (!showDatestamp) {
      row.push(sortedDataTag.timestamp as string);
    } else {
      row.push(formatDate(sortedDataTag.timestamp as string, 'long', timeZone, userLocale));
      row.push(
        formatDate(sortedDataTag.timestamp as string, 'hours-minutes-seconds', timeZone, userLocale)
      );
    }

    if (showDuration) {
      // Calculate the duration between the current row and the previous row (milliseconds)
      const duration = moment(
        i === sortedDataTags.length - 1 ? endTime : new Date(sortedDataTag.timestamp)
      ).diff(sortedDataTags[lastIndexWithUniqueValues]?.timestamp);

      // convert to hours:mins:secs
      const formattedDuration = formatDuration(duration, 'hours:mins:secs');

      row.push(formattedDuration);

      // We need to insert the duration into the previous row since we are looking ahead to get the duration
      // Skip the first row since there is no previous row
      // Skip the last row since we are using the end time
      if (i !== 0 && i !== sortedDataTags.length - 1) {
        const prevRow = data.pop();
        const split = prevRow?.split(';');
        const tableHeaders = data[0].split(';');
        const insertLocation = tableHeaders.indexOf('Duration'); // - 1 to account for separator;
        split?.splice(insertLocation, 1, formattedDuration);
        data.push((split || []).join(';'));
      }
    }
    // Update the last index with unique values
    lastIndexWithUniqueValues = i;

    row = [
      ...row,
      columnNames
        .map((columnName) => {
          let value = sortedDataTag[columnName];
          value = typeof value === 'number' ? value.toLocaleString(userLocale) : value;

          // Expicitly set empty string values to 'No selection'
          value === '' && (value = NO_SELECTION);

          // if there is a value store it in the map
          value && lastKnownValueMap.set(columnName, value);
          return lastKnownValueMap.get(columnName) || emptyValue;
        })
        .join(';')
    ];
    data.push(row.join(';'));
  });

  return data;
};

export const dataToCSV = (data: string[]): string[] => {
  // Define separator as ; this allows EU number formatting to work with Excel
  const csv: string[] = [];
  data.map((row: string, index: number) => {
    if (index === 0) csv.push(`"sep=;"\n`);
    csv.push(row + '\n');
  });
  return csv;
};
