import React from 'react';
import { ZoomObjectTuples } from 'types';

export interface DatePoint {
  x: Date;
  y: number | string;
  dateActual?: Date;
  interpolationMessage?: string;
}

export interface Data extends DatePoint {
  color?: string;
  label?: string;
  // To pass any information to chart to be rendered on the right side panel.
  metadata?: { mainTitle: string; data?: { title: string; value?: string; values?: string[] }[] };
}

// A series that is drawn as lines by <VictoryLine />.
export type LineSeries = {
  readonly mode: 'LINE';
};

// A series that is drawn as scattered points by <VictoryScatter/>
export type ScatterSeries = {
  readonly mode: 'SCATTER';
  // Custom component to render the points
  dataComponent?: JSX.Element;
  // Override 'y' values by the Minimum 'y' value of all series,
  // ... this plot scatter series at the bottom of the chart
  bottom?: number;
  // Generate data
  samples?: number;
  // Scatter point size
  size?: number;
  // Custom func to colorize scatter points
  fill?: (x: Date) => string;
};

// Common properties on series drawn by <KPIOverTimeGraph/>
export type BaseSeries = {
  // Series Id
  id: string;

  // The actual values
  data: Data[];

  // The color of this series
  color: string;

  // The label of this series (for the legend)
  label?: string;

  // Whether to draw the series or not
  active?: boolean;

  // Tell the victory to ignore this series when computing the tooltip position
  ignore?: boolean;

  // Any valid svg style would work on Victory
  style?: { [K in keyof React.CSSProperties]: string | number };

  // Allow custom format for the tooltip content
  // e.g `${name}, $${value.y}, ${formatDate(value.x, 'hours-minutes')}
  tooltipFormat?: (self: BaseSeries, values: DatePoint, index?: number) => string;

  // Override the default tooltip component
  tooltipComponent?: JSX.Element;

  // Flag to optimize series with thousands of points
  optimize?: boolean;

  // Assign to the right axis
  isRightAxis?: boolean;

  // Series unit
  unit?: string;
};

export type Series = BaseSeries & (LineSeries | ScatterSeries);

// Props used to handle the zooming Behaviour
// ... Graph in sync mode uses the 'zoomingProvider' BrushProps
// otherwise it uses its own 'BrushProps'
export type BrushProps = {
  // Zoomed X area [startDate - endDate]
  // Zoomed Y area [number - number]
  zoomedDomain?: ZoomObjectTuples;
  // Called on each update to the highlighted domain (select and drag)
  onBrushDomainChange?: () => void;
  // Called on mouseUp after dragging
  onBrushDomainChangeEnd: (domain: ZoomObjectTuples) => void;
  // Reset Zoom
  resetZoom: () => void;
};

export type ToolTipProps = {
  title: string;
  startTime: Date;
  endTime: Date;
};

export enum Interpolation {
  Linear = 'linear',
  MonotoneX = 'monotoneX',
  StepAfter = 'stepAfter'
}

export type InterpolationPropType =
  | 'basis'
  | 'basisClosed'
  | 'basisOpen'
  | 'bundle'
  | 'cardinal'
  | 'cardinalClosed'
  | 'cardinalOpen'
  | 'catmullRom'
  | 'catmullRomClosed'
  | 'catmullRomOpen'
  | 'linear'
  | 'linearClosed'
  | 'monotoneX'
  | 'monotoneY'
  | 'natural'
  | 'radial'
  | 'step'
  | 'stepAfter'
  | 'stepBefore';
