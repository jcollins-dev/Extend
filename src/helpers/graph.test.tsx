import { DatePoint } from 'types/graph';
import { prunePointsBelow, prunePointsAbove, getXaxisOffset, getYaxisOffset } from './graph';

describe('prunePointsBelow helper', () => {
  test('Removes points below a certain threshold, leaving the closest point to the threshold unaffected', () => {
    const input = [
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 100 },
      { x: new Date('2020-01-01T01:00:00.000Z'), y: 50 },
      { x: new Date('2020-01-01T02:00:00.000Z'), y: 30 },
      { x: new Date('2020-01-01T03:00:00.000Z'), y: 80 },
      { x: new Date('2020-01-01T04:00:00.000Z'), y: 101 },
      { x: new Date('2020-01-01T05:00:00.000Z'), y: 90 }
    ];

    const expected = [
      { x: new Date('2020-01-01T02:00:00.000Z'), y: 30 },
      { x: new Date('2020-01-01T03:00:00.000Z'), y: 80 },
      { x: new Date('2020-01-01T04:00:00.000Z'), y: 101 },
      { x: new Date('2020-01-01T05:00:00.000Z'), y: 90 }
    ];

    // Remove all points before 2:30, except for one
    expect(prunePointsBelow(input, new Date('2020-01-01T02:30:00.000Z'))).toEqual(expected);
  });
});

describe('prunePointsAbove helper', () => {
  test('Removes points above a certain threshold, leaving the closest point to the threshold unaffected', () => {
    const input = [
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 100 },
      { x: new Date('2020-01-01T01:00:00.000Z'), y: 50 },
      { x: new Date('2020-01-01T02:00:00.000Z'), y: 30 },
      { x: new Date('2020-01-01T03:00:00.000Z'), y: 80 },
      { x: new Date('2020-01-01T04:00:00.000Z'), y: 101 },
      { x: new Date('2020-01-01T05:00:00.000Z'), y: 90 }
    ];

    const expected = [
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 100 },
      { x: new Date('2020-01-01T01:00:00.000Z'), y: 50 },
      { x: new Date('2020-01-01T02:00:00.000Z'), y: 30 },
      { x: new Date('2020-01-01T03:00:00.000Z'), y: 80 }
    ];

    // Remove all points after 2:30, except for one
    expect(prunePointsAbove(input, new Date('2020-01-01T02:30:00.000Z'))).toEqual(expected);
  });
});

describe('getXaxisOffset helper', () => {
  test('Get the xAxis max and min values', () => {
    const series = [
      {
        data: [
          { x: new Date('2020-01-01T00:00:00.000Z'), y: 100 },
          { x: new Date('2020-01-01T01:00:00.000Z'), y: 50 },
          { x: new Date('2020-01-01T02:00:00.000Z'), y: 30 },
          { x: new Date('2020-01-01T03:00:00.000Z'), y: 80 },
          { x: new Date('2020-01-01T04:00:00.000Z'), y: 101 },
          { x: new Date('2020-01-01T05:00:00.000Z'), y: 90 }
        ] as DatePoint[]
      }
    ];
    expect(getXaxisOffset(series)).toStrictEqual({
      min: new Date('2020-01-01T00:00:00.000Z'),
      max: new Date('2020-01-01T05:00:00.000Z')
    });
  });
});

describe('getYaxisOffset helper', () => {
  test('Get the yAxis max and min values', () => {
    const series = [
      {
        data: [
          { x: new Date('2020-01-01T00:00:00.000Z'), y: 100 },
          { x: new Date('2020-01-01T01:00:00.000Z'), y: 50 },
          { x: new Date('2020-01-01T02:00:00.000Z'), y: 30 },
          { x: new Date('2020-01-01T03:00:00.000Z'), y: 80 },
          { x: new Date('2020-01-01T04:00:00.000Z'), y: 101 },
          { x: new Date('2020-01-01T05:00:00.000Z'), y: 90 }
        ] as DatePoint[]
      }
    ];
    expect(getYaxisOffset(series)).toStrictEqual({
      min: 30,
      max: 101
    });
  });
});
