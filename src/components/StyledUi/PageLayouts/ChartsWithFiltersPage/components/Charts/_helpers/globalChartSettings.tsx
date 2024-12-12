import { VictoryChartProps, VictoryStackProps } from 'victory';
import { VictoryCommonThemeProps } from 'victory-core';

export interface GlobalChartSettingsProps extends VictoryCommonThemeProps {
  width?: number;
  height?: number;
  count?: number;
}
export const globalChartSettings = ({
  width,
  height,
  count,
  domainPadding
}: GlobalChartSettingsProps): GlobalChartSettingsProps => {
  const settings: VictoryChartProps = {
    // set default domain padding
    domainPadding: domainPadding || 20,
    width,
    height
  };

  if (width && height && count) {
    settings.domainPadding = Math.round(width / count / 2);
  }

  return settings;
};

export interface GlobalStackedBarChartSettingsProps {
  width?: number;
  height?: number;
  count?: number;
}

export const globalStackedBarChartSettings = ({
  width,
  height,
  count
}: GlobalStackedBarChartSettingsProps): VictoryStackProps => {
  console.log('settings not used', { width, height, count });
  return {};
};
