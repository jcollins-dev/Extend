// 3rd party
import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { TFunction } from 'i18next';

// Types
import {
  MaintenanceEventStatus,
  MaintenanceEventTableRow,
  MaintenanceScheduleTableRow,
  MaintenanceTask,
  MaintenanceTaskStatus,
  MaintenanceTaskType
} from 'types/maintenance';
import { PermissionScopeName } from 'types/user-management';
import { UserScopes } from 'types';

// Components
import IconCell, { IconType } from '../IconCell/IconCell';
import { PermissionWrapper, Typography } from 'components';

// Helpers
import { formatDate, getMaintenanceEventOverdue, isMaintenanceEventOverdue } from 'helpers';

const TwoStackedTextContainerFloat = styled.div`
  margin: 0;
  p {
    margin-bottom: 0;
  }
  p:not(:first-child) {
    float: left;
    margin-right: 0.25rem;
  }
  p:last-child {
    margin-top: 0.125 rem;
  }
`;

// Map task type to correct icon
const nextStepIconMapTask: Record<MaintenanceTaskType, IconType> = {
  [MaintenanceTaskType.AssignAndSchedule]: 'person',
  [MaintenanceTaskType.Order]: 'cart',
  [MaintenanceTaskType.Complete]: 'wrench',
  [MaintenanceTaskType.FollowUp]: 'create'
};

export const maintenanceEventGroupBy = (
  array: MaintenanceEventTableRow[],
  fn: (item: MaintenanceEventTableRow) => string
): Map<string, MaintenanceEventTableRow[]> => {
  return array.reduce((rows, rowItem) => {
    const key: string = fn(rowItem);
    if (!rows.has(key)) {
      rows.set(key, [rowItem]);
    } else {
      rows.get(key)?.push(rowItem);
    }
    return rows;
  }, new Map<string, MaintenanceEventTableRow[]>());
};

export const maintenanceScheduleGroupBy = (
  array: MaintenanceScheduleTableRow[],
  fn: (item: MaintenanceScheduleTableRow) => string
): Map<string, MaintenanceScheduleTableRow[]> => {
  return array.reduce((rows, rowItem) => {
    const key: string = fn(rowItem);
    if (!rows.has(key)) {
      rows.set(key, [rowItem]);
    } else {
      rows.get(key)?.push(rowItem);
    }
    return rows;
  }, new Map<string, MaintenanceScheduleTableRow[]>());
};

export const getStatusCellDate = (
  data: MaintenanceEventTableRow,
  t: TFunction<'fpns'[], undefined>
): string => {
  if (data.status && data.completion && data.status === MaintenanceEventStatus.Completed) {
    return formatDate(data.completion, 'short');
  } else if (data.status !== MaintenanceEventStatus.Completed && data.suggestedDue) {
    return formatDate(data.suggestedDue, 'short');
  }
  return t('date_missing', { ns: 'fpns' });
};

/**
 * Inspects the Maintenance event object, and returns a correctly populated status cell,
 * and the background color it should sit in front of
 */
export const getStatusCellEvent = (
  data: MaintenanceEventTableRow,
  theme: DefaultTheme,
  t: TFunction<'fpns'[], undefined>
): {
  cellColor: string;
  cell: React.ReactNode;
} => {
  // Determine the cell color by inspecting the status
  let cellColor = 'transparent';
  let overdue;

  if (isMaintenanceEventOverdue(data)) {
    cellColor = theme.colors.negativeRed4;
    overdue = getMaintenanceEventOverdue(data);
  } else if (data.status === MaintenanceEventStatus.Completed) {
    cellColor = theme.colors.onTrackGreen4;
  }
  // Generate the text to display
  const text = isMaintenanceEventOverdue(data) ? t('due') : t(data.status ?? 'status_unavailable');

  // TODO - work out the correct sub text depending on the contents of the task object
  return {
    cellColor,
    cell: (
      <TwoStackedTextContainerFloat>
        <Typography variant="body1">{text}</Typography>
        <Typography variant="body2" color="bluefont">
          {getStatusCellDate(data, t)}
        </Typography>
        {overdue && (
          <Typography variant="body2" color="danger">
            {`${overdue} ` + t('days_over', { ns: 'fpns' })}
          </Typography>
        )}
      </TwoStackedTextContainerFloat>
    )
  };
};

/**
 * Inspects the Maintenance task object, and returns a correctly populated next steps cell,
 * and the background color it should sit in front of
 */
export const getNextStepCell = (
  data: MaintenanceEventTableRow,
  theme: DefaultTheme,
  t: TFunction<'fpns'[], undefined>,
  setSelectedPm?: (pm: MaintenanceEventTableRow) => void,
  onClickCreateService?: (data: MaintenanceEventTableRow) => void
): {
  cellColor: string;
  cell: React.ReactNode;
} => {
  // TODO - populate this entire cell correctly
  const cellColor = theme.colors.primaryBlue4;

  // Get the icon and text for this status
  let icon, text;
  if (data.status !== MaintenanceEventStatus.Completed) {
    const nextStepTask = data.tasks
      ?.filter((task) => task.status === MaintenanceTaskStatus.NotComplete)
      .sort((a, b) => a.priority - b.priority)[0] as MaintenanceTask;

    icon = data.tasks && nextStepTask ? nextStepIconMapTask[nextStepTask.type] : '';
    text =
      data.tasks && nextStepTask
        ? t(`mm_table_${nextStepTask.type}`)
        : t('mm_table_none_required', { ns: 'fpns' });
  } else if (data.followUpNeeded) {
    icon = 'plus';
    text = t('create_follow_up', { ns: 'fpns' });
  } else {
    icon = 'wrench';
    text = t('see_details', { ns: 'fpns' });
  }

  const onClick = data.tasks
    ? () => {
        setSelectedPm && setSelectedPm(data as MaintenanceEventTableRow);
      }
    : undefined;
  const onCreateService = data.tasks
    ? () => {
        onClickCreateService && onClickCreateService(data as MaintenanceEventTableRow);
      }
    : undefined;
  return {
    cellColor,
    cell: (
      <PermissionWrapper page={PermissionScopeName.MAINTENANCE_MANAGER} scope={UserScopes.Write}>
        <IconCell
          icon={icon as IconType}
          text={text}
          showArrow={true}
          subText={undefined}
          onClick={data.followUpNeeded ? onCreateService : onClick}
        />
      </PermissionWrapper>
    )
  };
};
