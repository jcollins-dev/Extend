// 3rd party
import React, { ReactNode, ReactElement } from 'react';
import { VictoryBar, VictoryChart, VictoryStack, VictoryAxis, Bar } from 'victory';

// Components
import { LightTooltip, DarkTooltip, DefaultTooltip, AngledLabel } from '../Tooltips';

// Types
import { ChartDataItemProps, ChartSettingsProps } from '../Charts.types';
import { FilterSelectedItemsProps } from 'components/StyledUi/ChartsDataFilter/PieChartsArea';

export type StackedBarChartHandleClickProps = (group: string, item: string) => void;
export type StackedBarChartSelectedProps = {
  [groupId: string]: { [itemId: string]: boolean };
};

export type StackedBarChartColorsProps = {
  [key: string]: string;
};

export type StackedBarChartDataProps = {
  [groupId: string]: ChartDataItemProps[];
};

export interface StackedBarChartProps extends ChartSettingsProps {
  /** incoming aray of data objects in the form of [{x: label, y: value}] */
  data?: StackedBarChartDataProps;
  /** click handers for pie slicers, returns the X: label value of the pie slice. */
  handleClick?: StackedBarChartHandleClickProps;
  /** array of labels that are selected, can be sent from the filters array from useFilterStates, it's used for styling */
  selected?: FilterSelectedItemsProps;
  /** pre-defined colors, coming soon */
  colors?: StackedBarChartColorsProps;
  /**  the main chart label that goes at the bottom of the chart, under the bar labels */
  bottomLabel?: string;
  /** the labels to group the bars to */
  categories?: string[];
  /** the labels that appear below the bar charts */
  tickMarks?: string[];
  /** sets the min and max height of the bars based on values */
  maxDomain?: number;
  /** tooltip type */
  tooltipType?: `light` | `dark`;
  groupKey?: string;
  itemKey?: string;
  checkIfSelected?: StackedBarChartHandleClickProps;
  // If chart has a legend
  hasLegend?: boolean;
  totalDataPoints?: number;
}

export const StackedBarChart = ({
  data,
  handleClick,
  selected,
  //categories,
  tickMarks,
  maxDomain,
  tooltipType,
  //totalDataPoints,
  height,
  width
}: //checkIfSelected
StackedBarChartProps): ReactElement => {
  let BarTooltip = DefaultTooltip;

  if (!data) return <></>;

  if (tooltipType === 'dark') BarTooltip = DarkTooltip;
  if (tooltipType === 'light') BarTooltip = LightTooltip;

  const counter = Object.keys(data).length;
  const pad = counter > 2 ? 60 : 150;

  const ChartWrapper = ({ children }: { children: ReactNode | ReactNode[] }): JSX.Element => (
    <VictoryChart
      singleQuadrantDomainPadding={{ x: false }}
      {...{
        colorScale: 'qualitative',
        domainPadding: [pad, pad],
        domain: maxDomain ? { x: [1, counter], y: [0, maxDomain] } : undefined,
        //categories,
        children,
        width,
        height
      }}
    >
      <VictoryStack>{children}</VictoryStack>
      <VictoryAxis tickValues={tickMarks} tickLabelComponent={AngledLabel} crossAxis={false} />
      <VictoryAxis dependentAxis crossAxis={false} tickFormat={(tick) => `${tick}`} />
    </VictoryChart>
  );

  const BarCharts = Object.entries(data).map(([groupId, bars], i) => (
    <VictoryBar
      key={i}
      {...{
        colorScale: 'qualitative',
        alignment: 'middle',
        data: bars,
        labelComponent: BarTooltip,
        labels: (d) => d.y,
        dataComponent: <Bar pathComponent={<path data-chart-id={`${groupId.toLowerCase()}`} />} />,
        style: {
          data: {
            // if filters are active and if label is on filter list, change the opacity of the slice to indicate
            // it's not selected
            cursor: 'pointer',
            transition: 'all 500ms ease',
            fillOpacity: ({ datum }) => {
              if (selected) {
                const ss = Object.keys(selected)[0] as unknown as string;
                // @ts-expect-error: ignore
                const kv = selected[ss];
                if (kv.constructor === Array) {
                  return kv.indexOf(datum.label) > -1 ? 1 : 0.3;
                } else if (typeof kv === 'object' && !Array.isArray(kv) && kv !== null) {
                  const itemId = datum.xName;
                  // @ts-expect-error: ignore
                  if (selected?.[groupId]?.[itemId]) return 1;
                  else return 0.3;
                }
              }
              return 1;
            }
          }
        },
        events: [
          {
            childName: 'all',
            target: 'data',
            eventHandlers: {
              onClick: () => [
                {
                  // get the x value and groupId and send to click handlers as strings
                  mutation: ({ datum }: { datum: ChartDataItemProps }) => {
                    const group = datum.label;
                    const item = datum.x;
                    if (group && item) handleClick?.(group, item);
                  }
                }
              ]
            }
          }
        ]
      }}
    />
  ));

  return <ChartWrapper>{BarCharts}</ChartWrapper>;
};
