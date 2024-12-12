import React from 'react';
import { PieChartLegendItemContainer, PieChartLegendContainer } from './PieChartLegend.elements';

export interface PieChartLegendPropsHandlerReturn {
  label: string;
  id: string;
  colorKey?: string;
  color?: string;
}

export interface PieChartLegendPropsItem extends PieChartLegendPropsHandlerReturn {
  // custom click handler if different from provided from main handle prop
  handleClick?: (props: PieChartLegendPropsHandlerReturn) => void;
}

export interface PieChartLegendProps {
  items?: PieChartLegendPropsItem[];
  selected?: string[];
  colors?: Record<string, string>;
  handle?: (props: PieChartLegendPropsHandlerReturn) => void;
  // the name of the key used to get the value to check the colors object for custom color
  colorKey?: string;
}

export const PieChartLegend = ({
  items,
  selected,
  colors,
  handle
}: PieChartLegendProps): JSX.Element => {
  if (!items) return <div className="error-wrapper">no items</div>;

  return (
    <PieChartLegendContainer className="pie-chart-legend">
      {items.map(({ label, id, handleClick, colorKey, color }: PieChartLegendPropsItem) => {
        const isSelected = !selected ? true : selected.includes(id);

        const handler = handleClick || handle;

        let itemSettings: Record<string, unknown> = {
          'data-muted': isSelected ? undefined : 'true'
        };

        const buttonSettings: Record<string, unknown> = {
          type: 'button',
          onClick: () => handler?.({ label, id, colorKey })
        };

        if (colors) {
          if (!colorKey) {
            console.warn(`ERROR: Cannot set color, item is missing 'colorKey' string.`);

            // check if color is set within the object
            if (color) itemSettings = { ...itemSettings, color };
          } else {
            itemSettings = { ...itemSettings, color: colors[colorKey] };
          }

          return (
            <PieChartLegendItemContainer key={label} {...itemSettings}>
              <button {...buttonSettings}>{label}</button>
            </PieChartLegendItemContainer>
          );
        }
      })}
    </PieChartLegendContainer>
  );
};
