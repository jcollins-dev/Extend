import theme from 'themes';
import { MachineStateNames } from 'types/dsi';

export const dsiMachineModesWidgetData = [
  {
    id: 1,
    label: 'Machine Name',
    parentProperty: '1',
    data: [
      {
        stateCode: 3,
        stateName: 'Running',
        startTimestamp: '2022-04-18T01:00:00+00:00',
        endTimestamp: '2022-04-18T01:30:00+00:00'
      },
      {
        stateCode: 3,
        stateName: 'Running',
        startTimestamp: '2022-04-18T01:30:00+00:00',
        endTimestamp: '2022-04-18T02:30:00+00:00'
      },
      {
        stateCode: 4,
        stateName: 'Not Running',
        startTimestamp: '2022-04-18T02:30:00+00:00',
        endTimestamp: '2022-04-18T03:00:00+00:00'
      },
      {
        stateCode: 2,
        stateName: 'No Product',
        startTimestamp: '2022-04-18T03:00:00+00:00',
        endTimestamp: '2022-04-18T03:30:00+00:00'
      },
      {
        stateCode: 1,
        stateName: 'Offline',
        startTimestamp: '2022-04-18T03:30:00+00:00',
        endTimestamp: '2022-04-18T04:30:00+00:00'
      }
    ]
  }
];

export const dsiMappingTimeInterval = [
  {
    interval: 'Last 15 min',
    values: [
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T01:02:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:04:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:05:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T01:10:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:12:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T01:13:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:14:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T01:14:30+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T01:15:00+00:00').getTime(), value: 6 }
      ],
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T01:02:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T01:04:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:05:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T01:10:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T01:12:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T01:13:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:14:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:14:30+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:15:00+00:00').getTime(), value: 1 }
      ]
    ]
  },
  {
    interval: 'Last 30 min',
    values: [
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T01:05:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:10:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:15:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T01:20:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:25:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T01:25:30+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:25:45+00:00').getTime(), value: 3 }
      ],
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T01:05:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:10:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T01:15:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:20:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:25:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T01:25:30+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:25:45+00:00').getTime(), value: 3 }
      ]
    ]
  },
  {
    interval: 'Last hour',
    values: [
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T01:05:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:10:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:25:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T01:35:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:45:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T01:55:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:58:00+00:00').getTime(), value: 2 }
      ],
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T01:05:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T01:10:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T01:25:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T01:35:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:45:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T01:55:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T01:58:00+00:00').getTime(), value: 6 }
      ]
    ]
  },
  {
    interval: 'Last Shift',
    values: [
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T02:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T03:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T04:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T05:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T06:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T07:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T07:10:00+00:00').getTime(), value: 4 }
      ],
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T02:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T03:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T04:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T05:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T06:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T07:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T07:10:00+00:00').getTime(), value: 1 }
      ]
    ]
  },
  {
    interval: 'Last Day',
    values: [
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T02:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T03:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T04:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T05:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T06:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T07:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T08:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T09:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T10:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T11:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T12:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T13:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T14:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T15:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T16:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T17:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T18:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T19:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T20:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T21:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T22:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T23:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T24:00:00+00:00').getTime(), value: 3 }
      ],
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T02:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T03:00:00+00:00').getTime(), value: 7 },
        { timestamp: new Date('2022-04-18T04:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T05:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T06:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T07:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T08:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T09:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T10:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T11:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T12:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-18T13:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T14:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-18T15:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T16:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T17:00:00+00:00').getTime(), value: 8 },
        { timestamp: new Date('2022-04-18T18:00:00+00:00').getTime(), value: 9 },
        { timestamp: new Date('2022-04-18T19:00:00+00:00').getTime(), value: 7 },
        { timestamp: new Date('2022-04-18T20:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-18T21:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T22:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-18T23:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-18T24:00:00+00:00').getTime(), value: 3 }
      ]
    ]
  },
  {
    interval: 'Last Week',
    values: [
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-23T04:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-24T09:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-24T10:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-24T11:00:00+00:00').getTime(), value: 1 }
      ],
      [
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-23T04:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-24T09:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-24T10:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-24T11:00:00+00:00').getTime(), value: 5 }
      ]
    ]
  },
  {
    interval: 'Last Month',
    values: [
      [
        { timestamp: new Date('2022-04-08T15:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-09T16:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-10T17:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-11T18:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-12T19:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-13T20:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-14T21:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-15T22:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-16T23:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-17T24:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-25T08:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-26T09:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-27T10:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-28T11:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-29T12:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-30T13:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-31T07:00:00+00:00').getTime(), value: 3 }
      ],
      [
        { timestamp: new Date('2022-04-08T15:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-09T16:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-10T17:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-11T18:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-12T19:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-13T20:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-14T21:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-15T22:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-16T23:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-17T24:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 1 },
        { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 3 },
        { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 4 },
        { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 2 },
        { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 5 },
        { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-25T08:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-26T09:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-27T10:00:00+00:00').getTime(), value: 7 },
        { timestamp: new Date('2022-04-28T11:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-29T12:00:00+00:00').getTime(), value: 8 },
        { timestamp: new Date('2022-04-30T13:00:00+00:00').getTime(), value: 6 },
        { timestamp: new Date('2022-04-31T07:00:00+00:00').getTime(), value: 3 }
      ]
    ]
  }
];

export const statesValues = [
  {
    timestamp: '2022-06-22T03:59:59+00:00',
    value: 10.0,
    name: 'idle',
    endTimestamp: '2022-06-22T05:14:19.205000+00:00'
  },
  {
    timestamp: '2022-06-22T05:14:19.205000+00:00',
    value: 50.0,
    name: 'stop',
    endTimestamp: '2022-06-22T05:14:34.200000+00:00'
  }
];

export const dsiChartsOverTimeMockData = [
  {
    id: 'infeed-piece-id',
    label: 'Infeed Piece Size',
    indicators: [
      {
        tagId: '',
        mainTag: 'True',
        tagGroupId: '5',
        tagGroupName: 'dsi tags',
        name: '',
        unit: 'lbs',
        value: 60,
        values: [
          { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 50 },
          { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 40 },
          { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 50 },
          { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 40 },
          { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 30 }
        ]
      },
      {
        tagId: '',
        mainTag: 'True',
        tagGroupId: '5',
        tagGroupName: 'dsi tags',
        name: '',
        unit: 'lbs',
        value: 60,
        values: [
          { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 90 },
          { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 70 },
          { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 40 },
          { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 50 },
          { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 20 },
          { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 30 }
        ]
      }
    ],
    states: statesValues,
    color: theme.colors.darkGrey,
    colors: [theme.colors.darkGrey, '#A5BBE2'],
    bgColor: theme.colors.lightGrey2,
    unit: 'g'
  },
  {
    id: 'yield-id',
    label: 'Yield',
    target: { value: 50 },
    indicators: [
      {
        tagId: 'Yield',
        mainTag: 'True',
        tagGroupId: '5',
        tagGroupName: 'dsi tags',
        name: 'Yield',
        unit: '%',
        value: 60,
        values: [
          { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 60 },
          { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 60 }
        ]
      }
    ],
    states: statesValues,
    color: theme.colors.darkGrey,
    colors: [theme.colors.darkGrey],
    unit: '%'
  },
  {
    id: 'throughput-id',
    label: 'Throughput',
    target: { value: 50 },
    indicators: [
      {
        tagId: 'Throughput',
        mainTag: 'True',
        tagGroupId: '5',
        tagGroupName: 'dsi tags',
        name: 'Throughput',
        unit: 'mm',
        value: 60,
        values: [
          { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 60 },
          { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 60 }
        ]
      }
    ],
    states: statesValues,
    color: '#2C476F',
    colors: ['#2C476F'],
    bgColor: 'rgba(44, 71, 111, 0.08)',
    unit: 'lbs x 1000'
  },
  {
    id: 'throughput-id',
    label: 'Throughput',
    target: { value: 50 },
    indicators: [
      {
        tagId: 'Throughput',
        mainTag: 'True',
        tagGroupId: '5',
        tagGroupName: 'dsi tags',
        name: 'Throughput',
        unit: 'mm',
        value: 60,
        values: [
          { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 60 },
          { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 60 }
        ]
      }
    ],
    states: statesValues,
    color: '#2C476F',
    colors: ['#2C476F'],
    bgColor: 'rgba(44, 71, 111, 0.08)',
    unit: 'pieces x 1000'
  },
  {
    id: 'loading-efficiency',
    label: 'Loading Efficiency',
    target: { value: 50 },
    indicators: [
      {
        tagId: 'Throughput',
        mainTag: 'True',
        tagGroupId: '5',
        tagGroupName: 'dsi tags',
        name: 'Loading Efficiency',
        unit: 'mm',
        value: 60,
        values: [
          { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 60 },
          { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 60 }
        ]
      }
    ],
    states: statesValues,
    color: '#895ea7',
    colors: ['#895EA7'],
    bgColor: 'rgba(105, 64, 133, 0.08)',
    unit: '%'
  },
  {
    id: 'loading-gap',
    label: 'Loading Gap',
    target: { value: 50 },
    indicators: [
      {
        tagId: 'Loading',
        mainTag: 'True',
        tagGroupId: '5',
        tagGroupName: 'dsi tags',
        name: 'Loading Gap',
        unit: 'mm',
        value: 60,
        values: [
          { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 60 },
          { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 60 }
        ]
      }
    ],
    states: statesValues,
    color: '#C47888',
    colors: ['#895EA7'],
    bgColor: 'rgba(196, 120, 136, 0.08)',
    unit: '%'
  },
  {
    id: 'belt-speed',
    label: 'Belt Speed',
    target: { value: 50 },
    indicators: [
      {
        tagId: 'Throughput',
        mainTag: 'True',
        tagGroupId: '5',
        tagGroupName: 'dsi tags',
        name: 'Belt Speed',
        unit: 'fpm',
        value: 60,
        values: [
          { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 60 },
          { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 60 }
        ]
      }
    ],
    states: statesValues,
    color: '#8378C3',
    colors: ['#8378c3'],
    bgColor: 'rgba(70, 64, 133, 0.08)',
    unit: 'fpm'
  },
  {
    id: 'product-processed',
    label: 'Product Processed',
    target: { value: 50 },
    indicators: [
      {
        tagId: 'Throughput',
        mainTag: 'True',
        tagGroupId: '5',
        tagGroupName: 'dsi tags',
        name: 'Product Processed',
        unit: '%',
        value: 60,
        values: [
          { timestamp: new Date('2022-04-18T01:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-19T02:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-20T03:00:00+00:00').getTime(), value: 60 },
          { timestamp: new Date('2022-04-21T04:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-22T05:00:00+00:00').getTime(), value: 30 },
          { timestamp: new Date('2022-04-23T06:00:00+00:00').getTime(), value: 10 },
          { timestamp: new Date('2022-04-24T07:00:00+00:00').getTime(), value: 60 }
        ]
      }
    ],
    states: statesValues,
    color: '#407E85',
    colors: ['#407E85'],
    bgColor: 'rgba(64, 126, 133, 0.08)',
    unit: '%'
  }
];

export const dsiKPIWidgetMockData = [
  {
    title: 'Belt Speed',
    kpiType: 'BeltSpeed',
    value1: { value: '52', unit: 'fpm', id: 'belt-speed-1', duration: 'Avg/last hr' },
    value2: { value: '50', unit: 'fpm', id: 'belt-speed-2', duration: 'Target fpm' },
    status: 'good'
  },
  {
    title: 'Loading',
    kpiType: 'LoadingEfficiency',
    value1: {
      value: '60',
      valueTitle: 'Efficiency',
      status: 'bad',
      unit: '%',
      key: 'loading-1',
      duration: 'Avg/last hr'
    },
    value2: {
      value: '130',
      valueTitle: 'Gap',
      status: 'bad',
      unit: 'mm',
      key: 'loading-2',
      duration: 'Avg/last hr'
    },
    status: 'bad'
  },
  {
    title: 'Pump Pressure',
    kpiType: 'PumpPressure',
    value3: {
      value: '45,000',
      unit: 'psi',
      key: 'belt-speed-1',
      duration: ''
    },
    status: 'good'
  },
  {
    title: 'Yield',
    kpiType: 'Yield',
    value1: {
      value: '70%',
      unit: '',
      valueTitle: ':',
      key: 'yield-1',
      duration: 'Avg/last hr'
    },
    value2: {
      value: '> 70%',
      unit: '',
      valueTitle: ':',
      key: 'yield-2',
      duration: 'Target yield'
    },
    /* values: [
      { value: '35%', unit: 'Product Type 1' },
      { value: '20%', unit: 'Product Type 2' },
      { value: '15%', unit: 'Product Type 3' }
    ],*/
    status: 'good'
  },
  {
    title: 'Yield',
    kpiType: 'yield-overview',
    value1: {
      value: '70%',
      unit: '',
      key: 'yield-1',
      duration: 'Avg/last hr'
    },
    value2: {
      value: '75%',
      unit: '',
      key: 'yield-2',
      duration: 'Avg/last day'
    },
    value3: {
      value: '> 73',
      unit: '%',
      key: 'yield-2',
      duration: 'Target'
    }
  },
  {
    title: 'Product Processed',
    kpiType: 'ProcessedProductPercentage',
    value1: { value: '96', unit: '%', key: 'processed-product-1', duration: 'Avg/last hr' },
    value2: {
      value: '98%',
      unit: '',
      key: 'processed-product-2',
      duration: 'Target'
    },
    status: 'good'
  },
  {
    title: 'Product Processed',
    kpiType: 'product-processed-overview',
    value1: {
      value: '99%',
      unit: '',
      key: 'processed-product-1',
      duration: 'Avg/last hr'
    },
    value2: {
      value: '95%',
      unit: '',
      key: 'processed-product-2',
      duration: 'Avg/last day'
    },
    value3: {
      value: '> 98%',
      unit: '',
      key: 'yield-2',
      duration: 'Target'
    }
  },
  {
    title: 'Throughput - Rate',
    kpiType: 'ThroughputRate',
    status: 'warning',
    value1: {
      value: '18,00',
      valueTitle: 'Input throughput',
      unit: 'lbs/hr',
      key: 'weight-1',
      duration: 'Avg last hr'
    },
    value2: {
      value: '2,000',
      valueTitle: 'Input throughput',
      unit: 'lbs/hr',
      key: 'weight-2',
      duration: 'Target lb/hr'
    },
    value3: {
      value: '13,000',
      unit: 'lbs/hr',
      key: 'weight-3',
      duration: "Today's total finished good output"
    }
  },
  {
    title: 'Throughput - Piece Count',
    kpiType: 'ThroughputPieceCount',
    status: 'warning',
    value1: {
      value: '25,00',
      valueTitle: 'Input throughput',
      unit: '',
      key: 'piece-1',
      duration: 'Avg last hr'
    },
    value2: {
      value: '27,00',
      valueTitle: 'Input throughput',
      unit: '',
      key: 'piece-2',
      duration: 'Target pieces/hr'
    },
    value3: {
      value: '10,000',
      unit: '',
      key: 'piece-3',
      duration: "Today's total finished good output"
    }
  },
  {
    title: 'Infeed Throughput - Piece Count',
    kpiType: 'throughput-piece-count-overview',
    status: 'warning',
    value1: {
      value: '2,500',
      unit: 'pcs',
      key: 'throughput-piece-count-1',
      duration: 'Avg last hr',
      unitTitle: '',
      unitTitleColor: theme.colors.mediumBlue2
    },
    value2: {
      value: '2,600',
      unit: 'pcs',
      key: 'throughput-piece-count-1',
      duration: 'Avg pieces/hr for last day',
      unitTitle: '',
      unitTitleColor: theme.colors.onTrackGreen
    },
    value3: {
      value: '2700',
      unit: '',
      key: 'yield-2',
      duration: 'Target pieces/hr'
    }
  },
  {
    title: 'Infeed Throughput - Weight',
    kpiType: 'throughput-weight-overview',
    status: 'warning',
    value1: {
      value: '18,000',
      unit: 'lb',
      key: 'throughput-weight-overview-1',
      duration: 'Avg last hour',
      unitTitle: '',
      unitTitleColor: theme.colors.mediumBlue2
    },
    value2: {
      value: '19,00',
      unit: 'lb',
      key: 'throughput-weight-overview-2',
      duration: 'Avg lbs/hr for last day',
      unitTitle: '',
      unitTitleColor: theme.colors.onTrackGreen
    },
    value3: {
      value: '2000',
      unit: '',
      key: 'yield-2',
      duration: 'Target lbs/hr'
    }
  }
];

export const dsiAlarmsMockData = [
  {
    startTimestamp: '2022-07-19T15:37:00+00:00',
    code: -1,
    description:
      '[MACHINE VISION] Cap close to edge detected, check Fords press (min_distance_to_edge: 1.668/2.000 mm)'
  },
  {
    startTimestamp: '2022-07-19T15:36:00+00:00',
    code: -1,
    description:
      '[MACHINE VISION] Cap close to edge detected, check Fords press (min_distance_to_edge: 1.497/2.000 mm)'
  }
];

export const dsiAlertsMockData = [
  {
    startTimestamp: '2022-07-19T15:37:00+00:00',
    code: -1,
    description:
      '[MACHINE VISION] Cap close to edge detected, check Fords press (min_distance_to_edge: 1.668/2.000 mm)'
  },
  {
    startTimestamp: '2022-07-19T15:36:00+00:00',
    code: -1,
    description:
      '[MACHINE VISION] Cap close to edge detected, check Fords press (min_distance_to_edge: 1.497/2.000 mm)'
  },
  {
    startTimestamp: '2022-07-19T15:34:00+00:00',
    code: -1,
    description:
      '[MACHINE VISION] Cap close to edge detected, check Fords press (min_distance_to_edge: 1.296/2.000 mm)'
  }
];

export const dsiMachineInfoMockData = [
  {
    valueTitle: 'Product Setup Unit',
    value: 'Outback Fillet',
    unit: '',
    key: 'product-setup',
    unitTitle: ''
  },
  {
    valueTitle: 'Application 1',
    value: '42110',
    unit: '',
    key: 'app-1',
    unitTitle: ''
  },
  {
    valueTitle: 'Application 2',
    value: '34290',
    unit: '',
    key: 'app-1',
    unitTitle: ''
  },
  {
    valueTitle: 'Application 3',
    value: '41128',
    unit: '',
    key: 'app-1',
    unitTitle: ''
  },
  {
    valueTitle: 'Cumulative Output Last 24 hrs.',
    key: 'cumulative-output',
    unitTitle: 'Cumulative Output',
    value: '',
    unit: '',
    values: [
      { value: '45,000 lbs', unit: 'Weight' },
      { value: '52,000 pcs', unit: 'Pieces' }
    ]
  }
];

export const dsiOEEMockData = {
  id: 'OEE',
  status: '-',
  period: '',
  availability: {
    value: '-',
    color: theme.colors.darkGrey,
    mb: '0.625rem',
    size: '1.3125rem'
  },
  performance: {
    value: '-',
    color: theme.colors.darkGrey,
    mb: '0.625rem',
    size: '1.3125rem'
  },
  quality: {
    value: '-',
    color: theme.colors.darkGrey,
    mb: '0.625rem',
    size: '1.3125rem'
  }
};

export const dsiSiteOEETableMockData = [
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l1',
    status: MachineStateNames.Running,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    oee: '70%',
    psu: 'Outback Fillet'
  },
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l2',
    status: MachineStateNames.NotRunning,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    oee: '80%',
    psu: 'KFC Nuggets'
  },
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l3',
    status: MachineStateNames.NotRunning,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    oee: '75% Avg',
    psu: '--'
  }
];
export const dsiSiteQualityTableMockData = [
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l1',
    status: MachineStateNames.Running,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    yield: '75%',
    productProcessed: '98%'
  },
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l2',
    status: MachineStateNames.NotRunning,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    yield: '80%',
    productProcessed: '96%'
  },
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l3',
    status: MachineStateNames.NotRunning,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    yield: '77% Avg',
    productProcessed: '97% Avg'
  }
];
export const dsiSitePerformanceTableMockData = [
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l1',
    status: MachineStateNames.Running,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    throughputPieceCount: '2700 pieces/hr',
    throughputWeight: '2500 lbs/hr',
    output: '18885 lbs'
  },
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l2',
    status: MachineStateNames.NotRunning,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    throughputPieceCount: '2700 pieces/hr',
    throughputWeight: '2500 lbs/hr',
    output: '19,509 lbs'
  },
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l3',
    status: MachineStateNames.NotRunning,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    throughputPieceCount: '2700 pieces/hr Avg',
    throughputWeight: '2500 lbs/hr Avg',
    output: '38,394 lbs'
  }
];
export const dsiSiteAvailabilityTableMockData = [
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l1',
    status: MachineStateNames.Running,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    utilization: '82%'
  },
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l2',
    status: MachineStateNames.NoProduct,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    utilization: '87.5%'
  },
  {
    id: '86a1dca2-9e25-4b0d-8e55-1d92e69f4f1c',
    description: 'DSI-888-4409',
    lineName: 'l3',
    status: MachineStateNames.NoProduct,
    numCurrentAlarms: 0,
    numAlarmsOverPeriod: 0,
    productionOverPeriod: 0,
    utilizationOverPeriod: 0,
    oee: '84% Avg'
  }
];

export const dsiProductMockData = {
  infeed: {
    title: 'Infeed Piece Size',
    values: [{ value: '477', valueTitle: 'avg. last hour', unit: 'g' }]
  },
  fillet: {
    title: 'Outback Fillet',
    subTitle: 'Current PSU',
    values: [
      { value: '42110', valueTitle: 'Application 1', unit: '' },
      { value: '34290', valueTitle: 'Application 2', unit: '' },
      { value: '41128', valueTitle: 'Application 3', unit: '' }
    ]
  }
};
export const dsiProductTypeMockData = [
  {
    title: 'Product Type 01',
    value: '3,987',
    valueTitle: 'Calculated output',
    unit: 'lbs'
  },
  {
    title: 'Product Type 02',
    value: '3,810',
    valueTitle: 'Calculated output',
    unit: 'lbs'
  },
  {
    title: 'Product Type 03',
    value: '4,110',
    valueTitle: 'Calculated output',
    unit: 'lbs'
  }
];
