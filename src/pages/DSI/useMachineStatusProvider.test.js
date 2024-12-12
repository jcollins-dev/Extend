import { DSIKpiId } from 'types/dsi';
import { NUM_OF_TIMESTAMPS_TO_CHECK } from './useMachineStatusProvider';
import { find } from 'lodash';

const machineStatus = (currentKpiResultResponses, currentKpiResult, lastConnectedDates) => {
  // 1. Check if api call is the same or not,
  // this way we determine if machine is running or offline
  if (currentKpiResultResponses?.current?.length === 2) {
    currentKpiResult && currentKpiResultResponses?.current?.shift();
  }

  currentKpiResult && currentKpiResultResponses?.current?.push(currentKpiResult);

  if (currentKpiResultResponses?.current?.length === 2) {
    const obj1 = JSON.stringify(currentKpiResultResponses?.current[0]);
    const obj2 = JSON.stringify(currentKpiResultResponses?.current[1]);
    if (obj1 === obj2) {
      return true;
    }
  } else {
    return false;
  }

  //2. Once we established that api is returning different values(machine is running)
  // then we compare timestamps
  const stateObject = find(currentKpiResult, (e) => {
    return e.id === DSIKpiId.StateName;
  });

  const state = stateObject?.value?.value?.toString();
  const timestamp = stateObject?.value?.timestamp.toString();

  if (lastConnectedDates?.current?.length === NUM_OF_TIMESTAMPS_TO_CHECK) {
    lastConnectedDates?.current?.shift();
  }

  timestamp && lastConnectedDates?.current?.push(timestamp);

  //compare dates only when array has all values
  if (lastConnectedDates?.current?.length === NUM_OF_TIMESTAMPS_TO_CHECK) {
    const isSameTimestamp = new Set(lastConnectedDates?.current);
    if (isSameTimestamp.size === 1) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

describe('DSI isMachineConnected logic', () => {
  it('DSI is disconnected == FALSE', () => {
    const currentKpiResult = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-07-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:40:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResultResponses = {};
    currentKpiResultResponses.current = [];

    const lastConnectedDates = {};
    lastConnectedDates.current = [];

    const isDisconnected = machineStatus(
      currentKpiResultResponses,
      currentKpiResult,
      lastConnectedDates
    );
    expect(isDisconnected).toEqual(false);
  });

  it('DSI is disconnected == TRUE', () => {
    const currentKpiResult = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-07-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:40:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResult2 = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-07-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:40:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResultResponses = {};
    currentKpiResultResponses.current = [currentKpiResult];

    const lastConnectedDates = {};
    lastConnectedDates.current = [];

    const isDisconnected = machineStatus(
      currentKpiResultResponses,
      currentKpiResult2,
      lastConnectedDates
    );
    expect(isDisconnected).toEqual(true);
  });

  it('DSI is disconnected == FALSE', () => {
    const currentKpiResult = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-07-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:40:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResult2 = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-08-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:40:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResultResponses = {};
    currentKpiResultResponses.current = [currentKpiResult, currentKpiResult];

    const lastConnectedDates = {};
    lastConnectedDates.current = [];

    const isDisconnected = machineStatus(
      currentKpiResultResponses,
      currentKpiResult2,
      lastConnectedDates
    );
    expect(isDisconnected).toEqual(false);
  });

  it('DSI is disconnected == FALSE', () => {
    const currentKpiResult = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-07-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:40:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResult2 = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-08-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:40:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResultResponses = {};
    currentKpiResultResponses.current = [currentKpiResult, currentKpiResult];

    const lastConnectedDates = {};
    lastConnectedDates.current = ['2023-07-10T02:40:42.074647'];

    const isDisconnected = machineStatus(
      currentKpiResultResponses,
      currentKpiResult2,
      lastConnectedDates
    );
    expect(isDisconnected).toEqual(false);
  });

  it('DSI is disconnected == FALSE', () => {
    const currentKpiResult = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-07-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:40:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResult2 = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-08-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:41:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResultResponses = {};
    currentKpiResultResponses.current = [currentKpiResult, currentKpiResult];

    const lastConnectedDates = {};
    lastConnectedDates.current = [
      '2023-07-10T02:40:42.074647',
      '2023-07-10T02:40:42.074647',
      '2023-07-10T02:40:42.074647'
    ];

    const isDisconnected = machineStatus(
      currentKpiResultResponses,
      currentKpiResult2,
      lastConnectedDates
    );
    expect(isDisconnected).toEqual(false);
  });

  it('DSI is disconnected == TRUE', () => {
    const currentKpiResult = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-07-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:40:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResult2 = [
      {
        type: 'dsi_kpi',
        id: 'psu_name',
        unit: '',
        value: {
          timestamp: '2023-08-09T07:43:28',
          value: 'Tyson-Nugget'
        },
        values: []
      },
      {
        type: 'dsi_kpi',
        id: 'app_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_1'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_2'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nuggets_3'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'product_type',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Nugget'
          },
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Portion1'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'sku_name',
        unit: '',
        values: [
          {
            timestamp: '2023-07-09T07:43:28',
            value: 'Unassigned'
          }
        ]
      },
      {
        type: 'dsi_kpi',
        id: 'state_name',
        unit: '',
        value: {
          timestamp: '2023-07-10T02:41:42.074647',
          value: 'Not Running'
        },
        values: []
      }
    ];

    const currentKpiResultResponses = {};
    currentKpiResultResponses.current = [currentKpiResult, currentKpiResult2];

    const lastConnectedDates = {};
    lastConnectedDates.current = [
      '2023-07-10T02:40:42.074647',
      '2023-07-10T02:40:42.074647',
      '2023-07-10T02:40:42.074647',
      '2023-07-10T02:40:42.074647',
      '2023-07-10T02:40:42.074647'
    ];

    const isDisconnected = machineStatus(
      currentKpiResultResponses,
      currentKpiResult,
      lastConnectedDates
    );
    expect(isDisconnected).toEqual(true);
  });
});
