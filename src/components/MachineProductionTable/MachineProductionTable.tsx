// 3rd party libs
import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
// Lodash
import { isNil, round } from 'lodash';

// Types
import { ColumnConfig, SortClickHandler, SortState } from 'types';
import { MachineHealthKpiStatus, MachineHealthProductionData } from 'types/machine-health';

// Helpers
import { formatDate, getCellColor } from 'helpers';

// Components
import { BaseTable, ActionButton } from 'components';

interface MachineProductionTableProps {
  data: MachineHealthProductionData[];
  kpiUom?: Record<string, string>;
  sortHandler: SortClickHandler;
  sortState: Record<string, SortState>;
  onItemClick: (id: string) => void;
  machineColumnTitle: string;
  isPascal: boolean | undefined;
  disableDetailAction?: boolean;
}

interface ChildrenCellProps {
  value: string | number | boolean | JSX.Element;
  label: string;
}

const TableCell = styled.div`
  height: 3.625rem;
  display: flex;
  align-items: center;
`;

const CustomHeader = styled.thead`
  tr {
    background-color: ${(props) => props.theme.colors.background.background7};

    th {
      font-size: ${(props) => props.theme.typography.components.tableHeader.size};
      font-weight: ${(props) => props.theme.typography.components.tableHeader.weight};
      line-height: ${(props) => props.theme.typography.components.tableHeader.lineHeight};
      border-bottom: ${(props) => props.theme.colors.borders.border02.border};
      border-top: none;
      padding: 0.75rem;
      height: 3.625rem;
    }
  }
`;

const getChildrenCell = ({ value, label }: ChildrenCellProps): JSX.Element => {
  return (
    <TableCell>
      {isNil(value) || value === '' ? (
        '–'
      ) : (
        <>
          {typeof value === 'number' ? round(value, 1) : value}
          <br />
          {label}
        </>
      )}
    </TableCell>
  );
};

const generateColumnConfigsProduction = (
  sortState: Record<string, SortState>,
  onItemClick: (id: string) => void,
  machineColumnTitle: string,
  kpiUom?: Record<string, string>,
  disableDetailAction?: boolean,
  isPascal?: boolean
): ColumnConfig[] => {
  return isPascal
    ? [
        {
          title: machineColumnTitle,
          dataIndex: 'machine',
          key: 'machine',
          width: '11.875rem',
          sortState: Object.prototype.hasOwnProperty.call(sortState, 'machine')
            ? sortState['machine']
            : SortState.unsorted,
          render(value, data) {
            return (
              <TableCell>
                <ActionButton
                  // TODO - remove disabled once data for modal is available
                  disabled={disableDetailAction}
                  onClick={() => {
                    onItemClick(`${(data as MachineHealthProductionData).id}`);
                  }}
                >
                  {value}
                </ActionButton>
              </TableCell>
            );
          }
        },
        {
          title: 'Processed Cycles',
          subtitle: kpiUom ? kpiUom['cyclecountMachineHour'] : 'Avg. cycles / hr',
          colSpan: 2,
          dataIndex: 'successfulCyclesActual',
          key: 'successfulCyclesActual',
          width: '5rem',
          render(value, data) {
            const condition: MachineHealthKpiStatus = (data as MachineHealthProductionData)
              ?.successfulCyclesStatus;
            return {
              props: {
                style: {
                  ...getCellColor(condition),
                  textAlign: 'center'
                }
              },
              children: getChildrenCell({ value, label: 'Actual' })
            };
          }
        },
        {
          title: '',
          colSpan: 0,
          dataIndex: 'successfulCyclesTarget',
          key: 'successfulCyclesTarget',
          width: '5rem',
          render(value) {
            return {
              props: {
                style: {
                  textAlign: 'center'
                }
              },
              children: getChildrenCell({ value, label: 'Target' })
            };
          }
        },
        {
          title: 'Wait Time',
          subtitle: kpiUom ? kpiUom['waitTimeMachineHour'] : 'min. / cycle',
          dataIndex: 'waitTime',
          key: 'waitTime',
          width: '6.25rem',
          sortState: Object.prototype.hasOwnProperty.call(sortState, 'waitTime')
            ? sortState['waitTime']
            : SortState.unsorted,
          render(value, data) {
            const waitTime = moment.duration((data as MachineHealthProductionData)?.waitTime);
            const condition: MachineHealthKpiStatus = (data as MachineHealthProductionData)
              ?.waitTimeStatus;
            return {
              props: {
                style: {
                  ...getCellColor(condition)
                }
              },
              children: (
                <TableCell>
                  {waitTime.isValid() ? formatDate(waitTime.asMilliseconds(), 'time-elapsed') : '–'}
                </TableCell>
              )
            };
          }
        },
        {
          title: 'Re-processed Cycles',
          subtitle: 'Total in last hour',
          dataIndex: 'failCycles',
          key: 'failCycles',
          width: '9.5rem',
          sortState: Object.prototype.hasOwnProperty.call(sortState, 'failCycles')
            ? sortState['failCycles']
            : SortState.unsorted,
          render(value, data) {
            const condition: MachineHealthKpiStatus = (data as MachineHealthProductionData)
              ?.failCyclesStatus;
            return {
              props: {
                style: {
                  ...getCellColor(condition)
                }
              },
              children: <TableCell>{value ? value : '–'}</TableCell>
            };
          }
        }
      ]
    : [
        {
          title: machineColumnTitle,
          dataIndex: 'machine',
          key: 'machine',
          width: '11.875rem',
          sortState: Object.prototype.hasOwnProperty.call(sortState, 'machine')
            ? sortState['machine']
            : SortState.unsorted,
          render(value, data) {
            return (
              <TableCell>
                <ActionButton
                  // TODO - remove disabled once data for modal is available
                  disabled={disableDetailAction}
                  onClick={() => {
                    onItemClick(`${(data as MachineHealthProductionData).id}`);
                  }}
                >
                  {value}
                </ActionButton>
              </TableCell>
            );
          }
        },
        // TODO: Integrate with real data after Alpha release
        // {
        //   title: 'OEE',
        //   dataIndex: 'oee',
        //   key: 'oee',
        //   width: '6.25rem',
        //   render(value) {
        //     let body: React.ReactNode = '–';
        //     if (value && typeof value === 'number') {
        //       body = round(value, 1);
        //     } else if (value === 0 || value) {
        //       body = value;
        //     }
        //     return <TableCell>{body}</TableCell>;
        //   }
        // },
        {
          title: 'Processed Cycles',
          subtitle: kpiUom ? kpiUom['cyclecountMachineHour'] : 'Avg. cycles / hr',
          colSpan: 2,
          dataIndex: 'successfulCyclesActual',
          key: 'successfulCyclesActual',
          width: '5rem',
          render(value, data) {
            const condition: MachineHealthKpiStatus = (data as MachineHealthProductionData)
              ?.successfulCyclesStatus;
            return {
              props: {
                style: {
                  ...getCellColor(condition),
                  textAlign: 'center'
                }
              },
              children: getChildrenCell({ value, label: 'Actual' })
            };
          }
        },
        {
          title: '',
          colSpan: 0,
          dataIndex: 'successfulCyclesTarget',
          key: 'successfulCyclesTarget',
          width: '5rem',
          render(value) {
            return {
              props: {
                style: {
                  textAlign: 'center'
                }
              },
              children: getChildrenCell({ value, label: 'Target' })
            };
          }
        },
        {
          title: 'Weight',
          subtitle: 'Avg. ' + (kpiUom ? kpiUom['weightMachineHour'] : 'lbs / cycle'),
          colSpan: 2,
          dataIndex: 'weightActual',
          key: 'weightActual',
          width: '5rem',
          render(value) {
            return {
              props: {
                style: {
                  textAlign: 'center'
                }
              },
              children: getChildrenCell({ value, label: 'Actual' })
            };
          }
        },
        {
          title: '',
          colSpan: 0,
          dataIndex: 'weightTarget',
          key: 'weightTarget',
          width: '5rem',
          render(value) {
            return {
              props: {
                style: {
                  textAlign: 'center'
                }
              },
              children: getChildrenCell({ value, label: 'Target' })
            };
          }
        },
        {
          title: 'Avg. Wait Time',
          subtitle: kpiUom ? kpiUom['waitTimeMachineHour'] : 'min',
          dataIndex: 'waitTime',
          key: 'waitTime',
          width: '6.25rem',
          sortState: Object.prototype.hasOwnProperty.call(sortState, 'waitTime')
            ? sortState['waitTime']
            : SortState.unsorted,
          render(value, data) {
            const waitTime = moment.duration((data as MachineHealthProductionData)?.waitTime);
            const condition: MachineHealthKpiStatus = (data as MachineHealthProductionData)
              ?.waitTimeStatus;
            return {
              props: {
                style: {
                  ...getCellColor(condition)
                }
              },
              children: (
                <TableCell>
                  {waitTime.isValid() ? formatDate(waitTime.asMilliseconds(), 'time-elapsed') : '–'}
                </TableCell>
              )
            };
          }
        },
        {
          title: 'Re-processed Cycles',
          subtitle: 'Total in last hour',
          dataIndex: 'failCycles',
          key: 'failCycles',
          width: '9.5rem',
          sortState: Object.prototype.hasOwnProperty.call(sortState, 'failCycles')
            ? sortState['failCycles']
            : SortState.unsorted,
          render(value, data) {
            const condition: MachineHealthKpiStatus = (data as MachineHealthProductionData)
              ?.failCyclesStatus;
            return {
              props: {
                style: {
                  ...getCellColor(condition)
                }
              },
              children: <TableCell>{value ? value : '–'}</TableCell>
            };
          }
        }
      ];
};

/**
 * Unlike other table components, the MachineProductionTable does not contain internal
 * sort state, as this is controlled from its parent.
 */
const MachineProductionTable = ({
  data,
  kpiUom,
  sortHandler,
  sortState,
  onItemClick,
  machineColumnTitle,
  isPascal,
  disableDetailAction
}: MachineProductionTableProps): JSX.Element => {
  return (
    <BaseTable
      columnConfigs={generateColumnConfigsProduction(
        sortState,
        onItemClick,
        machineColumnTitle,
        kpiUom,
        disableDetailAction,
        isPascal
      )}
      data={data}
      sortHandler={sortHandler}
      isDataLoading={false}
      customHeader={CustomHeader}
      borderBottomRow={true}
    />
  );
};

export default MachineProductionTable;
