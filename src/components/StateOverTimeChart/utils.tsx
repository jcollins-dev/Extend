// 3rd party libs
import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {
  VictoryBar,
  VictoryTooltip,
  VictoryLabelProps,
  createContainer,
  VictoryVoronoiContainerProps,
  VictoryBrushContainerProps,
  VictoryAxis,
  VictoryAxisProps
} from 'victory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

// Theme
import theme from 'themes';

// Components
import { Typography } from 'components';

// Helpers
import { formatDuration, formatTooltipDateMessage } from 'helpers';

// Types
import { BrushProps, ToolTipProps } from 'types/graph';
import { BarPeriod, SpanPeriod } from '.';

// Providers
import { useTimeZone } from 'providers';

/**
 * Container that combines zoom and tooltip Behaviours
 */

export const VictoryVoronoiBrushContainer = createContainer<
  VictoryVoronoiContainerProps,
  VictoryBrushContainerProps
>('voronoi', 'brush');

/**
 * Default tooltip renderer
 */

const LabelComponent = styled.div`
  display: flex;
  gap: 0.1rem;
  & > div > span {
    font-size: 0.75rem;
  }
`;

const ToolTipTitle = styled((props) => <Typography {...props} />)`
  text-overflow: ellipsis;
  max-width: 11.5rem;
  white-space: nowrap;
  overflow: hidden;
`;

export const DefaultTooltip = (props: VictoryLabelProps): JSX.Element => {
  const { x, y, datum } = props;
  const { toolTipData, color } = datum as { toolTipData: ToolTipProps; color: string };
  const intialX = (x || 0) - 95;
  const initialY = (y || 0) - 40;
  const duration = moment(toolTipData.endTime).diff(toolTipData.startTime);
  const { timeZone } = useTimeZone();
  return (
    <g>
      <foreignObject x={intialX} y={initialY} width="200" height={'100%'}>
        <LabelComponent>
          <FontAwesomeIcon icon={faSquare} color={color} />
          <div>
            <ToolTipTitle mb={0} size="0.75rem" weight="bold">
              {toolTipData.title}
            </ToolTipTitle>
            <span>Start time</span>
            <Typography mb={0} size="0.75rem" weight="bold">
              {formatTooltipDateMessage(toolTipData.startTime, timeZone)}
            </Typography>
            <span>Duration</span>
            <Typography mb="0.3rem" size="0.75rem" weight="bold">
              {formatDuration(duration, 'hours:mins:secs')}
            </Typography>
          </div>
        </LabelComponent>
      </foreignObject>
    </g>
  );
};

/**
 * Zoom in func
 */

export const zoomIn = (domain: Date[] | undefined, bars: BarPeriod[]): BarPeriod[] => {
  if (bars.length == 0) return [];

  if (!domain) return bars;

  // Keep only the bars that intersect with the zoomed domain ...
  // ... then clamp the remaining bars' start/end times to the zoomed domain

  const [domainStart, domainEnd] = domain;

  return bars
    .filter(({ startTime: barStart, endTime: barEnd }) => {
      // Filter out bars that do not intersect the domain
      const isStartIntersection = barStart >= domainStart && barStart <= domainEnd;
      const isEndIntersection = barEnd >= domainStart && barEnd <= domainEnd;
      const isDoubleIntersection = barStart <= domainStart && barEnd >= domainEnd;

      return isStartIntersection || isEndIntersection || isDoubleIntersection;
    })
    .map((bar) => {
      // Clamp the bar startTime and/or endTime to the ...
      // ... domain bounds if either is outside of the domain.
      const { startTime: barStart, endTime: barEnd } = bar;
      if (barStart < domainStart) {
        bar.startTime = domainStart;
      }

      if (barEnd > domainEnd) {
        bar.endTime = domainEnd;
      }

      return bar;
    });
};

/**
 * A Victory bar chart component which renders bars that span the entire height
 * of the graph, which can represent a period of time.
 */

export const spanPeriodsRenderer = (
  spanPeriods: SpanPeriod[],
  height: number,
  tooltip: JSX.Element
): JSX.Element | null => {
  if (spanPeriods.length == 0) return null;
  return (
    <VictoryBar
      data={spanPeriods}
      y="endTime"
      y0="startTime"
      x="id"
      barWidth={height * 2 /** big enough the cover the graph area */}
      style={{
        data: {
          fill: ({ datum }) => datum.color
        }
      }}
      labels={({ datum }) => datum.toolTipData}
      labelComponent={
        <VictoryTooltip
          cornerRadius={4}
          flyoutHeight={90}
          flyoutWidth={200}
          flyoutStyle={{
            strokeWidth: 1,
            fill: 'white',
            fillOpacity: 0.8,
            pointerEvents: 'none',
            stroke: theme.colors.lightGrey5
          }}
          constrainToVisibleArea
          labelComponent={tooltip}
        />
      }
    />
  );
};

export const SyncVictoryAxis = ({
  sync,
  brush,
  ...rest
}: VictoryAxisProps & {
  sync?: boolean;
  bars: BarPeriod[];
  startTime: Date;
  endTime: Date;
  zoomed: boolean;
  brush?: BrushProps;
}): JSX.Element => {
  return sync ? (
    <VictoryAxis
      {...rest}
      key={uuidv4()}
      domain={brush?.zoomedDomain ? brush?.zoomedDomain?.x : undefined}
    />
  ) : (
    <VictoryAxis {...rest} key={uuidv4()} />
  );
};
