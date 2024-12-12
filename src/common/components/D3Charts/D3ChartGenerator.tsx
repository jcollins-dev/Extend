import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { ChartAxisWrapperProps } from './ChartAxisWrapper/ChartAxisWrapper';

export interface D3ChartGeneratorPropsAxisMargins {
  t?: number;
  r?: number;
  b?: number;
  l?: number;
}

export type D3ChartGeneratorTypesProps = 'line' | 'points' | 'html-points';

export interface D3ChartGeneratorProps extends ChartAxisWrapperProps {
  /** padding around this chart or custom margins */
  axisMargins?: D3ChartGeneratorPropsAxisMargins;
  /** the width/height of axis for now, it's the same for both, the bottom axis will be full width and the left axis will
   * be full height */
  axisSize?: number;
  data?: Record<string, unknown>[];
  /** the color of this line */
  color?: string;
  /** key that will be used to plot the verticle positions, typically date */
  valueKey?: string;
  /** the key that will be used to plot the horizontal positions, typically date */
  groupKey?: string;
  /** the char type */
  type?: 'line' | 'points' | 'html-points';
  /** settings for the charts points */
  pointsSettings?: {
    isOutlined?: boolean;
    size?: number;
  };
}

export const D3ChartGenerator = ({
  width,
  height,
  data,
  color,
  dateRangeDomain,
  valueKey,
  groupKey,
  axisMargins,
  axisSize,
  leftDomain,
  bottomDomain,
  type,
  pointsSettings
}: D3ChartGeneratorProps): JSX.Element => {
  // return nothing if reqs aren't met, to avoid any crashes
  if (!width || !height || !data) return <></>;

  // set some defaults to also avoid crashes
  valueKey = valueKey || 'value';
  color = color || '#cb1dd1';
  // set the default axis size to zero if a axis is needed
  axisSize = axisSize || 0;
  // set the default axis size if a domain is provided
  if (dateRangeDomain || leftDomain || bottomDomain) axisSize = axisSize || 50;

  const marginTop = axisMargins?.t || axisSize / 2;
  const marginRight = axisMargins?.r || axisSize / 2;
  const marginBottom = axisMargins?.b || axisSize;
  const marginLeft = axisMargins?.l || axisSize;
  // calculate the actual width of the chart, if there are axis then those are considered
  const chartWidth = width - marginLeft - marginRight;
  const chartHeight = height - marginTop - marginBottom;

  // set a default domain
  let xDomain: string[] | number[] | Date[] = [0, 1000];
  const yDomain: string[] | number[] | Date[] = leftDomain || [0, 1000];

  if (dateRangeDomain) xDomain = [new Date(dateRangeDomain[0]), new Date(dateRangeDomain[1])];

  // get the positioning scale of the chart points
  const xScale = d3.scaleUtc().domain(xDomain).range([0, chartWidth]);

  const yScale = d3.scaleLinear().domain(yDomain).range([chartHeight, 0]);

  switch (type) {
    case 'line': {
      // Build the line
      const lineBuilder = d3
        .line<Record<string, unknown>>()
        .x((d) => xScale(new Date(d[groupKey as string] as string)))
        .y((d) => yScale(d[valueKey as string] as number));
      // gets the d value for the svg path
      const linePath = lineBuilder(data) as string;
      return <path d={linePath} stroke={color} fill="none" strokeWidth={1.5} />;
    }

    case 'points': {
      const Points = data.map((item, i) => {
        const posX = xScale(new Date(item[groupKey as string] as string));
        const posY = yScale(item[valueKey as string] as number);
        return (
          <circle
            key={i}
            cx={posX}
            cy={posY}
            r={pointsSettings?.size || 3}
            fill={pointsSettings?.isOutlined ? 'white' : color}
            strokeWidth={pointsSettings?.isOutlined ? 2 : undefined}
            stroke={pointsSettings?.isOutlined ? color : undefined}
            //onMouseOver={() => setTooltip({ left: posX + leftMarg, top: posY + topMarg, i, ...item })}
            //onMouseLeave={() => setTooltip(undefined)}
          />
        );
      });

      return <>{Points}</>;
    }

    default:
      return <></>;
  }
};
