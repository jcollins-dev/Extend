// 3rd party
import React, { ReactElement, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BaseTable, ActionButton, Typography } from 'components';
import { Cell } from 'components/KPICard/CardComponents';

// Types
import { ColumnConfig } from 'types';
import { CleaningStepWithKPI, CleaningStepStatus } from 'types/protein';
import { Alarm } from 'types/machine-health/alarms';
import { Alert } from 'types/machine-health/alerts';

// Theme
import theme from 'themes';

// Helpers
import { ConvertHHMMSStoMinutes, formatDate, formatDuration } from 'helpers';
import { useTimeZone } from 'providers';
import { MachineType } from 'types/machine-health';

interface CleaningStepRow extends CleaningStepWithKPI {
  key: string;
  rowId: number;
  parentRowId?: number;
  duration: string;
  avgOverTimeStr: string;
  targetDuration?: string;
  targetDiffInMinutes?: number;
}

interface CleaningStepsTableProps {
  data: CleaningStepWithKPI[];
  isDataLoading?: boolean;
  setSelectedAlarms: (alarms: Alarm[]) => void;
  setSelectedAlerts: (alerts: Alert[]) => void;
  machineType?: MachineType | undefined;
}

const Root = styled.div`
  width: 100%;
  height: auto;
`;

const ButtonContainer = styled.div<{ isChild: boolean }>`
  padding-left: ${({ isChild }) => (isChild ? '1rem' : '0')};

  button {
    width: ${({ isChild }) => (isChild ? 'auto' : '100%')};
  }
`;

const AlertCellContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const AlertIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.675rem;
  height: 1.675rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.atRiskYellow};
`;

const CellShowDifference = styled(Cell)`
  display: flex;
  flex-direction: row;
`;

const DurationContainer = styled.div``;
const DifferenceContainer = styled.div`
  color: ${({ theme }) => theme.colors.negativeRed};
`;

const AlertCell = ({ children, onClick }: { children: number; onClick: () => void }) => (
  <AlertCellContainer onClick={onClick} role="button">
    <AlertIcon>
      <Typography mb={0} as="span" color="white" size="0.75rem" weight="bold">
        {children}
      </Typography>
    </AlertIcon>
  </AlertCellContainer>
);

// Return formatted duration string from a step
const getFormattedDuration = (step: CleaningStepWithKPI) => {
  if (!step.startTime || !step.endTime) {
    return '—';
  }
  const durationAsMillis = new Date(step.endTime).getTime() - new Date(step.startTime).getTime();
  return formatDuration(durationAsMillis, 'hours:mins:secs');
};

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  onItemClick: (id: number) => void,
  numKPIColumns: number,
  expandedRowIds: number[],
  numSubSteps: number,
  setSelectedAlarms: (alarms: Alarm[]) => void,
  setSelectedAlerts: (alerts: Alert[]) => void,
  t: TFunction<'fpns'[], undefined>,
  machineType?: MachineType
): ColumnConfig[] => {
  let columns: ColumnConfig[];
  if (machineType === MachineType.Aseptic) {
    columns = [
      {
        title: t('program_steps_num_substeps') as string,
        dataIndex: 'name',
        key: 'name',
        render(value, data) {
          const isChild = (data as CleaningStepRow).parentRowId !== undefined;
          const hasChildren = !!(data as CleaningStepRow).subSteps?.length;

          return (
            <ButtonContainer isChild={isChild}>
              {isChild ? (
                <Typography mb={0} weight="bold" size="0.8125rem">
                  {value}
                </Typography>
              ) : (
                <ActionButton
                  downArrow={
                    hasChildren && expandedRowIds.includes((data as CleaningStepRow).rowId)
                  }
                  hideArrow={isChild || !hasChildren}
                  onClick={() => {
                    !isChild && onItemClick((data as CleaningStepRow).rowId);
                  }}
                >
                  {value}
                </ActionButton>
              )}
            </ButtonContainer>
          );
        }
      },
      {
        title: t('status') as string,
        dataIndex: 'status',
        key: 'status',
        render(_, data) {
          const { status, alarms, alerts } = data as CleaningStepRow;
          let background = 'inherit';
          let label: string | React.ReactNode = '-';

          if (status === CleaningStepStatus.Completed) {
            background = theme.colors.onTrackGreen4;
            label = t('completed');
          } else if (alarms?.length && alerts?.length) {
            background = theme.colors.atRiskYellow4;
            label = (
              <AlertCell
                onClick={() => {
                  setSelectedAlarms(alarms);
                  setSelectedAlerts(alerts);
                }}
              >
                {alarms.length + alerts.length}
              </AlertCell>
            );
          } else if (alarms?.length) {
            background = theme.colors.atRiskYellow4;
            label = (
              <AlertCell
                onClick={() => {
                  setSelectedAlarms(alarms);
                }}
              >
                {alarms.length}
              </AlertCell>
            );
          } else if (alerts?.length) {
            background = theme.colors.atRiskYellow4;
            label = (
              <AlertCell
                onClick={() => {
                  setSelectedAlerts(alerts);
                }}
              >
                {alerts.length}
              </AlertCell>
            );
          }
          return {
            props: {
              style: {
                background
              }
            },
            children: label
          };
        }
      },
      {
        title: t('duration') as string,
        dataIndex: 'duration',
        key: 'duration',
        render(_, data) {
          const { targetDuration, duration } = data as CleaningStepRow;
          const background = 'inherit';
          let label: string | React.ReactNode = '-';

          const difference =
            targetDuration && duration ? ConvertHHMMSStoMinutes(targetDuration, duration) : 0;

          label = (
            <CellShowDifference>
              <DurationContainer>{duration}</DurationContainer>
              <DifferenceContainer>{difference}</DifferenceContainer>
            </CellShowDifference>
          );

          return {
            props: {
              style: {
                background
              }
            },
            children: label
          };
        }
      },
      {
        title: t('target_duration') as string,
        dataIndex: 'targetDuration',
        key: 'targetDuration'
      },
      {
        title: t('avg_duration') as string,
        dataIndex: 'avgOverTimeStr',
        key: 'avgOverTimeStr'
      }
    ];
  } else {
    columns = [
      {
        title: t('program_steps_num_substeps') as string,
        dataIndex: 'name',
        key: 'name',
        render(value, data) {
          const isChild = (data as CleaningStepRow).parentRowId !== undefined;
          const hasChildren = !!(data as CleaningStepRow).subSteps?.length;

          return (
            <ButtonContainer isChild={isChild}>
              {isChild ? (
                <Typography mb={0} weight="bold" size="0.8125rem">
                  {value}
                </Typography>
              ) : (
                <ActionButton
                  downArrow={
                    hasChildren && expandedRowIds.includes((data as CleaningStepRow).rowId)
                  }
                  hideArrow={isChild || !hasChildren}
                  onClick={() => {
                    !isChild && onItemClick((data as CleaningStepRow).rowId);
                  }}
                >
                  {value}
                </ActionButton>
              )}
            </ButtonContainer>
          );
        }
      },
      {
        title: t('status') as string,
        dataIndex: 'status',
        key: 'status',
        render(_, data) {
          const { status, alarms, alerts } = data as CleaningStepRow;
          let background = 'inherit';
          let label: string | React.ReactNode = '-';

          if (status === CleaningStepStatus.Completed) {
            background = theme.colors.onTrackGreen4;
            label = t('completed');
          } else if (alarms?.length && alerts?.length) {
            background = theme.colors.atRiskYellow4;
            label = (
              <AlertCell
                onClick={() => {
                  setSelectedAlarms(alarms);
                  setSelectedAlerts(alerts);
                }}
              >
                {alarms.length + alerts.length}
              </AlertCell>
            );
          } else if (alarms?.length) {
            background = theme.colors.atRiskYellow4;
            label = (
              <AlertCell
                onClick={() => {
                  setSelectedAlarms(alarms);
                }}
              >
                {alarms.length}
              </AlertCell>
            );
          } else if (alerts?.length) {
            background = theme.colors.atRiskYellow4;
            label = (
              <AlertCell
                onClick={() => {
                  setSelectedAlerts(alerts);
                }}
              >
                {alerts.length}
              </AlertCell>
            );
          }
          return {
            props: {
              style: {
                background
              }
            },
            children: label
          };
        }
      },
      {
        title: t('start_time') as string,
        dataIndex: 'startTime',
        key: 'startTime'
      },
      {
        title: t('end_time') as string,
        dataIndex: 'endTime',
        key: 'endTime'
      },
      {
        title: t('duration') as string,
        dataIndex: 'duration',
        key: 'duration'
      },
      {
        title: t('average_over_time') as string,
        dataIndex: 'avgOverTimeStr',
        key: 'avgOverTimeStr',
        render(_, data) {
          const cleaningRowData = data as CleaningStepRow;
          const isChild = cleaningRowData.parentRowId !== undefined;
          return isChild ? cleaningRowData?.avgOverTimeStr : '—';
        }
      }
    ];
  }

  // Dynamically add the KPI columns, as we do not know how many there will be
  for (let i = 0; i < numKPIColumns; i++) {
    columns.push({
      title: i === 0 ? (t('kpis') as string) : '',
      dataIndex: `kpi${i}`,
      key: `kpi${i}`,
      render(_, data) {
        const { kpis } = data as CleaningStepRow;

        // If there is a KPI at this index for the row, return it
        if (kpis[i]) {
          const { label, unit, value } = kpis[i];
          return (
            <>
              {`${value} ${unit}`}
              <br />
              `({label})`
            </>
          );
        }
        return null;
      }
    });
  }
  return columns;
};

/**
 * Flatten the list of steps into a single level.
 * Nested child elements are given a parentRowId, so we can keep track of which row belongs
 * to which parent.
 */
const formatData = (data: CleaningStepWithKPI[], timeZone?: string): CleaningStepRow[] => {
  const output: CleaningStepRow[] = [];
  let uniqueRowId = 0;

  data.forEach((step) => {
    uniqueRowId++;
    // Add a top level row
    const row: CleaningStepRow = {
      ...step,
      key: `row-${uniqueRowId}`,
      rowId: uniqueRowId,
      startTime: formatDate(step.startTime, 'numeric-date-time', timeZone),
      endTime: formatDate(step.endTime, 'numeric-date-time', timeZone),
      duration: step.duration ?? getFormattedDuration(step),
      avgOverTimeStr: formatDuration(step.avgOverTime ?? 0, 'hours:mins:secs'),
      targetDuration: step.targetDuration,
      targetDiffInMinutes: step.targetDiffInMinutes ?? undefined
    };

    output.push(row);
    const parentRowId = uniqueRowId;

    // If row has substeps, push them onto the row array
    step.subSteps?.forEach((subStep) => {
      uniqueRowId++;
      const row: CleaningStepRow = {
        ...subStep,
        key: `row-${uniqueRowId}`,
        parentRowId,
        rowId: uniqueRowId,
        startTime: formatDate(subStep.startTime, 'numeric-date-time', timeZone),
        endTime: formatDate(subStep.endTime, 'numeric-date-time', timeZone),
        duration: subStep.duration ?? getFormattedDuration(subStep),
        avgOverTimeStr: formatDuration(subStep.avgOverTime ?? 0, 'hours:mins:secs'),
        targetDuration: subStep.targetDuration ?? '0',
        targetDiffInMinutes: subStep.targetDiffInMinutes ?? undefined
      };

      output.push(row);
    });
  });
  return output;
};

const CleaningStepsTable = ({
  data,
  isDataLoading,
  setSelectedAlarms,
  setSelectedAlerts,
  machineType
}: CleaningStepsTableProps): ReactElement => {
  const [expandedRowIds, setExpandedRowIds] = useState<number[]>([]);
  const { timeZone } = useTimeZone();
  const { t } = useTranslation(['mh']);
  const formattedData: CleaningStepRow[] = useMemo(
    () => formatData(data, timeZone),
    [data, timeZone]
  );

  // Find out how many KPI columns we need, by finding the step with the max number of KPIs
  const KPICounts = formattedData.map((row) => row.kpis.length);
  const numKPIColumns = Math.max(...KPICounts);

  const numSubSteps = formattedData.reduce((acc, row) => {
    const subSteps = row.subSteps ?? [];
    return acc + subSteps.length ?? 0;
  }, 0);

  // Show/hide child rows on parent item click
  const onItemClick = (id: number) => {
    const isExpanded = expandedRowIds.includes(id);
    if (isExpanded) {
      setExpandedRowIds(expandedRowIds.filter((row) => row !== id));
    } else {
      setExpandedRowIds([...expandedRowIds, id]);
    }
  };

  // Only show child elements of rows that are expanded.
  // Top level rows are always shown
  const filteredData = formattedData.filter((row) => {
    if (row.parentRowId !== undefined) {
      return expandedRowIds.includes(row.parentRowId);
    }
    return true;
  });

  return (
    <Root>
      <BaseTable
        columnConfigs={generateColumnConfigs(
          onItemClick,
          numKPIColumns,
          expandedRowIds,
          numSubSteps,
          setSelectedAlarms,
          setSelectedAlerts,
          t,
          machineType
        )}
        data={filteredData}
        isDataLoading={isDataLoading}
        borderBottomRow
        alternatingRowColoring={false}
      />
    </Root>
  );
};

export default CleaningStepsTable;
