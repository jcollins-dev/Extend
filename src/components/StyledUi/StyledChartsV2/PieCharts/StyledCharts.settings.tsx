import { ScalePropType } from 'victory-core';
import { defaultFlyoutStyles } from '../StyledCharts.styles';
import { VictoryTooltipProps } from 'victory';

/** the default settings for wrapping VictoryChart */
export const defaultChartSettings = {
  scale: { x: 'time' as ScalePropType },
  padding: { top: 10, bottom: 50, left: 50, right: 50 }
};

/** the default toolstip settings */
export const defaultTooltipSettings: VictoryTooltipProps = {
  renderInPortal: true,
  orientation: 'top',
  flyoutPadding: { left: 10, right: 10, top: 10, bottom: 5 },
  flyoutStyle: defaultFlyoutStyles
};
