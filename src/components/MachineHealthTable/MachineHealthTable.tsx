// 3rd party
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';

// Components
import {
  ActionButton,
  BaseTable
  // IconCell,
  // Typography
} from 'components';

// Constants
import { MachineHealthKpiOptionsText } from 'constants/machineHealthKpis';

// Types
import { ColumnConfig, SortClickHandler, SortState, BaseType } from 'types';
import {
  MachineHealthItem,
  MachineHealthItemWithKey,
  MachineHealthKpiStatus
} from 'types/machine-health';

// Custom hooks
import { useSort } from 'hooks';

import theme from 'themes';

/* Interfaces used for styling and local objects */
interface MachineHealthTableProps {
  data: MachineHealthItem[];
  isDataLoading?: boolean;
  onItemClick: (id: string) => void;
}
/* End interfaces */

const Root = styled.div`
  width: 100%;
  height: auto;
`;

const TableCell = styled.div`
  margin: -0.0625rem -0.5rem;
  height: 3.625rem;
  display: flex;
  align-items: center;
  height: 100%;
`;

const TableCellKpi = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.125rem;
  letter-spacing: 0em;
  text-align: center;
  color: ${theme.colors.darkGrey};
`;

const TableCellColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TableCellRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const TableCellRowLabel = styled.div`
  text-align: center;
  padding: 0.40625rem 1rem;
  width: 100%;
  min-width: 9rem;
  height: 1.5625rem;
`;

const TableCellKpiValue = styled.div`
  padding: 0.40625rem 1rem;
  text-align: center;
  width: 50%;
  min-height: 2.0625rem;
`;

const TableCellKpiSingleValue = styled.div`
  padding: 0.40625rem 1rem;
  text-align: center;
  width: 100%;
  min-height: 2.0625rem;
`;

const CustomHeader = styled.thead`
  tr {
    th {
      background-color: ${theme.colors.background.background2};
      font-size: ${theme.typography.components.tableHeader.size};
      font-weight: ${theme.typography.components.tableHeader.weight};
      line-height: ${theme.typography.components.tableHeader.lineHeight};
      border-bottom: ${theme.colors.borders.border02.border};
      border-top: none;
    }
    th:first-child {
      border-top-left-radius: 0.5rem;
    }
    th:last-child {
      border-top-right-radius: 0.5rem;
    }
  }
`;

/* End styling */

/* Helper functions */

/* Format Kpi Cells */
const getCellColor = (condition: MachineHealthKpiStatus) => {
  const cellColor = {
    background: 'inherit',
    color: 'inherit'
  };
  switch (condition) {
    case MachineHealthKpiStatus.Good:
      cellColor.background = theme.colors.onTrackGreen4;
      break;
    case MachineHealthKpiStatus.Running:
      cellColor.background = theme.colors.onTrackGreen4;
      break;
    case MachineHealthKpiStatus.Warning:
      cellColor.background = theme.colors.atRiskYellow4;
      cellColor.color = theme.colors.richGold;
      break;
    // For now, Disabled should show the same as Bad
    case MachineHealthKpiStatus.Bad:
    case MachineHealthKpiStatus.Disabled:
      cellColor.background = theme.colors.negativeRed4;
      cellColor.color = theme.colors.darkRed;
      break;
    case MachineHealthKpiStatus.NA:
    default:
      break;
  }
  return cellColor;
};

/* For kpi with 2 values, it will choose the worse status
 * this will be used to color the cell
 */
const getOneCondition = (
  condition1: MachineHealthKpiStatus,
  condition2: MachineHealthKpiStatus
): MachineHealthKpiStatus => {
  let oneCondition = MachineHealthKpiStatus.NA;
  if (condition1 === MachineHealthKpiStatus.Good || condition2 === MachineHealthKpiStatus.Good) {
    oneCondition = MachineHealthKpiStatus.Good;
  }
  if (
    condition1 === MachineHealthKpiStatus.Running ||
    condition2 === MachineHealthKpiStatus.Running
  ) {
    oneCondition = MachineHealthKpiStatus.Running;
  }
  if (
    condition1 === MachineHealthKpiStatus.Warning ||
    condition2 === MachineHealthKpiStatus.Warning
  ) {
    oneCondition = MachineHealthKpiStatus.Warning;
  }
  if (condition1 === MachineHealthKpiStatus.Bad || condition2 === MachineHealthKpiStatus.Bad) {
    oneCondition = MachineHealthKpiStatus.Bad;
  }
  return oneCondition;
};

/**
 * TODO - Implement all label options
 * Label options:
 * Pressure (Pa)
 * Temp (ºF)
 * Check valve temp
 * strokes/min
 * strokes/cycle
 * Motor current
 * Motor speed
 */

const KpiLabels = {
  CheckValve: 'Check valve temp',
  StrokeRate: 'strokes/min',
  DecompValveTemperature: 'Temp (ºF)',
  PressureVessel: 'Pressure (Pa)',
  MotorCurrent: 'Motor current',
  MotorSpeed: 'Motor speed'
};

const getKpiLabel = (name: string): string => {
  if (name.includes(MachineHealthKpiOptionsText.CheckValve)) {
    return KpiLabels.CheckValve;
  } else if (name.includes(MachineHealthKpiOptionsText.StrokeRate)) {
    return KpiLabels.StrokeRate;
  } else if (name.includes(MachineHealthKpiOptionsText.DecompValveTemperature)) {
    return KpiLabels.DecompValveTemperature;
  } else if (name.includes(MachineHealthKpiOptionsText.PressureVessel)) {
    return KpiLabels.PressureVessel;
  } else if (name.includes(MachineHealthKpiOptionsText.MotorCurrent)) {
    return KpiLabels.MotorCurrent;
  } else if (name.includes(MachineHealthKpiOptionsText.MotorSpeed)) {
    return KpiLabels.MotorSpeed;
  } else {
    return '';
  }
};

const checkIsNaN = (input: string): string => {
  return Number.parseFloat(input).toFixed(2) === 'NaN' ? '-' : Number.parseFloat(input).toFixed(2);
};

const renderKPI = (datas: MachineHealthItem, index: number) => {
  const { data } = datas;
  const keys = Object.keys(data);
  const kpi = data?.[keys[index]];
  if (kpi && kpi.length % 2 === 0) {
    const condition: MachineHealthKpiStatus =
      kpi?.[0]?.threshold?.status.toLocaleLowerCase() as MachineHealthKpiStatus;
    const condition2: MachineHealthKpiStatus =
      kpi?.[1]?.threshold?.status.toLocaleLowerCase() as MachineHealthKpiStatus;
    return {
      props: {
        style: {
          padding: 0
        }
      },
      children: (
        <TableCellKpi>
          <TableCellColumn>
            <TableCellRow>
              <TableCellKpiValue style={{ ...getCellColor(condition) }}>
                {checkIsNaN(kpi?.[0]?.values.actual as string)}
              </TableCellKpiValue>
              <TableCellKpiValue style={{ ...getCellColor(condition2) }}>
                {checkIsNaN(kpi?.[1]?.values.actual as string)}
              </TableCellKpiValue>
            </TableCellRow>
            <TableCellRowLabel style={{ ...getCellColor(getOneCondition(condition, condition2)) }}>
              {getKpiLabel(keys[index])}
            </TableCellRowLabel>
          </TableCellColumn>
        </TableCellKpi>
      )
    };
  } else {
    if (kpi?.[0]?.kpi) {
      const condition: MachineHealthKpiStatus =
        kpi?.[0]?.threshold?.status.toLocaleLowerCase() as MachineHealthKpiStatus;
      return {
        props: {
          style: {
            padding: 0,
            ...{ ...getCellColor(condition) }
          }
        },
        children: (
          <TableCellKpi>
            <TableCellColumn>
              <TableCellRow>
                <TableCellKpiSingleValue>
                  {checkIsNaN(kpi?.[0]?.values.actual as string)}
                </TableCellKpiSingleValue>
              </TableCellRow>
              <TableCellRowLabel>{getKpiLabel(keys[index])}</TableCellRowLabel>
            </TableCellColumn>
          </TableCellKpi>
        )
      };
    } else {
      return {
        children: <TableCell></TableCell>
      };
    }
  }
};

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  sortState: Record<string, SortState>,
  onItemClick: (id: string) => void
): ColumnConfig[] => {
  return [
    {
      title: 'Sub-component',
      dataIndex: 'component',
      key: 'component',
      width: '10.1875rem',
      fixed: true,
      // TODO: Integrate with real data after Alpha release
      // sortState: Object.prototype.hasOwnProperty.call(sortState, 'component')
      //   ? sortState['component']
      //   : SortState.unsorted,
      render(value, data, index) {
        return {
          props: {
            style: {
              // Fix to hide content behind the cell
              backgroundColor:
                (index as number) % 2 == 0 ? theme.colors.background.background1 : 'inherit'
            }
          },
          children: (
            <TableCell>
              <ActionButton
                // TODO - Make click work and remove disabled once modal data available
                disabled
                onClick={() => {
                  onItemClick(`${(data as MachineHealthItem).id}`);
                }}
              >
                {value}
              </ActionButton>
            </TableCell>
          )
        };
      }
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: '5.5625rem',
      // TODO: Integrate with real data after Alpha release
      // sortState: Object.prototype.hasOwnProperty.call(sortState, 'state')
      //   ? sortState['state']
      //   : SortState.unsorted,
      render(_, data) {
        const { state } = data as MachineHealthItem;
        return {
          props: {
            style: getCellColor(state.value.toLowerCase() as MachineHealthKpiStatus)
          },
          children: <TableCell>{state.displayName}</TableCell>
        };
      }
    },
    // TODO: Integrate with real data after Alpha release
    // {
    //   title: 'Action Needed',
    //   dataIndex: 'actionNeeded',
    //   key: 'actionNeeded',
    //   width: '8.0625rem',
    //   render(_, data) {
    //     const { actionNeeded } = data as MachineHealthItem;
    //     let background = 'inherit';
    //     let color = 'inherit';
    //     let fontWeight;
    //     let label = '-';

    //     if (actionNeeded === 'preventative-maintenance') {
    //       background = theme.colors.atRiskYellow4;
    //       color = theme.colors.atRiskYellow;
    //       label = 'Preventative Maintenance';
    //       fontWeight = 'bold';
    //     } else if (actionNeeded === 'urgent-maintenance') {
    //       background = theme.colors.negativeRed4;
    //       color = theme.colors.negativeRed;
    //       fontWeight = 'bold';
    //       label = 'Urgent Maintenance';
    //     } else {
    //       label = '-';
    //     }

    //     return {
    //       props: {
    //         style: {
    //           background,
    //           color,
    //           fontWeight
    //         }
    //       },
    //       children: <TableCell>{label}</TableCell>
    //     };
    //   }
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: '6.25rem',
    //   render(_, data) {
    //     const { status } = data as MachineHealthItem;
    //     const cell = <IconCell icon='create' text='Create' subText={<Typography mb={0}>{}</Typography>} />
    //     if (status) {
    //       return {
    //         children: <TableCell>{status}</TableCell>
    //       };
    //     } else {
    //       return {
    //         children: <TableCell>{cell}</TableCell>
    //       };
    //     }
    //   }
    // },
    {
      title: 'KPI 1',
      dataIndex: 'kpi1',
      key: 'kpi1',
      width: '8.5625rem',
      render(_, datas) {
        return renderKPI(datas as MachineHealthItem, 0);
      }
    },
    {
      title: 'KPI 2',
      dataIndex: 'kpi2',
      key: 'kpi2',
      width: '8.5625rem',
      render(_, datas) {
        return renderKPI(datas as MachineHealthItem, 1);
      }
    },
    {
      title: 'KPI 3',
      dataIndex: 'kpi3',
      key: 'kpi3',
      width: '8.5625rem',
      render(_, datas) {
        return renderKPI(datas as MachineHealthItem, 2);
      }
    },
    {
      title: 'KPI 4',
      dataIndex: 'kpi4',
      key: 'kpi4',
      width: '8.5625rem',
      render(_, datas) {
        return renderKPI(datas as MachineHealthItem, 3);
      }
    },
    {
      title: 'KPI 5',
      dataIndex: 'kpi5',
      key: 'kpi5',
      width: '8.5625rem',
      render(_, datas) {
        return renderKPI(datas as MachineHealthItem, 4);
      }
    }
  ];
};

const addKeysToData = (
  keyPrefix: string,
  data: MachineHealthItem[]
): MachineHealthItemWithKey[] => {
  return data.map((item) => {
    return {
      ...item,
      key: `${keyPrefix}-${item.sku}`
    };
  });
};

/* End helper functions */

/* Initial states for sorting and filtering */
const defaultSortState: Record<string, SortState> = {
  component: SortState.unsorted,
  status: SortState.unsorted
};

/* End initial states */

const MachineHealthTable = ({
  data,
  isDataLoading,
  onItemClick
}: MachineHealthTableProps): ReactElement => {
  const keyPrefix = 'm-health';
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);
  const sortedData = useSort<MachineHealthItem>(sortState, data);
  const dataWithKeys: MachineHealthItemWithKey[] = addKeysToData(keyPrefix, sortedData);

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

  return (
    <Root>
      <BaseTable
        columnConfigs={generateColumnConfigs(sortState, onItemClick)}
        alternatingRowColoring={true}
        data={dataWithKeys}
        sortHandler={sortHandler}
        isDataLoading={isDataLoading}
        rowKey={(record: BaseType, index?: number) =>
          `${(record as MachineHealthItemWithKey).id}-${index}`
        }
        borderBottomRow
        customHeader={CustomHeader}
      />
    </Root>
  );
};

export default MachineHealthTable;
