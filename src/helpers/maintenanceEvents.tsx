import { cloneDeep } from 'lodash';
import React from 'react';
import moment from 'moment';
import i18next from 'i18next';

import {
  MaintenanceCreator,
  MaintenanceEvent,
  MaintenanceEventStatus,
  MaintenanceEventTableRow,
  MaintenanceTask,
  MaintenanceTaskStatus,
  MaintenanceTaskType,
  MaintenanceSchedule
} from 'types/maintenance';
import { getShortDate } from './dates';

const creatorCopyStringMap: Record<MaintenanceCreator, string> = {
  [MaintenanceCreator.Predictive]: 'Sensor-Detected Predictive Maintenance',
  [MaintenanceCreator.Customer]: 'Customer Prioritized PM',
  [MaintenanceCreator.Manufacturer]: 'Manufacturer Recommended PM',
  [MaintenanceCreator.User]: 'User Created Maintenance'
};

export const LOADING_TEXT_COMPONENT = <i>{i18next.t('loading', { ns: 'common' })}</i>;
export const UNAVAILABLE_TEXT_COMPONENT = (name?: string): JSX.Element => (
  <i>
    {name
      ? `${name} ` + i18next.t('unavailable', { ns: 'common' })
      : i18next.t('unavailable_dot', { ns: 'common' })}
  </i>
);

export function isMaintenanceEventOverdue(event: MaintenanceEvent): boolean {
  if (event.status != MaintenanceEventStatus.Completed) {
    const now = getShortDate(new Date());
    const comparisonDate =
      typeof event.suggestedDue === 'string' ? new Date(event.suggestedDue) : event.suggestedDue;
    if (comparisonDate && now > comparisonDate) {
      return true;
    }
  }
  return false;
}

export function getMaintenanceEventOverdue(event: MaintenanceEvent): number | null {
  if (event.status != MaintenanceEventStatus.Completed) {
    const now = moment().startOf('day');
    const comparisonDate = moment(event.suggestedDue).startOf('day');
    if (event.suggestedDue && now > comparisonDate) {
      const daysDiff = now.diff(comparisonDate, 'days');
      return daysDiff;
    }
  }
  return null;
}

export function getCreatorCopyString(event: MaintenanceEvent): string {
  if (event.creator === undefined) {
    return 'Unknown PM Source';
  }
  return creatorCopyStringMap[event.creator];
}

export function getCreatorCopyStringPlanned(schedule: MaintenanceSchedule): string {
  if (schedule.creator === undefined) {
    return 'Unknown PM Source';
  }
  return creatorCopyStringMap[schedule.creator];
}

export function getMaintenanceEventTaskByType(
  type: MaintenanceTaskType,
  maintenanceEvent: MaintenanceEvent | MaintenanceEventTableRow | undefined
): MaintenanceTask | undefined {
  if (maintenanceEvent === undefined || maintenanceEvent.tasks === undefined) {
    return undefined;
  }
  return maintenanceEvent?.tasks?.find((task) => task.type === type) as MaintenanceTask;
}

export function stringOrLoadingText(
  input: string | undefined,
  isLoading: boolean,
  name?: string
): JSX.Element | string | undefined {
  if (isLoading) {
    return LOADING_TEXT_COMPONENT;
  }
  if (input === undefined && name) {
    return UNAVAILABLE_TEXT_COMPONENT(name);
  } else if (input === undefined && name == undefined) {
    return UNAVAILABLE_TEXT_COMPONENT();
  }
  return input;
}

export function markTaskCompleteOrIncompleteByType(
  type: MaintenanceTaskType,
  maintenanceEvent: MaintenanceEvent,
  complete = true
): MaintenanceEvent {
  const eventClone = cloneDeep(maintenanceEvent);
  if (maintenanceEvent.tasks) {
    const clonedTasks = cloneDeep(maintenanceEvent.tasks);
    for (const t of clonedTasks) {
      if (t.type == type) {
        t.status =
          complete !== undefined && complete
            ? MaintenanceTaskStatus.Completed
            : MaintenanceTaskStatus.NotComplete;
      }
    }
    eventClone.tasks = clonedTasks;
  }
  return eventClone;
}
