import { getCreatorCopyString } from 'helpers';
import {
  MaintenanceCreator,
  MaintenanceEvent,
  MaintenanceEventStatus,
  MaintenanceTask,
  MaintenanceTaskStatus,
  MaintenanceTaskType
} from 'types/maintenance';
import {
  getMaintenanceEventTaskByType,
  isMaintenanceEventOverdue,
  LOADING_TEXT_COMPONENT,
  markTaskCompleteOrIncompleteByType,
  stringOrLoadingText
} from './maintenanceEvents';

describe('Maintenance Event Helper', () => {
  it('It should get a copy string', () => {
    const testEvent: MaintenanceEvent = {
      status: MaintenanceEventStatus.NotComplete,
      creator: MaintenanceCreator.Manufacturer,
      priority: 0,
      owner: 'Andrew Bier',
      id: '12345'
    };
    expect(getCreatorCopyString(testEvent)).toBeTruthy();
  });

  it('It should get loading text when required', () => {
    expect(stringOrLoadingText('unimportant', true, 'unimportant')).toEqual(LOADING_TEXT_COMPONENT);
  });

  it('It should correctly determine an event is overdue', () => {
    const testEvent: MaintenanceEvent = {
      status: MaintenanceEventStatus.NotComplete,
      creator: MaintenanceCreator.Manufacturer,
      priority: 0,
      owner: 'Andrew Bier',
      id: '12345',
      suggestedDue: new Date(2020, 0, 1)
    };
    expect(isMaintenanceEventOverdue(testEvent)).toBe(true);
  });

  it('It should correctly get a maintenance task by type', () => {
    const testTask: MaintenanceTask = {
      action: 'twist some bolts',
      maintenanceEventId: '12345',
      type: MaintenanceTaskType.AssignAndSchedule,
      priority: 0,
      status: MaintenanceTaskStatus.NotComplete
    };

    const testEvent: MaintenanceEvent = {
      status: MaintenanceEventStatus.NotComplete,
      creator: MaintenanceCreator.Manufacturer,
      priority: 0,
      owner: 'Andrew Bier',
      id: '12345',
      suggestedDue: new Date(2020, 0, 1),
      tasks: [testTask]
    };
    expect(getMaintenanceEventTaskByType(MaintenanceTaskType.AssignAndSchedule, testEvent)).toEqual(
      testTask
    );
  });

  it('It should correctly mark a task complete by type', () => {
    const testTask: MaintenanceTask = {
      action: 'twist some bolts',
      maintenanceEventId: '12345',
      type: MaintenanceTaskType.AssignAndSchedule,
      priority: 0,
      status: MaintenanceTaskStatus.NotComplete
    };

    const testEvent: MaintenanceEvent = {
      status: MaintenanceEventStatus.NotComplete,
      creator: MaintenanceCreator.Manufacturer,
      priority: 0,
      owner: 'Andrew Bier',
      id: '12345',
      suggestedDue: new Date(2020, 0, 1),
      tasks: [testTask]
    };
    expect(
      markTaskCompleteOrIncompleteByType(MaintenanceTaskType.AssignAndSchedule, testEvent)
    ).toEqual({
      ...testEvent,
      tasks: [
        {
          ...testTask,
          status: MaintenanceTaskStatus.Completed
        }
      ]
    });
  });
});
