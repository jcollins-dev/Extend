import {
  Bubble,
  DependentAxisFormat,
  Machine,
  MachineStatus,
  PartCategory,
  PreventativeMaintenancePart,
  PM,
  Resource,
  ResourceType,
  MachineModalData,
  SFOrder
} from 'types';
import { LeadTimeError, PriceError, Product, Part } from 'types/parts';
import {
  MachineHealthItem,
  MachineHealthKpiStatus,
  MachineHealthProductionData
} from 'types/machine-health';
import {
  MaintenanceEventStatus,
  MaintenanceEventTableRow,
  MaintenanceTask,
  MaintenanceTaskType
} from 'types/maintenance';
import { ContactInfo, ProteinMachineCategoryStates, SiteTableDataType } from 'types/protein';
import theme from 'themes';
import { MachineVisionKpiItem } from 'types/machine-vision';
import { AlarmType } from 'types/machine-health/alarms';
import { BarDatumLane } from 'components/machine-health/linear-filler/StackedBarChartOverLane';

export const testMachineTableData: Part[] = [
  {
    id: 'bd8e9bbf-c70f-40e8-96b0-35c8a515de12',
    description: 'JBT 009080554 Caster, 4", Swivel, with Lock, Stainless Steel',
    sku: '003091001',
    stock: 4,
    leadTime: 22,
    price: 195.99,
    priceUnit: '$',
    partTypes: ['caster']
  },
  {
    id: '10aeeffb-0ef7-45b8-bf16-09c28db3bc07',
    description: 'JBT 06000108 Manifold, Juice, MFJ',
    sku: '06000108',
    stock: 5,
    leadTime: 22,
    price: 320.32,
    priceUnit: '$',
    partTypes: ['manifold']
  },
  {
    id: '8b10024c-41ca-4587-9f3b-a8cd2e7f601f',
    description: 'JBT 009080554 Caster, 4", Swivel, with Lock, Stainless Steel',
    sku: '003091002',
    stock: 51,
    leadTime: 7,
    price: 190.19,
    priceUnit: '$',
    partTypes: ['caster']
  }
];

export const testPMPartsTableData: Part[] = [
  {
    id: '84944',
    description: 'JBT 009080554 Caster',
    sku: '003091001',
    stock: 4,
    leadTime: 22,
    quantity: 1,
    price: 195.99,
    priceUnit: '$',
    leadTimeError: LeadTimeError.UNREASONABLE
  },
  {
    id: 'part-2',
    description: 'JBT 06000108 Manifold, Juice, MFJ',
    sku: '06000108',
    stock: 5,
    leadTime: 22,
    quantity: 1,
    price: 320.32,
    priceUnit: '$',
    priceError: PriceError.UNREASONABLE
  },
  {
    id: 'part-3',
    description: 'JBT 009080554 Caster',
    sku: '003091002',
    stock: 51,
    leadTime: 7,
    quantity: 1,
    price: 190.19,
    priceUnit: '$',
    leadTimeError: LeadTimeError.NONE
  }
];

export const partsFieldThresholds = {
  leadTime: 15,
  stock: 5
};

export const testMachineData: Machine[] = [
  {
    id: 'DD8888',
    name: 'Double D Forced Convection Oven',
    nickname: 'Double D Forced Convection Oven',
    // TODO: update to streams
    sku: 'ST3773SEA',
    orgId: '12345',
    plantId: '1111',
    warrantyExpired: new Date('2023-02-23T00:00:00'),
    purchased: new Date('2021-02-23T00:00:00'),
    status: MachineStatus.Healthy,
    installed: new Date('2021-02-28T00:00:00'),
    description: 'Double D Forced Convection Oven',
    throughput: ['1040', '1500', '2000', '6000'],
    lineSpeed: ['103', '108', '110'],
    downtime: ['1:10:12', '1:30:15'],
    businessUnit: 'avure',
    serialNumber: '1120346'
  },
  {
    id: 'CR9999',
    sku: 'CR4421LND',
    orgId: '12345',
    plantId: '1111',
    warrantyExpired: new Date('2023-02-14T00:00:00'),
    purchased: new Date('2021-01-01T00:00:00'),
    status: MachineStatus.AtRisk,
    installed: new Date('2021-02-14T00:00:00'),
    name: 'Spiral Freezer in the back by the stairs',
    nickname: 'Spiral Freezer in the back by the stairs',
    description: 'GYRoCOMPACT® 40 Spiral Freezer',
    throughput: ['5600', '3000', '1060', '5689'],
    lineSpeed: ['104', '200', '145'],
    downtime: ['2:14:12', '2:35:11'],
    businessUnit: 'avure',
    serialNumber: '1120346'
  }
];

export const testPartCategories: PartCategory[] = [
  {
    id: 0,
    name: 'Belts',
    description: 'If it conveys, it might just be a belt.',
    serialNumber: '1120346'
  },
  {
    id: 1,
    name: 'Bearings',
    description: 'Famously made in the waters between Alaska and Russia.',
    serialNumber: '1120346'
  },
  {
    id: 2,
    name: 'Shafts',
    description: 'Connecting two items together has never been easier.',
    serialNumber: '1120346'
  },
  {
    id: 3,
    name: 'Compressors',
    description: 'Air, oil, water -- you name it, we compress it.',
    serialNumber: '1120346'
  },
  { id: 4, name: 'Casters', description: 'Rollin out!', serialNumber: '1120346' },
  {
    id: 5,
    name: 'Manifolds',
    description: 'Guiding everything from air to juice.',
    serialNumber: '1120346'
  }
];

export const testBubbles1: Bubble[] = [
  {
    index: '1',
    x: 302,
    y: 666,
    id: 'test-1',
    radius: 20
  },
  {
    index: '2',
    x: 1110,
    y: 1200,
    id: 'test-2',
    radius: 20
  },
  {
    index: '3',
    x: 1067,
    y: 1353,
    id: 'test-3',
    radius: 20
  },
  {
    index: '4',
    x: 100,
    y: 668,
    id: 'test-4',
    radius: 20
  },
  {
    index: '5',
    x: 645,
    y: 610,
    id: 'test-5',
    radius: 20
  },
  {
    index: '6',
    x: 312,
    y: 452,
    id: 'test-6',
    radius: 20
  },
  {
    index: '7',
    x: 910,
    y: 1353,
    id: 'test-7',
    radius: 20
  },
  {
    index: '8',
    x: 1110,
    y: 795,
    id: 'test-8',
    radius: 20
  },
  {
    index: '9',
    x: 148,
    y: 1355,
    id: 'test-9',
    radius: 20
  },
  {
    index: '10',
    x: 450,
    y: 1353,
    id: 'test-10',
    radius: 20
  },
  {
    index: '11',
    x: 390,
    y: 610,
    id: 'test-11',
    radius: 20
  },
  {
    index: '12',
    x: 1043,
    y: 355,
    id: 'test-12',
    radius: 20
  },
  {
    index: '13',
    x: 1110,
    y: 1245,
    id: 'test-13',
    radius: 20
  },
  {
    index: '14',
    x: 1110,
    y: 870,
    id: 'test-14',
    radius: 20
  },
  {
    index: '15',
    x: 496,
    y: 610,
    id: 'test-15',
    radius: 20
  },
  {
    index: '16',
    x: 855,
    y: 588,
    id: 'test-16',
    radius: 20
  },
  {
    index: '17',
    x: 1110,
    y: 940,
    id: 'test-17',
    radius: 20
  },
  {
    index: '18',
    x: 1110,
    y: 980,
    id: 'test-18',
    radius: 20
  },
  {
    index: '19',
    x: 1110,
    y: 700,
    id: 'test-19',
    radius: 20
  },
  {
    index: '20',
    x: 130,
    y: 1210,
    id: 'test-20',
    radius: 20
  },
  {
    index: '21',
    x: 850,
    y: 666,
    id: 'test-21',
    radius: 20
  },
  {
    index: '22',
    x: 720,
    y: 666,
    id: 'test-22',
    radius: 20
  },
  {
    index: '23',
    x: 305,
    y: 340,
    id: 'test-23',
    radius: 20
  },
  {
    index: '24',
    x: 130,
    y: 1095,
    id: 'test-24',
    radius: 20
  },
  {
    index: '25',
    x: 130,
    y: 1030,
    id: 'test-25',
    radius: 20
  },
  {
    index: '26',
    x: 130,
    y: 910,
    id: 'test-26',
    radius: 20
  },
  {
    index: '27',
    x: 1110,
    y: 1055,
    id: 'test-27',
    radius: 20
  },
  {
    index: '28',
    x: 1005,
    y: 666,
    id: 'test-28',
    radius: 20
  },
  {
    index: '29',
    x: 792,
    y: 666,
    id: 'test-29',
    radius: 20
  },
  {
    index: '30',
    x: 930,
    y: 398,
    id: 'test-30',
    radius: 20
  },
  {
    index: '31',
    x: 1110,
    y: 742,
    id: 'test-31',
    radius: 20
  },
  {
    index: '32',
    x: 130,
    y: 1270,
    id: 'test-32',
    radius: 20
  },
  {
    index: '33',
    x: 662,
    y: 666,
    id: 'test-33',
    radius: 20
  },
  {
    index: '34',
    x: 992,
    y: 1353,
    id: 'test-34',
    radius: 20
  },
  {
    index: '35',
    x: 256,
    y: 18,
    id: 'test-35',
    radius: 20
  },
  {
    index: '36',
    x: 1110,
    y: 1147,
    id: 'test-36',
    radius: 20
  },
  {
    index: '37',
    x: 130,
    y: 1177,
    id: 'test-37',
    radius: 20
  },
  {
    index: '38',
    x: 915,
    y: 666,
    id: 'test-38',
    radius: 20
  },
  {
    index: '39',
    x: 550,
    y: 666,
    id: 'test-39',
    radius: 20
  },
  {
    index: '40',
    x: 130,
    y: 1147,
    id: 'test-40',
    radius: 20
  },
  {
    index: '41',
    x: 299,
    y: 557,
    id: 'test-41',
    radius: 20
  },
  {
    index: '42',
    x: 513,
    y: 666,
    id: 'test-42',
    radius: 20
  },
  {
    index: '43',
    x: 350,
    y: 1353,
    id: 'test-43',
    radius: 20
  },
  {
    index: '44',
    x: 20,
    y: 675,
    id: 'test-44',
    radius: 20
  },
  {
    index: '45',
    x: 519,
    y: 1353,
    id: 'test-45',
    radius: 20
  }
];

export const testBubbles2: Bubble[] = [
  {
    index: '1',
    x: 436,
    y: 425,
    id: 'sub-test-1',
    radius: 20
  },
  {
    index: '2',
    x: 385,
    y: 190,
    id: 'sub-test-2',
    radius: 20
  },
  {
    index: '3',
    x: 235,
    y: 686,
    id: 'sub-test-3',
    radius: 20
  },
  {
    index: '4',
    x: 340,
    y: 678,
    id: 'sub-test-4',
    radius: 20
  },
  {
    index: '5',
    x: 25,
    y: 162,
    id: 'sub-test-5',
    radius: 20
  },
  {
    index: '6',
    x: 25,
    y: 90,
    id: 'sub-test-6',
    radius: 20
  },
  {
    index: '7',
    x: 35,
    y: 585,
    id: 'sub-test-7',
    radius: 20
  },
  {
    index: '8',
    x: 270,
    y: 62,
    id: 'sub-test-8',
    radius: 20
  },
  {
    index: '9',
    x: 158,
    y: 760,
    id: 'sub-test-9',
    radius: 20
  },
  {
    index: '10',
    x: 27,
    y: 632,
    id: 'sub-test-10',
    radius: 20
  }
];

export const testPMData: PM[] = [
  {
    id: 1,
    type: 'date',
    date: new Date(2021, 0, 1),
    tasks: [
      {
        id: 1,
        machineId: 'machine-1',
        priority: 'high',
        subComponent: 'Sub component',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        subDescription: 'Sub description',
        serialNumber: '1120346',
        assigned: {
          name: 'Username'
        }
      },
      {
        id: 2,
        machineId: 'machine-1',
        subComponent: 'Sub component',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        subDescription: 'Sub description',
        serialNumber: '1120346',
        assigned: {
          name: 'Username'
        }
      }
    ]
  },
  {
    id: 2,
    type: 'date',
    date: new Date(2021, 0, 2),
    tasks: [
      {
        id: 1,
        machineId: 'machine-1',
        priority: 'medium',
        subComponent: 'Sub component 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        subDescription: 'Sub description',
        serialNumber: '1120346',
        assigned: {
          name: 'Someone'
        }
      },
      {
        id: 2,
        machineId: 'machine-1',
        subComponent: 'Sub component 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        subDescription: 'Sub description',
        serialNumber: '1120346'
      },
      {
        id: 3,
        machineId: 'machine-1',
        subComponent: 'Sub component 2',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        subDescription: 'Sub description',
        serialNumber: '1120346',
        assigned: {
          name: 'Someone'
        }
      }
    ]
  },
  {
    id: 3,
    type: 'date',
    date: new Date(2021, 1, 1),
    tasks: [
      {
        id: 1,
        machineId: 'machine-1',
        subComponent: 'Sub component 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        subDescription: 'Sub description',
        serialNumber: '1120346'
      }
    ]
  },
  {
    id: 4,
    type: 'cycle-count',
    cycleCount: 3_000,
    tasks: [
      {
        id: 1,
        machineId: 'machine-1',
        subComponent: 'Sub component 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        subDescription: 'Sub description',
        serialNumber: '1120346',
        assigned: {
          name: 'Someone'
        }
      }
    ]
  },
  {
    id: 5,
    type: 'runtime',
    runtime: 10_000,
    tasks: [
      {
        id: 1,
        machineId: 'machine-1',
        subComponent: 'Sub component 3',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        subDescription: 'Sub description',
        serialNumber: '1120346',
        assigned: {
          name: 'Someone'
        }
      }
    ]
  }
];
export const testPmParts: PreventativeMaintenancePart[] = testMachineTableData.map((part, i) => {
  return {
    ...part,
    quantity: 1,
    autoOrder: i % 2 === 0
  };
});

export const machineHealthProductionKpis = [
  {
    color: '#2ABA74',
    label: 'successful cycles',
    value: 100
  },
  {
    color: '#2ABA74',
    label: 'runtime',
    value: 87
  }
];

export const machineHealthProductionData: MachineHealthProductionData[] = [
  {
    id: '1',
    machine: 'Avure AV-50X 80174',
    oee: '',
    successfulCyclesActual: '7',
    successfulCyclesTarget: '8',
    successfulCyclesStatus: MachineHealthKpiStatus.Bad,
    weightActual: '550',
    weightTarget: '546',
    weightStatus: MachineHealthKpiStatus.Good,
    waitTime: '00:51',
    waitTimeStatus: MachineHealthKpiStatus.Warning,
    failCycles: '0/7',
    failCyclesStatus: MachineHealthKpiStatus.Good,
    state: 'Stopped - Operator',
    stateStatus: MachineHealthKpiStatus.Good,
    condition: 'Sub-systems at risk',
    conditionStatus: MachineHealthKpiStatus.Bad
  },
  {
    id: '2',
    machine: 'Avure AV-40X 80174',
    oee: '',
    successfulCyclesActual: '',
    successfulCyclesTarget: '7',
    successfulCyclesStatus: MachineHealthKpiStatus.Bad,
    weightActual: '',
    weightTarget: '',
    weightStatus: MachineHealthKpiStatus.Good,
    waitTime: '',
    waitTimeStatus: MachineHealthKpiStatus.Warning,
    failCycles: '',
    failCyclesStatus: MachineHealthKpiStatus.Good,
    state: 'Running - Automatic',
    stateStatus: MachineHealthKpiStatus.Bad,
    condition: 'Sub-systems at good health',
    conditionStatus: MachineHealthKpiStatus.Good
  }
];

export const machineHealthProductionData2: MachineHealthProductionData[] = [
  {
    id: '1',
    machine: '9055',
    oee: '',
    successfulCyclesActual: '7',
    successfulCyclesTarget: '8',
    successfulCyclesStatus: MachineHealthKpiStatus.Bad,
    weightActual: '550',
    weightTarget: '546',
    weightStatus: MachineHealthKpiStatus.Good,
    waitTime: '00:51',
    waitTimeStatus: MachineHealthKpiStatus.Warning,
    failCycles: '0/7',
    failCyclesStatus: MachineHealthKpiStatus.Good,
    state: 'Stopped - Operator',
    stateStatus: MachineHealthKpiStatus.Good,
    condition: 'Sub-systems at risk',
    conditionStatus: MachineHealthKpiStatus.Bad
  },
  {
    id: '2',
    machine: '9065',
    oee: '',
    successfulCyclesActual: '',
    successfulCyclesTarget: '7',
    successfulCyclesStatus: MachineHealthKpiStatus.Bad,
    weightActual: '',
    weightTarget: '',
    weightStatus: MachineHealthKpiStatus.Good,
    waitTime: '',
    waitTimeStatus: MachineHealthKpiStatus.Warning,
    failCycles: '',
    failCyclesStatus: MachineHealthKpiStatus.Good,
    state: 'Running - Automatic',
    stateStatus: MachineHealthKpiStatus.Warning,
    condition: 'Sub-systems at good health',
    conditionStatus: MachineHealthKpiStatus.Good
  }
];

export const testResource: Resource = {
  id: 'test-id',
  parentId: 'test-parent-id',
  type: ResourceType.Image,
  url: '/assets/placeholder/assemblies/test-assembly-l1.png'
};

export const testMachine: Machine = {
  id: 'DD8888',
  name: 'Double D Forced Convection Oven',
  nickname: 'Double D Forced Convection Oven',
  // TODO: update to streams
  sku: 'ST3773SEA',
  orgId: '12345',
  plantId: '1111',
  warrantyExpired: new Date('2023-02-23T00:00:00'),
  purchased: new Date('2021-02-23T00:00:00'),
  status: MachineStatus.Healthy,
  installed: new Date('2021-02-28T00:00:00'),
  description: 'Double D Forced Convection Oven',
  throughput: ['1040', '1500', '2000', '6000'],
  lineSpeed: ['103', '108', '110'],
  downtime: ['1:10:12', '1:30:15'],
  assets: [testResource],
  businessUnit: 'avure',
  serialNumber: '1120346'
};

export const testPart: Part = {
  id: 'bd8e9bbf-c70f-40e8-96b0-35c8a515de12',
  description: 'JBT 009080554 Caster, 4", Swivel, with Lock, Stainless Steel',
  sku: '003091001',
  stock: 4,
  leadTime: 22,
  price: 2000,
  priceUnit: '$',
  partTypes: ['caster'],
  imgURL: '/assets/placeholder/part.png',
  customerPartId: '987654',
  overview:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  compatibility: [
    {
      description: 'Machine 1'
    } as Machine,
    {
      description: 'Machine 2'
    } as Machine
  ],
  custPrice: 195.99,
  discontinued: true,
  alternateProduct: {
    description: 'Some other part',
    id: 'part-id'
  } as Product
};

export const testProduct: Product = {
  id: 'bd8e9bbf-c70f-40e8-96b0-35c8a515de12',
  description: 'JBT 009080554 Caster, 4", Swivel, with Lock, Stainless Steel',
  sku: '003091001',
  stock: 4,
  leadTime: 22,
  price: 2000,
  priceUnit: '$',
  partTypes: ['caster'],
  imgURL: '/assets/placeholder/part.png',
  customerPartId: '987654',
  overview:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  compatibility: [
    {
      id: 'machine-id-1',
      sku: '1234567',
      description: 'Machine 1'
    } as Machine,
    {
      id: 'machine-id-2',
      sku: '9876543',
      description: 'Machine 2'
    } as Machine
  ],
  custPrice: 195.99,
  discontinued: true,
  isPurchasable: true,
  alternateProduct: {
    description: 'Some other part',
    id: 'product-id'
  } as Product
};

export const testMachineHealthTableData: MachineHealthItem[] = [
  {
    id: 1,
    component: 'Pressure Vessel (KPa)',
    status: 'running',
    state: {
      displayName: 'Running',
      value: 'running'
    },
    data: {
      kpi1: [
        {
          kpi: 'kpi1',
          values: {
            actual: 20,
            target: null
          },
          threshold: {
            status: MachineHealthKpiStatus.Good,
            value: {
              actual: 20,
              target: null
            }
          }
        }
      ]
    }
  },
  {
    id: 2,
    component: 'Decrompression Valve 1 (ºF)',
    status: 'running',
    state: {
      displayName: 'Running',
      value: 'running'
    },
    data: {
      kpi1: [
        {
          kpi: 'kpi1',
          values: {
            actual: 20,
            target: null
          },
          threshold: {
            status: MachineHealthKpiStatus.Good,
            value: {
              actual: 20,
              target: null
            }
          }
        }
      ]
    }
  },
  {
    id: 3,
    component: 'HPU1 L2',
    status: 'running',
    state: {
      displayName: 'Running',
      value: 'running'
    },
    data: {
      kpi1: [
        {
          kpi: 'kpi1',
          values: {
            actual: 20,
            target: null
          },
          threshold: {
            status: MachineHealthKpiStatus.Good,
            value: {
              actual: 20,
              target: null
            }
          }
        }
      ]
    },
    actionNeeded: 'preventative-maintenance'
  },
  {
    id: 4,
    component: 'HPU1 R2',
    status: 'stopped-alarm',
    state: {
      displayName: 'Running',
      value: 'running'
    },
    data: {
      kpi1: [
        {
          kpi: 'kpi1',
          values: {
            actual: 20,
            target: null
          },
          threshold: {
            status: MachineHealthKpiStatus.Good,
            value: {
              actual: 20,
              target: null
            }
          }
        }
      ],
      kpi2: [
        {
          kpi: 'kpi2',
          values: {
            actual: 20,
            target: null
          },
          threshold: {
            status: MachineHealthKpiStatus.Good,
            value: {
              actual: 20,
              target: null
            }
          }
        }
      ]
    },
    actionNeeded: 'urgent-maintenance'
  }
];

export const testModalData: MachineModalData[] = [
  {
    id: 1,
    kpis: [
      {
        name: 'Cycle Ct.',
        data: [
          { reading: 7, date: '00:00\nNov 22' },
          { reading: 6, date: '01:00\nNov 22' },
          { reading: 10, date: '02:00\nNov 22' },
          { reading: 10, date: '03:00\nNov 22' },
          { reading: 9, date: '04:00\nNov 22' },
          { reading: 6, date: '05:00\nNov 22' },
          { reading: 10, date: '06:00\nNov 22' },
          { reading: 10, date: '07:00\nNov 22' },
          { reading: 16, date: '08:00\nNov 22' },
          { reading: 14, date: '09:00\nNov 22' },
          { reading: 10, date: '10:00\nNov 22' },
          { reading: 19, date: '11:00\nNov 22' },
          { reading: 3, date: '12:00\nNov 22' },
          { reading: 1, date: '13:00\nNov 22' },
          { reading: 10, date: '14:00\nNov 22' },
          { reading: 6, date: '15:00\nNov 22' },
          { reading: 10, date: '16:00\nNov 22' },
          { reading: 10, date: '17:00\nNov 22' },
          { reading: 16, date: '18:00\nNov 22' },
          { reading: 14, date: '19:00\nNov 22' },
          { reading: 10, date: '20:00\nNov 22' },
          { reading: 19, date: '21:00\nNov 22' },
          { reading: 3, date: '22:00\nNov 22' },
          { reading: 1, date: '23:00\nNov 22' }
        ],
        threshold: 8,
        goodAboveThreshold: true
      },
      {
        name: 'Weight',
        data: [
          { reading: 700, date: '00:00\nNov 22' },
          { reading: 700, date: '01:00\nNov 22' },
          { reading: 700, date: '02:00\nNov 22' },
          { reading: 650, date: '03:00\nNov 22' },
          { reading: 700, date: '04:00\nNov 22' },
          { reading: 500, date: '05:00\nNov 22' },
          { reading: 500, date: '06:00\nNov 22' },
          { reading: 500, date: '07:00\nNov 22' }
        ],
        threshold: 600,
        goodAboveThreshold: true
      },
      {
        name: 'Wait Time',
        data: [
          { reading: 25, date: '00:00\nNov 22' },
          { reading: 22, date: '01:00\nNov 22' },
          { reading: 25, date: '02:00\nNov 22' },
          { reading: 30, date: '03:00\nNov 22' },
          { reading: 25, date: '04:00\nNov 22' },
          { reading: 10, date: '05:00\nNov 22' },
          { reading: 10, date: '06:00\nNov 22' },
          { reading: 10, date: '07:00\nNov 22' }
        ],
        dependentAxisFormat: DependentAxisFormat.TIME
      },
      {
        name: 'Failed Cycles',
        data: [
          { reading: 0, date: '00:00\nNov 22' },
          { reading: 0, date: '01:00\nNov 22' },
          { reading: 0, date: '02:00\nNov 22' },
          { reading: 0, date: '03:00\nNov 22' },
          { reading: 25, date: '04:00\nNov 22' },
          { reading: 25, date: '05:00\nNov 22' },
          { reading: 13, date: '06:00\nNov 22' },
          { reading: 0, date: '07:00\nNov 22' }
        ],
        threshold: 15,
        goodAboveThreshold: false,
        dependentAxisFormat: DependentAxisFormat.PERCENTAGE
      }
    ]
  },
  {
    id: 2,
    kpis: [
      {
        name: 'Cycle Ct.',
        data: [
          { reading: 0, date: '00:00\nNov 22' },
          { reading: 3, date: '01:00\nNov 22' },
          { reading: 12, date: '02:00\nNov 22' },
          { reading: 12, date: '03:00\nNov 22' },
          { reading: 15, date: '04:00\nNov 22' },
          { reading: 8, date: '05:00\nNov 22' },
          { reading: 1, date: '06:00\nNov 22' },
          { reading: 11, date: '07:00\nNov 22' }
        ],
        threshold: 8,
        goodAboveThreshold: true
      },
      {
        name: 'Weight',
        data: [
          { reading: 900, date: '00:00\nNov 22' },
          { reading: 750, date: '01:00\nNov 22' },
          { reading: 700, date: '02:00\nNov 22' },
          { reading: 350, date: '03:00\nNov 22' },
          { reading: 300, date: '04:00\nNov 22' },
          { reading: 500, date: '05:00\nNov 22' },
          { reading: 550, date: '06:00\nNov 22' },
          { reading: 850, date: '07:00\nNov 22' }
        ],
        threshold: 600,
        goodAboveThreshold: true
      },
      {
        name: 'Wait Time',
        data: [
          { reading: 15, date: '00:00\nNov 22' },
          { reading: 12, date: '01:00\nNov 22' },
          { reading: 35, date: '02:00\nNov 22' },
          { reading: 50, date: '03:00\nNov 22' },
          { reading: 12, date: '04:00\nNov 22' },
          { reading: 14, date: '05:00\nNov 22' },
          { reading: 5, date: '06:00\nNov 22' },
          { reading: 0, date: '07:00\nNov 22' }
        ],
        dependentAxisFormat: DependentAxisFormat.TIME
      },
      {
        name: 'Failed Cycles',
        data: [
          { reading: 0, date: '00:00\nNov 22' },
          { reading: 0, date: '01:00\nNov 22' },
          { reading: 0, date: '02:00\nNov 22' },
          { reading: 0, date: '03:00\nNov 22' },
          { reading: 44, date: '04:00\nNov 22' },
          { reading: 67, date: '05:00\nNov 22' },
          { reading: 70, date: '06:00\nNov 22' },
          { reading: 90, date: '07:00\nNov 22' }
        ],
        threshold: 15,
        goodAboveThreshold: false,
        dependentAxisFormat: DependentAxisFormat.PERCENTAGE
      }
    ]
  }
];

export const testSuccessfulCycleData = [
  {
    code: '153',
    day: '2023-04-07T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-07T03:18:27.880000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-07T02:52:12.997000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-07T00:00:00+02:00',
    description: '40071: Stack 1 - Belt off inner rail',
    endTimestamp: '2023-04-07T10:09:58.974000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-07T08:54:14.113000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-07T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-07T03:39:51.280000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-07T03:27:31.464000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-08T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-08T03:44:58.181000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-08T03:44:00.648000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-08T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-08T03:12:01.148000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-08T02:35:48.169000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-09T00:00:00+02:00',
    description: '40029: Infeed 1 - High belt tension',
    endTimestamp: '2023-04-09T03:52:48.376000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-09T03:50:36.814000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-09T00:00:00+02:00',
    description: '40035: Take-up 1 - Belt too short',
    endTimestamp: '2023-04-09T03:52:02.868000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-09T03:51:43.734000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-10T00:00:00+02:00',
    description: '40029: Infeed 1 - High belt tension',
    endTimestamp: '2023-04-03T03:53:50.605000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-03T03:52:53.619000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-08T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-08T03:55:53.211000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-08T01:51:33.236000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-09T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-09T04:16:46.549000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-09T02:45:11.266000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-09T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-09T04:20:01.020000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-09T04:17:48.238000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-10T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-10T03:35:49.480000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-10T03:21:22.456000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '153',
    day: '2023-04-10T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-10T04:16:46.298000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-10T03:42:45.325000+00:00',
    type: 'Critical Alarm' as AlarmType
  }
];

export const testUnsuccessfulCycleData = [
  {
    code: '130',
    day: '2023-04-13T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-13T03:18:27.880000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-13T02:52:12.997000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-13T00:00:00+02:00',
    description: '40071: Stack 1 - Belt off inner rail',
    endTimestamp: '2023-04-13T10:09:58.974000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-13T08:54:14.113000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-04T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-04T03:39:51.280000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-04T03:27:31.464000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-05T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-05T03:44:58.181000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-05T03:44:00.648000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-06T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-06T03:12:01.148000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-06T02:35:48.169000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-07T00:00:00+02:00',
    description: '40029: Infeed 1 - High belt tension',
    endTimestamp: '2023-04-07T03:52:48.376000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-07T03:50:36.814000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-07T00:00:00+02:00',
    description: '40035: Take-up 1 - Belt too short',
    endTimestamp: '2023-04-07T03:52:02.868000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-07T03:51:43.734000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-10T00:00:00+02:00',
    description: '40029: Infeed 1 - High belt tension',
    endTimestamp: '2023-04-10T03:53:50.605000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-10T03:52:53.619000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-08T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-08T03:55:53.211000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-08T01:51:33.236000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-09T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-09T04:16:46.549000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-09T02:45:11.266000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-09T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-09T04:20:01.020000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-09T04:17:48.238000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-10T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-10T03:35:49.480000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-10T03:21:22.456000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-10T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-10T04:16:46.298000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-10T03:42:45.325000+00:00',
    type: 'Critical Alarm' as AlarmType
  },
  {
    code: '130',
    day: '2023-04-10T00:00:00+02:00',
    description: '40078: Stack 1 - Taper switch, outside stack',
    endTimestamp: '2023-04-10T04:16:46.298000+00:00',
    location: 'Product Movement',
    remedy: '',
    startTimestamp: '2023-04-10T03:42:45.325000+00:00',
    type: 'Critical Alarm' as AlarmType
  }
];

export const testSubcomponentModalData: MachineModalData[] = [
  {
    id: 1,
    kpis: [
      {
        id: '1',
        name: 'KPI 1',
        units: 'units/sec',
        value: '0,35',
        data: [
          { reading: 7, date: '00:00\nNov 22' },
          { reading: 6, date: '01:00\nNov 22' },
          { reading: 10, date: '02:00\nNov 22' },
          { reading: 10, date: '03:00\nNov 22' },
          { reading: 9, date: '04:00\nNov 22' },
          { reading: 6, date: '05:00\nNov 22' },
          { reading: 10, date: '06:00\nNov 22' },
          { reading: 10, date: '07:00\nNov 22' },
          { reading: 16, date: '08:00\nNov 22' },
          { reading: 14, date: '09:00\nNov 22' },
          { reading: 10, date: '10:00\nNov 22' },
          { reading: 19, date: '11:00\nNov 22' },
          { reading: 3, date: '12:00\nNov 22' },
          { reading: 1, date: '13:00\nNov 22' },
          { reading: 10, date: '14:00\nNov 22' },
          { reading: 6, date: '15:00\nNov 22' },
          { reading: 10, date: '16:00\nNov 22' },
          { reading: 10, date: '17:00\nNov 22' },
          { reading: 16, date: '18:00\nNov 22' },
          { reading: 14, date: '19:00\nNov 22' },
          { reading: 10, date: '20:00\nNov 22' },
          { reading: 19, date: '21:00\nNov 22' },
          { reading: 3, date: '22:00\nNov 22' },
          { reading: 1, date: '23:00\nNov 22' }
        ],
        threshold: 8,
        goodAboveThreshold: true
      },
      {
        id: '2',
        name: 'KPI 2',
        units: 'units/sec',
        value: '0,35',
        data: [
          { reading: 700, date: '00:00\nNov 22' },
          { reading: 700, date: '01:00\nNov 22' },
          { reading: 700, date: '02:00\nNov 22' },
          { reading: 650, date: '03:00\nNov 22' },
          { reading: 700, date: '04:00\nNov 22' },
          { reading: 500, date: '05:00\nNov 22' },
          { reading: 500, date: '06:00\nNov 22' },
          { reading: 500, date: '07:00\nNov 22' },
          { reading: 400, date: '08:00\nNov 22' },
          { reading: 300, date: '09:00\nNov 22' },
          { reading: 400, date: '10:00\nNov 22' },
          { reading: 200, date: '11:00\nNov 22' },
          { reading: 100, date: '12:00\nNov 22' },
          { reading: 200, date: '13:00\nNov 22' },
          { reading: 0, date: '14:00\nNov 22' },
          { reading: 600, date: '15:00\nNov 22' },
          { reading: 300, date: '16:00\nNov 22' },
          { reading: 100, date: '17:00\nNov 22' },
          { reading: 600, date: '18:00\nNov 22' },
          { reading: 400, date: '19:00\nNov 22' },
          { reading: 300, date: '20:00\nNov 22' },
          { reading: 700, date: '21:00\nNov 22' },
          { reading: 300, date: '22:00\nNov 22' },
          { reading: 100, date: '23:00\nNov 22' }
        ],
        threshold: 600,
        goodAboveThreshold: true
      }
    ]
  },
  {
    id: 2,
    kpis: [
      {
        id: '1',
        name: 'KPI 1',
        units: 'units/sec',
        value: '4,35',
        data: [
          { reading: 0, date: '00:00\nNov 22' },
          { reading: 3, date: '01:00\nNov 22' },
          { reading: 12, date: '02:00\nNov 22' },
          { reading: 12, date: '03:00\nNov 22' },
          { reading: 15, date: '04:00\nNov 22' },
          { reading: 8, date: '05:00\nNov 22' },
          { reading: 1, date: '06:00\nNov 22' },
          { reading: 11, date: '07:00\nNov 22' }
        ],
        threshold: 8,
        goodAboveThreshold: true
      },
      {
        id: '2',
        name: 'KPI 2',
        units: 'units/sec',
        value: '2,0',
        data: [
          { reading: 900, date: '00:00\nNov 22' },
          { reading: 750, date: '01:00\nNov 22' },
          { reading: 700, date: '02:00\nNov 22' },
          { reading: 350, date: '03:00\nNov 22' },
          { reading: 300, date: '04:00\nNov 22' },
          { reading: 500, date: '05:00\nNov 22' },
          { reading: 550, date: '06:00\nNov 22' },
          { reading: 850, date: '07:00\nNov 22' }
        ],
        threshold: 600,
        goodAboveThreshold: true
      }
    ]
  }
];

export const testMaintenanceEventData: MaintenanceEventTableRow[] = [
  {
    id: '1',
    machineId: '1',
    machineDescription: 'Machine 1',
    description: 'Maintenance of the Decompression Valve',
    status: MaintenanceEventStatus.NotComplete,
    dueDate: new Date('2022-11-22T00:00:00.000Z'),
    owner: 'Test Owner1',
    productIds: ['844384'],
    nextStep: 'Order PM Kit',
    priority: 0
  } as MaintenanceEventTableRow,
  {
    id: '2',
    machineId: '2',
    machineDescription: 'Machine 2',
    description: 'Maintenance of the Decompression Valve 2',
    status: MaintenanceEventStatus.Completed,
    dueDate: new Date('2022-11-22T00:00:00.000Z'),
    owner: 'Test Owner1',
    productIds: ['844384'],
    nextStep: 'Service',
    priority: 1
  } as MaintenanceEventTableRow
];

export const testMaintenanceTaskData: MaintenanceTask[] = [
  {
    action: 'Assign & schedule',
    maintenanceEventId: '8079bf49-e301-4fd6-82a6-141b9ab5e185',
    priority: 0,
    // status: MaintenanceTaskStatus.Assigned,
    type: MaintenanceTaskType.AssignAndSchedule
  } as MaintenanceTask,
  {
    action: 'Mark complete',
    maintenanceEventId: '8079bf49-e301-4fd6-82a6-141b9ab5e185',
    priority: 1,
    // status: MaintenanceTaskStatus.Resolved,
    type: MaintenanceTaskType.Complete
  } as MaintenanceTask
];

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

export const mockContactInfo: { jbt: ContactInfo[]; customer: ContactInfo[] } = {
  jbt: [
    {
      name: 'John doe',
      role: 'Technical contact',
      phone: '0987654321',
      email: 'contact@jbtc.com'
    },
    {
      name: 'Jane doe',
      role: 'Commercial contact',
      phone: '0987654321',
      email: 'contact@jbtc.com'
    }
  ],
  customer: [
    {
      name: 'James doe',
      role: 'Site contact',
      phone: '0987654321',
      email: 'contact@customer.com'
    }
  ]
};

export const mockPurchaseOrderData: SFOrder[] = [
  {
    name: 'PO-000026',
    id: 'a6J7j000000QIVpEAO',
    orderQuoteId: 'a4116261-ba2e-496d-ae1f-b7eee480145b',
    createdDate: new Date('2022-05-13T18:27:37+00:00'),
    poNumber: 'SS-Test-1',
    status: 'Approved',
    total: 0.0,
    quantity: 2.0
  } as SFOrder,
  {
    name: 'PO-000026',
    id: 'a6J7j000000QIVpEAO',
    orderQuoteId: 'a4116261-ba2e-496d-ae1f-b7eee480145b',
    createdDate: new Date('2022-05-13T18:27:37+00:00'),
    poNumber: 'SS-Test-1',
    status: 'Approved',
    total: 0.0,
    quantity: 2.0
  } as SFOrder,
  {
    name: 'PO-000029',
    id: 'a6J7j000000QIW4EAO',
    orderQuoteId: '72549753-44c8-41d4-b1e9-8295e8d0a6fa',
    createdDate: new Date('2022-05-13T20:01:45+00:00'),
    poNumber: 'SS-1',
    status: 'Approved',
    total: 0.0,
    quantity: 2.0
  } as SFOrder
];

/*
  Aseptic mock data
 */

export const asepticFoilWidget = [
  {
    id: 'size',
    tag: 'maximum_cap_size',
    value: {
      value: 12000
    },
    unit: 'mm2'
  },
  {
    id: 'size',
    tag: 'minimum_cap_size',
    value: {
      value: 14500
    },
    unit: 'mm2'
  },
  {
    id: 'min dis. edge',
    tag: 'min_distance_to_edge',
    value: {
      value: 12
    },
    unit: 'mm2'
  },
  {
    id: 'min dist. between caps',
    tag: 'min_distance_between_caps',
    value: {
      value: 8
    },
    unit: 'mm2'
  }
];

export const asepticLineStatusWidgetData = [
  {
    id: 0,
    label: 'Actual Status',
    parentProperty: '1',
    isLabel: true,
    data: [
      {
        stateCode: 1,
        stateName: 'Maintenance',
        startTimestamp: '2022-04-18T01:00:00+00:00',
        endTimestamp: '2022-04-18T02:00:00+00:00'
      },
      {
        stateCode: 1,
        stateName: 'Maintenance',
        startTimestamp: '2022-04-18T02:00:00+00:00',
        endTimestamp: '2022-04-18T02:30:00+00:00'
      },
      {
        stateCode: 2,
        stateName: 'Cleaning',
        startTimestamp: '2022-04-18T02:30:00+00:00',
        endTimestamp: '2022-04-18T03:00:00+00:00'
      },
      {
        stateCode: 1,
        stateName: 'Maintenance',
        startTimestamp: '2022-04-18T03:00:00+00:00',
        endTimestamp: '2022-04-18T03:30:00+00:00'
      },
      {
        stateCode: 3,
        stateName: 'Sterilization',
        startTimestamp: '2022-04-18T03:30:00+00:00',
        endTimestamp: '2022-04-18T04:00:00+00:00'
      },
      {
        stateCode: 4,
        stateName: 'Production',
        startTimestamp: '2022-04-18T04:00:00+00:00',
        endTimestamp: '2022-04-18T05:00:00+00:00'
      },
      {
        stateCode: 5,
        stateName: 'Idle',
        startTimestamp: '2022-04-18T05:00:00+00:00',
        endTimestamp: '2022-04-18T06:00:00+00:00'
      }
    ]
  },
  {
    id: 1,
    label: 'Target Status',
    parentProperty: '2',
    data: [
      {
        stateCode: 1,
        stateName: 'Maintenance',
        startTimestamp: '2022-04-18T01:00:00+00:00',
        endTimestamp: '2022-04-18T01:30:00+00:00'
      },
      {
        stateCode: 1,
        stateName: 'Maintenance',
        startTimestamp: '2022-04-18T01:30:00+00:00',
        endTimestamp: '2022-04-18T02:30:00+00:00'
      },
      {
        stateCode: 2,
        stateName: 'Cleaning',
        startTimestamp: '2022-04-18T02:30:00+00:00',
        endTimestamp: '2022-04-18T03:00:00+00:00'
      },
      {
        stateCode: 3,
        stateName: 'Sterilization',
        startTimestamp: '2022-04-18T03:00:00+00:00',
        endTimestamp: '2022-04-18T03:30:00+00:00'
      },
      {
        stateCode: 4,
        stateName: 'Production',
        startTimestamp: '2022-04-18T03:30:00+00:00',
        endTimestamp: '2022-04-18T04:30:00+00:00'
      },
      {
        stateCode: 5,
        stateName: 'Idle',
        startTimestamp: '2022-04-18T04:30:00+00:00',
        endTimestamp: '2022-04-18T05:30:00+00:00'
      }
    ]
  }
];

export const asepticMachineModesWidgetData = [
  {
    id: 1,
    label: 'Target Status',
    parentProperty: '1',
    data: [
      {
        stateCode: 1,
        stateName: 'Maintenance',
        startTimestamp: '2022-04-18T01:00:00+00:00',
        endTimestamp: '2022-04-18T01:30:00+00:00'
      },
      {
        stateCode: 1,
        stateName: 'Maintenance',
        startTimestamp: '2022-04-18T01:30:00+00:00',
        endTimestamp: '2022-04-18T02:30:00+00:00'
      },
      {
        stateCode: 2,
        stateName: 'Cleaning',
        startTimestamp: '2022-04-18T02:30:00+00:00',
        endTimestamp: '2022-04-18T03:00:00+00:00'
      },
      {
        stateCode: 3,
        stateName: 'Sterilization',
        startTimestamp: '2022-04-18T03:00:00+00:00',
        endTimestamp: '2022-04-18T03:30:00+00:00'
      },
      {
        stateCode: 4,
        stateName: 'Production',
        startTimestamp: '2022-04-18T03:30:00+00:00',
        endTimestamp: '2022-04-18T04:30:00+00:00'
      },
      {
        stateCode: 5,
        stateName: 'Idle',
        startTimestamp: '2022-04-18T04:30:00+00:00',
        endTimestamp: '2022-04-18T05:30:00+00:00'
      }
    ]
  }
];

export const asepticSessionsData = [
  {
    alarms: 1,
    startTimestamp: '2022-04-18T01:00:00+00:00',
    endTimestamp: '2022-04-18T02:00:00+00:00'
  },
  {
    alarms: 2,
    startTimestamp: '2022-04-18T02:00:00+00:00',
    endTimestamp: '2022-04-18T03:00:00+00:00'
  },
  {
    alarms: 3,
    startTimestamp: '2022-04-18T03:00:00+00:00',
    endTimestamp: '2022-04-18T04:00:00+00:00'
  },
  {
    alarms: 4,
    startTimestamp: '2022-04-18T04:00:00+00:00',
    endTimestamp: '2022-04-18T05:00:00+00:00'
  },
  {
    alarms: 5,
    startTimestamp: '2022-04-18T05:00:00+00:00',
    endTimestamp: '2022-04-18T06:00:00+00:00'
  },
  {
    alarms: 6,
    startTimestamp: '2022-04-18T06:00:00+00:00',
    endTimestamp: '2022-04-18T07:00:00+00:00'
  },
  {
    alarms: 7,
    startTimestamp: '2022-04-18T07:00:00+00:00',
    endTimestamp: '2022-04-18T08:00:00+00:00'
  },
  {
    alarms: 8,
    startTimestamp: '2022-04-18T08:00:00+00:00',
    endTimestamp: '2022-04-18T09:00:00+00:00'
  }
];

export const asepticStepTableData = [
  {
    id: '7',
    name: 'Maintenance',
    parentName: '',
    status: '1',
    startTime: '2022-05-31T01:07:13.275000+00:00',
    endTime: '2022-05-31T02:24:34.230000+00:00',
    avgOverTime: 1344790,
    kpis: [],
    alarms: [],
    alerts: [],
    subSteps: [
      {
        id: '200',
        name: 'Initials',
        parentName: 'Maintenance',
        status: 'completed',
        startTime: '2022-05-31T01:07:13.275000+00:00',
        endTime: '2022-05-31T01:15:14.247000+00:00',
        avgOverTime: 481193.8,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '230',
        name: 'Empty Machine',
        parentName: 'Maintenance',
        status: 'completed',
        startTime: '2022-05-31T01:15:14.247000+00:00',
        endTime: '2022-05-31T02:18:36.246000+00:00',
        avgOverTime: 12174509.1,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '306',
        name: 'Run Machine',
        parentName: 'Maintenance',
        status: 'completed',
        startTime: '2022-05-31T02:18:36.246000+00:00',
        endTime: '2022-05-31T02:20:06.233000+00:00',
        avgOverTime: 89894.8,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '310',
        name: 'Maintenance No Auto',
        parentName: 'Maintenance',
        status: 'completed',
        startTime: '2022-05-31T02:20:06.233000+00:00',
        endTime: '2022-05-31T02:20:26.227000+00:00',
        avgOverTime: 20001.4,
        kpis: [],
        alarms: [],
        alerts: []
      }
    ]
  },
  {
    id: '1',
    name: 'Cleaning',
    parentName: '',
    status: '17',
    startTime: '2022-05-31T02:24:34.230000+00:00',
    endTime: '2022-05-31T05:43:05.252000+00:00',
    avgOverTime: 1191102.2,
    kpis: [],
    alarms: [],
    subSteps: [
      {
        id: '200',
        name: 'Initials',
        parentName: 'Sterilization',
        status: 'completed',
        startTime: '2022-05-31T01:07:13.275000+00:00',
        endTime: '2022-05-31T01:15:14.247000+00:00',
        avgOverTime: 481193.8,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '230',
        name: 'Empty Machine',
        parentName: 'Sterilization',
        status: 'completed',
        startTime: '2022-05-31T01:15:14.247000+00:00',
        endTime: '2022-05-31T02:18:36.246000+00:00',
        avgOverTime: 12174509.1,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '306',
        name: 'Run Machine',
        parentName: 'Sterilization',
        status: 'completed',
        startTime: '2022-05-31T02:18:36.246000+00:00',
        endTime: '2022-05-31T02:20:06.233000+00:00',
        avgOverTime: 89894.8,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '310',
        name: 'Maintenance No Auto',
        parentName: 'Sterilization',
        status: 'completed',
        startTime: '2022-05-31T02:20:06.233000+00:00',
        endTime: '2022-05-31T02:20:26.227000+00:00',
        avgOverTime: 20001.4,
        kpis: [],
        alarms: [],
        alerts: []
      }
    ]
  },
  {
    id: '230',
    name: 'Sterilization',
    parentName: '',
    status: 'completed',
    startTime: '2022-05-31T01:15:14.247000+00:00',
    endTime: '2022-05-31T02:18:36.246000+00:00',
    avgOverTime: 12174509.1,
    kpis: [],
    alarms: [],
    alerts: [],
    subSteps: [
      {
        id: '200',
        name: 'Initials',
        parentName: 'Cleaning',
        status: 'completed',
        startTime: '2022-05-31T01:07:13.275000+00:00',
        endTime: '2022-05-31T01:15:14.247000+00:00',
        avgOverTime: 481193.8,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '230',
        name: 'Empty Machine',
        parentName: 'Cleaning',
        status: 'completed',
        startTime: '2022-05-31T01:15:14.247000+00:00',
        endTime: '2022-05-31T02:18:36.246000+00:00',
        avgOverTime: 12174509.1,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '306',
        name: 'Run Machine',
        parentName: 'Cleaning',
        status: 'completed',
        startTime: '2022-05-31T02:18:36.246000+00:00',
        endTime: '2022-05-31T02:20:06.233000+00:00',
        avgOverTime: 89894.8,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '310',
        name: 'Maintenance No Auto',
        parentName: 'Cleaning',
        status: 'completed',
        startTime: '2022-05-31T02:20:06.233000+00:00',
        endTime: '2022-05-31T02:20:26.227000+00:00',
        avgOverTime: 20001.4,
        kpis: [],
        alarms: [],
        alerts: []
      }
    ]
  },
  {
    id: '7',
    name: 'Production',
    parentName: '',
    status: '1',
    startTime: '2022-05-31T05:43:17.233000+00:00',
    endTime: '2022-05-31T06:56:41.228000+00:00',
    avgOverTime: 1344790,
    kpis: [],
    alarms: [],
    alerts: [],
    subSteps: [
      {
        id: '200',
        name: 'Initials',
        parentName: 'Production',
        status: 'completed',
        startTime: '2022-05-31T05:43:17.233000+00:00',
        endTime: '2022-05-31T05:51:19.237000+00:00',
        avgOverTime: 481193.8,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '230',
        name: 'Empty Machine',
        parentName: 'Production',
        status: 'completed',
        startTime: '2022-05-31T05:51:19.237000+00:00',
        endTime: '2022-05-31T06:50:35.231000+00:00',
        avgOverTime: 12174509.1,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '306',
        name: 'Run Machine',
        parentName: 'Production',
        status: 'completed',
        startTime: '2022-05-31T06:50:35.231000+00:00',
        endTime: '2022-05-31T06:52:05.234000+00:00',
        avgOverTime: 89894.8,
        kpis: [],
        alarms: [],
        alerts: []
      },
      {
        id: '310',
        name: 'Machine No Auto',
        parentName: 'Production',
        status: 'completed',
        startTime: '2022-05-31T06:52:05.234000+00:00',
        endTime: '2022-05-31T06:52:25.243000+00:00',
        avgOverTime: 20001.4,
        kpis: [],
        alarms: [],
        alerts: []
      }
    ]
  }
];

export const ActiveRecipeKpiWidgetMockData = [
  {
    type: 'aseptic_kpi',
    id: 'recipe_name',
    value: {
      value: 'Suniva'
    },
    values: []
  },
  {
    type: 'aseptic_kpi',
    id: 'approvedbottles',
    value: {
      value: 726931
    },
    values: []
  },
  {
    type: 'aseptic_kpi',
    id: 'run_length_in_seconds',
    value: {
      value: 193884
    },
    values: []
  }
];

export const asepticScatterChartData = [
  {
    x: new Date('2022-04-18T01:00:00+00:00'),
    y: 0,
    label: 'start bottle sorter changeover'
  },
  {
    x: new Date('2022-04-18T02:00:00+00:00'),
    y: 0,
    label: 'start bottle sorter changeover'
  },
  {
    x: new Date('2022-04-18T01:00:00+00:00'),
    y: 0,
    label: 'start bottle sorter changeover'
  },
  {
    x: new Date('2022-04-18T03:00:00+00:00'),
    y: 0,
    label: 'start bottle sorter changeover'
  },
  {
    x: new Date('2022-04-18T04:00:00+00:00'),
    y: 0,
    label: 'start bottle sorter changeover'
  },
  {
    x: new Date('2022-04-18T05:00:00+00:00'),
    y: 0,
    label: 'start bottle sorter changeover'
  },
  {
    x: new Date('2022-04-18T06:00:00+00:00'),
    y: 0,
    label: 'start bottle sorter changeover'
  },
  {
    x: new Date('2022-04-18T07:00:00+00:00'),
    y: 0,
    label: 'start bottle sorter changeover'
  },
  {
    x: new Date('2022-04-18T08:00:00+00:00'),
    y: 0,
    label: 'start bottle sorter changeover'
  }
];

export const asepticUpstreamData = [
  { x: 1, y: 0, label: 'Start bottle sorter changeover' },
  { x: 2, y: 0, label: 'Start bottle sorter changeover' },
  { x: 3, y: 0, label: 'Start bottle sorter changeover' },
  { x: 4, y: 0, label: 'Start bottle sorter changeover' },
  { x: 5, y: 0, label: 'Start bottle sorter changeover' }
];

export const asepticChangeOverData = {
  id: 'Changeovers',
  status: 'Completed',
  startTime: '11:50 a.m 04/25/22',
  startTimeId: 'Start Time',
  SKU: '102066',
  SKUId: 'Previous SKU',
  duration: '08:47',
  durationId: 'Duration (h)'
};

export const asepticOEEMockData = {
  id: 'OEE',
  status: '75%',
  period: 'Last week',
  availability: {
    value: '85%',
    color: theme.colors.darkGrey,
    mb: '0.625rem',
    size: '1.3125rem'
  },
  performance: {
    value: '95%',
    color: theme.colors.darkGrey,
    mb: '0.625rem',
    size: '1.3125rem'
  },
  quality: {
    value: '95%',
    color: theme.colors.darkGrey,
    mb: '0.625rem',
    size: '1.3125rem'
  }
};

export const AsepticFoilPressMockData: MachineVisionKpiItem = {
  type: 'mv_kpi',
  id: 'Minimum size',
  unit: '',
  value: {
    timestamp: '2022-08-23T14:55:00+00:00',
    value: 15415.686120059429,
    endTimestamp: '2022-08-23T15:00:00+00:00'
  },
  values: [
    {
      timestamp: '2022-08-23T13:25:00+00:00',
      value: 14608.20581559988,
      endTimestamp: '2022-08-23T13:30:00+00:00'
    },
    {
      timestamp: '2022-08-23T13:30:00+00:00',
      value: 14654.963983113526,
      endTimestamp: '2022-08-23T13:35:00+00:00'
    },
    {
      timestamp: '2022-08-23T13:35:00+00:00',
      value: 15518.985577737294,
      endTimestamp: '2022-08-23T13:40:00+00:00'
    },
    {
      timestamp: '2022-08-23T13:40:00+00:00',
      value: 17289.452350523883,
      endTimestamp: '2022-08-23T13:45:00+00:00'
    },
    {
      timestamp: '2022-08-23T13:45:00+00:00',
      value: 16966.911738418687,
      endTimestamp: '2022-08-23T13:50:00+00:00'
    },
    {
      timestamp: '2022-08-23T13:50:00+00:00',
      value: 16737.712456931065,
      endTimestamp: '2022-08-23T13:55:00+00:00'
    },
    {
      timestamp: '2022-08-23T13:55:00+00:00',
      value: 15999.082695192672,
      endTimestamp: '2022-08-23T14:00:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:00:00+00:00',
      value: 14707.067248796267,
      endTimestamp: '2022-08-23T14:05:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:05:00+00:00',
      value: 7424.668011004236,
      endTimestamp: '2022-08-23T14:10:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:10:00+00:00',
      value: 1926.764475072701,
      endTimestamp: '2022-08-23T14:15:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:15:00+00:00',
      value: 4294.373478470833,
      endTimestamp: '2022-08-23T14:20:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:20:00+00:00',
      value: 12094.3315834044,
      endTimestamp: '2022-08-23T14:25:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:25:00+00:00',
      value: 14917.863440013965,
      endTimestamp: '2022-08-23T14:30:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:30:00+00:00',
      value: 14239.227359108412,
      endTimestamp: '2022-08-23T14:35:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:35:00+00:00',
      value: 15687.940015871232,
      endTimestamp: '2022-08-23T14:40:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:40:00+00:00',
      value: 15142.006475987211,
      endTimestamp: '2022-08-23T14:45:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:45:00+00:00',
      value: 16005.112240237695,
      endTimestamp: '2022-08-23T14:50:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:50:00+00:00',
      value: 15051.398643389966,
      endTimestamp: '2022-08-23T14:55:00+00:00'
    },
    {
      timestamp: '2022-08-23T14:55:00+00:00',
      value: 15415.686120059429,
      endTimestamp: '2022-08-23T15:00:00+00:00'
    }
  ]
};

export const AsepticmockStackedBarChartOverTimeData: BarDatumLane[][] = [
  [
    {
      id: '1',
      name: 'foaming',
      y: 400,
      x: 'Lane 1'
    },
    {
      id: '1',
      name: 'foaming',
      y: 300,
      x: 'Lane 1'
    },
    {
      id: '1',
      name: 'foaming',
      y: 200,
      x: 'Lane 3'
    },
    {
      id: '1',
      name: 'foaming',
      y: 100,
      x: 'Lane 1'
    },

    {
      id: '1',
      name: 'foaming',
      y: 200,
      x: 'Lane 1'
    }
  ],
  [
    {
      id: '2',
      name: 'defrost',
      y: 100,
      x: 'Lane 2'
    },
    {
      id: '2',
      name: 'defrost',
      y: 100,
      x: 'Lane 3'
    },
    {
      id: '2',
      name: 'defrost',
      y: 100,
      x: 'Lane 16'
    },
    {
      id: '2',
      name: 'defrost',
      y: 100,
      x: 'Lane 9'
    },

    {
      id: '2',
      name: 'defrost',
      y: 200,
      x: 'Lane 9'
    }
  ],
  [
    {
      id: '3',
      name: 'rinse',
      y: 400,
      x: 'Lane 8'
    },
    {
      id: '3',
      name: 'rinse',
      y: 200,
      x: 'Lane 11'
    },
    {
      id: '3',
      name: 'rinse',
      y: 400,
      x: 'Lane 10'
    },
    {
      id: '3',
      name: 'rinse',
      y: 200,
      x: 'Lane 8'
    },

    {
      id: '3',
      name: 'rinse',
      y: 200,
      x: 'Lane 7'
    },

    {
      id: '3',
      name: 'rinse',
      y: 200,
      x: 'Lane 6'
    }
  ],
  [
    {
      id: '4',
      name: 'foaming of belt, evaporator and equipment',
      y: 400,
      x: 'Lane 6'
    }
  ],
  [
    {
      id: '5',
      name: 'circuit rinse',
      y: 300,
      x: 'Lane 5'
    }
  ],
  [
    {
      id: '6',
      name: 'disinfection',
      y: 300,
      x: 'Lane 4'
    }
  ],
  [
    {
      id: '7',
      name: 'equipment defrost',
      y: 300,
      x: 'Lane 4'
    }
  ]
];

export const ChangeOverStepDurationsBarChartData = [
  {
    id: '70',
    name: 'Warm up water',
    parentName: 'Pre rinse',
    startTime: '2023-02-02T14:05:44.392000+00:00',
    endTime: '2023-02-02T14:05:44.503000+00:00',
    sessionId: '9010c34f-1870-4bb5-9a8c-5a6a6e55f046'
  },
  {
    id: '4',
    name: 'Equipment pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-02T14:05:44.503000+00:00',
    endTime: '2023-02-02T14:40:44.645000+00:00',
    sessionId: '9010c34f-1870-4bb5-9a8c-5a6a6e55f046'
  },
  {
    id: '60',
    name: 'Cool down',
    parentName: 'Pre rinse',
    startTime: '2023-02-02T14:40:44.645000+00:00',
    endTime: '2023-02-02T14:40:44.853000+00:00',
    sessionId: '9010c34f-1870-4bb5-9a8c-5a6a6e55f046'
  },
  {
    id: '50',
    name: 'Drain wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-02T14:40:44.853000+00:00',
    endTime: '2023-02-02T14:43:54.960000+00:00',
    sessionId: '9010c34f-1870-4bb5-9a8c-5a6a6e55f046'
  },
  {
    id: '71',
    name: 'Repeat pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-02T14:43:54.960000+00:00',
    endTime: '2023-02-02T14:43:55.169000+00:00',
    sessionId: '9010c34f-1870-4bb5-9a8c-5a6a6e55f046'
  },
  {
    id: '99',
    name: 'Drying inspection end',
    parentName: 'Drying',
    startTime: '2023-02-02T14:43:55.169000+00:00',
    endTime: '2023-02-02T14:44:20.991000+00:00',
    sessionId: '9010c34f-1870-4bb5-9a8c-5a6a6e55f046'
  },
  {
    id: '70',
    name: 'Warm up water',
    parentName: 'Pre rinse',
    startTime: '2023-02-02T14:49:05.362000+00:00',
    endTime: '2023-02-02T14:54:05.388000+00:00',
    sessionId: 'ff8f9223-dc4a-446d-8f23-5fe2d7be9f22'
  },
  {
    id: '4',
    name: 'Equipment pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-02T14:54:05.388000+00:00',
    endTime: '2023-02-02T15:26:06.364000+00:00',
    sessionId: 'ff8f9223-dc4a-446d-8f23-5fe2d7be9f22'
  },
  {
    id: '3',
    name: 'Fill wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-02T15:26:06.364000+00:00',
    endTime: '2023-02-02T15:26:06.475000+00:00',
    sessionId: 'ff8f9223-dc4a-446d-8f23-5fe2d7be9f22'
  },
  {
    id: '70',
    name: 'Warm up water',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T00:57:42.550000+00:00',
    endTime: '2023-02-03T00:57:42.659000+00:00',
    sessionId: 'dcd7ebf2-8d62-46b8-a8d3-d955dca524c0'
  },
  {
    id: '4',
    name: 'Equipment pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T00:57:42.659000+00:00',
    endTime: '2023-02-03T01:39:28.473000+00:00',
    sessionId: 'dcd7ebf2-8d62-46b8-a8d3-d955dca524c0'
  },
  {
    id: '60',
    name: 'Cool down',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T01:39:28.473000+00:00',
    endTime: '2023-02-03T01:39:28.692000+00:00',
    sessionId: 'dcd7ebf2-8d62-46b8-a8d3-d955dca524c0'
  },
  {
    id: '50',
    name: 'Drain wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T01:39:28.692000+00:00',
    endTime: '2023-02-03T01:42:34.853000+00:00',
    sessionId: 'dcd7ebf2-8d62-46b8-a8d3-d955dca524c0'
  },
  {
    id: '71',
    name: 'Repeat pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T01:42:34.853000+00:00',
    endTime: '2023-02-03T01:42:35.073000+00:00',
    sessionId: 'dcd7ebf2-8d62-46b8-a8d3-d955dca524c0'
  },
  {
    id: '99',
    name: 'Drying inspection end',
    parentName: 'Drying',
    startTime: '2023-02-03T01:42:35.073000+00:00',
    endTime: '2023-02-03T01:44:19.744000+00:00',
    sessionId: 'dcd7ebf2-8d62-46b8-a8d3-d955dca524c0'
  },
  {
    id: '70',
    name: 'Warm up water',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T01:50:55.137000+00:00',
    endTime: '2023-02-03T01:53:18.100000+00:00',
    sessionId: '6b38f556-7344-4477-b353-d8e931fac4bd'
  },
  {
    id: '4',
    name: 'Equipment pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T01:53:18.100000+00:00',
    endTime: '2023-02-03T02:28:18.237000+00:00',
    sessionId: '6b38f556-7344-4477-b353-d8e931fac4bd'
  },
  {
    id: '60',
    name: 'Cool down',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T02:28:18.237000+00:00',
    endTime: '2023-02-03T02:28:18.457000+00:00',
    sessionId: '6b38f556-7344-4477-b353-d8e931fac4bd'
  },
  {
    id: '50',
    name: 'Drain wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T02:28:18.457000+00:00',
    endTime: '2023-02-03T02:31:04.052000+00:00',
    sessionId: '6b38f556-7344-4477-b353-d8e931fac4bd'
  },
  {
    id: '71',
    name: 'Repeat pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T02:31:04.052000+00:00',
    endTime: '2023-02-03T02:31:04.162000+00:00',
    sessionId: '6b38f556-7344-4477-b353-d8e931fac4bd'
  },
  {
    id: '99',
    name: 'Drying inspection end',
    parentName: 'Drying',
    startTime: '2023-02-03T02:31:04.162000+00:00',
    endTime: '2023-02-03T03:45:29.242000+00:00',
    sessionId: '6b38f556-7344-4477-b353-d8e931fac4bd'
  },
  {
    id: '3',
    name: 'Fill wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T03:45:29.242000+00:00',
    endTime: '2023-02-03T03:45:29.352000+00:00',
    sessionId: '6b38f556-7344-4477-b353-d8e931fac4bd'
  },
  {
    id: '70',
    name: 'Warm up water',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T22:27:27.314000+00:00',
    endTime: '2023-02-03T22:27:27.424000+00:00',
    sessionId: 'd93082af-1815-4b18-831c-ac0aa65a8269'
  },
  {
    id: '4',
    name: 'Equipment pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T22:27:27.424000+00:00',
    endTime: '2023-02-03T23:02:27.562000+00:00',
    sessionId: 'd93082af-1815-4b18-831c-ac0aa65a8269'
  },
  {
    id: '60',
    name: 'Cool down',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T23:02:27.562000+00:00',
    endTime: '2023-02-03T23:02:27.781000+00:00',
    sessionId: 'd93082af-1815-4b18-831c-ac0aa65a8269'
  },
  {
    id: '50',
    name: 'Drain wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T23:02:27.781000+00:00',
    endTime: '2023-02-03T23:08:22.051000+00:00',
    sessionId: 'd93082af-1815-4b18-831c-ac0aa65a8269'
  },
  {
    id: '71',
    name: 'Repeat pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-03T23:08:22.051000+00:00',
    endTime: '2023-02-03T23:08:22.272000+00:00',
    sessionId: 'd93082af-1815-4b18-831c-ac0aa65a8269'
  },
  {
    id: '99',
    name: 'Drying inspection end',
    parentName: 'Drying',
    startTime: '2023-02-03T23:08:22.272000+00:00',
    endTime: '2023-02-03T23:44:55.928000+00:00',
    sessionId: 'd93082af-1815-4b18-831c-ac0aa65a8269'
  },
  {
    id: '70',
    name: 'Warm up water',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T00:08:42.955000+00:00',
    endTime: '2023-02-04T00:12:21.279000+00:00',
    sessionId: '875fef88-67dd-4dcf-ad1b-453753400e55'
  },
  {
    id: '4',
    name: 'Equipment pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T00:12:21.279000+00:00',
    endTime: '2023-02-04T00:58:08.810000+00:00',
    sessionId: '875fef88-67dd-4dcf-ad1b-453753400e55'
  },
  {
    id: '60',
    name: 'Cool down',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T00:58:08.810000+00:00',
    endTime: '2023-02-04T00:58:09.029000+00:00',
    sessionId: '875fef88-67dd-4dcf-ad1b-453753400e55'
  },
  {
    id: '50',
    name: 'Drain wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T00:58:09.029000+00:00',
    endTime: '2023-02-04T00:59:30.188000+00:00',
    sessionId: '875fef88-67dd-4dcf-ad1b-453753400e55'
  },
  {
    id: '3',
    name: 'Fill wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T00:59:30.188000+00:00',
    endTime: '2023-02-04T00:59:30.298000+00:00',
    sessionId: '875fef88-67dd-4dcf-ad1b-453753400e55'
  },
  {
    id: '70',
    name: 'Warm up water',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T01:02:33.064000+00:00',
    endTime: '2023-02-04T01:04:15.119000+00:00',
    sessionId: '0b3386c0-eca3-4b91-9530-45557114d760'
  },
  {
    id: '4',
    name: 'Equipment pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T01:04:15.119000+00:00',
    endTime: '2023-02-04T01:39:15.250000+00:00',
    sessionId: '0b3386c0-eca3-4b91-9530-45557114d760'
  },
  {
    id: '60',
    name: 'Cool down',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T01:39:15.250000+00:00',
    endTime: '2023-02-04T01:39:15.471000+00:00',
    sessionId: '0b3386c0-eca3-4b91-9530-45557114d760'
  },
  {
    id: '50',
    name: 'Drain wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T01:39:15.471000+00:00',
    endTime: '2023-02-04T01:43:08.884000+00:00',
    sessionId: '0b3386c0-eca3-4b91-9530-45557114d760'
  },
  {
    id: '71',
    name: 'Repeat pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T01:43:08.884000+00:00',
    endTime: '2023-02-04T01:43:08.994000+00:00',
    sessionId: '0b3386c0-eca3-4b91-9530-45557114d760'
  },
  {
    id: '99',
    name: 'Drying inspection end',
    parentName: 'Drying',
    startTime: '2023-02-04T01:43:08.994000+00:00',
    endTime: '2023-02-04T03:51:06.888000+00:00',
    sessionId: '0b3386c0-eca3-4b91-9530-45557114d760'
  },
  {
    id: '3',
    name: 'Fill wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T03:51:06.888000+00:00',
    endTime: '2023-02-04T03:51:14.988000+00:00',
    sessionId: '0b3386c0-eca3-4b91-9530-45557114d760'
  },
  {
    id: '70',
    name: 'Warm up water',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T23:01:47.759000+00:00',
    endTime: '2023-02-04T23:01:47.868000+00:00',
    sessionId: '6d7d7c98-cf94-492f-b2af-16e6ff795ea6'
  },
  {
    id: '4',
    name: 'Equipment pre rinse',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T23:01:47.868000+00:00',
    endTime: '2023-02-04T23:36:48.012000+00:00',
    sessionId: '6d7d7c98-cf94-492f-b2af-16e6ff795ea6'
  },
  {
    id: '60',
    name: 'Cool down',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T23:36:48.012000+00:00',
    endTime: '2023-02-04T23:36:48.232000+00:00',
    sessionId: '6d7d7c98-cf94-492f-b2af-16e6ff795ea6'
  },
  {
    id: '50',
    name: 'Drain wash tank',
    parentName: 'Pre rinse',
    startTime: '2023-02-04T23:36:48.232000+00:00',
    endTime: '2023-02-04T23:42:48.070000+00:00',
    sessionId: '6d7d7c98-cf94-492f-b2af-16e6ff795ea6'
  }
];
