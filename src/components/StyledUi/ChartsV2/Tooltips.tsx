import React from 'react';
import { VictoryTooltip, VictoryLabel, Flyout } from 'victory';
import { styledTheme } from '../theme';

const defaultFlyoutStyles = {
  outline: 0,
  filter: `drop-shadow(-1px 1px 2px rgb(0 0 0 / 0.4))`,
  fontSize: 25
};

const darkFlyoutStyles = {
  fill: styledTheme.color.main,
  ...defaultFlyoutStyles
};

const lightFlyoutStyles = {
  fill: styledTheme.color.neg,
  ...defaultFlyoutStyles
};

const defaultLabelStyles = {
  fontFamily: 'inherit'
};

const lightLabelStyles = {
  fill: 'red', //styledTheme.color.neg,
  ...defaultLabelStyles
};

const darkLabelStyles = {
  fill: styledTheme.color.main,
  ...defaultLabelStyles
};

const defaultTooltipSettings = {
  constrainToVisibleArea: true,
  style: {
    fontFamily: 'inherit'
  }
};

export const DarkLabel = <VictoryLabel style={darkLabelStyles} />;

export const AngledLabel = (
  <VictoryLabel style={{ ...darkLabelStyles, angle: -30, textAnchor: 'end', fontSize: 10 }} />
);

export const LightLabel = <VictoryLabel style={lightLabelStyles} />;

export const BarChartOverTimeTooltip = (
  <VictoryTooltip
    flyoutComponent={<Flyout style={{ ...lightFlyoutStyles }} />}
    labelComponent={<VictoryLabel style={{ fontSizeAdjust: 100, ...darkLabelStyles }} />}
    {...defaultTooltipSettings}
  />
);

export const PieChartTooltip = (
  <VictoryTooltip
    flyoutComponent={<Flyout style={{ ...lightFlyoutStyles }} />}
    labelComponent={<VictoryLabel style={{ fontSizeAdjust: 100, ...darkLabelStyles }} />}
    text={({ datum }) => `${` `} ${datum.x} ${`(${datum.y})`} `}
    {...defaultTooltipSettings}
  />
);

export const LightTooltip = (
  <VictoryTooltip
    flyoutComponent={<Flyout style={{ ...lightFlyoutStyles }} />}
    labelComponent={<VictoryLabel style={{ fontSizeAdjust: 100, ...darkLabelStyles }} />}
    text={({ datum }) => `${` `} ${datum.x} ${`(${datum.y})`} `}
    {...defaultTooltipSettings}
  />
);

export const DarkTooltip = (
  <VictoryTooltip
    flyoutComponent={<Flyout style={darkFlyoutStyles} />}
    labelComponent={<VictoryLabel style={lightLabelStyles} />}
    text={({ datum }) => `${`  `} ${datum.x} - ${datum.label}${` [${datum.y}]`} ${`  `} `}
    {...defaultTooltipSettings}
  />
);

export const CustomTooltip = (
  <VictoryTooltip
    flyoutComponent={<Flyout style={lightFlyoutStyles} />}
    text={(datum) => {
      console.log({ datum });
      return 'label';
    }}
    {...defaultTooltipSettings}
  />
);

export const DefaultTooltip = LightTooltip;

export const DefaultLabel = DarkLabel;
