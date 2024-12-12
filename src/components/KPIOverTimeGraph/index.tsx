// 3rd party libs
import React, { useEffect, useMemo, useState, useCallback, useImperativeHandle, Ref } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  createContainer,
  VictoryAxis,
  VictoryAxisProps,
  VictoryBrushContainerProps,
  VictoryChart,
  VictoryContainerProps,
  VictoryLabel,
  VictoryLabelProps,
  VictoryLine,
  VictoryTooltip,
  VictoryVoronoiContainerProps
} from 'victory';
import { faCircle, faInfoCircle, faSquare } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

// Components
import { ActionButton, Button, Card, Typography } from 'components';

// Theme
import victoryTheme from 'themes/victory';

// Hooks
import { useContainerSize } from 'hooks';
import { useContainerResize, useDate } from 'providers';

// Types
import { DateTuple, ZoomObjectTuples } from 'types';
import { BrushProps, DatePoint, Series } from 'types/graph';

// Helpers
import { DEFAULT_LEFT_PADDING, getXaxisOffset } from 'helpers/graph';
import {
  drawLegends,
  drawLineSeries,
  drawPoints,
  formatBooleanAxis,
  SEPARATOR,
  zoom
} from './plot';

// Themes
import theme from 'themes';

type PaddingObject = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

export type KPIOverTimeGraphHandle = {
  resetZoom: () => void;
} | null;

export type GraphProps = {
  // Graph title
  title?: string;
  // Graph heading
  heading?: React.ReactNode;
  // The horizontal axis props
  axisH: VictoryAxisProps;
  // The (left) vertical axis props, if any
  axisV?: VictoryAxisProps;
  // The (right) axis, if any
  rightAxisV?: VictoryAxisProps;
  // Line series that should be drawn
  series: Series[];
  // range of x values the component will include,
  // If this prop is not provided, a domain will be calculated from data, [min, max] of all
  // series
  xDomain?: DateTuple;
  yDomain?: [number, number];
  // Renders padding in the body of the graph. X is for padding on the
  // horizontal axis, Y is for the vertical.
  domainPadding?: { x?: number; y?: number };
  // Optional icon/button to display
  iconButton?: React.ReactNode;
  // Flag to sync zooming with other graphs
  sync?: boolean;
  brush?: BrushProps;
  target?: { value?: number; colour?: string; label?: string };
  legendBgColor?: string;
  tooltip?: { color: string; bg: string; width?: number };
  interpolation?: string;
  hideLegend?: boolean;
  graphContainerHeight?: string;
  containerComponent?: string;
  children?:
    | React.ReactNode
    | ((graphWidth: number, graphHeight: number, padding: PaddingObject) => React.ReactNode);
  // Flag to format axis
  isBooleanChart?: boolean;
  // Display Zero Line axis
  displayZeroLine?: boolean;
  isZoomEnabled?: boolean;
  onZoom?: () => void;
  // Upon enabling this, info icon will appear on the right side of chart,
  // by clicking on the icon, a slider will show up on the right, which shows metadata information.
  // metadata information can also be passed to "series" data property as "metadata" to override this "metadata"
  // to be able to update metadata according to each point when hovering over a point on graph and seeing tooltip
  metadata?: { mainTitle: string; data?: { title: string; value?: string; values?: string[] }[] };
  // Add points to line chart
  points?: { id: string; data: DatePoint[] }[];
};

const PADDING: PaddingObject = { top: 10, right: 50, bottom: 50, left: 50 };

// Styling
const Container = styled(Card)`
  display: flex;
  flex: 1;
`;

const Legends = styled('div')(({ theme }) => ({
  flex: '0 0 11.5625rem;',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.lightGrey1,
  borderRight: `0.0625rem solid ${theme.colors.lightGrey2}`,
  minHeight: '15.625rem'
}));

const GraphContainer = styled.div<{ height?: number | string }>`
  flex: 1;
  ${({ height }) =>
    !!height &&
    `
    height: ${height};
  `}
`;

const NoContentText = styled.p`
  text-align: center;
  transform: translateY(120px);
`;

const LabelComponent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.2rem;
  width: 100%;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(tooltip: { color: string; bg: string }) =>
    tooltip ? tooltip.color : theme.colors.darkGrey} !important;
  div {
    display: flex;
    gap: 0.2rem;
    justify-content: center;
    align-items: center;
    transform: translateY(3px);
  }
`;

const ResetZoom = styled.div`
  margin-bottom: 0.5rem;
`;

const StyledMetadataIcon = styled(FontAwesomeIcon)`
  cursor: pointer;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
`;

const StyledMetadataInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1.25rem',
  gap: '0.625rem',
  width: '16rem',
  height: '100%',
  background: '#f9fafb',
  backgroundColor: theme.colors.lightGrey1,
  borderRight: `0.0625rem solid ${theme.colors.lightGrey2}`,
  flex: 'none',
  order: 2,
  alignSelf: 'stretch',
  flexGrow: 0,
  zIndex: 2
}));

const StyledMetadataButton = styled(Button)`
  cursor: pointer;
  display: table;
  margin: 0 auto;
  float: none;
  max-width: 6.25rem;
  margin-top: 6.25rem;
`;

const VictoryBrushCursorContainer = createContainer<
  VictoryBrushContainerProps,
  VictoryVoronoiContainerProps
>('brush', 'voronoi');

type MetadataTooltipProps = {
  datum?: {
    metadata: { mainTitle: string; data?: { title: string; value?: string; values?: string[] }[] };
    x: Date | string;
  };
  setMetadata: (metadata: {
    mainTitle: string;
    data?: { title: string; value?: string; values?: string[] }[];
  }) => void;
  metadata?: { mainTitle: string; data?: { title: string; value?: string; values?: string[] }[] };
  tooltip: { color: string; bg: string; width?: number };
};

// Render tooltip onMouseOver
const CustomLabelComponent = (
  props: VictoryContainerProps & VictoryLabelProps & MetadataTooltipProps
) => {
  const { x, y, text, datum, setMetadata, metadata, tooltip } = props;
  // Number of labels to be displayed
  const filteredText = (text as string[]).filter(String);
  // const nb = filteredText.length * 1.1;
  const initialX = (x || 0) - 115;
  const initialY = (y || 0) - 18 * 1.5;
  const metadataValue = datum?.metadata;
  // To update metadata when we hover over values and values change
  if (metadata && metadataValue) {
    useEffect(() => {
      setMetadata(metadataValue);
    }, [metadataValue]);
  }

  return (
    <g>
      <foreignObject x={initialX} y={initialY} width="230" height={50}>
        <LabelComponent {...tooltip}>
          {filteredText.map((t, i) => {
            const data = t.split(SEPARATOR);
            return (
              <div key={`${t}-${i}`}>
                {data[1] && <FontAwesomeIcon icon={faSquare} color={data[1]} />}
                <span>{data[0]}</span>
              </div>
            );
          })}
        </LabelComponent>
      </foreignObject>
    </g>
  );
};
// Depending on the orientation, we allow more padding on top or bottom
// so that the labels do not lay on the edge,
// Use DEFAULT_LEFT_PADDING in case the sync flag is 'true'
const getPadding = (
  orientation: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
  sync?: boolean
) => {
  const padding = { ...PADDING, left: sync ? DEFAULT_LEFT_PADDING : PADDING.left };
  return {
    ...padding,
    top: orientation == 'top' ? 50 : 10,
    bottom: orientation == 'bottom' ? 50 : 10
  };
};

// Make all series 'active'
const initState = (series: Series[]) => {
  return series.map((s) => {
    return { ...s, active: true };
  });
};

const KPIOverTimeGraph = React.forwardRef(
  (
    {
      xDomain,
      yDomain,
      domainPadding,
      title,
      heading,
      axisH,
      axisV,
      rightAxisV,
      series,
      iconButton,
      sync,
      brush,
      target,
      legendBgColor,
      tooltip,
      interpolation,
      hideLegend,
      containerComponent,
      graphContainerHeight,
      children,
      isBooleanChart,
      displayZeroLine,
      isZoomEnabled = true,
      onZoom,
      metadata,
      points
    }: GraphProps,
    ref: Ref<KPIOverTimeGraphHandle>
  ): JSX.Element => {
    const [isShowMetadata, setIsShowMetadata] = useState(false);
    const initialMetadata: {
      mainTitle: string;
      data?: { title: string; value?: string; values?: string[] }[];
    } = { mainTitle: '' };
    const [metadataValue, setMetadata] = useState(initialMetadata);

    // Get datePicker values
    const { startTime, endTime } = useDate();

    // Measure the graph container and pass the size into victory, so it can size itself to fit
    const {
      width: graphWidth,
      height: graphHeight,
      containerRef: graphContainerRef,
      triggerResize
    } = useContainerSize();

    // Resize the graph when the parent container tells us to
    const { resizeDelay, shouldResize } = useContainerResize();

    useEffect(() => {
      const timer = setTimeout(() => {
        triggerResize();
      }, resizeDelay);
      return () => clearTimeout(timer);
    }, [shouldResize]);

    const [innerSeries, setInnerSeries] = useState(initState(series));
    const [isInnerSeriesDataEmpty, setIsInnerSeriesDataEmpty] = useState(true);

    // To update graph when Y-axis values change
    useEffect(() => {
      // When series changes, we need to setInnerSeries with the new series values, but we
      // want to retain the existing `active` states from the existing innerSeries data
      // (so that the state of legends is retained)
      const newInnerSeries = series.map((s) => {
        const existingInnerSeries = innerSeries.find((inner) => inner.id === s.id);
        return { ...s, active: existingInnerSeries?.active ?? true };
      });

      const isInnerSeriesData = newInnerSeries.filter((item) => item.data.length > 0);
      if (isInnerSeriesData.length !== 0) setIsInnerSeriesDataEmpty(false);

      setInnerSeries(newInnerSeries);
    }, [series]);

    // Not zoomed by default
    const [zoomedDomain, setZoomedDomain] = useState<ZoomObjectTuples | undefined>();

    // True - when an area is being selecting
    const [zooming, setZooming] = useState(false);

    const computeXDomain = useMemo(() => {
      let x: DateTuple;
      // Domain provided by parent component is priority 1
      if (xDomain && !sync) return xDomain;
      // Domain provided by date Picker is priority 2
      if (sync) {
        return [startTime, endTime] as DateTuple;
        // We end here in case no domain is provided as props
        // thus, computing it based on the series
      } else {
        const offset = getXaxisOffset(innerSeries);
        x = [offset.min, offset.max];
      }
      return x;
    }, [xDomain, startTime, endTime]);

    // Define the domain shown. Use the zoomedXDomain if there is one set (i.e. we have zoomed in),
    // otherwise use the supplied xDomain prop
    const domain = { x: zoomedDomain?.x || computeXDomain, y: zoomedDomain?.y || yDomain };

    const padding = getPadding(axisH.orientation, sync);

    //  Set the AxisH y-offset to move down or top when the chart area has negative values,
    //  in which case the x-axis (AxisV) in placed the incorrect y-offset.
    const offsetY = axisH.orientation == 'top' ? padding.top : padding.bottom;

    /**
     * Line Series
     */
    //error here
    const lineSeries = useMemo(() => {
      return zoom(
        innerSeries.filter((s) => s.mode == 'LINE' && s.active),
        domain.x,
        title as string
      );
    }, [domain.x, innerSeries]);

    // Memoize series
    const lineSeriesRenderer = useMemo(() => {
      return drawLineSeries(lineSeries, interpolation);
    }, [lineSeries]);

    // Add Points to chart
    const pointsRenderer = useMemo(() => {
      return points && drawPoints(points, innerSeries);
    }, [points, innerSeries]);

    /**
     * Scatter Series
     
      const scatterSeries = useMemo(() => {
        return zoom(
          innerSeries.filter((s) => s.mode == 'SCATTER'),
          domain.x,
          title as string
        ) as (BaseSeries & ScatterSeries)[];
      }, [domain.x, innerSeries]);

      const scatterSeriesRenderer = useMemo(() => {
        const { min } = getYaxisOffset(lineSeries);
        return drawScatterSeries(scatterSeries, min);
      }, [lineSeries]);

     */

    // Sync zoom if Applicable
    useEffect(() => {
      if (sync) {
        setZoomedDomain(brush?.zoomedDomain);
        setZooming(false);
      }
    }, [brush?.zoomedDomain]);

    const resetZoom = useCallback(() => {
      if (sync) {
        brush?.resetZoom && brush?.resetZoom();
      } else {
        setZoomedDomain(undefined);
      }
    }, [sync, brush]);

    useImperativeHandle(
      ref,
      () => ({
        resetZoom
      }),
      [resetZoom]
    );

    /** renderMetadata if "metadata" field exists **/
    const renderMetadata = () => {
      return metadataValue.data?.map((metadataItem, index) => {
        return (
          <div key={index}>
            {metadataItem.title && (
              <Typography size="1rem" weight="bold" as="span">
                {metadataItem.title + ' '}
              </Typography>
            )}
            {metadataItem.value && (
              <Typography size="1rem" as="span">
                {metadataItem.value}
              </Typography>
            )}
            {metadataItem.values &&
              metadataItem.values.map((value, i) => {
                return (
                  <Typography key={i} size="1rem" mb="0.125rem" style={{ marginTop: '0.125rem' }}>
                    <FontAwesomeIcon
                      icon={faCircle}
                      color={theme.colors.darkGrey}
                      style={{ fontSize: '0.3125rem' }}
                    />{' '}
                    {value}
                  </Typography>
                );
              })}
          </div>
        );
      });
    };
    return (
      <Container as={containerComponent ?? Card}>
        {!hideLegend && (
          <Legends style={{ backgroundColor: legendBgColor ?? theme.colors.lightGrey1 }}>
            <div>
              <Typography weight="medium" size="0.8125rem">
                {title}
                {heading}
              </Typography>
              {iconButton && <div>{iconButton}</div>}
              {(zoomedDomain?.x || zoomedDomain?.y) && (
                <ResetZoom>
                  <ActionButton onClick={resetZoom} hideArrow>
                    Reset zoom
                  </ActionButton>
                </ResetZoom>
              )}
            </div>
            <div>
              {drawLegends(innerSeries, (id) => {
                setInnerSeries(
                  innerSeries.map((s) => {
                    if (s.id == id) return { ...s, active: !s.active };
                    return s;
                  })
                );
              })}
            </div>
          </Legends>
        )}
        <GraphContainer ref={graphContainerRef} height={graphContainerHeight}>
          {!isInnerSeriesDataEmpty ? (
            <VictoryChart
              key={uuidv4()}
              width={graphWidth}
              height={graphHeight}
              padding={padding}
              scale={{ x: 'time' }}
              domain={domain.y ? domain : { x: domain.x }}
              domainPadding={domainPadding || { y: 20 }}
              theme={victoryTheme}
              containerComponent={
                <VictoryBrushCursorContainer
                  // List of components to ignore when computing
                  // ... the position for the <VictoryTooltip />
                  voronoiBlacklist={innerSeries.filter((s) => s.ignore).map((s) => s.id)}
                  // Clear previously selected area
                  defaultBrushArea="none"
                  allowDraw={isZoomEnabled}
                  allowDrag={false}
                  brushStyle={{
                    stroke: 'transparent',
                    fill: 'black',
                    fillOpacity: zooming ? 0.1 : 0
                  }}
                  onBrushDomainChangeEnd={(domain) => {
                    // Skip if the domain doesn't change,
                    // ...this is likely to happen when the user clicks on the chart without dragging
                    if (domain.x[0] == 0) return;

                    const nextDomain = {
                      x: domain.x as DateTuple
                    };

                    if (sync) {
                      brush?.onBrushDomainChangeEnd(nextDomain);
                      onZoom?.();
                    } else {
                      setZoomedDomain(nextDomain);
                      setZooming(false);
                    }
                  }}
                  onBrushDomainChange={() => {
                    if (!zooming) setZooming(true);
                  }}
                  labels={({ datum }) => datum.tooltipContent}
                  labelComponent={
                    <VictoryTooltip
                      cornerRadius={4}
                      flyoutWidth={tooltip && tooltip.width ? tooltip.width : 250}
                      flyoutHeight={70}
                      style={{
                        fill: tooltip && tooltip.color ? tooltip.color : theme.colors.darkGrey
                      }}
                      flyoutStyle={{
                        strokeWidth: 1,
                        fill: tooltip && tooltip.bg ? tooltip.bg : theme.colors.white,
                        fillOpacity: 0.8,
                        pointerEvents: 'none',
                        stroke: theme.colors.lightGrey5
                      }}
                      constrainToVisibleArea
                      labelComponent={
                        <CustomLabelComponent
                          setMetadata={(metadata) => setMetadata(metadata)}
                          metadata={metadata}
                          tooltip={{
                            color: (tooltip && tooltip.color) ?? theme.colors.darkGrey,
                            bg: (tooltip && tooltip.bg) ?? theme.colors.white,
                            width: (tooltip && tooltip.width) ?? 250
                          }}
                        />
                      }
                    />
                  }
                />
              }
            >
              {sync ? (
                <VictoryAxis
                  key={uuidv4()}
                  offsetY={offsetY}
                  minDomain={{ x: domain.x[0].getTime() }}
                  maxDomain={{ x: domain.x[1].getTime() }}
                  {...axisH}
                />
              ) : (
                <VictoryAxis key={uuidv4()} {...axisH} offsetY={offsetY} />
              )}

              {displayZeroLine && (
                <VictoryAxis
                  key={uuidv4()}
                  crossAxis={false}
                  style={{
                    axis: { stroke: theme.colors.lightGrey3 }
                  }}
                  tickFormat={() => ''}
                />
              )}

              {isBooleanChart
                ? axisV && (
                    <VictoryAxis
                      key={uuidv4()}
                      {...axisV}
                      dependentAxis
                      tickFormat={(t) => formatBooleanAxis(t)}
                      crossAxis={false}
                    />
                  )
                : axisV && (
                    <VictoryAxis key={uuidv4()} {...axisV} dependentAxis crossAxis={false} />
                  )}
              {rightAxisV && (
                <VictoryAxis
                  key={uuidv4()}
                  {...rightAxisV}
                  dependentAxis
                  offsetX={padding.right}
                  crossAxis={false}
                />
              )}

              {lineSeriesRenderer}
              {points && pointsRenderer}
              {target && target.value && !isNaN(target.value) && (
                <VictoryLine
                  theme={victoryTheme}
                  style={{
                    data: {
                      stroke: target.colour ?? theme.colors.mediumGrey3,
                      strokeDasharray: '5,5'
                    },
                    parent: { border: '0.0625rem solid #ccc' }
                  }}
                  labels={({ datum }) =>
                    xDomain && datum.x === xDomain[1] && !target.label
                      ? `Target(${target.value})`
                      : (target && target.label) ?? ''
                  }
                  labelComponent={
                    <VictoryLabel
                      renderInPortal
                      dy={5}
                      dx={25}
                      style={{ color: target.colour ?? theme.colors.mediumGrey3 }}
                    />
                  }
                  data={[
                    { x: xDomain && xDomain[0], y: 5 },
                    { x: xDomain && xDomain[1], y: 5 }
                  ]}
                />
              )}
              {typeof children === 'function'
                ? children(graphWidth, graphHeight, padding)
                : children}
            </VictoryChart>
          ) : (
            <NoContentText>No data available in the range</NoContentText>
          )}
        </GraphContainer>
        {metadata && !isShowMetadata && (
          <StyledMetadataIcon
            icon={faInfoCircle}
            onClick={() => {
              if (metadata) {
                setMetadata(metadata);
                setIsShowMetadata(true);
              }
            }}
          />
        )}
        {isShowMetadata && metadata && metadataValue && (
          <StyledMetadataInfo>
            <Typography weight="bold" size="1.25rem" mb={0}>
              {metadataValue.mainTitle.replaceAll('"', '')}
            </Typography>
            {renderMetadata()}
            <StyledMetadataButton
              variant="primary"
              size="small"
              onClick={() => {
                setIsShowMetadata(false);
              }}
            >
              Close
            </StyledMetadataButton>
          </StyledMetadataInfo>
        )}
      </Container>
    );
  }
);

KPIOverTimeGraph.displayName = 'KPIOverTimeGraph';

export default KPIOverTimeGraph;
