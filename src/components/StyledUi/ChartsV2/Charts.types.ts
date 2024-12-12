export interface ChartDataItemProps {
  x: string;
  y: number;
  label?: string;
  y0?: number;
  x0?: string;
  className?: string;
}

export interface LineChartDataItemProps {
  x: number | string | Date;
  y: number;
  label?: string;
  y0?: number;
  x0?: string;
  className?: string;
}

export interface ChartSettingsProps {
  width?: number;
  height?: number;
  tooltipStyle?: `light` | `dark`;
}
