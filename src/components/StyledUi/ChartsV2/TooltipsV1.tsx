import React from 'react';
import { VictoryTooltip, VictoryLabel, Flyout } from 'victory';
import { styledTheme } from '../theme';

const defaultFlyoutStyles = {
  outline: 0,
  filter: `drop-shadow(-1px 1px 2px rgb(0 0 0 / 0.4))`
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
  fill: styledTheme.color.neg,
  ...defaultLabelStyles
};

const darkLabelStyles = {
  fill: styledTheme.color.main,
  ...defaultLabelStyles
};

const defaultTooltipSettings = {
  constrainToVisibleArea: true
};

export const DarkLabel = <VictoryLabel style={darkLabelStyles} />;

export const AngledLabel = (
  <VictoryLabel style={{ ...darkLabelStyles, angle: -30, textAnchor: 'end', fontSize: 10 }} />
);

export const LightLabel = <VictoryLabel style={lightLabelStyles} />;

export const LightTooltip = (
  <VictoryTooltip
    flyoutComponent={<Flyout style={lightFlyoutStyles} />}
    style={{ fontSize: 13, fontFamily: 'inherit' }}
    //labelComponent={<VictoryLabel style={darkLabelStyles} />}
    text={({ datum }) =>
      `${`  `} ${datum.x} - ${datum.label ? datum.label : ``}${` (${datum.y})`} ${`  `} `
    }
    {...defaultTooltipSettings}
  />
);

export const PieChartTooltip = (
  <VictoryTooltip
    flyoutComponent={<Flyout style={{ ...lightFlyoutStyles }} />}
    style={{ fontSize: 25, fontFamily: 'inherit' }}
    //labelComponent={<VictoryLabel style={{ fontSizeAdjust: 100 }} />} // style={{ fontSize: 30, ...darkLabelStyles }} />}
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

export const DefaultTooltip = LightTooltip;

export const DefaultLabel = DarkLabel;
