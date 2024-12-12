import { processData } from './utils';
import { driveTorqueRatioTestData } from 'constants/testdata/protein';

describe('DriveTorqueRatio - utils', () => {
  it('It processes data correctly', () => {
    const output = processData(driveTorqueRatioTestData);
    expect(output.innerSeriesData).toEqual([
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 9 },
      { x: new Date('2020-01-01T01:00:00.000Z'), y: 10 }
    ]);
    expect(output.outerSeriesData).toEqual([
      { x: new Date('2020-01-01T00:00:00.000Z'), y: 14 },
      { x: new Date('2020-01-01T01:00:00.000Z'), y: 15 }
    ]);
    expect(output.innerValuePercent).toEqual(40);
    expect(output.outerValuePercent).toEqual(60);
  });
});
