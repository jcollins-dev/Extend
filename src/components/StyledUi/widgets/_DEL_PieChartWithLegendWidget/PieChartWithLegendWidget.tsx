import React, { ReactNode } from 'react';
import { WidgetUi, WidgetUiProps } from 'components/StyledUi/WidgetUi';
import {
  PieChartWithLegendItemContainer,
  PieChartWithLegendContainer
} from './PieChartWithLegend.elements';
import { FilterSelectedPropsSelected } from 'components';
import { PieChartLegend, PieChartLegendPropsItem } from './PieChartLegend';

export interface PieChartWithLegendWidgetProps extends WidgetUiProps {
  children?: ReactNode | ReactNode[];
  data?: Record<string, unknown>[];
  groupKey: string;
  handleItemClick?: (x: string) => void;
  selected?: FilterSelectedPropsSelected;
  colors?: Record<string, string>;
  showCount?: boolean;
  legendItems?: PieChartLegendPropsItem[];
}

const alarmsLegendItems = [
  { label: `A-Alarm (Critical)`, id: `critical`, colorKey: `critical` },
  { label: `B-Alarm (Product)`, id: `product`, colorKey: `product` },
  { label: `C-Alarm (Warning)`, id: `warning`, colorKey: `warning` }
];

export const PieChartWithLegendWidget = ({
  data,
  colors,
  selected,
  handleItemClick,
  groupKey,
  children,
  showCount,
  ...rest
}: PieChartWithLegendWidgetProps): JSX.Element => {
  const selectedGroups = selected && Object.values(selected?.[groupKey]);

  return (
    <WidgetUi
      {...rest}
      Main={
        <PieChartWithLegendContainer className="widget-ui-main">
          {children}
          <PieChartLegend {...{ colors, items: alarmsLegendItems, selected: selectedGroups }} />
        </PieChartWithLegendContainer>
      }
    />
  );
};
