import { VictoryTheme, VictoryThemeDefinition } from 'victory';
import theme from './';

// Victory theme extends the default theme
export default {
  ...VictoryTheme.grayscale,
  axis: {
    ...VictoryTheme.grayscale.axis,
    style: {
      ...VictoryTheme.grayscale.axis?.style,
      tickLabels: {
        ...VictoryTheme.grayscale.axis?.style?.tickLabels,
        fontSize: 12,
        fontFamily: theme.typography.family,
        fill: theme.colors.mediumGrey3
      }
    }
  }
} as VictoryThemeDefinition;
