import { VictoryStyleInterface } from 'victory-core';
import { GlobalChartProps } from '../Charts.types';

export const globalChartStyles = ({
  colors,
  checkIfSelected,
  colorScale,
  colorKey
}: GlobalChartProps): VictoryStyleInterface => {
  const styles: VictoryStyleInterface = {
    data: {
      cursor: 'pointer',
      transition: 'opacity 500ms ease, color 500ms ease',
      fontFamily: 'inherit'
    },
    labels: {
      fontFamily: 'inherit'
    }
  };

  // because of typescript, we have to add this if needed
  // fill if colors is present
  if (!colorScale && colors)
    styles.data = {
      ...styles.data,
      fill: ({ datum }) => {
        const colorId: string = colorKey ? datum[colorKey] : datum.x;
        return colors?.[colorId];
      }
    };

  if (checkIfSelected)
    styles.data = {
      ...styles.data,
      fillOpacity: ({ datum }) => {
        return checkIfSelected?.(datum) ? 1 : 0.3;
      }
    };

  return styles;
};
