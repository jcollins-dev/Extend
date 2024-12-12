import React from 'react';

import {
  StyledChartLegendItemContainer,
  StyledChartLegendContainer
} from './StyledChartLegend.elements';

export interface StyledChartLegendPropsHandlerReturn {
  label: string;
  id: string;
  colorKey?: string;
  color?: string;
}

export interface StyledChartLegendPropsItem extends StyledChartLegendPropsHandlerReturn {
  // custom click handler if different from provided from main handle prop
  handleClick?: (props: StyledChartLegendPropsHandlerReturn) => void;
}

export interface StyledChartLegendProps {
  items?: StyledChartLegendPropsItem[];
  selected?: string[];
  colors?: Record<string, unknown>;
  handle?: (props: StyledChartLegendPropsHandlerReturn) => void;
  // the name of the key used to get the value to check the colors object for custom color
  colorKey?: string;
}

/* 
please keep this code, i need this hook soon to get the colors from the elements
const useChartColors = (): Record<string, unknown> => {
  const chartsRef = document.querySelectorAll('.getColors path');

  const [colors, setColors] = useState<Record<string, unknown> | undefined>(undefined); // useState<Record<string, unknown> | undefined

  useEffect(() => {
    // if (!colors) {
    // loop through all the paths and get the aria-label and fill color
    if (chartsRef.length > 0) {
      const colorsToUse = [...chartsRef].reduce((obj, path) => {
        const id = (path.getAttribute('aria-label') as string).split('__')[1];

        if (id) {
          const fill = (path as SVGPathElement).style.fill;
          return (obj = { ...obj, [id]: fill });
        } else return obj;
      }, {});
    }

    //setColors(colorsToUse)
    // }
  }, [document]);

  return colors || {};
};
*/

export const StyledChartLegend = ({
  items,
  selected,
  colors,
  handle
}: StyledChartLegendProps): JSX.Element => {
  if (!items) return <div className="error-wrapper">no items</div>;

  return (
    <StyledChartLegendContainer className="pie-chart-legend">
      {items.map(({ label, id, handleClick, colorKey, color }: StyledChartLegendPropsItem) => {
        const isSelected = !selected ? true : selected.includes(id);

        const handler = handleClick || handle;

        let itemSettings: Record<string, unknown> = {
          'data-muted': isSelected ? undefined : 'true'
        };

        const buttonSettings: Record<string, unknown> = {
          type: 'button',
          onClick: () => handler?.({ label, id, colorKey })
        };

        if (color) itemSettings = { ...itemSettings, color };
        else if (colors) itemSettings = { ...itemSettings, color: colors[colorKey || id] };

        return (
          <StyledChartLegendItemContainer key={label} {...itemSettings}>
            <button {...buttonSettings}>{label}</button>
          </StyledChartLegendItemContainer>
        );
      })}
    </StyledChartLegendContainer>
  );
};
