// 3rd party libs
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { groupBy } from 'lodash';

// Hooks
import { useContainerSize } from 'hooks';

// Components
import { Card, Typography, GraphLegend } from 'components';
import ToolTipContent from './ToolTipContent';
import Chart from './Chart';

// Theme
import theme from 'themes';

// Types
import { CleaningStepGroup, DecoratedCleaningStep } from 'types/protein';

// Providers
import { useTimeZone } from 'providers';

interface Props {
  data: DecoratedCleaningStep[];
  groupedData: CleaningStepGroup[];
  selectedSteps: string[];
  onSelectSteps: (steps: string[]) => void;
  getColorById: (id: string) => string;
}

export interface BarDatum {
  id: string;
  x: string;
  y: number;
  y0: number;
  color: string;
  toolTipData?: unknown;
}

const ChartContainer = styled.div`
  display: flex;
  gap: 7rem;
  margin-bottom: -4rem;
`;

const GraphContainer = styled.div`
  flex: 1;
  margin-left: 2rem;
  padding-top: 1rem;
`;

const LegendsContainer = styled.div`
  display: block;
  flex-wrap: wrap;
  margin-right: 2rem;
  padding-top: 3rem;
  > * {
    margin: 0 0.5rem 0.5rem 0;
  }
`;

export const groupIntoBars = (
  data: DecoratedCleaningStep[],
  getColorById: (id: string) => string,
  selectedSteps: string[]
): {
  barData: BarDatum[];
  numSessions: number;
  sessionIdToDateMap: Record<string, Date>;
  orderedSessionIds: string[];
} => {
  // Only steps that have a session are valid
  const validSteps = data.filter((step) => step.sessionId);
  const groupedBySession = groupBy(validSteps, 'sessionId');
  const sessionsArr = Object.values(groupedBySession);

  const sessionIdToDateMap: Record<string, Date> = {};

  const barData = sessionsArr
    .map((session) => {
      // Use the date of the first step within this session to populate the y-axis tick labels
      // We create a map of session id to date here, so it can be provided to the chart later
      const firstStep = session.reduce((prev, curr) => {
        return prev.startDateTime.getTime() < curr.startDateTime.getTime() ? prev : curr;
      });

      if (firstStep && !sessionIdToDateMap[firstStep.sessionId]) {
        sessionIdToDateMap[firstStep.sessionId] = firstStep.startDateTime;
      }

      // Combine steps of the same type within this session
      const combinedSteps: Record<string, DecoratedCleaningStep> = {};

      session.forEach((step) => {
        const existing = combinedSteps[step.id];

        // If existing combined step, add to the cumulative duration totals
        if (existing) {
          existing.duration += step.duration;
        } else {
          // No existing combined step, create a new one
          combinedSteps[step.id] = { ...step };
        }
      });

      let cumulativeStepDuration = 0; // Keep a cumulative running duration for this session, so the bars stack vertically on top of each other

      const combinedStepsArr = Object.values(combinedSteps);

      // Only display selected step types
      const filteredSteps = combinedStepsArr.filter(
        (d) => selectedSteps.includes(d.id) || !selectedSteps.length
      );

      // Sort steps by duration acsending
      filteredSteps.sort((a, b) => b.duration - a.duration);

      const returnData = filteredSteps.map((combinedStep) => {
        const datum = {
          id: combinedStep.id,
          x: combinedStep.sessionId,
          y0: cumulativeStepDuration / 1000 / 60, // In minutes
          y: (cumulativeStepDuration + combinedStep.duration) / 1000 / 60, // In minutes
          color: getColorById(combinedStep.id),
          toolTipData: {
            label: combinedStep.name,
            date: firstStep.startDateTime,
            duration: combinedStep.duration
          }
        };
        cumulativeStepDuration += combinedStep.duration;
        return datum;
      });
      return returnData;
    })
    .flat();

  const numSessions = sessionsArr.length;

  // Chronologically ordered session IDs - This is used to ensure the bar chart always shows the full
  // list of sessions in the x axis, in the correct order, even if some bars do not display due to filtering.
  const orderedSessionIds = Object.keys(groupedBySession).sort(
    (a, b) => sessionIdToDateMap[a].getTime() - sessionIdToDateMap[b].getTime()
  );

  return { barData, numSessions, sessionIdToDateMap, orderedSessionIds };
};

const ChangeOverStepDurationsBarChart = ({
  data,
  groupedData,
  selectedSteps,
  onSelectSteps,
  getColorById
}: Props): JSX.Element => {
  const { timeZone } = useTimeZone();

  const { barData, numSessions, sessionIdToDateMap, orderedSessionIds } = useMemo(
    () => groupIntoBars(data, getColorById, selectedSteps),
    [data, getColorById]
  );

  // Measure the graph container and pass the size into victory, so it can size itself to fit
  const { width: graphWidth, containerRef: graphContainerRef } = useContainerSize();

  const legendsData = groupedData;

  return (
    <Card borderColor={theme.colors.mediumGrey1}>
      <Card.Header bgColor={theme.colors.lightGrey1}>
        <Typography color="darkGrey" weight="medium" size="1rem" as="span">
          Changeover Step Durations (in min)
        </Typography>
      </Card.Header>

      <ChartContainer>
        <GraphContainer ref={graphContainerRef}>
          <Chart
            numSessions={numSessions}
            bars={barData}
            height={320}
            width={graphWidth}
            sessionIdToDateMap={sessionIdToDateMap}
            timeZone={timeZone}
            categories={orderedSessionIds}
            renderToolTipContent={(toolTipData) => (
              <ToolTipContent
                label={toolTipData.label as string}
                date={toolTipData.date as Date}
                duration={toolTipData.duration as number}
                timeZone={timeZone}
              />
            )}
            onBarClick={(datum) => {
              onSelectSteps([datum.id]);
            }}
          />
        </GraphContainer>

        <LegendsContainer>
          {legendsData.map((stepGroup) => (
            <GraphLegend
              id={stepGroup.id}
              key={stepGroup.id}
              color={getColorById(stepGroup.id)}
              label={stepGroup.name}
              active={selectedSteps.includes(stepGroup.id) || !selectedSteps.length}
              onClick={() => onSelectSteps([stepGroup.id])}
            />
          ))}
        </LegendsContainer>
      </ChartContainer>
    </Card>
  );
};

export default ChangeOverStepDurationsBarChart;
