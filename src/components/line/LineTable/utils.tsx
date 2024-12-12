// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { TFunction } from 'i18next';

// Components
import { ActionButton } from 'components';

// Types
import { MachineLineStatus } from 'types/protein';
import { ColumnConfig, SortState } from 'types';

// Routes
import { JBTRoutes } from 'constants/routes';

// Styling
const TableCell = styled.div`
  height: 3.625rem;
  display: flex;
  align-items: center;
`;

export const generateColumnConfigs = (
  sortState: Record<string, SortState>,
  goto: (path: string) => void,
  t: TFunction<'mh'[], undefined>
): ColumnConfig[] => {
  return [
    {
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
              style={{ justifyContent: 'center' }}
              onClick={() => goto(JBTRoutes.machine.replace(':machineId', machineId))}
            >
              {value}
            </ActionButton>
          </TableCell>
        );
      }
    },
    {
      title: t('issues_current', { ns: 'mh' }) as string,
      dataIndex: 'numCurrentAlarms',
      key: 'numCurrentAlarms'
    },
    {
      title: t('issues_past_24h', { ns: 'mh' }) as string,
      dataIndex: 'numAlarmsOverPeriod',
      key: 'numAlarmsOverPeriod'
    },
    {
      title: t('running_past_24h', { ns: 'mh' }) as string,
      dataIndex: 'running',
      key: 'running',
      render(value) {
        return `${value || 0}%`;
      }
    },
    {
      title: t('cleaning_past_24h', { ns: 'mh' }) as string,
      dataIndex: 'cleaning',
      key: 'cleaning',
      render(value) {
        return `${value || 0}%`;
      }
    },
    {
      title: t('idle_past_24h', { ns: 'mh' }) as string,
      dataIndex: 'idle',
      key: 'idle',
      render(value) {
        return `${value || 0}%`;
      }
    },
    {
      title: t('paused_past_24h', { ns: 'mh' }) as string,
      dataIndex: 'stopped',
      key: 'stopped',
      render(value) {
        return `${value || 0}%`;
      }
    },
    {
      title: t('stop_by_alarm_past_24h', { ns: 'mh' }) as string,
      dataIndex: 'stopAlarm',
      key: 'stopAlarm',
      render(value) {
        return `${value || 0}%`;
      }
    }
  ];
};

export const addKeyProp = (data: MachineLineStatus[]): MachineLineStatus[] =>
  data.map((d, i) => {
    return { ...d, key: `line-${i}` };
  });
