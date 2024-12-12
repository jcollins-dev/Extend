// 3rd party libs
import React, { useState, useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { VictoryLabelProps } from 'victory';

// Components
import { ActionButton, Button, GraphLegend, StateOverTimeChart, Typography } from 'components';
import { BarPeriod, Row, SpanPeriod } from 'components/StateOverTimeChart';

// Types
import { CleaningState, CleaningStepWithKPI } from 'types/protein';
import { ToolTipProps } from 'types/graph';
import { ZoomObjectTuples } from 'types';

// Helpers
import { formatTooltipDateMessage } from 'helpers';

// Providers
import { useTimeZone } from 'providers';

interface Props {
  stepsData: CleaningStepWithKPI[];
  waitingStatesData?: CleaningState[];
  getColorById: (id: string) => string;
  dataIsGrouped?: boolean;
  selectedSteps?: string[];
  onSelectSteps?: (steps: string[]) => void;
}

interface IdNameMap {
  [id: string]: string;
}

const WAIT_TIME_COLOR = 'rgba(255, 175, 252, 0.2)';

// How many legends to show when not all legends are visible
const NUM_LEGENDS_CONTRACTED = 5;

const Container = styled.div`
  display: flex;
  overflow: hidden;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.mediumGrey1};
`;

const Legends = styled.div`
  flex: 0 0 11.5625rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  border-right: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey2};
`;

const LegendRow = styled.div`
  margin-bottom: 0.5rem;
`;

const ShowAllLegendsButton = styled(Button)`
  margin-top: 0.5rem;
`;

const LabelComponent = styled.div`
  display: flex;
  gap: 0.2rem;
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

const ResetZoom = styled.div`
  margin-bottom: 0.5rem;
`;

// Custom tooltip renderer
const CustomTooltip = (props: VictoryLabelProps) => {
  const { x, y, datum } = props;
  const { toolTipData, color } = datum as { toolTipData: ToolTipProps; color: string };
  const intialX = (x || 0) - 95;
  const initialY = (y || 0) - 40;
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
            <span>End time</span>
            <Typography mb="0.3rem" size="0.75rem" weight="bold">
              {formatTooltipDateMessage(toolTipData.endTime, timeZone)}
            </Typography>
          </div>
        </LabelComponent>
      </foreignObject>
    </g>
  );
};

const CleaningStepsChart = ({
  stepsData,
  waitingStatesData,
  getColorById,
  dataIsGrouped,
  selectedSteps,
  onSelectSteps
}: Props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const [showAllLegends, setShowAllLegends] = useState(false);
  const [waitTimeVisible, setWaitTimeVisible] = useState(true);

  // Not zoomed by default
  const [zoomedDomain, setZoomedDomain] = useState<ZoomObjectTuples | undefined>();
  // True - when an area is being selecting
  const [zooming, setZooming] = useState(false);

  // Color map to map step categories to specific color
  const stepCategoryColorMap = useTheme().colors.cleaningStepColors as { [key: string]: string };

  // Find a list of all unique step ids, and map them to their names
  const stepNameMap: IdNameMap = useMemo(() => {
    const map: IdNameMap = {};
    stepsData.forEach(({ id, name }) => (map[id] = name));
    return map;
  }, [stepsData]);

  // Create bar objects from the data
  const bars: BarPeriod[] = useMemo(() => {
    if (dataIsGrouped) {
      /**
       * Parsing step data that is grouped into categories.
       * Create a new row for each top level step category.
       * Each row then plots the substeps within that top level step category along it.
       * They take the color of the top level step category, not the sub step
       */
      return stepsData.reduce((acc, step) => {
        // Do not add this bar if it should be hidden (i.e. not selected in the legend)
        if (!selectedSteps?.length || selectedSteps.includes(step.id)) {
          const substepBars = step?.subSteps?.map((subStep) => {
            const startTime = new Date(subStep.startTime);
            const endTime = new Date(subStep.endTime);
            return {
              state: `${step.id}`,
              color: stepCategoryColorMap[step.id] || getColorById(step.id),
              startTime,
              endTime,
              toolTipData: {
                title: subStep.name,
                startTime,
                endTime
              }
            } as BarPeriod;
          });
          return [...acc, ...(substepBars ?? [])];
        } else {
          return acc;
        }
      }, [] as BarPeriod[]);
    } else {
      /**
       * Parsing step data is that is not grouped into categories.
       * Map over all the steps and create a bar for each one.
       */
      return stepsData.reduce((acc, step) => {
        // Do not add this bar if it should be hidden (i.e. not selected in the legend)
        if (!selectedSteps?.length || selectedSteps.includes(step.id)) {
          const startTime = new Date(step.startTime);
          const endTime = new Date(step.endTime);
          acc.push({
            state: `${step.id}`,
            color: getColorById(step.id),
            startTime,
            endTime,
            toolTipData: {
              title: step.name,
              startTime,
              endTime
            }
          });
        }
        return acc;
      }, [] as BarPeriod[]);
    }
  }, [stepsData, dataIsGrouped, selectedSteps]);

  // Define rows for the StateOverTimeChart
  const rows: Row[] = useMemo(() => {
    // Define the first row explicitly here, which displays _all_ the steps, with a custom state of "all"
    // This is a duplication of all the steps combined
    const rows: Row[] = [
      {
        state: 'all',
        label: 'Cleaning Steps',
        bars: bars.map((bar) => ({ ...bar, state: 'all' })),
        isButton: true,
        isExpanded: expanded,
        key: 'cleaning-step-chart-all'
      }
    ];

    // Then dynamically add a row for each step id
    Object.keys(stepNameMap).forEach((stepId) => {
      rows.push({
        bars: bars.filter((bar) => bar.state === stepId),
        label: stepNameMap[stepId],
        state: stepId,
        key: stepId
      });
    });

    return rows;
  }, [bars, expanded, stepNameMap]);

  // Create the span periods from the waiting time data
  const waitingSpanPeriods: SpanPeriod[] | undefined = useMemo(
    () =>
      waitingStatesData?.map((waitingState) => {
        const startTime = new Date(waitingState.startTimestamp);
        const endTime = new Date(waitingState.endTimestamp);

        return {
          // 'all' as we want the waiting bar to be plotted along with all the other steps (combined in the first row)
          id: 'all',
          startTime,
          endTime,
          color: WAIT_TIME_COLOR,
          toolTipData: {
            title: 'Wait time',
            startTime,
            endTime
          }
        };
      }),
    [waitingStatesData]
  );

  // Only show all rows only when exapnded
  const filteredRows = expanded ? rows : rows.filter((row) => row.state === 'all');

  // Show a limited amount of legends, with a "show all" button if necessary
  const allLegendsData = Object.keys(stepNameMap);

  const legendsData = showAllLegends
    ? allLegendsData
    : allLegendsData.slice(0, NUM_LEGENDS_CONTRACTED);

  const showLegendsButtonVisible = allLegendsData.length > NUM_LEGENDS_CONTRACTED;

  return (
    <Container>
      <Legends>
        <div>
          <Typography weight="medium" size="0.8125rem">
            Cleaning Session Steps
          </Typography>
          {zoomedDomain?.x && (
            <ResetZoom>
              <ActionButton onClick={() => setZoomedDomain(undefined)} hideArrow>
                Reset zoom
              </ActionButton>
            </ResetZoom>
          )}
        </div>
        <div>
          <Typography weight="medium" size="0.8125rem">
            Legend
          </Typography>
          {legendsData.map((stepId) => (
            <LegendRow key={stepId}>
              <GraphLegend
                id={stepId}
                active={selectedSteps?.includes(stepId) || !selectedSteps?.length}
                label={`${stepNameMap[stepId]} (${stepId})`}
                color={
                  dataIsGrouped
                    ? stepCategoryColorMap[stepId] || getColorById(stepId)
                    : getColorById(stepId)
                }
                onClick={() => onSelectSteps?.([stepId])}
              />
            </LegendRow>
          ))}

          {waitingStatesData && (
            <LegendRow key="waiting">
              <GraphLegend
                id="waiting"
                active={waitTimeVisible}
                label="Wait time"
                color={WAIT_TIME_COLOR}
                onClick={() => setWaitTimeVisible(!waitTimeVisible)}
              />
            </LegendRow>
          )}
          {showLegendsButtonVisible && (
            <ShowAllLegendsButton
              variant="inline-link"
              width="auto"
              onClick={() => setShowAllLegends(!showAllLegends)}
            >
              {showAllLegends ? 'Hide' : 'Show all'}
            </ShowAllLegendsButton>
          )}
        </div>
      </Legends>

      <StateOverTimeChart
        padding={{ left: 150 }}
        rows={filteredRows}
        spanPeriods={waitTimeVisible ? waitingSpanPeriods : undefined}
        onLabelClick={() => setExpanded(!expanded)}
        customTooltip={<CustomTooltip />}
        hasZoom={true}
        zooming={zooming}
        brush={{
          onBrushDomainChange: () => !zooming && setZooming(true),
          onBrushDomainChangeEnd: (d) => {
            setZoomedDomain(d);
            setZooming(false);
          },
          resetZoom: () => setZoomedDomain(undefined),
          zoomedDomain
        }}
      />
    </Container>
  );
};

export default CleaningStepsChart;
