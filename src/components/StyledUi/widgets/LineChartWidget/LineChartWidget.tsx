import React, { ReactNode } from 'react';
import moment from 'moment';
import { LineChartWidgetProps } from './LineChartWidget.types';
import { LineChartWidgetContainer } from './LineChartWidget.elements';

interface Props extends LineChartWidgetProps {
  children?: ReactNode | ReactNode[];
}

export const LineChartWidget = ({
  className,
  children,
  Main,
  title,
  ...rest
}: Props): JSX.Element => {
  return (
    <LineChartWidgetContainer>
      <header className="widget-ui-header">{title}</header>
      {children}
      {Main}
    </LineChartWidgetContainer>
  );
};
