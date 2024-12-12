import React from 'react';
import {
  Bar,
  VictoryAxisProps,
  VictoryBarProps,
  VictoryChartProps,
  VictoryPieProps
} from 'victory';
import { VictoryStackProps } from 'victory';
import {
  BarChartOverTimeTooltip,
  DarkLabel,
  PieChartTooltip
} from 'components/StyledUi/ChartsV2/Tooltips';
import { parseISO, format } from 'date-fns';

export interface StackedBarChartOverTimeProps {
  title: string;
  colors?: Record<string, string>;
  isLoading?: boolean;
  hasError?: string;
  hasMessage?: string;
  groupKey: string;
  itemKey?: string;
  categoryKey?: string;
}

export const categoryAxisSettings = (): VictoryAxisProps => {
  return {
    tickCount: 10,
    fixLabelOverlap: true,
    tickLabelComponent: DarkLabel,
    tickFormat: (x: string) => format(parseISO(x), `M/d`)
  };
};

export const valueAxisSettings = (): VictoryAxisProps => {
  return {
    dependentAxis: true,
    tickLabelComponent: DarkLabel
  };
};

export interface StackSettingsProps {
  categories: string[];
}
export const stackSettings = ({ categories }: StackSettingsProps): VictoryStackProps => {
  return {
    colorScale: 'qualitative',
    categories: { x: categories }
  };
};

export const chartSettings = (): VictoryChartProps => {
  return {
    domainPadding: 20
  };
};

export interface CommonChartProps {
  //data: Record<string, unknown>[];
  colors?: Record<string, string>;
  handleClick: (x: Record<string, string>) => void;
  checkIfSelected: (x: Record<string, string>) => boolean;
  standAlone?: boolean;
  width?: number;
  height?: number;
}

interface BarSettingsProps extends CommonChartProps, VictoryBarProps {
  groupId: string;
}

export const barSettings = ({
  groupId,
  colors,
  handleClick,
  checkIfSelected
}: BarSettingsProps): VictoryBarProps => {
  return {
    colorScale: colors ? undefined : 'qualitative',
    alignment: 'middle',
    labelComponent: BarChartOverTimeTooltip,
    labels: ({ datum }) => `${` `} ${datum.x} ${`(${datum.y})`} `,
    dataComponent: <Bar pathComponent={<path data-chart-id={`${groupId.toLowerCase()}`} />} />,
    style: {
      data: {
        // if filters are active and if label is on filter list, change the opacity of the slice to indicate
        // it's not selected
        cursor: 'pointer',
        transition: 'all 500ms ease',
        fill: colors?.[groupId],
        fillOpacity: ({ datum }) => (checkIfSelected(datum) ? 1 : 0.3)
      }
    },
    events: [
      {
        childName: 'all',
        target: 'data',
        eventHandlers: {
          onClick: () => [
            {
              // the bar data to the click handler
              mutation: ({ datum }: { datum: Record<string, string> }) => handleClick(datum)
            }
          ]
        }
      }
    ]
  };
};

interface PieChartProps extends CommonChartProps {
  isDoughNut?: boolean;
}
export const pieChartSettings = ({
  handleClick,
  colors,
  checkIfSelected,
  width,
  height,
  isDoughNut
}: PieChartProps): VictoryPieProps => {
  return {
    width,
    height,
    labelComponent: PieChartTooltip,
    labels: ({ datum }) => `x: ${datum.x}, y: ${datum.y}`,
    innerRadius: isDoughNut ? 50 : 0,
    colorScale: !colors ? 'qualitative' : undefined,
    style: {
      data: {
        // if filters are active and if label is on filter list, change the opacity of the slice to indicate
        // it's not selected
        cursor: 'pointer',
        fill: !colors ? undefined : ({ datum }) => colors?.[datum.x],
        transition: 'fill-opacity 300ms ease',
        fillOpacity: ({ datum }) => (checkIfSelected(datum) ? 1 : 0.3)
      }
    },
    events: [
      {
        childName: 'all',
        target: 'data',
        eventHandlers: {
          onClick: () => ({
            // send slice data to click handler
            mutation: ({ datum }: { datum: Record<string, string> }) => handleClick(datum)
          })
        }
      }
    ]
  };
};
