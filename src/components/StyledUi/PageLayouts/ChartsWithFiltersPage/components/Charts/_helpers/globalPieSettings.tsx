import { VictoryPieProps } from 'victory';
import { GlobalChartProps } from '../Charts.types';

export interface GlobalPieSettingsProps extends GlobalChartProps, VictoryPieProps {}

export const globalPieSettings = (props?: GlobalPieSettingsProps): VictoryPieProps => {
  /*
  const radius = 75
  const pad = radius / 15
  const padding = { top: pad, left: pad, right: pad, bottom: pad }

  const settings: VictoryPieProps = {
    padding,
    labelRadius: radius * 0.5,
    width: radius * 2 + padding.left + padding.right,
    height: radius * 2 + padding.top + padding.bottom,
  }
  */

  //if (props?.formatLabels) settings.labels = props?.formatLabels;
  //if (props?.labelComponent) settings.labelComponent = props?.labelComponent;

  return {
    labelPosition: 'centroid'
  };
};
