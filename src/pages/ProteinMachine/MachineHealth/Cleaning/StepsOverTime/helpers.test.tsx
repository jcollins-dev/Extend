import { processData } from './helpers';
import { CleaningStep, CleaningStepGroup } from 'types/protein';

// Convert mins to milliseconds
const mins2Millis = (mins: number) => mins * 60000;

const MOCK_STEPS: CleaningStep[] = [
  // Duration = 1 min
  {
    id: '1',
    name: 'name-1',
    startTime: '2020-01-01T00:00:00.000Z',
    endTime: '2020-01-01T00:01:00.000Z',
    parentName: 'test-parent',
    sessionId: 'session-a'
  },
  // Duration = 2 mins
  {
    id: '2',
    name: 'name-2',
    startTime: '2020-01-01T00:01:00.000Z',
    endTime: '2020-01-01T00:03:00.000Z',
    parentName: 'test-parent',
    sessionId: 'session-a'
  },
  // Duration = 4 mins
  {
    id: '3',
    name: 'name-3',
    startTime: '2020-01-01T00:04:00.000Z',
    endTime: '2020-01-01T00:08:00.000Z',
    parentName: 'test-parent',
    sessionId: 'session-a'
  },
  // Duration = 1 min
  {
    id: '1',
    name: 'name-1',
    startTime: '2020-01-01T00:07:00.000Z',
    endTime: '2020-01-01T00:08:00.000Z',
    parentName: 'test-parent',
    sessionId: 'session-b'
  },
  // Duration = 1 min
  {
    id: '1',
    name: 'name-1',
    startTime: '2020-01-01T00:08:00.000Z',
    endTime: '2020-01-01T00:09:00.000Z',
    parentName: 'test-parent',
    sessionId: 'session-b'
  },
  // Duration = 10 mins
  {
    id: '2',
    name: 'name-2',
    startTime: '2020-01-01T00:09:00.000Z',
    endTime: '2020-01-01T00:19:00.000Z',
    parentName: 'test-parent',
    sessionId: 'session-b'
  }
];

// Combined total of all steps
const TOTAL_DURATION = mins2Millis(19);

describe('StepsOverTime - helpers', () => {
  it('processData puts decorated steps into groups, grouped by id, and calculates total durations for each group', () => {
    // Expected total durations for each step group
    // 1 = 3 mins
    // 2 = 12 mins
    // 3 = 4 mins

    const expectedGroupedOrdered: CleaningStepGroup[] = [
      {
        id: '2',
        name: 'name-2',
        duration: mins2Millis(12),
        percent: (mins2Millis(12) / TOTAL_DURATION) * 100,
        minDuration: mins2Millis(2),
        maxDuration: mins2Millis(10),
        averageDuration: mins2Millis(6),
        parentName: 'test-parent',
        steps: [
          {
            id: '2',
            name: 'name-2',
            startTime: '2020-01-01T00:01:00.000Z',
            startDateTime: new Date('2020-01-01T00:01:00.000Z'),
            endTime: '2020-01-01T00:03:00.000Z',
            endDateTime: new Date('2020-01-01T00:03:00.000Z'),
            duration: mins2Millis(2),
            parentName: 'test-parent',
            sessionId: 'session-a'
          },
          {
            id: '2',
            name: 'name-2',
            startTime: '2020-01-01T00:09:00.000Z',
            startDateTime: new Date('2020-01-01T00:09:00.000Z'),
            endTime: '2020-01-01T00:19:00.000Z',
            endDateTime: new Date('2020-01-01T00:19:00.000Z'),
            duration: mins2Millis(10),
            parentName: 'test-parent',
            sessionId: 'session-b'
          }
        ]
      },
      {
        id: '3',
        name: 'name-3',
        duration: mins2Millis(4),
        percent: (mins2Millis(4) / TOTAL_DURATION) * 100,
        minDuration: mins2Millis(4),
        maxDuration: mins2Millis(4),
        averageDuration: mins2Millis(4),
        parentName: 'test-parent',
        steps: [
          {
            id: '3',
            name: 'name-3',
            startTime: '2020-01-01T00:04:00.000Z',
            startDateTime: new Date('2020-01-01T00:04:00.000Z'),
            endTime: '2020-01-01T00:08:00.000Z',
            endDateTime: new Date('2020-01-01T00:08:00.000Z'),
            duration: mins2Millis(4),
            parentName: 'test-parent',
            sessionId: 'session-a'
          }
        ]
      },
      {
        id: '1',
        name: 'name-1',
        duration: mins2Millis(3),
        percent: (mins2Millis(3) / TOTAL_DURATION) * 100,
        minDuration: mins2Millis(1),
        maxDuration: mins2Millis(1),
        averageDuration: mins2Millis(1),
        parentName: 'test-parent',
        steps: [
          {
            id: '1',
            name: 'name-1',
            startTime: '2020-01-01T00:00:00.000Z',
            startDateTime: new Date('2020-01-01T00:00:00.000Z'),
            endTime: '2020-01-01T00:01:00.000Z',
            endDateTime: new Date('2020-01-01T00:01:00.000Z'),
            duration: mins2Millis(1),
            parentName: 'test-parent',
            sessionId: 'session-a'
          },
          {
            id: '1',
            name: 'name-1',
            startTime: '2020-01-01T00:07:00.000Z',
            startDateTime: new Date('2020-01-01T00:07:00.000Z'),
            endTime: '2020-01-01T00:08:00.000Z',
            endDateTime: new Date('2020-01-01T00:08:00.000Z'),
            duration: mins2Millis(1),
            parentName: 'test-parent',
            sessionId: 'session-b'
          },
          {
            id: '1',
            name: 'name-1',
            startTime: '2020-01-01T00:08:00.000Z',
            startDateTime: new Date('2020-01-01T00:08:00.000Z'),
            endTime: '2020-01-01T00:09:00.000Z',
            endDateTime: new Date('2020-01-01T00:09:00.000Z'),
            duration: mins2Millis(1),
            parentName: 'test-parent',
            sessionId: 'session-b'
          }
        ]
      }
    ];

    const { orderedGroupedSteps } = processData(MOCK_STEPS);

    expect(orderedGroupedSteps).toEqual(expectedGroupedOrdered);
  });

  it('processData returns correct decorated steps', () => {
    const expected = [
      {
        id: '1',
        name: 'name-1',
        startTime: '2020-01-01T00:00:00.000Z',
        endTime: '2020-01-01T00:01:00.000Z',
        parentName: 'test-parent',
        sessionId: 'session-a',
        duration: 60000,
        startDateTime: new Date('2020-01-01T00:00:00.000Z'),
        endDateTime: new Date('2020-01-01T00:01:00.000Z')
      },
      {
        id: '2',
        name: 'name-2',
        startTime: '2020-01-01T00:01:00.000Z',
        endTime: '2020-01-01T00:03:00.000Z',
        parentName: 'test-parent',
        sessionId: 'session-a',
        duration: 120000,
        startDateTime: new Date('2020-01-01T00:01:00.000Z'),
        endDateTime: new Date('2020-01-01T00:03:00.000Z')
      },
      {
        id: '3',
        name: 'name-3',
        startTime: '2020-01-01T00:04:00.000Z',
        endTime: '2020-01-01T00:08:00.000Z',
        parentName: 'test-parent',
        sessionId: 'session-a',
        duration: 240000,
        startDateTime: new Date('2020-01-01T00:04:00.000Z'),
        endDateTime: new Date('2020-01-01T00:08:00.000Z')
      },
      {
        id: '1',
        name: 'name-1',
        startTime: '2020-01-01T00:07:00.000Z',
        endTime: '2020-01-01T00:08:00.000Z',
        parentName: 'test-parent',
        sessionId: 'session-b',
        duration: 60000,
        startDateTime: new Date('2020-01-01T00:07:00.000Z'),
        endDateTime: new Date('2020-01-01T00:08:00.000Z')
      },
      {
        id: '1',
        name: 'name-1',
        startTime: '2020-01-01T00:08:00.000Z',
        endTime: '2020-01-01T00:09:00.000Z',
        parentName: 'test-parent',
        sessionId: 'session-b',
        duration: 60000,
        startDateTime: new Date('2020-01-01T00:08:00.000Z'),
        endDateTime: new Date('2020-01-01T00:09:00.000Z')
      },
      {
        id: '2',
        name: 'name-2',
        startTime: '2020-01-01T00:09:00.000Z',
        endTime: '2020-01-01T00:19:00.000Z',
        parentName: 'test-parent',
        sessionId: 'session-b',
        duration: 600000,
        startDateTime: new Date('2020-01-01T00:09:00.000Z'),
        endDateTime: new Date('2020-01-01T00:19:00.000Z')
      }
    ];
    const { decoratedSteps } = processData(MOCK_STEPS);
    expect(decoratedSteps).toEqual(expected);
  });
});
