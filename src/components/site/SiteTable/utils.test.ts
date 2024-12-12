import { generateColumnConfigs } from './utils';
import i18n from 'i18nForTests';

describe('SiteTable utils', () => {
  test('generateColumnConfigs', () => {
    const machineCols = generateColumnConfigs('MACHINE', {}, jest.fn, i18n.t);
    const lineCols = generateColumnConfigs('LINE', {}, jest.fn, i18n.t);

    expect(machineCols.map((col) => col.key)).toEqual([
      'description',
      'status',
      'numCurrentAlarms',
      'numAlarmsOverPeriod',
      'configurationType',
      'line',
      'productionOverPeriod',
      'utilizationOverPeriod'
    ]);

    expect(lineCols.map((col) => col.key)).toEqual([
      'name',
      'status',
      'numCurrentAlarms',
      'numAlarmsOverPeriod',
      'productionOverPeriod',
      'utilizationOverPeriod'
    ]);
  });
});
