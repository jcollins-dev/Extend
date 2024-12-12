import { BaseTag, BaseTagType } from 'types/protein';
import { normalize, toLineSeries } from './utils';

const tags: BaseTag[] = [
  {
    id: 'F07',
    name: 'F07',
    unit: '°C',
    type: BaseTagType.Tag,
    values: [
      {
        timestamp: '2022-03-01T06:40:00+00:00',
        value: 20
      },
      {
        timestamp: '2022-03-02T06:40:00+00:00',
        value: 40
      },
      {
        timestamp: '2022-03-03T06:40:00+00:00',
        value: 80
      }
    ]
  },
  {
    id: 'F08',
    name: 'F08',
    unit: 'kg',
    type: BaseTagType.Tag,
    values: [
      {
        timestamp: '2022-03-01T06:40:00+00:00',
        value: 100
      },
      {
        timestamp: '2022-03-02T06:40:00+00:00',
        value: 200
      },
      {
        timestamp: '2022-03-03T06:40:00+00:00',
        value: 400
      }
    ]
  }
];

describe('MachineTagsAnalysis utils', () => {
  const lineSeries = toLineSeries(tags, ['F08']);
  /**
   * Series array is populated
   */
  test('Series', () => expect(lineSeries.length).toBe(2));

  /**
   * Multi-axis
   */
  test('F07 assigned to the left axis', () =>
    expect(lineSeries.find((s) => s.id == 'F07')?.isRightAxis).toBeFalsy());
  test('F08 assigned to the right axis', () =>
    expect(lineSeries.find((s) => s.id == 'F08')?.isRightAxis).toBeTruthy());

  /**
   * Normalize
   */

  test('Normalize data', () =>
    expect(normalize([lineSeries[0]], 80, 0)[0].data.map((d) => d.y)).toEqual([0.25, 0.5, 1]));
  test('Normalize data', () =>
    expect(normalize([lineSeries[1]], 400, 0)[0].data.map((d) => d.y)).toEqual([0.25, 0.5, 1]));
});
