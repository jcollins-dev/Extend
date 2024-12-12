import { VictoryStyleObject } from 'victory-core';
import { styledTheme } from '../theme';

export const defaultLabelStyles: VictoryStyleObject = {
  fontFamily: 'inherit',
  fontSize: 11,
  fillOpacity: undefined
};

export const defaultTooltipStyles: VictoryStyleObject = {
  fontFamily: 'inherit',
  fontSize: 15,
  textAnchor: 'left',
  fill: styledTheme.color.main
};

export const defaultLabelBackgroundStyles = {
  fill: 'rgba(0,0,0,.5)'
};

export const defaultFlyoutStyles: VictoryStyleObject = {
  outline: 0,
  filter: `drop-shadow(-1px 1px 2px rgb(0 0 0 / 0.4))`,
  stroke: 0,
  fill: 'white'
};

export const defaultTickLabelsStyles: VictoryStyleObject = {
  fontFamily: 'inherit',
  fontSize: 12
};

export const defaultDataStyles: VictoryStyleObject = {
  cursor: 'pointer',
  transition: 'opacity 500ms ease, color 500ms ease',
  fontFamily: 'inherit',
  strokeWidth: 0
};
