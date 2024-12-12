// 3rd party libs
import React from 'react';

// Types
import { VictoryScale } from 'types';
import { TrackingLine } from '.';
import moment from 'moment';
import theme from 'themes';

interface Props {
  scale?: VictoryScale;
  datum: TrackingLine;
  height: number;
  topPadding: number;
}

/** TrackingLinesComponent is a custom Victory component which renders a line that points out the difference between
 * the actual and target values.
 */
const TrackingLinesComponent = (props: Props): JSX.Element | null => {
  if (!props.datum || !props.scale) {
    return null;
  }
  const { dashed, targetTime, actualTime } = props.datum;
  // target
  const startX = props.scale.y(targetTime);
  // actual
  const endX = props.scale.y(actualTime);
  const diffMin = moment(actualTime).diff(moment(targetTime), 'minutes');

  return (
    <>
      <svg>
        <text
          x={endX - 25}
          y={props.topPadding - 15}
          style={{ fontSize: 12, fill: theme.colors.negativeRed }}
        >
          {diffMin} {diffMin === 0 ? 'min' : 'mins'}
        </text>
        <line
          x1={startX}
          y1={props.height}
          x2={startX}
          y2={props.topPadding + 55}
          style={{
            stroke: props.datum.color,
            strokeWidth: 2,
            strokeDasharray: dashed ? '5,5' : '0'
          }}
        />
        <line
          x1={startX}
          y1={props.topPadding + 55}
          x2={endX}
          y2={props.topPadding + 30}
          style={{
            stroke: props.datum.color,
            strokeWidth: 2,
            strokeDasharray: dashed ? '5,5' : '0'
          }}
        />
        <line
          x1={endX}
          y1={props.topPadding + 30}
          x2={endX}
          y2={props.topPadding - 10}
          style={{
            stroke: props.datum.color,
            strokeWidth: 2,
            strokeDasharray: dashed ? '5,5' : '0'
          }}
        />
      </svg>
    </>
  );
};

export default TrackingLinesComponent;
