import { getEnumName } from 'helpers';
import { AlarmType } from 'types/machine-health/alarms';

describe('Enum helper - getEnumName', () => {
  it('It should return correct name for AvureCriticalAlarm', () => {
    const enumValue = AlarmType.AvureCriticalAlarm;
    const expectedName = 'AvureCriticalAlarm';
    const actualName = getEnumName(AlarmType, enumValue);
    expect(actualName).toBe(expectedName);
  });
});
