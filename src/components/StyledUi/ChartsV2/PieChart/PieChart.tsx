//3rd party
import React from 'react';
import { VictoryPie } from 'victory';
import { DarkTooltip, DefaultTooltip, LightTooltip } from '../TooltipsV1';

/** data being sent to pie chart in the required format */
/** data must be converted before sending to PieChart */
export interface PieChartDataProps {
  x: string;
  y: number;
  label?: string;
}

/** click handers for pie slicers, returns the X: label value of the pie slice. */
export type PieChartHandlerProps = (x: string) => void;
/** array of labels that are selected, can be sent from the filters array from useFilterStates, it's used for styling */
export type PieChartSelectedProps = string[];
/** colors that are assigned to each slice/by idKey (x: in the pie chart array of objects) */
export type PieChartColorsProps = { [key: string]: string };
/** is this a doughnut style pie chart?  defaults to standard pie chart */
export type PieChartIsDoughnutProps = boolean;

export type LegendProps = {
  name?: string;
  symbol?: {
    fill?: string;
    type?: string;
  };
};

export interface PieChartProps {
  /** incoming aray of data objects in the form of [{x: label, y: value}] */
  data: PieChartDataProps[];
  handleClick?: PieChartHandlerProps;
  selected?: PieChartSelectedProps;
  colors?: PieChartColorsProps;
  isDoughnut?: PieChartIsDoughnutProps;
  height?: number;
  width?: number;
  padding?: number;
  standAlone?: boolean;
  labelComponent?: JSX.Element;
  hasLegend?: boolean;
  tooltipType?: `light` | `dark`;
}

export const PieChart = ({
  data,
  handleClick,
  selected,
  colors,
  isDoughnut,
  tooltipType,
  height,
  width,
  padding,
  standAlone,
  labelComponent
}: PieChartProps): JSX.Element => {
  // return nothing if no data
  if (!data) return <></>;
  let BarTooltip = DefaultTooltip;
  if (tooltipType === 'dark') BarTooltip = DarkTooltip;
  if (tooltipType === 'light') BarTooltip = LightTooltip;

  return (
    <VictoryPie
      standalone={standAlone}
      data={data}
      width={width}
      height={height || width}
      padding={padding}
      labelRadius={120}
      labelComponent={labelComponent || BarTooltip}
      labels={({ datum }) => `x: ${datum.x}, y: ${datum.y}`}
      innerRadius={(/*{ datum }*/) => (isDoughnut ? 50 : 0)}
      colorScale={!colors ? 'qualitative' : undefined}
      style={{
        data: {
          // if filters are active and if label is on filter list, change the opacity of the slice to indicate
          // it's not selected
          cursor: 'pointer',
          transition: 'fill-opacity 300ms ease',
          fillOpacity: ({ datum }) =>
            !selected?.length ? 1 : selected?.includes(datum.x) ? 1 : 0.2
        }
      }}
      events={[
        {
          childName: 'all',
          target: 'data',
          eventHandlers: {
            onClick: () => ({
              // get the x value and send to click handlers as string
              mutation: ({ datum }: { datum: PieChartDataProps }) =>
                handleClick?.(datum.x as string)
            }) /*,
            
            //// will need this later ////

            onMouseOver: (_, obj) => {
              console.log(obj)
              return {

                // get the x value and send to click handlers as string
                mutation: (over) =>
                  console.log({ over })
              }
            },
            onMouseOut: () => ({}),
            
            /////////////////////////////////

            */
          }
        }
      ]}
    />
  );
};
