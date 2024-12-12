import { VictoryBarProps } from 'victory';
import { GlobalChartProps } from '../Charts.types';

export interface GlobalBarSettingsProps extends GlobalChartProps, VictoryBarProps {
  count?: number;
}

export const globalBarSettings = ({
  formatLabels,
  labelComponent,
  count,
  width
}: GlobalBarSettingsProps): VictoryBarProps => {
  let barSettings: VictoryBarProps = {};

  // have to calculate the bar width based on the number of bars and the width of the container
  // this is because when there are only 2 bars they should be wider
  if (width && count) {
    count = count < 4 ? 4 : count;
    // get the current relative bar width based on math below
    const w = Math.round(width / count / 2);
    // don't get too wide if there aren't a lot of bars
    const barWidth = count === 4 ? 35 : w > 25 ? 25 : w;

    barSettings = { ...barSettings, barWidth };

    //barSettings.barRatio = evenlySpaced
    //console.log({ evenlySpaced, width, count })
  }

  if (formatLabels) barSettings.labels = formatLabels;
  if (labelComponent) barSettings.labelComponent = labelComponent;

  return barSettings;
};
