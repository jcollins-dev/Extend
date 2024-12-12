// 3rd party libs
import React, { ReactElement, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { scaleTime } from 'd3';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

// components
import { ActionButton, KPICard, KPIOverTimeGraph } from 'components';
import { KPIOverTimeGraphHandle } from 'components/KPIOverTimeGraph';
import CurrentPackIntervalMarker from './CurrentPackIntervalMarker';
import RecipeAxisSegment from './RecipeAxisSegment';
import StatusIcon from './StatusIcon';
import StatusTooltip from './StatusTooltip';

// Types
import { BaseTag, ProsealRecipeSegment, ProsealStatus } from 'types/proseal';
import { Data, Series } from 'types/graph';

// Theme
import theme from 'themes';

export type PackIntervalChartProps = {
  startTime: moment.Moment;
  endTime: moment.Moment;
  showCurrentMarker?: boolean;
  packs?: BaseTag;
  statuses?: ProsealStatus[];
  recipes?: ProsealRecipeSegment[];
  graphOptions?: { containerHeight?: string };
  timeTickCount?: number;
  isZoomEnabled?: boolean;
  onZoom?: () => void;
  onZoomReset?: () => void;
  children?: React.ReactNode;
};

// Styling
const Card = styled(KPICard)`
  flex: 1;
`;

const ZoomButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const getColor = (index: number): string => {
  return theme.colors.kpiChartColors[index % (theme.colors.kpiChartColors.length - 1)];
};

const timeZone = 'Europe/London';

const DEFAULT_HEIGHT_POINT_PACKS_MIN = 100;
const MAX_HEIGHT_POINT_PACKS_MIN = 250;
const PackIntervalChart = ({
  startTime,
  endTime,
  showCurrentMarker = false,
  packs,
  statuses = [],
  recipes = [],
  graphOptions = {},
  timeTickCount,
  isZoomEnabled = true,
  onZoom,
  onZoomReset,
  children
}: PackIntervalChartProps): ReactElement => {
  const { t } = useTranslation(['mh']);
  const graphRef = useRef<KPIOverTimeGraphHandle>(null);
  const currentPoint = useMemo(() => {
    const current = packs?.values[packs?.values?.length - 1];
    return {
      timestamp: current ? new Date(current.timestamp) : undefined,
      value: Math.floor(Number(current?.value ?? 0))
    };
  }, [packs?.values]);

  const maximumPoint = useMemo(() => {
    const maxTarget = recipes.reduce(
      (currentMax, recipe) => Math.max(currentMax, recipe.targetPacksPerMinute),
      0
    );

    const maxPackPerMinute = packs?.values?.reduce(
      (currentMax, packDatum) => Math.max(currentMax, packDatum.value as number),
      0
    );

    return Math.min(
      Math.max(maxPackPerMinute || 0, maxTarget, DEFAULT_HEIGHT_POINT_PACKS_MIN),
      MAX_HEIGHT_POINT_PACKS_MIN
    );
  }, [recipes, packs]);

  const yDomainPadding = maximumPoint * 0.1;

  const resetZoom = () => {
    graphRef.current?.resetZoom?.();
    onZoomReset?.();
  };

  const dataPoints = useMemo(() => {
    return packs?.values?.map((pack) => {
      return {
        x: new Date(pack.timestamp),
        y: pack.value
      };
    }) as Data[];
  }, [packs]);

  const errorStatuses = useMemo(() => {
    return statuses
      .filter((status) => status.isError)
      .map((status) => ({
        x: new Date(status.timestamp),
        y: status.packsPerMinute,
        label: status.machineStatus,
        statusCategory: status.statusCategory
      }));
  }, [statuses]);

  const packMinLineSeries = useMemo(() => {
    return {
      mode: 'LINE',
      id: 'packs/min',
      color: '#a5bbe2',
      style: {
        strokeWidth: 2
      },
      data: dataPoints
    } as Series;
  }, [dataPoints]);

  const statusScatterSeries = useMemo(() => {
    return {
      mode: 'SCATTER',
      id: 'packs/min errors',
      color: '#a5bbe2',
      data: errorStatuses,
      dataComponent: <StatusIcon />,
      tooltipComponent: <StatusTooltip />
    } as Series;
  }, [errorStatuses]);

  const recipeTargetLineSeries = useMemo(() => {
    return recipes.map((recipe, index) => {
      const color = getColor(index);
      return {
        mode: 'LINE',
        id: `${recipe.name}${index}`,
        color,
        style: {
          strokeWidth: 2,
          strokeDasharray: '6, 6'
        },
        data: [
          { x: new Date(recipe.startTime), y: recipe.targetPacksPerMinute },
          {
            x: new Date(recipe.endTime),
            y: recipe.targetPacksPerMinute,
            color
          }
        ]
      };
    }) as Series[];
  }, [recipes]);

  const timeTickFormat = (t: Date) => {
    return moment(t).tz(timeZone).format('kk:mm');
  };

  // rightContent
  return (
    <Card
      heading={t('packs_per_min') as string}
      rightContent={
        isZoomEnabled ? (
          <ZoomButtonContainer>
            <ActionButton onClick={resetZoom} hideArrow>
              {t('reset_zoom')}
            </ActionButton>
          </ZoomButtonContainer>
        ) : (
          <></>
        )
      }
    >
      <KPIOverTimeGraph
        ref={graphRef}
        containerComponent="div"
        graphContainerHeight={graphOptions.containerHeight}
        series={[packMinLineSeries, statusScatterSeries, ...recipeTargetLineSeries]}
        xDomain={[startTime.toDate(), endTime.toDate()]}
        yDomain={[-1 * yDomainPadding, maximumPoint + yDomainPadding]}
        hideLegend={true}
        isZoomEnabled={isZoomEnabled}
        onZoom={onZoom}
        axisV={{
          style: {
            axis: { stroke: 'none' },
            grid: { stroke: theme.colors.lightGrey3 }
          },
          tickFormat: (tickValue) => ((tickValue as number) < 0 ? '' : tickValue),
          crossAxis: false
        }}
        axisH={{
          style: {
            axis: { stroke: theme.colors.lightGrey5, strokeWidth: 5 }
          },
          tickCount: timeTickCount,
          tickFormat: timeTickFormat
        }}
      >
        {(graphWidth, graphHeight, padding) => {
          const bottom = graphHeight - padding.bottom;
          const right = graphWidth - padding.right;
          const axisScaler = scaleTime().domain([startTime, endTime]).range([padding.left, right]);
          return (
            <>
              {recipes.map((recipe, index) => (
                <RecipeAxisSegment
                  key={`${recipe.name}${index}`}
                  recipe={recipe}
                  color={getColor(index)}
                  x1={axisScaler(new Date(recipe.startTime))}
                  x2={axisScaler(recipe.endTime ? new Date(recipe.endTime) : endTime.toDate())}
                  y1={bottom}
                  y2={bottom}
                />
              ))}
              {showCurrentMarker && (
                <CurrentPackIntervalMarker
                  x={axisScaler(currentPoint.timestamp || new Date())}
                  top={padding.top}
                  bottom={bottom}
                  packCount={currentPoint.value}
                />
              )}
            </>
          );
        }}
      </KPIOverTimeGraph>
      {children}
    </Card>
  );
};

export default PackIntervalChart;
