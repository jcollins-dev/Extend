import {
  BaseTag,
  BaseTagDataType,
  BaseTagType,
  CleaningSession,
  CleaningState,
  CleaningStepGroup,
  CleaningStepWithKPI,
  DataAnalysisProperties,
  DataAnalysisView,
  MachineTagsModel,
  ProteinMachineCategoryStates,
  SiteTableDataType,
  WidgetType
} from 'types/protein';
import { Alarm, AlarmType, AlarmSummary } from 'types/machine-health/alarms';
import { Alert, AlertStatus, AlertType } from 'types/machine-health/alerts';
import { WidgetTableDataItem, WidgetTableDropdownItem } from 'types/machine-health';
import { BarPeriod } from 'components/StateOverTimeChart';
import { BarDatum } from 'components/StackedBarChartOverTime';
import theme from 'themes';
import { INNER_DRIVE_TORQUE, OUTER_DRIVE_TORQUE } from 'constants/machineTags';

export const testAlertsData: Alert[] = [
  {
    id: 'id-1',
    alertType: AlertType.Operations,
    description: 'Alert 1 description',
    createdAt: '2022-04-19T00:00:00.000Z',
    status: AlertStatus.Complete
  },
  {
    id: 'id-2',
    alertType: AlertType.Operations,
    description: 'Alert 2 description',
    createdAt: '2022-04-19T00:01:00.000Z',
    status: AlertStatus.NotComplete
  }
];

export const testAlarms = [
  {
    code: '100',
    startTimestamp: '2022-01-01T00:00:00.000Z',
    endTimestamp: '2022-01-01T01:00:00.000Z',
    type: AlarmType.Alarm,
    location: 'location-1',
    description: 'description-1'
  },
  {
    code: '101',
    startTimestamp: '2022-01-02T00:00:00.000Z',
    endTimestamp: '2022-01-02T01:00:00.000Z',
    type: AlarmType.CriticalAlarm,
    location: 'location-2',
    description: 'description-2'
  },
  {
    code: '102',
    startTimestamp: '2022-01-03T00:00:00.000Z',
    endTimestamp: '2022-01-03T01:00:00.000Z',
    type: AlarmType.CriticalAlarm,
    location: 'location-3',
    description: 'description-3'
  },
  {
    code: '103',
    startTimestamp: '2022-01-04T00:00:00.000Z',
    endTimestamp: '2022-01-04T01:00:00.000Z',
    type: AlarmType.CriticalAlarm,
    location: 'location-4',
    description: 'description-4'
  },
  {
    code: '104',
    startTimestamp: '2022-01-05T00:00:00.000Z',
    endTimestamp: '2022-01-05T01:00:00.000Z',
    type: AlarmType.CriticalAlarm,
    location: 'location-5',
    description: 'description-5'
  }
];

export const testCleaningStepsData: CleaningStepWithKPI[] = [
  {
    id: '1',
    name: 'Defrost',
    status: '5',
    alarms: testAlarms,
    startTime: '2022-01-01T00:00:00.000Z',
    endTime: '2022-01-01T00:10:00.000Z',
    avgOverTime: 45000,
    kpis: [],
    parentName: 'parent',
    subSteps: [
      {
        id: '1a',
        name: 'Child 1',
        parentName: 'parent',
        status: '5',
        alarms: testAlarms,
        startTime: '2022-01-01T00:00:00.000Z',
        endTime: '2022-01-01T00:01:00.000Z',
        avgOverTime: 45000,
        kpis: [
          {
            value: '101',
            unit: 'unit',
            label: 'KPI 1a-1'
          },
          {
            value: '0.2',
            unit: 'unit',
            label: 'KPI 1a-2'
          }
        ]
      },
      {
        id: '1b',
        name: 'Child 2',
        parentName: 'parent',
        status: 'completed',
        startTime: '2022-01-01T00:00:00.000Z',
        endTime: '2022-01-01T00:01:00.000Z',
        avgOverTime: 45000,
        kpis: []
      }
    ]
  },
  {
    id: '2',
    name: 'Pre-rinse',
    status: 'completed',
    startTime: '2022-01-01T00:00:00.000Z',
    endTime: '2022-01-01T00:01:00.000Z',
    avgOverTime: 45000,
    parentName: 'parent',
    kpis: [
      {
        value: '2',
        unit: 'unit',
        label: 'KPI 2-1'
      },
      {
        value: '0.2',
        unit: 'unit',
        label: 'KPI 2-2'
      },
      {
        value: '0.3',
        unit: 'unit',
        label: 'KPI 2-3'
      }
    ]
  }
] as CleaningStepWithKPI[];

// Test data for StateOverTimeChart
export const testCleaningStepsOverTimeBars: BarPeriod[] = [
  {
    state: 'defrost',
    startTime: new Date('2021-01-01T00:00:00.000Z'),
    endTime: new Date('2021-01-01T00:01:00.000Z')
  },
  {
    state: 'foaming',
    startTime: new Date('2021-01-01T00:01:00.000Z'),
    endTime: new Date('2021-01-01T00:02:00.000Z')
  },
  {
    state: 'rinse',
    startTime: new Date('2021-01-01T00:03:00.000Z'),
    endTime: new Date('2021-01-01T00:04:00.000Z')
  },
  {
    state: 'inspection',
    startTime: new Date('2021-01-01T00:04:00.000Z'),
    endTime: new Date('2021-01-01T00:04:30.000Z')
  },
  {
    state: 'foaming of belt, evaporator and equipment',
    startTime: new Date('2021-01-01T00:05:00.000Z'),
    endTime: new Date('2021-01-01T00:06:00.000Z')
  }
];

export const testCleaningStatesResponse: CleaningState[] = [
  {
    stateCode: 0,
    stateName: 'Stopped',
    startTimestamp: '2021-01-01T00:00:00.000Z',
    endTimestamp: '2021-01-01T00:01:00.000Z'
  },
  {
    stateCode: 1,
    stateName: 'Running',
    startTimestamp: '2021-01-01T00:01:00.000Z',
    endTimestamp: '2021-01-01T00:02:00.000Z'
  },
  {
    stateCode: 2,
    stateName: 'Idle',
    startTimestamp: '2021-01-01T00:02:00.000Z',
    endTimestamp: '2021-01-01T00:04:00.000Z'
  },
  {
    stateCode: 3,
    stateName: 'Waiting for Operator',
    startTimestamp: '2021-01-01T00:04:00.000Z',
    endTimestamp: '2021-01-01T00:05:00.000Z'
  },
  {
    stateCode: 2,
    stateName: 'Idle',
    startTimestamp: '2021-01-01T00:05:00.000Z',
    endTimestamp: '2021-01-01T00:06:00.000Z'
  }
];

export const testCleaningWaitStatesResponse: CleaningState[] = [
  {
    stateCode: 0,
    stateName: 'Waiting',
    startTimestamp: '2022-01-26T00:00:00.000Z',
    endTimestamp: '2022-01-26T03:00:00.000Z'
  },
  {
    stateCode: 0,
    stateName: 'Waiting',
    startTimestamp: '2022-01-27T00:04:30.000Z',
    endTimestamp: '2022-01-27T03:05:00.000Z'
  }
];

export const mockCleaningStepGroup: CleaningStepGroup[] = [
  {
    id: '1',
    name: 'Equipment defrost',
    percent: 2.5,
    duration: 2_500
  },
  {
    id: '2',
    name: 'Drying',
    percent: 30,
    duration: 30_000
  },
  {
    id: '3',
    name: 'Rinse',
    percent: 15,
    duration: 15_000
  },
  {
    id: '4',
    name: 'Defrost',
    percent: 15,
    duration: 15_000
  },
  {
    id: '5',
    name: 'Foaming',
    percent: 30,
    duration: 30_000
  },
  {
    id: '6',
    name: 'Disinfection',
    percent: 3.5,
    duration: 3_500
  },
  {
    id: '7',
    name: 'Circuit rinse',
    percent: 2,
    duration: 2_000
  },
  {
    id: '8',
    name: 'Foaming of belt, evaporator and equipment',
    percent: 2,
    duration: 2_000
  }
] as CleaningStepGroup[];

export const mockStackedBarChartOverTimeData: BarDatum[][] = [
  [
    {
      id: '1',
      name: 'foaming',
      y: 400,
      x: new Date('2020-01-01T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },
    {
      id: '1',
      name: 'foaming',
      y: 300,
      x: new Date('2020-01-02T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },
    {
      id: '1',
      name: 'foaming',
      y: 200,
      x: new Date('2020-01-03T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },
    {
      id: '1',
      name: 'foaming',
      y: 100,
      x: new Date('2020-01-04T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },

    {
      id: '1',
      name: 'foaming',
      y: 200,
      x: new Date('2020-01-05T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    }
  ],
  [
    {
      id: '2',
      name: 'defrost',
      y: 100,
      x: new Date('2020-01-01T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },
    {
      id: '2',
      name: 'defrost',
      y: 100,
      x: new Date('2020-01-02T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },
    {
      id: '2',
      name: 'defrost',
      y: 100,
      x: new Date('2020-01-03T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },
    {
      id: '2',
      name: 'defrost',
      y: 100,
      x: new Date('2020-01-04T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },

    {
      id: '2',
      name: 'defrost',
      y: 200,
      x: new Date('2020-01-05T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    }
  ],
  [
    {
      id: '3',
      name: 'rinse',
      y: 400,
      x: new Date('2020-01-01T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },
    {
      id: '3',
      name: 'rinse',
      y: 200,
      x: new Date('2020-01-02T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },
    {
      id: '3',
      name: 'rinse',
      y: 400,
      x: new Date('2020-01-03T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },
    {
      id: '3',
      name: 'rinse',
      y: 200,
      x: new Date('2020-01-04T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },

    {
      id: '3',
      name: 'rinse',
      y: 200,
      x: new Date('2020-01-05T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    },

    {
      id: '3',
      name: 'rinse',
      y: 200,
      x: new Date('2020-01-10T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    }
  ],
  [
    {
      id: '4',
      name: 'foaming of belt, evaporator and equipment',
      y: 400,
      x: new Date('2020-01-05T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    }
  ],
  [
    {
      id: '5',
      name: 'circuit rinse',
      y: 300,
      x: new Date('2020-01-04T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    }
  ],
  [
    {
      id: '6',
      name: 'disinfection',
      y: 300,
      x: new Date('2020-01-04T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    }
  ],
  [
    {
      id: '7',
      name: 'equipment defrost',
      y: 300,
      x: new Date('2020-01-08T00:00:00.000Z'),
      toolTipData: {
        count: 5,
        day: '2023-04-18T00:00:00-07:00',
        label: 'success'
      }
    }
  ]
];

export const testCleaningSessionData: CleaningSession[] = [
  {
    startTimestamp: '2022-01-01T00:00:00.000Z',
    endTimestamp: '2022-01-01T00:10:00.000Z',
    alarms: 0
  },
  {
    startTimestamp: '2022-01-02T00:00:00.000Z',
    endTimestamp: '2022-01-02T00:10:00.000Z',
    alarms: 1
  },
  {
    startTimestamp: '2022-01-02T00:00:00.000Z',
    endTimestamp: '2022-01-02T00:10:00.000Z',
    alarms: 10
  }
];

export const testAlarmsPastSessionData: Alarm[] = [
  {
    code: '81',
    description: 'Door left open too long',
    startTimestamp: '2022-01-01T00:00:00.000Z',
    endTimestamp: '2022-01-01T00:10:00.000Z',
    type: AlarmType.Alarm,
    location: 'Cleaning'
  },
  {
    code: '80',
    description: 'Water unavailable',
    startTimestamp: '2022-01-01T10:00:00.000Z',
    endTimestamp: '2022-01-01T10:20:00.000Z',
    type: AlarmType.Alarm,
    location: 'Cleaning'
  },
  {
    code: '14',
    description: 'No power',
    startTimestamp: '2022-01-01T10:00:00.000Z',
    endTimestamp: '2022-01-01T10:20:00.000Z',
    type: AlarmType.Alarm,
    location: 'Cleaning'
  }
];

export const mockAlarmsTableData: Alarm[] = [
  {
    code: '21',
    description: 'Water temperature out of range',
    startTimestamp: '2022-01-01T00:00:00.000Z',
    endTimestamp: '2022-01-01T00:10:00.000Z',
    type: AlarmType.Alarm,
    location: 'Cleaning'
  },
  {
    code: '18',
    description: 'Foaming incomplete',
    startTimestamp: '2022-01-01T10:00:00.000Z',
    endTimestamp: '2022-01-01T10:20:00.000Z',
    type: AlarmType.Alarm,
    location: 'Cleaning'
  },
  {
    code: '56',
    description: 'Alarm name',
    startTimestamp: '2022-01-01T11:00:00.000Z',
    endTimestamp: '2022-01-01T11:20:00.000Z',
    type: AlarmType.CriticalAlarm,
    location: 'Cleaning'
  },
  {
    code: '52',
    description: 'Alarm name 2',
    startTimestamp: '2022-01-01T12:00:00.000Z',
    endTimestamp: '2022-01-01T12:20:00.000Z',
    type: AlarmType.CriticalAlarm,
    location: 'Cleaning'
  },
  {
    code: '78',
    description: 'Alarm name 3',
    startTimestamp: '2022-01-01T13:00:00.000Z',
    endTimestamp: '2022-01-01T13:20:00.000Z',
    type: AlarmType.WarningInformation,
    location: 'Cleaning'
  }
];

export const mockAlarmSummaryTableData: AlarmSummary[] = [
  {
    code: '21',
    description: 'Water temperature out of range',
    totalTime: 30000,
    count: 1,
    type: AlarmType.Alarm
  },
  {
    code: '18',
    description: 'Foaming incomplete',
    totalTime: 60000,
    count: 2,
    type: AlarmType.Alarm
  }
];

export const testMachineKpis = [
  { label: 'Active recipe', value: { key: 'kpi-0', content: 'xx', clickable: true } },
  {
    label: 'Zone',
    value: {
      key: 'kpi-1',
      weight: 500,
      height: 33,
      color: theme.colors.darkGrey,
      bgColor: theme.colors.lightGrey2
    }
  },
  { label: 'Air Temperature', value: { key: 'kpi-2', content: '30°C', clickable: true } },
  { label: 'Belt Speed', value: { key: 'kpi-3', content: '1000 m/min', clickable: true } },
  {
    label: 'Evaporator 1',
    value: {
      key: 'kpi-4',
      content: '90°C',
      color: theme.colors.atRiskYellow,
      bgColor: theme.colors.atRiskYellow4,
      weight: 500,
      clickable: true
    }
  }
];

export const testExtendedMachineKpis = [
  {
    label: 'Zone',
    value: {
      key: 'ext-0',
      weight: 500,
      height: 33,
      color: theme.colors.darkGrey,
      bgColor: theme.colors.lightGrey2
    }
  },
  {
    label: 'Belt Run Distance',
    value: { key: 'ext-1', content: '5906.0 km', clickable: true, color: theme.colors.darkGrey }
  },
  {
    label: 'Belt Run Time',
    value: { key: 'ext-2', content: '9820 hours', clickable: true, color: theme.colors.darkGrey }
  },
  {
    label: 'Belt Speed',
    value: { key: 'ext-3', content: '5.9 M/Min', clickable: true, color: theme.colors.darkGrey }
  },
  {
    label: 'Air Temperature Stack 1',
    value: { key: 'ext-4', content: '-35.2 °C', clickable: true, color: theme.colors.darkGrey }
  },
  {
    label: 'Evaporator 1 Temperature',
    value: { key: 'ext-5', content: '-36.9 °C', clickable: true, color: theme.colors.darkGrey }
  },
  {
    label: 'Rail Temperature',
    value: {
      key: 'ext-6',
      content: '5.9 M/-33.4 °C',
      clickable: true,
      color: theme.colors.darkGrey
    }
  }
];

export const testCleaningKpis = [
  {
    label: 'Status',
    value: { content: 'Completed', weight: 700 }
  },
  {
    label: 'Start Time',
    value: { content: '12:50 22/01/2021' }
  },
  {
    label: 'Duration (h)',
    value: { content: '13:40' }
  }
];

export const testMachineAlarmKpis = testAlarmsPastSessionData;

export const dataAnalysisTags: MachineTagsModel[] = [
  { tagId: 'AlarmNumber_0', name: 'AlarmNumber_0', value: 673.0, unit: '' },
  { tagId: 'AlarmNumber_1', name: 'AlarmNumber_1', value: 173.0, unit: '' },
  { tagId: 'AlarmNumber_2', name: 'AlarmNumber_2', value: 169.0, unit: '' },
  { tagId: 'AlarmNumber_3', name: 'AlarmNumber_3', value: 165.0, unit: '' },
  { tagId: 'AlarmNumber_4', name: 'AlarmNumber_4', value: 161.0, unit: '' },
  { tagId: 'CleaningState', name: 'Cleaning State', value: 1.0, unit: '' },
  { tagId: 'DriveSystem01State', name: 'DriveSystem 1 State', value: 6.0, unit: '' },
  { tagId: 'EquipmentAlarmState', name: 'Equipment Alarm State', value: 20.0, unit: '' },
  { tagId: 'F01_CntrlPnlA1_Te', name: '', value: 26.3, unit: '' },
  { tagId: 'F04_DistanceCounter', name: 'Belt Run Distance', value: 7.0, unit: 'km' },
  { tagId: 'F04_HourCounter', name: 'Belt Run Time', value: 6.0, unit: 'hours' },
  { tagId: 'F04_InDrv01_VFD_Current', name: 'Inner Drive Current', value: 0.31, unit: 'Amps' },
  { tagId: 'F04_InDrv01_VFD_Frq', name: 'Inner Drive Frequency', value: 0.0, unit: '' },
  { tagId: 'F04_InDrv01_VFD_Trq', name: 'Inner Drive Torque', value: 0.21, unit: 'Nm' },
  { tagId: 'F04_OutDrv01_PID_Output', name: '', value: 0.0, unit: '' },
  { tagId: 'F04_OutDrv01_PID_PV', name: '', value: 55.16, unit: '' },
  { tagId: 'F04_OutDrv01_PID_SP', name: '', value: 50.0, unit: '' },
  { tagId: 'F04_OutDrv01_VFD_Current', name: 'Outer Drive Current', value: 0.44, unit: 'Amps' },
  { tagId: 'F04_OutDrv01_VFD_Frq', name: 'Outer Drive Frequency', value: 0.0, unit: '' },
  { tagId: 'F04_OutDrv01_VFD_Trq', name: 'Outer Drive Torque', value: 0.35, unit: '' },
  { tagId: 'F04_Outfeed01_BeltTen_PV', name: 'Outfeed Belt tension', value: 1.16, unit: '' },
  { tagId: 'F04_Outfeed01_MtrTe', name: 'Outfeed motor temperature', value: 29.1, unit: '' },
  { tagId: 'F04_Outfeed01_PID_Output', name: '', value: 0.0, unit: '' },
  { tagId: 'F04_Outfeed01_PID_PV', name: '', value: 33.0, unit: '' },
  {
    tagId: 'F04_Outfeed01_VFD_BeltTen_PV',
    name: 'Outfeed 1 belt tension',
    value: 27.0,
    unit: ''
  },
  { tagId: 'F04_Outfeed01_VFD_Current', name: 'Outfeed 1 Current', value: 0.19, unit: '' },
  { tagId: 'F04_Outfeed01_VFD_Frq', name: 'Outfeed 1 Frequency', value: 0.0, unit: '' },
  { tagId: 'F04_Outfeed01_VFD_Trq', name: 'Outfeed 1 Torque', value: 0.08, unit: '' },
  { tagId: 'F04_PV_BeltSpeed01', name: 'Belt 1 Speed', value: 0.0, unit: '' },
  { tagId: 'F04_PV_RailTemperature', name: 'Rail Temperature', value: 23.6, unit: '°C' },
  { tagId: 'F05_AirB_Fan01_PID_PV', name: '', value: 23.63, unit: '' },
  { tagId: 'F05_AirB_Fan01_PID_SP', name: '', value: 30.15, unit: '' },
  {
    tagId: 'F05_AirB_Fan01_PV_AmbTe',
    name: 'ABT  Ambient temperature',
    value: 24.3,
    unit: ''
  },
  {
    tagId: 'F05_AirB_Fan01_PV_OutFdTe',
    name: 'ABT Outfeed temperature',
    value: 23.63,
    unit: ''
  },
  { tagId: 'F06_CleaningPumpState', name: 'Cleaning Pump State', value: 1.0, unit: '' },
  { tagId: 'F06_CleaningStepNumber', name: 'Cleaning Step number', value: 5.0, unit: '' },
  {
    tagId: 'F08_CliModEvap_1_PV_DiffP',
    name: 'Pressure drop over Evaporator 1',
    value: 0.0,
    unit: ''
  },
  {
    tagId: 'F08_CliModEvap_1_PV_EvapTe',
    name: 'Evaporator 1 Temperature',
    value: 26.0,
    unit: '°C'
  },
  {
    tagId: 'F08_CliModEvap_2_PV_DiffP',
    name: 'Pressure drop over Evaporator 2',
    value: 0.0,
    unit: ''
  },
  {
    tagId: 'F08_CliModEvap_2_PV_EvapTe',
    name: 'Evaporator 2 Temperature',
    value: 0.0,
    unit: ''
  },
  { tagId: 'F08_LVS_1_SucCtrl_PID_PV', name: '', value: 26.0, unit: '' },
  { tagId: 'F08_LVS_1_SucCtrl_PID_SP', name: '', value: 26.0, unit: '' },
  { tagId: 'F08_LVS_1_SucCtrl_PV_SucP_LVS', name: '', value: 2.24, unit: '' },
  { tagId: 'F08_LVS_1_SucCtrl_PV_SucTeLVS', name: '', value: -7.32, unit: '' },
  { tagId: 'F08_PV_AirTemperature01', name: 'Air Temperature', value: 26.0, unit: '°C' },
  { tagId: 'F08_PV_AirTemperature02', name: 'Air Temperature', value: 0.0, unit: '' },
  { tagId: 'F08_PV_Humidity', name: 'Humidity', value: 3.40282296e37, unit: '' },
  { tagId: 'MainFansState', name: 'Main Fans State', value: 6.0, unit: '' },
  { tagId: 'ManualModeState', name: 'Manual Mode State', value: 4.0, unit: '' },
  { tagId: 'ProductionState', name: 'Production State', value: 1.0, unit: '' }
];

export const dataAnalysisTemplates: DataAnalysisView[] = [
  {
    viewName: 'Temperature Graph',
    viewId: 'JBT-1',
    timestampCreated: 'Added 1 month ago'
  },
  {
    viewName: 'Humidity Graph',
    viewId: 'JBT-2',
    timestampCreated: 'Added 1 month ago'
  }
];

export const dataAnalysisProperties: DataAnalysisProperties[] = [
  {
    id: 1,
    name: 'Air temperature before HX - zone 01',
    unit: '°C',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 2,
    name: 'Air temperature after HX - zone 01',
    unit: '°C',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 3,
    name: 'Active Alarm Count 24h',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 4,
    name: 'Active Alarm Count',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 5,
    name: 'Active Alarm Count',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 6,
    name: 'Alarm Number 0',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 7,
    name: 'Alarm Number 1',
    unit: 'Number',
    right: false,
    left: false,
    enabled: false,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 8,
    name: 'Alarm Number 2',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 9,
    name: 'Alarm Number 3',
    unit: 'Number',
    right: false,
    left: false,
    enabled: false,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 10,
    name: 'Alarm Number 4',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 11,
    name: 'Alarm Number 5',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 12,
    name: 'Cleaning End State',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 13,
    name: 'Cleaning Start State',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 14,
    name: 'Cleaning Start Step',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 15,
    name: 'Cleaning State',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 16,
    name: 'Cleaning State 1',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 17,
    name: 'Cleaning State 2',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 18,
    name: 'Cleaning State 3',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 19,
    name: 'Cleaning State 4',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  },
  {
    id: 20,
    name: 'Cleaning State 5',
    unit: 'Number',
    right: false,
    left: false,
    enabled: true,
    link: 'L1',
    fullname: 'F08_Climod_1_Steam_PID_Hu_Output'
  }
];

export const mockLineSeries = [
  {
    mode: 'LINE',
    id: 'belt-speed',
    label: 'Belt Speed',
    color: '#E5E9ED',
    unit: 'km/h',
    data: [
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 100 },
      { x: new Date('2020-01-02T01:00:00.000Z'), y: 50 },
      { x: new Date('2020-01-03T02:00:00.000Z'), y: 30 },
      { x: new Date('2020-01-04T03:00:00.000Z'), y: 80 },
      { x: new Date('2020-01-05T04:00:00.000Z'), y: 101 },
      { x: new Date('2020-01-06T05:00:00.000Z'), y: 90 },
      { x: new Date('2020-01-07T05:00:00.000Z'), y: 90 },
      { x: new Date('2020-01-08T05:00:00.000Z'), y: 90 },
      { x: new Date('2020-01-09T05:00:00.000Z'), y: 90 },
      { x: new Date('2020-01-10T05:00:00.000Z'), y: 90 }
    ]
  },
  {
    mode: 'LINE',
    id: 'rail-temperature',
    label: 'Rail Temperature',
    color: '#28B981',
    unit: '°C',
    data: [
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 50 },
      { x: new Date('2020-01-02T01:00:00.000Z'), y: 20 },
      { x: new Date('2020-01-03T02:00:00.000Z'), y: 70 },
      { x: new Date('2020-01-04T03:00:00.000Z'), y: 20 },
      { x: new Date('2020-01-05T04:00:00.000Z'), y: 0 },
      { x: new Date('2020-01-06T05:00:00.000Z'), y: 40 },
      { x: new Date('2020-01-07T05:00:00.000Z'), y: -50 },
      { x: new Date('2020-01-08T05:00:00.000Z'), y: -10 },
      { x: new Date('2020-01-09T05:00:00.000Z'), y: 30 },
      { x: new Date('2020-01-10T05:00:00.000Z'), y: 60 }
    ]
  },
  {
    mode: 'LINE',
    id: 'air-temperature-stack-1',
    label: 'Air Temperature Stack 1',
    color: '#AB091E',
    unit: '°C',
    data: [
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 10 },
      { x: new Date('2020-01-02T01:00:00.000Z'), y: 30 },
      { x: new Date('2020-01-03T02:00:00.000Z'), y: 60 },
      { x: new Date('2020-01-04T03:00:00.000Z'), y: 50 },
      { x: new Date('2020-01-05T04:00:00.000Z'), y: 40 },
      { x: new Date('2020-01-06T05:00:00.000Z'), y: 10 },
      { x: new Date('2020-01-07T05:00:00.000Z'), y: -20 },
      { x: new Date('2020-01-08T05:00:00.000Z'), y: 10 },
      { x: new Date('2020-01-09T05:00:00.000Z'), y: 60 },
      { x: new Date('2020-01-10T05:00:00.000Z'), y: 90 }
    ]
  },
  {
    mode: 'LINE',
    id: 'evaporator-1-temperature',
    label: 'Evaporator 1 Temperature',
    color: '#0A70FF',
    unit: '°C',
    data: [
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 80 },
      { x: new Date('2020-01-02T01:00:00.000Z'), y: 60 },
      { x: new Date('2020-01-03T02:00:00.000Z'), y: 50 },
      { x: new Date('2020-01-04T03:00:00.000Z'), y: 40 },
      { x: new Date('2020-01-05T04:00:00.000Z'), y: 30 },
      { x: new Date('2020-01-06T05:00:00.000Z'), y: 20 },
      { x: new Date('2020-01-07T05:00:00.000Z'), y: -20 },
      { x: new Date('2020-01-08T05:00:00.000Z'), y: 60 },
      { x: new Date('2020-01-09T05:00:00.000Z'), y: 90 },
      { x: new Date('2020-01-10T05:00:00.000Z'), y: 100 }
    ]
  }
];

export const mockScatterSeries = {
  mode: 'SCATTER',
  id: 'categories',
  color: '#0A70FF',
  data: [
    { x: new Date('2020-01-01T00:00:00.000Z'), y: 0 },
    { x: new Date('2020-01-02T03:00:00.000Z'), y: 0 },
    { x: new Date('2020-01-07T05:00:00.000Z'), y: 0 },
    { x: new Date('2020-01-08T05:00:00.000Z'), y: 0 }
  ]
};

/**
 * Site / Line views
 */
export const mockSiteTableMachines: SiteTableDataType[] = [
  {
    machine: 'bd8e9bbf',
    status: ProteinMachineCategoryStates.Running,
    issuesCurrent: 5,
    issuesPast: 4,
    line: 6601,
    configurationType: 'My config',
    production: '16h',
    utilization: '20h'
  },
  {
    machine: 'a8cd2e7f601f',
    status: ProteinMachineCategoryStates.Idle,
    issuesCurrent: 5,
    issuesPast: 4,
    line: 6601,
    configurationType: 'TWINDRUM TDT-6-14-R10-E-CCR',
    production: '16h',
    utilization: '20h'
  },
  {
    machine: '9ab7f601f',
    status: ProteinMachineCategoryStates.Stop,
    issuesCurrent: 15,
    issuesPast: 0,
    line: 6601,
    configurationType: 'My config',
    production: '16h',
    utilization: '20h'
  },
  {
    machine: '9ab7f601f',
    status: ProteinMachineCategoryStates.Stop,
    issuesCurrent: 15,
    issuesPast: 1,
    line: 6601,
    configurationType: 'TWINDRUM TDT-6-14-R10-E-CCR',
    production: '16h',
    utilization: '20h'
  }
];

export const mockSiteTableLines: SiteTableDataType[] = [
  {
    lines: 'bd8e9bbf',
    status: ProteinMachineCategoryStates.Running,
    issuesCurrent: 5,
    issuesPast: 4,
    production: '16h',
    utilization: '20h'
  },
  {
    lines: '9ab7f601f',
    status: ProteinMachineCategoryStates.Running,
    issuesCurrent: 15,
    issuesPast: 0,
    production: '16h',
    utilization: '20h'
  },
  {
    lines: '9ab7f601f',
    status: ProteinMachineCategoryStates.Idle,
    issuesCurrent: 15,
    issuesPast: 1,
    production: '16h',
    utilization: '20h'
  }
];

export const driveTorqueRatioTestData: BaseTag[] = [
  {
    type: BaseTagType.Tag,
    id: INNER_DRIVE_TORQUE,
    meta: {
      dataType: BaseTagDataType.Float
    },
    name: 'Inner',
    unit: 'm/s',
    values: [
      { timestamp: '2020-01-01T00:00:00.000Z', value: 9 },
      { timestamp: '2020-01-01T01:00:00.000Z', value: 10 }
    ]
  },
  {
    type: BaseTagType.Tag,
    id: OUTER_DRIVE_TORQUE,
    meta: {
      dataType: BaseTagDataType.Float
    },
    name: 'Outer',
    unit: 'm/s',
    values: [
      { timestamp: '2020-01-01T00:00:00.000Z', value: 14 },
      { timestamp: '2020-01-01T01:00:00.000Z', value: 15 }
    ]
  }
];

const testRowData: WidgetTableDataItem[] = [...new Array(3)].map((_, i) => ({
  active: i % 2 === 0,
  editable: i <= 1,
  members: [...new Array(3)].map((_, j) => ({
    active: false,
    editable: true,
    members:
      j <= 1
        ? [...new Array(3)].map((_, k) => ({
            editable: true,
            id: `row-1-${i}-${j}-${k}`,
            name: `Tag Group ${i}-${j}-${k} name`,
            tags: [...new Array(2)].map((_, l) => ({
              id: `tag${i}-${j}-${k}-${l}`,
              name: `Tag ${l} Name`,
              type: WidgetType.State,
              values: [...new Array(2)].map((_, m) => ({
                value: `Tag ${l} Value ${m}`,
                name: 'Running'
              }))
            })),
            widgetType: WidgetType.TagGroup
          }))
        : null,
    id: `row-1-${i}-${j}`,
    name: `Widget ${i}-${j} name`,
    tags: [...new Array(2)].map((_, l) => ({
      id: `tag-${i}-${j}-${l}`,
      name: `Tag ${l} Name`,
      type: WidgetType.State,
      values: [...new Array(2)].map((_, m) => ({
        value: `Tag ${l} Value ${m}`,
        name: 'Running'
      }))
    })),
    toggleActive: true,
    widgetType: WidgetType.MatrixWidget
  })),
  id: `row-0-${i}`,
  name: i <= 0 ? undefined : `Widget Group ${i} name`,
  tags:
    i === 2
      ? [...new Array(2)].map((_, l) => ({
          id: `tag${l}`,
          name: `Tag ${l} Name`,
          type: WidgetType.State,
          values: [...new Array(2)].map((_, m) => ({
            value: `Tag ${l} Value ${m}`,
            name: 'Running'
          }))
        }))
      : null,
  toggleActive: i <= 3,
  widgetType:
    i <= 0
      ? WidgetType.MatrixWidgetGroup
      : i === 1
      ? WidgetType.CurrentIssues
      : WidgetType.TorqueChart
}));

export const testConfigResponse = {
  // The entire section of product processing
  members: [...new Array(3)].map((_, i) => ({
    active: true,
    canBeEdited: true,
    canBeExpanded: true,
    members: testRowData,
    id: `test-id-${i}`,
    label: 'PP_OV',
    name: i === 0 ? 'Overview' : i === 1 ? 'Heat Exchangers/Fans' : 'Extra Sensors',
    toggleActive: true
  })),
  id: '35346-2346354-235436',
  label: 'PP',
  name: 'Product Processing',
  widgetType: 'structure'
};

export const testMatrixTableTypes: WidgetTableDropdownItem[] = [
  { id: 'table-item-id-1', name: 'Matrix Widget', type: WidgetType.MatrixWidget }
];

export const testWidgetTypes: WidgetTableDropdownItem[] = [
  { id: 'widget-item-id-1', name: 'Tag Group', type: WidgetType.TagGroup }
];

export const testMasterTagList: WidgetTableDropdownItem[] = [...new Array(10)].map((_, l) => ({
  id: `new-tag-${l}`,
  name: `Tag ${l} Name`,
  type: WidgetType.State,
  values: [...new Array(2)].map((_, m) => ({
    value: `Tag ${l} Value ${m}`,
    name: 'Running'
  }))
}));
