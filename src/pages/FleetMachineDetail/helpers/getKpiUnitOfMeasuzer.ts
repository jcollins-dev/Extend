import { MachineHealthKpiKey, MachineHealthKpiUnits } from 'types/machine-health';
import moment from 'moment';
import { formatDate } from 'helpers';
// Lodash
import round from 'lodash/round';

export const getKpiUnitOfMeasure = (
  kpi: MachineHealthKpiKey,
  unitsOfMeasure?: MachineHealthKpiUnits
): string => {
  if (!unitsOfMeasure || !unitsOfMeasure[kpi]) return '-';
  return unitsOfMeasure[kpi] || '-';
};

export const kpiValueToCardText = (value: React.ReactNode): React.ReactNode => {
  const pattern = /:/;
  if (value && typeof value === 'number') {
    return round(value, 2);
  } else if (pattern.test(value as string)) {
    const waitTime = moment.duration(value as string);
    return waitTime.isValid() ? formatDate(waitTime.asMilliseconds(), 'time-elapsed') : '–';
  } else if (value === 0 || value) {
    return value;
  }
  return '–';
};
