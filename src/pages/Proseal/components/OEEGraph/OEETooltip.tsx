import React, { ReactElement } from 'react';
import { VictoryTooltip, VictoryTooltipProps } from 'victory';
import moment from 'moment';

type OEETooltipProps = {
  dateDomain: moment.Moment[];
  oee: { data: number[]; color: string };
  performance: { data: number[]; color: string };
  availability: { data: number[]; color: string };
};

type OEETooltipFlyoutProps = {
  oeeValue: number;
  oeeColor: string;
  performanceValue: number;
  performanceColor: string;
  availabilityValue: number;
  availabilityColor: string;
  date: moment.Moment;
};

type LineItemProps = {
  x: number;
  y: number;
  yOffset: number;
  text: string;
  color: string;
};

const LineItem = (props: LineItemProps): ReactElement => {
  const { x, y, yOffset, text, color } = props;

  return (
    <g>
      <rect
        x={x + 10}
        y={y + 16 + yOffset}
        width="20"
        height="20"
        fill={color}
        stroke="black"
        strokeWidth="0.1"
        ry="10"
        rx="10"
      />
      <text x={x + 35} y={y + 30 + yOffset} fontSize={12} fill={'black'}>
        {text}
      </text>
    </g>
  );
};

const OEETooltipFlyout = (props: VictoryTooltipProps & OEETooltipFlyoutProps): ReactElement => {
  const {
    x,
    y,
    oeeValue,
    oeeColor,
    performanceValue,
    performanceColor,
    availabilityValue,
    availabilityColor,
    date
  } = props;

  return (
    <g>
      <rect
        x={x}
        y={Number(y) - 10}
        width="150"
        height="115"
        fill="white"
        stroke="black"
        strokeWidth="0.1"
        ry="15"
        rx="15"
      />

      <text x={Number(x) + 10} y={Number(y) + 12} fontSize={16} fill={'black'}>
        {date.format('DD MMM, YYYY')}
      </text>

      <LineItem
        x={Number(x)}
        y={Number(y)}
        yOffset={8}
        text={`OEE: ${oeeValue}%`}
        color={oeeColor}
      />
      <LineItem
        x={Number(x)}
        y={Number(y)}
        yOffset={35}
        text={`PR: ${performanceValue}%`}
        color={performanceColor}
      />
      <LineItem
        x={Number(x)}
        y={Number(y)}
        yOffset={62}
        text={`AR: ${availabilityValue}%`}
        color={availabilityColor}
      />
    </g>
  );
};

const OEETooltip = (props: VictoryTooltipProps & OEETooltipProps): ReactElement => {
  return (
    <VictoryTooltip
      {...props}
      flyoutComponent={
        <OEETooltipFlyout
          date={props.dateDomain[(props.index || 0) as number]}
          oeeValue={props.oee.data[(props.index || 0) as number]}
          oeeColor={props.oee.color}
          performanceValue={props.performance.data[(props.index || 0) as number]}
          performanceColor={props.performance.color}
          availabilityValue={props.availability.data[(props.index || 0) as number]}
          availabilityColor={props.availability.color}
        />
      }
    />
  );
};

export default OEETooltip;
