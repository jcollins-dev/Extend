import React, { ReactNode } from 'react';
import { VictoryBar, VictoryTooltip, VictoryChart } from 'victory';
import { ChartSettingsProps, ChartDataItemProps } from '../Charts.types';

export interface BarChartProps extends ChartSettingsProps {
  /** incoming aray of data objects in the form of [{x: label, y: value}] */
  data: ChartDataItemProps[];
  /** click handers for pie slicers, returns the X: label value of the pie slice. */
  handleClick?: (x: string) => void;
  /** array of labels that are selected, can be sent from the filters array from useFilterStates, it's used for styling */
  selected?: string[];
  colors?: {
    [key: string]: string;
  };
  maxDomain?: number;
  categories?: string[];
}

export const BarChart = ({
  data,
  handleClick,
  selected,
  //colors,
  maxDomain,
  width,
  height,
  categories
}: BarChartProps): React.ReactElement => {
  const ChartWrapper = ({ children }: { children: ReactNode | ReactNode[] }): JSX.Element => (
    <VictoryChart
      {...{
        colorScale: 'qualitative',
        domainPadding: 10,
        domain: maxDomain ? { y: [0, maxDomain] } : undefined,
        categories,
        children,
        width,
        height
      }}
    >
      {children}
    </VictoryChart>
  );
  return (
    <ChartWrapper>
      <VictoryBar
        data={data}
        labelComponent={<VictoryTooltip />}
        style={{
          data: {
            // if filters are active and if label is on filter list, change the opacity of the slice to indicate
            // it's not selected
            cursor: 'pointer',
            transition: 'all 500ms ease',
            fillOpacity: ({ datum }) =>
              !selected?.length ? 1 : selected?.includes(datum.x) ? 1 : 0.2
          }
        }}
        events={[
          {
            childName: 'all',
            target: 'data',
            eventHandlers: {
              onClick: () => [
                {
                  // get the x value and send to click handlers as string
                  mutation: ({ datum }: { datum: ChartDataItemProps }) =>
                    handleClick?.(datum.x as string)
                }
              ]
            }
          }
        ]}
      />
    </ChartWrapper>
  );
};
