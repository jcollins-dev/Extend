import React from 'react';
import { BaseType } from 'types';
import { VictoryLegend } from 'victory';
import { LegendProps } from '../PieChart/PieChart';

export enum VictoryLegendOrientationType {
  Horizontal = 'horizontal',
  Vertical = 'vertical'
}

export interface LegendComponentProps {
  data?: LegendProps[];
  title?: string;
  orientation?: string;
  style?: BaseType;
  x?: number;
  y?: number;
}

export const Legend = ({
  data,
  title,
  orientation,
  style,
  x,
  y
}: LegendComponentProps): JSX.Element => {
  return (
    <VictoryLegend
      x={125}
      y={50}
      title={title}
      centerTitle
      orientation={
        orientation === 'horizontal'
          ? orientation
          : orientation === 'vertical'
          ? orientation
          : undefined
      }
      gutter={20}
      style={style}
      data={data}
    />
  );
};
