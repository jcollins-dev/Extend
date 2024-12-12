import { VictoryStyleObject } from 'victory-core';

export const defaultChartStyles: VictoryStyleObject = {};

export const defaultLabelStyles: VictoryStyleObject = {
  fontFamily: 'inherit',
  fontSize: 15,
  textAnchor: 'left',
  padding: 5
};

export const defaultFlyoutStyles: VictoryStyleObject = {
  outline: 0,
  filter: `drop-shadow(-1px 1px 2px rgb(0 0 0 / 0.4))`,
  stroke: 0,
  fill: 'white'
};

export const defaultAxisStyles = {
  stroke: 'rgba(0,0,0,.2)'
};

export const defaultAxisYGridStyles = {
  stroke: 'rgba(0,0,0,.2)',
  strokeDasharray: '2, 4',
  strokeWidth: 1
};

export const defaultAxisXGridStyles = {
  stroke: 'rgba(0,0,0,.2)'
};

export const defaultTickLabelsStyles: VictoryStyleObject = {
  fontFamily: 'inherit',
  fontSize: 12,
  left: -10
};

export const defaultDataStyles: VictoryStyleObject = {
  cursor: 'pointer',
  transition: 'opacity 500ms ease, color 500ms ease',
  fontFamily: 'inherit',
  strokeWidth: 0
};
