// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { TFunction } from 'i18next';

// Components
import { ActionButton, Typography } from 'components';

// Types
import { ColumnConfig, SortState } from 'types';
import {
  LineStatus,
  MachineLineStatus,
  ProteinMachineStateCategoryName,
  SiteTableType
} from 'types/protein';
import { BusinessUnit, DSIKPIType, MachineStateNames, SiteTableDataType } from 'types/dsi';

// Routes
import { JBTRoutes } from 'constants/routes';

// constants
import { formatDate, getMachineStateCellColors } from 'helpers';
import {
  defaultCellColor,
  getCellColors,
  proteinMachineCategoryStatesToString
} from 'constants/proteinMachineCategoryStates';
import theme from 'themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

// Styling
const TableCell = styled.div`
  height: 3.625rem;
  display: flex;
  align-items: center;
`;

export const CustomHeader = styled.thead(({ theme }) => ({
  tr: {
    background: theme.colors.lightGrey1,
    th: {
      fontSize: '0.8125rem',
      fontWeight: 'bold',
      lineHeight: theme.typography.components.tableHeader.lineHeight,
      borderBottom: theme.colors.borders.border02.border,
      padding: '0.75rem',
      height: '3.625rem',
      ':first-child': {
        borderTopLeftRadius: '0.5rem'
      },
      ':last-child': {
        borderTopRightRadius: '0.5rem'
      }
    }
  }
}));

export const generateColumnConfigs = (
  tableType: SiteTableType,
  sortState: Record<string, SortState>,
  goto: (path: string) => void,
  t: TFunction<'mh'[], undefined>,
  tableDataType?: SiteTableDataType,
  businessUnit?: BusinessUnit
): ColumnConfig[] => {
  return tableType == 'MACHINE'
    ? machinesColumnConfigs(tableType, sortState, goto, t, tableDataType, businessUnit)
    : linesColumnConfigs(tableType, sortState, goto, t, tableDataType);
};

const commonColumnConfig = (
  tableType: SiteTableType,
  sortState: Record<string, SortState>,
  t: TFunction<'mh'[], undefined>,
  businessUnit?: BusinessUnit
): ColumnConfig[] => {
  return [
    {
      title: t('status') as string,
      dataIndex: 'status',
      key: 'status',
      sortState:
        tableType == 'MACHINE'
          ? Object.prototype.hasOwnProperty.call(sortState, 'status')
            ? sortState['status']
            : SortState.unsorted
          : undefined,
      render(value) {
        const state = value as ProteinMachineStateCategoryName;
        const { color, background } =
          businessUnit && businessUnit === BusinessUnit.DSI
            ? getMachineStateCellColors(value as MachineStateNames)
            : getCellColors[state] || defaultCellColor;
        return {
          props: { style: { color, background } },
          children: (
            <TableCell>
              {businessUnit && businessUnit === BusinessUnit.DSI
                ? state
                : proteinMachineCategoryStatesToString[state]}
            </TableCell>
          )
        };
      }
    },
    {
      title: t('alarms_current', { ns: 'mh' }) as string,
      dataIndex: 'numCurrentAlarms',
      key: 'numCurrentAlarms',
      sortState:
        tableType == 'MACHINE'
          ? Object.prototype.hasOwnProperty.call(sortState, 'numCurrentAlarms')
            ? sortState['numCurrentAlarms']
            : SortState.unsorted
          : undefined
    },
    {
      title: t('alarms_past_24h', { ns: 'mh' }) as string,
      dataIndex: 'numAlarmsOverPeriod',
      key: 'numAlarmsOverPeriod',
      sortState:
        tableType == 'MACHINE'
          ? Object.prototype.hasOwnProperty.call(sortState, 'numAlarmsOverPeriod')
            ? sortState['numAlarmsOverPeriod']
            : SortState.unsorted
          : undefined
    },
    {
      title: t('production_past_24h', { ns: 'mh' }) as string,
      dataIndex: 'productionOverPeriod',
      key: 'productionOverPeriod',
      sortState:
        tableType == 'MACHINE'
          ? Object.prototype.hasOwnProperty.call(sortState, 'productionOverPeriod')
            ? sortState['productionOverPeriod']
            : SortState.unsorted
          : undefined,
      render(value) {
        if (businessUnit && businessUnit === BusinessUnit.DSI) {
          value = (value as number) * 1000;
        }
        return formatDate(value as number, 'hours-minutes');
      }
    },
    {
      title: businessUnit
        ? (t('utilization_past_3days', { ns: 'mh' }) as string)
        : (t('utilization_past_24h', { ns: 'mh' }) as string),
      dataIndex: 'utilizationOverPeriod',
      key: 'utilizationOverPeriod',
      sortState:
        tableType == 'MACHINE'
          ? Object.prototype.hasOwnProperty.call(sortState, 'utilizationOverPeriod')
            ? sortState['utilizationOverPeriod']
            : SortState.unsorted
          : undefined,
      render(value) {
        return `${value}%`;
      }
    }
  ];
};

const columnConfigByDataType = (
  tableType: SiteTableType,
  sortState: Record<string, SortState>,
  t: TFunction<'mh'[], undefined>
): ColumnConfig[] => {
  const columnsMapper = [
    {
      title: <div className="groupHeader">{t('oee', { ns: 'mh' })}</div>,
      children: [
        {
          title: t('current_psu', { ns: 'mh' }),
          sortState: Object.prototype.hasOwnProperty.call(sortState, DSIKPIType.DsiCurrentKpi)
            ? sortState[DSIKPIType.DsiCurrentKpi]
            : SortState.unsorted,
          dataIndex: DSIKPIType.DsiCurrentKpi,
          key: DSIKPIType.DsiCurrentKpi,
          render(value: unknown) {
            return {
              sortState: Object.prototype.hasOwnProperty.call(sortState, DSIKPIType.DsiCurrentKpi)
                ? sortState[DSIKPIType.DsiCurrentKpi]
                : SortState.unsorted,
              props: {
                style: {
                  maxWidth: '2.5rem'
                }
              },
              children: (
                <TableCell>
                  <>{value}</>
                </TableCell>
              )
            };
          }
        },
        {
          title: (
            <>
              {t('oee', { ns: 'mh' })}
              <Typography size="0.8125rem" color={theme.colors.mediumGrey2} mb={0}>
                {t('current_prod_day', { ns: 'mh' })}
              </Typography>
            </>
          ),
          sortState: Object.prototype.hasOwnProperty.call(sortState, DSIKPIType.MachineInfoOEE)
            ? sortState[DSIKPIType.MachineInfoOEE]
            : SortState.unsorted,
          dataIndex: DSIKPIType.MachineInfoOEE,
          key: DSIKPIType.MachineInfoOEE,
          render(value: unknown) {
            return {
              props: {
                style: {
                  maxWidth: '5rem'
                }
              },
              children: (
                <TableCell>
                  <>{value}</>
                </TableCell>
              )
            };
          }
        }
      ]
    },
    {
      title: <div className="groupHeader">{t('quality', { ns: 'mh' })}</div>,
      children: [
        {
          title: (
            <>
              {t('yield', { ns: 'mh' })}
              <>{t('last_hr', { ns: 'mh' })}</>
            </>
          ),
          sortState: Object.prototype.hasOwnProperty.call(sortState, DSIKPIType.Yield)
            ? sortState[DSIKPIType.Yield]
            : SortState.unsorted,
          dataIndex: DSIKPIType.Yield,
          key: DSIKPIType.Yield,
          render(value: unknown) {
            return {
              props: {
                style: {
                  maxWidth: '2.5rem'
                }
              },
              children: (
                <TableCell>
                  <>{value}</>
                </TableCell>
              )
            };
          }
        },
        {
          title: (
            <>
              {t('percent_product_processed', { ns: 'mh' })}
              <>{t('last_hr', { ns: 'mh' })}</>
            </>
          ),
          sortState: Object.prototype.hasOwnProperty.call(sortState, DSIKPIType.ProductProcessed)
            ? sortState[DSIKPIType.ProductProcessed]
            : SortState.unsorted,
          dataIndex: DSIKPIType.ProductProcessed,
          key: DSIKPIType.ProductProcessed,
          render(value: unknown) {
            return {
              props: {
                style: {
                  maxWidth: '2.5rem'
                }
              },
              children: (
                <TableCell>
                  <>{value}</>
                </TableCell>
              )
            };
          }
        }
      ]
    },
    {
      title: <div className="groupHeader">{t('performance', { ns: 'mh' })}</div>,
      children: [
        {
          title: (
            <>
              {t('throughput', { ns: 'mh' })}
              <>{t('piece_count_last_hr', { ns: 'mh' })}</>
            </>
          ),
          sortState: Object.prototype.hasOwnProperty.call(
            sortState,
            DSIKPIType.ThroughputPieceCount
          )
            ? sortState[DSIKPIType.ThroughputPieceCount]
            : SortState.unsorted,
          dataIndex: DSIKPIType.ThroughputPieceCount,
          key: DSIKPIType.ThroughputPieceCount,
          render(value: unknown) {
            return {
              props: {
                style: {
                  maxWidth: '2.5rem'
                }
              },
              children: (
                <TableCell>
                  <>{value}</>
                </TableCell>
              )
            };
          }
        },
        {
          title: (
            <>
              {t('throughput', { ns: 'mh' })}
              <>{t('weight_last_hr', { ns: 'mh' })}</>
            </>
          ),
          sortState: Object.prototype.hasOwnProperty.call(sortState, DSIKPIType.ThroughputRate)
            ? sortState[DSIKPIType.ThroughputRate]
            : SortState.unsorted,
          dataIndex: DSIKPIType.ThroughputRate,
          key: DSIKPIType.ThroughputRate,
          render(value: unknown) {
            return {
              props: {
                style: {
                  maxWidth: '2.5rem'
                }
              },
              children: (
                <TableCell>
                  <>{value}</>
                </TableCell>
              )
            };
          }
        },
        {
          title: (
            <>
              {t('output', { ns: 'mh' })}
              <>{t('current_prod_day', { ns: 'mh' })}</>
            </>
          ),
          sortState: Object.prototype.hasOwnProperty.call(sortState, DSIKPIType.OutputWeight)
            ? sortState[DSIKPIType.OutputWeight]
            : SortState.unsorted,
          dataIndex: DSIKPIType.OutputWeight,
          key: DSIKPIType.OutputWeight,
          render(value: unknown) {
            return {
              props: {
                style: {
                  maxWidth: '5rem'
                }
              },
              children: (
                <TableCell>
                  <>{value}</>
                </TableCell>
              )
            };
          }
        }
      ]
    },
    {
      title: <div className="groupHeader">{t('availability', { ns: 'mh' })}</div>,
      children: [
        {
          title: <>{t('current_machine_state', { ns: 'mh' })}</>,
          sortState: Object.prototype.hasOwnProperty.call(sortState, 'status')
            ? sortState['status']
            : SortState.unsorted,
          dataIndex: 'status',
          key: 'status',
          render(value: unknown) {
            const { color, background } = getMachineStateCellColors(value as MachineStateNames);
            return {
              props: { style: { color, background }, maxWidth: '2.5rem' },
              children: (
                <TableCell>
                  <>{value}</>
                </TableCell>
              )
            };
          }
        },
        {
          title: (
            <>
              {t('utilization', { ns: 'mh' })}
              <>{t('last_3_days', { ns: 'mh' })}</>
            </>
          ),
          sortState: Object.prototype.hasOwnProperty.call(sortState, 'utilizationOverPeriod')
            ? sortState['utilizationOverPeriod']
            : SortState.unsorted,
          dataIndex: 'utilizationOverPeriod',
          key: 'utilizationOverPeriod',
          render(value: unknown) {
            return {
              props: {
                style: {
                  maxWidth: '2.5rem'
                }
              },
              children: (
                <TableCell>
                  <>{value}%</>
                </TableCell>
              )
            };
          }
        }
      ]
    }
  ];
  return columnsMapper;
};

const machinesColumnConfigs = (
  tableType: SiteTableType,
  sortState: Record<string, SortState>,
  goto: (path: string) => void,
  t: TFunction<'mh'[], undefined>,
  tableDataType?: SiteTableDataType,
  businessUnit?: BusinessUnit
): ColumnConfig[] => {
  const machineColumn: ColumnConfig = {
    title: t('machines') as string,
    dataIndex: 'description',
    key: 'description',
    sortState: Object.prototype.hasOwnProperty.call(sortState, 'description')
      ? sortState['description']
      : SortState.unsorted,
    render(value, record) {
      const machineId = (record as Record<string, unknown>)['id'] as string;
      return (
        <TableCell>
          <ActionButton
            hideArrow={true}
            icon={
              tableDataType && (
                <FontAwesomeIcon
                  style={{
                    marginLeft: '0.125rem',
                    paddingLeft: '0.625rem',
                    marginTop: '0.1875rem'
                  }}
                  icon={faAngleRight}
                  color={theme.colors.darkGrey}
                />
              )
            }
            style={{ justifyContent: 'center' }}
            onClick={() => goto(JBTRoutes.machine.replace(':machineId', machineId))}
          >
            {value}
          </ActionButton>
        </TableCell>
      );
    }
  };
  const line = {
    title: t('line'),
    dataIndex: 'lineName',
    key: 'line'
  };
  const configType = {
    title: t('configuration_type', { ns: 'mh' }),
    dataIndex: 'configurationType',
    key: 'configurationType'
  };

  const columns = tableDataType
    ? columnConfigByDataType(tableType, sortState, t)
    : commonColumnConfig(tableType, sortState, t, businessUnit);

  if (!tableDataType) {
    // Keep columns ordered as shown in the design
    columns.splice(3, 0, line);
    columns.splice(3, 0, configType);
  }

  return tableDataType && tableDataType !== SiteTableDataType.OEE
    ? columns
    : [machineColumn, ...columns];
};

const linesColumnConfigs = (
  tableType: SiteTableType,
  sortState: Record<string, SortState>,
  goto: (path: string) => void,
  t: TFunction<'mh'[], undefined>,
  tableDataType?: SiteTableDataType
): ColumnConfig[] => {
  const linesColumn: ColumnConfig = {
    title: t('lines') as string,
    dataIndex: 'name',
    key: 'name',
    sortState: Object.prototype.hasOwnProperty.call(sortState, 'name')
      ? sortState['name']
      : SortState.unsorted,
    render(value, record) {
      const lineId = (record as Record<string, unknown>)['id'] as string;
      return (
        <TableCell>
          <ActionButton
            hideArrow={true}
            style={{ justifyContent: 'center' }}
            onClick={() => goto(JBTRoutes.line.replace(':lineId', lineId))}
          >
            {value}
          </ActionButton>
        </TableCell>
      );
    }
  };
  const columns = tableDataType
    ? columnConfigByDataType(tableType, sortState, t)
    : commonColumnConfig(tableType, sortState, t);
  return [linesColumn, ...columns];
};

export const addKeyProp = (
  data: (LineStatus | MachineLineStatus)[],
  type: SiteTableType
): (LineStatus | MachineLineStatus)[] =>
  data.map((d, i) => {
    return { ...d, key: `${type}-${i}` };
  });
