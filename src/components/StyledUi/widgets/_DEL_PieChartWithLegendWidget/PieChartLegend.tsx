import React from 'react';
import { PieChartLegendItemContainer } from './PieChartLegend.elements';

export interface PieChartLegendPropsHandlerReturn {
  label: string;
  id: string;
  colorKey?: string;
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
}

export const PieChartLegend = ({
  items,
  selected,
  colors,
  handle
}: PieChartLegendProps): JSX.Element => {
  if (!items) return <></>;

  return (
    <ul className="pie-chart-legend">
      {items.map(({ label, id, handleClick, colorKey }: PieChartLegendPropsItem) => {
        const isSelected = selected?.includes(label);

        let itemSettings: Record<string, unknown> = {
          'data-muted': selected && isSelected ? undefined : 'true',
          'data-selected': isSelected ? 'true' : undefined
        };

        if (colors) {
          if (!colorKey) {
            console.warn(`ERROR: Cannot set color, item is missing 'colorKey' string.`);
          } else {
            itemSettings = { ...itemSettings, color: colors[colorKey] };
          }

          const handler = handleClick || handle;

          return (
            <PieChartLegendItemContainer key={label} {...itemSettings}>
              <button type="button" onClick={() => handler?.({ label, id, colorKey })}>
                {label}
              </button>
            </PieChartLegendItemContainer>
          );
        }
      })}
    </ul>
  );
};
