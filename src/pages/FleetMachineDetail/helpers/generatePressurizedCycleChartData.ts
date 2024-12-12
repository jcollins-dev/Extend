import { LineChartDataItemProps } from 'components';
import { parseISO } from 'date-fns';

export const generatePressurizedCycleChartData = (
  data: Record<string, unknown>[]
): LineChartDataItemProps[] => {
  let deltaCounter = 0;

  // i'm not sure why this is a fix for me issue of the objects being in
  // reverse order.  I tried fixing but changing the order of the reducer
  // and the order was still wrong.  The below is in place as a fix.
  const runData = [...data].reverse();

  // loop through current data that has already been generated for the pressurization table
  // this function only works with data from variable `tableData` from PressurizedPerformancePanel
  // tableData gets converted from hook useGetPressurizeCycleDataByIdQuery
  const chartData = runData.reduce((acc: LineChartDataItemProps[], obj) => {
    // skip if the pressure is zero or less
    if (!obj.batchSuccessful) return acc;

    const delta = Math.floor(obj.deltaPressurizeTime as number);

    // add to total counter
    // each x in the chart data array is the data in Date format
    // each y value is the running total deltaCounter
    // the chart should always start at 0 and go upwwards
    deltaCounter = deltaCounter + delta;

    // convert iso date to Date object
    const date = parseISO(obj.startTime as string);

    return (acc = [{ x: date, y: Number(deltaCounter) }, ...acc]);
  }, []);

  return chartData.reverse();
};
