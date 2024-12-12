import { useApiData, UseApiDataReturnProps } from 'sandbox/joey/useApiCall';
import { useFleetMachineAccountData } from './useFleetMachineAcountData';
import { useDateRange } from 'components';
import { parseISO, format } from 'date-fns';
import { calculateDataKeyTotals } from 'common/helpers/dataCounters';

export interface UseAlarmsForIntensifierApiDataProps {
  cycles?: number;
  alarms_details?: {
    alarm_category: string;
    alarm_description: string;
    alarm_hpu_value: string;
    alarm_id: string;
    intensifier: string;
  }[];
  tableData?: {
    alarm_category: string;
    alarm_description: string;
    alarm_hpu_value: string;
    alarm_id: string;
    intensifier: string;
    occurences_ratio: number;
    occurences_percentage: number;
    lineChartKey: string;
  }[];
}

export interface UseAlarmsForIntensifierApiDataReturnProps
  extends UseApiDataReturnProps,
    UseAlarmsForIntensifierApiDataProps {
  t?: string;
}

export interface UseAlarmsForIntensifierApiProps {
  startTime?: string;
  endTime?: string;
  machineId?: string;
}

export const useAlarmsForIntensifierApi = (
  props?: UseAlarmsForIntensifierApiProps
): UseAlarmsForIntensifierApiDataReturnProps => {
  const { isoDateRange } = useDateRange();

  let startTime = props?.startTime;
  let endTime = props?.endTime;
  let machineId = props?.machineId;

  if (!startTime || !endTime) {
    startTime = isoDateRange.startTime;
    endTime = isoDateRange.endTime;
  }

  if (!machineId) machineId = useFleetMachineAccountData().machineId;

  // Format it in the desired format
  const formattedTimestamp = format(parseISO(startTime), 'yyyy-MM-dd HH:mm:ss.SSS');

  const apiCall = useApiData(
    `/mh/v1/avure/machine-health/${machineId}/alarms-for-intensifiers?start_datetime=${formattedTimestamp}`
  );

  let tableData = undefined;
  // get the total number of alarms
  let alarmCount = 0;
  // process api call and return tableData
  if (apiCall?.data) {
    // break up api call and set types
    const { cycles, alarms_details } = apiCall.data as UseAlarmsForIntensifierApiDataProps;

    // to avoid errors
    if (alarms_details && cycles) {
      let groupedAlarms: Record<string, Record<string, unknown>> = {};
      // get the alarm totals return in the following format:
      // { [id]: { count: number } }
      const alarmTotals = calculateDataKeyTotals(alarms_details, 'alarm_id');
      // get the total number of alarms for this period
      alarmCount = alarms_details.length;
      // loop through the alarm details to build tableData
      alarms_details?.forEach((alarm) => {
        // this is all for typescript
        const id = alarm['alarm_id'] as string;
        const typedValObj = alarmTotals[id] as { count: number };
        const count = typedValObj.count;

        if (!groupedAlarms[id]) groupedAlarms = { ...groupedAlarms, [id]: {} };
        // need to break down a string for better formatting
        const [skidNum, intensifierNum] = (alarm['intensifier'] as string).split(' ')[1].split('.');
        // need to add a key that correponds to the line chart data
        // in order to show/hide
        const lineChartKey = `intensifier_utilization_${skidNum}_${intensifierNum}`;

        groupedAlarms[id] = {
          ...groupedAlarms[id],
          // the ratio of this alarm to the total number of alarms
          occurences_ratio: (count / alarmCount) * 100,
          // the ratio of this alarm to total cycles
          occurences_percentage: (count / cycles) * 100,
          lineChartKey,
          ...alarm
        };
      });
      // return the tableData as array
      tableData = Object.values(groupedAlarms) as UseAlarmsForIntensifierApiDataProps['tableData'];
    }
  }

  return { ...apiCall, tableData };
};
