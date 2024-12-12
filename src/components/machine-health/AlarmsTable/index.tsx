// 3rd party libs
import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { BaseTable } from 'components';

// Types
import { SortClickHandler, SortState } from 'types';
import { Alarm, DSIAlarm } from 'types/machine-health/alarms';

// Hooks
import { ColumnConfgurationProps, generateTableColumns } from './utils';
import { useFilterSelected } from 'components/StyledUi/FilterSelected';
import { getSortedData } from 'helpers';

export interface AlarmTableRow extends Alarm {
  key: string;
  duration: string;
  startDate: string;
  isActive?: boolean;
}

interface Props {
  data?: Array<Alarm | DSIAlarm>;
  isLoading?: boolean;
  // Setting scrollheight sets a fixed height and enables vertical scrolling
  scrollHeight?: number;
  rowIcon?: 'arrow'; // TODO: There will be more icon types in future
  onIconClick?: () => void;
  hideAreaColumn?: boolean;
  tableColumnConfiguration?: ColumnConfgurationProps;
  className?: string;
  dataColumns?: (string | number)[];
}

// const IconButton = styled.button`
//   border: none;
//   background: transparent;
//   cursor: pointer;
//   width: 2.75rem;
//   height: 2.75rem;
// `;

const BodyRowContainer = styled.tr<{ isActive: boolean }>`
  background-color: ${(props) => {
    if (props.isActive) {
      return props.theme.colors.table.active;
    }

    return 'transparent';
  }} !important; // !important needed to override BaseTable alternatingRowColoring styling
`;

// TODO: dynamicly generate defaut Sort.
// Instantiate sort state outside of the component
// otherwise we get an infinite loop in the useSort hook
// because the object is a different instance each time
const defaultSortState: Record<string, SortState> = {
  duration: SortState.unsorted,
  id: SortState.unsorted,
  location: SortState.unsorted,
  startDate: SortState.unsorted,
  text: SortState.unsorted,
  type: SortState.unsorted
};

// Generate the configurations for each column of this table
// const generateColumnConfigs = (
//   button: React.ReactNode,
//   sortState: Record<string, SortState>,
//   t: TFunction<'mh'[], undefined>,
//   hideAreaColumn?: boolean
// ): ColumnConfig[] => {
//   const columns = [
//     {
//       title: t('start_date') as string,
//       dataIndex: 'startDate',
//       key: 'startDate',
//       sortState: Object.prototype.hasOwnProperty.call(sortState, 'startDate')
//         ? sortState['startDate']
//         : SortState.unsorted
//     },
//     {
//       title: t('duration') as string,
//       dataIndex: 'duration',
//       key: 'duration',
//       sortState: Object.prototype.hasOwnProperty.call(sortState, 'duration')
//         ? sortState['duration']
//         : SortState.unsorted
//     },
//     {
//       title: t('text') as string,
//       dataIndex: 'description',
//       key: 'description',
//       sortState: Object.prototype.hasOwnProperty.call(sortState, 'description')
//         ? sortState['description']
//         : SortState.unsorted
//     },
//     {
//       title: t('id', { ns: 'common' }) as string,
//       dataIndex: 'code',
//       key: 'code',
//       sortState: Object.prototype.hasOwnProperty.call(sortState, 'code')
//         ? sortState['code']
//         : SortState.unsorted
//     },
//     {
//       title: t('type') as string,
//       dataIndex: 'type',
//       key: 'type',
//       sortState: Object.prototype.hasOwnProperty.call(sortState, 'type')
//         ? sortState['type']
//         : SortState.unsorted
//     },
//     ...(button
//       ? [
//           {
//             title: '',
//             dataIndex: 'button',
//             key: 'button',
//             render() {
//               return {
//                 props: {
//                   // Remove padding to allow larger hit target area for button
//                   style: { padding: 0 }
//                 },
//                 children: button
//               };
//             }
//           }
//         ]
//       : [])
//   ];

//   if (!hideAreaColumn) {
//     columns.splice(3, 0, {
//       title: t('area') as string,
//       dataIndex: 'location',
//       key: 'location',
//       sortState: Object.prototype.hasOwnProperty.call(sortState, 'location')
//         ? sortState['location']
//         : SortState.unsorted
//     });
//   }

//   return columns;
// };

const AlarmsTable = ({
  data,
  isLoading,
  scrollHeight,
  // rowIcon,
  // onIconClick,
  // hideAreaColumn,
  tableColumnConfiguration,
  className,
  dataColumns
}: Props): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh']);

  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);
  const [selected] = useFilterSelected();
  const [tableData, setTableData] = useState(data || []);

  useEffect(() => {
    if (tableData?.length) {
      setTableData(getSortedData(sortState, tableData) as unknown as Array<Alarm | DSIAlarm>);
    }
  }, [sortState]);

  useEffect(() => {
    if (data?.length === 0) return;
    if (selected === undefined || Object.keys(selected).length === 0) {
      setTableData(data || []);
      return;
    }
    const selectedKeys = Object.keys(selected);
    const selectedData = data?.filter((item) => {
      const filtered = selectedKeys.filter((key) => {
        if (item[key] != 'undefined' || item[key] != null) {
          const itemKeyValue = item[key];
          const selectedValues = selected[key];
          // @ts-expect-error: ignore this error
          return selectedValues.indexOf(itemKeyValue) > -1 ? true : false;
        }
      });
      return filtered.length > 0 ? true : false;
    });
    if (selectedData?.length) {
      setTableData(selectedData);
    }
  }, [selected]);

  // Interaction handler functions
  const sortHandler: SortClickHandler = (key, currentSortState) => {
    const newSortState = {
      ...defaultSortState,
      [key]:
        currentSortState === SortState.ascending
          ? SortState.descending
          : currentSortState === SortState.descending
          ? SortState.unsorted
          : SortState.ascending
    };
    setSortState(newSortState);
  };

  //const icon = rowIcon === 'arrow' ? <FontAwesomeIcon icon={faArrowRight} /> : null;
  //const button = icon && onIconClick && <IconButton onClick={onIconClick}>{icon}</IconButton>;

  const generatedColumns = generateTableColumns(
    tableColumnConfiguration,
    dataColumns,
    sortState,
    t
  );
  //const oldVersion = generateColumnConfigs(button, sortState, t, hideAreaColumn);

  return (
    <BaseTable
      className={className}
      columnConfigs={generatedColumns}
      alternatingRowColoring={false}
      data={tableData}
      borderBottomRow
      isDataLoading={isLoading}
      scroll={scrollHeight ? { y: scrollHeight } : {}}
      outerBorderColor={theme.colors.mediumGrey1}
      bodyRowComponent={BodyRowContainer}
      onRow={(record) => {
        //if record has startTimestamp then it is not a DSI alarm and we can apply colored rows
        const time = Object.prototype.hasOwnProperty.call(record, 'startTimestamp');
        return {
          isActive: time ? !record['endTimestamp'] : false
        } as React.HTMLAttributes<AlarmTableRow>;
      }}
      sortHandler={sortHandler}
    />
  );
};

export default AlarmsTable;
