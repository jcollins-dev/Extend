import { MachineOverviewTag } from 'types/protein';
import { toKpiRows, formatValueByValueType, formatValueWithUnit } from './utils';

const tags: MachineOverviewTag[] = [
  {
    mainTag: 'False',
    name: 'Belt Run Distance',
    tagGroupId: '4',
    tagGroupName: 'Drive System Warranty Information',
    tagId: 'F04_DistanceCounter',
    unit: 'km',
    value: 1,
    valueType: 'integer'
  },
  {
    mainTag: 'True',
    name: 'Belt Speed',
    tagGroupId: '1',
    tagGroupName: 'Machine Subsystems Information',
    tagId: 'F04_PV_BeltSpeed',
    unit: 'M/Min',
    value: '',
    valueType: 'float'
  },
  {
    mainTag: 'True',
    name: 'Rail Temperature',
    tagGroupId: '1',
    tagGroupName: 'Machine Subsystems Information',
    tagId: 'F04_PV_RailTemperature',
    unit: '°C',
    value: 22.5,
    valueType: 'float'
  },
  {
    mainTag: 'True',
    name: 'Evaporator 1 Temperature',
    tagGroupId: '1',
    tagGroupName: 'Machine Subsystems Information',
    tagId: 'F08_CliModEvap_1_PV_EvapTe',
    unit: '°C',
    value: 24,
    valueType: 'float'
  },
  {
    mainTag: 'True',
    name: 'Air Temperature',
    tagGroupId: '1',
    tagGroupName: 'Machine Subsystems Information',
    tagId: 'F08_PV_AirTemperature01',
    unit: '°C',
    value: 24.3999996
  },
  {
    mainTag: 'False',
    name: undefined,
    tagGroupId: '5',
    tagGroupName: 'Some random group name',
    tagId: 'F05_HourCounter',
    unit: 'hours',
    value: 55,
    valueType: 'float'
  },
  {
    mainTag: 'True',
    name: 'A Tag With No Group Id',
    tagGroupId: '',
    tagGroupName: '',
    tagId: 'tag-with-no-group-id',
    unit: 'hours',
    value: 55
  }
];

describe('toKpiRows', () => {
  const { main, extended } = toKpiRows(tags);
  /**
   * the grouping label is correctly set
   */
  // Ungrouped tags at the top
  test('main list', () => expect(main[0].label).toBe('A Tag With No Group Id'));
  // Then the first group name
  test('main list', () => expect(main[1].label).toBe('Machine Subsystems Information'));
  // Then the first tag in that group
  test('main list', () => expect(main[2].label).toBe('Belt Speed'));

  /**
   * the row that shows the grouping label is prepended to the tags list
   */
  test('main list', () => expect(main.length).toBe(6));

  /**
   * main list is correctly transformed to a flattened KpiRows[]
   */
  test('main list is correctly transformed', () => {
    expect(main).toEqual([
      {
        label: tags[6].name,
        value: {
          key: `${tags[6].tagGroupId}-${tags[6].tagId}`,
          content: formatValueWithUnit(
            formatValueByValueType(tags[6].value, tags[6].valueType),
            tags[6].unit
          ),
          clickable: true
        }
      },
      {
        label: tags[1].tagGroupName,
        value: {
          key: tags[1].tagGroupId,
          bgColor: '#F1F3F4',
          color: '#303E47',
          weight: 500,
          height: 33
        }
      },
      {
        label: tags[1].name,
        value: {
          key: `${tags[1].tagGroupId}-${tags[1].tagId}`,
          content: `-- ${tags[1].unit}`,
          clickable: true
        }
      },
      {
        label: tags[2].name,
        value: {
          key: `${tags[2].tagGroupId}-${tags[2].tagId}`,
          content: formatValueWithUnit(
            formatValueByValueType(tags[2].value, tags[2].valueType),
            tags[2].unit
          ),
          clickable: true
        }
      },
      {
        label: tags[3].name,
        value: {
          key: `${tags[3].tagGroupId}-${tags[3].tagId}`,
          content: formatValueWithUnit(
            formatValueByValueType(tags[3].value, tags[3].valueType),
            tags[3].unit
          ),
          clickable: true
        }
      },
      {
        label: tags[4].name,
        value: {
          key: `${tags[4].tagGroupId}-${tags[4].tagId}`,
          content: formatValueWithUnit(
            formatValueByValueType(tags[4].value, tags[4].valueType),
            tags[4].unit
          ),
          clickable: true
        }
      }
    ]);
  });

  /**
   * extended list is correctly transformed to a flattened KpiRows[]
   */
  test('extended list is correctly transformed', () =>
    expect(extended).toEqual([
      {
        label: tags[0].tagGroupName,
        value: {
          key: tags[0].tagGroupId,
          bgColor: '#F1F3F4',
          color: '#303E47',
          weight: 500,
          height: 33
        }
      },
      {
        label: tags[0].name,
        value: {
          key: `${tags[0].tagGroupId}-${tags[0].tagId}`,
          content: formatValueWithUnit(
            formatValueByValueType(tags[0].value, tags[0].valueType),
            tags[0].unit
          ),
          clickable: true
        }
      },
      {
        label: tags[5].tagGroupName,
        value: {
          key: tags[5].tagGroupId,
          bgColor: '#F1F3F4',
          color: '#303E47',
          weight: 500,
          height: 33
        }
      },
      {
        label: tags[5].tagId,
        value: {
          key: `${tags[5].tagGroupId}-${tags[5].tagId}`,
          content: formatValueWithUnit(
            formatValueByValueType(tags[5].value, tags[5].valueType),
            tags[5].unit
          ),
          clickable: true
        }
      }
    ]));
});
