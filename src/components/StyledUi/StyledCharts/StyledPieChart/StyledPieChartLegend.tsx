import React from 'react';
import {
  StyledPieChartLegendItemContainer,
  StyledPieChartLegendContainer
} from './StyledPieChartLegend.elements';

export interface StyledPieChartLegendPropsHandlerReturn {
  label: string;
  id: string;
  colorKey?: string;
  color?: string;
}

export interface StyledPieChartLegendPropsItem extends StyledPieChartLegendPropsHandlerReturn {
  // custom click handler if different from provided from main handle prop
  handleClick?: (props: StyledPieChartLegendPropsHandlerReturn) => void;
}

export interface StyledPieChartLegendProps {
  items?: StyledPieChartLegendPropsItem[];
  selected?: string[];
  colors?: Record<string, string>;
  handle?: (props: Record<string, unknown>) => void;
  // the name of the key used to get the value to check the colors object for custom color
  colorKey?: string;
  formatLegendItem?: (item?: Record<string, unknown>) => string;
}

export const StyledPieChartLegend = ({
  items,
  selected,
  colors,
  handle,
  formatLegendItem
}: StyledPieChartLegendProps): JSX.Element => {
  if (!items) return <div className="error-wrapper">no items</div>;

  return (
    <StyledPieChartLegendContainer className="pie-chart-legend">
      {items.map(({ label, id, handleClick, colorKey }: StyledPieChartLegendPropsItem) => {
        const isSelected = !selected ? true : selected.includes(id);

        const handler = handleClick || handle;

        let itemSettings: Record<string, unknown> = {
          'data-muted': isSelected ? undefined : 'true'
        };

        const buttonSettings: Record<string, unknown> = {
          type: 'button'
        };

        if (handler) buttonSettings.onClick = () => handler?.({ label, id, colorKey });

        if (colors?.[id]) {
          itemSettings = { ...itemSettings, color: colors[id] };
          /*if (!colorKey) {
            console.warn(`ERROR: Cannot set color, item is missing 'colorKey' string.`);
            if (color) itemSettings = { ...itemSettings, color };
          } else {
            itemSettings = { ...itemSettings, color: colors[colorKey] };
          }*/
        }

        const labelToUse = formatLegendItem ? formatLegendItem({ label, id }) : label;

        return (
          <StyledPieChartLegendItemContainer
            key={label}
            {...itemSettings}
            className="styled-pie-chart-with-legend"
          >
            <button {...buttonSettings}>{labelToUse}</button>
          </StyledPieChartLegendItemContainer>
        );
      })}
    </StyledPieChartLegendContainer>
  );
};
