// 3rd party libs
import React from 'react';
import styled, { useTheme } from 'styled-components';
import moment from 'moment';

// Components
import { PieChart, GraphLegend, DashboardWidget, Typography } from 'components';
import ToolTipContent from './ToolTipContent';

// Types
import { PieSliceDatum } from 'components/PieChart';
import { CleaningStepGroup } from 'types/protein';
import { ToolTipLine } from './ToolTipContent';

// Helpers
import { sortPieChartData } from 'helpers/machine-health';

// How many steps to display (the rest will be combined under "other")
const NUM_TOP_STEPS = 4;

interface Props {
  data: CleaningStepGroup[];
  selectedSteps: string[];
  onSelectSteps: (step: string[]) => void;
  getColorById: (id: string) => string;
  setSteps: (step: string[]) => void;
}

// Intermediary data type, to potentially group steps into one, which can then be rendered as pie slices
interface DataGroup {
  stepId: string;
  name: string;
  percent: number;
  duration: number; // in milliseconds
  tooltipLines: ToolTipLine[];
  // The steps that make up this group. Mainly useful for the 'other' group, which contains many steps
  constituentSteps: string[];
}

const LegendsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  > * {
    margin: 0 0.5rem 0.5rem 0;
  }
`;

/**
 * Take the list of steps and group them into DataGroups:
 * We take the top NUM_TOP_STEPS steps ,and put them into their own individual DataGroup
 * The remaining steps are grouped together under one "other" DataGroup
 * Each DataGroup will be rendered as one slice of the pie chart.
 */
export const groupData = (data: CleaningStepGroup[]): DataGroup[] => {
  // Order descending by percent
  const sortedData = data.sort((a, b) => b.percent - a.percent);

  // Get the highest steps by percentage
  const topSteps = sortedData.slice(0, NUM_TOP_STEPS);
  // Get the rest of the steps
  const otherSteps = sortedData.slice(NUM_TOP_STEPS);

  const groupedData: DataGroup[] = [];

  topSteps.forEach((step) => {
    groupedData.push({
      stepId: step.id,
      name: step.name,
      percent: step.percent,
      duration: step.duration,
      tooltipLines: [
        {
          id: step.id,
          label: step.name,
          percent: step.percent,
          duration: step.duration
        }
      ],
      constituentSteps: [step.id]
    });
  });

  if (otherSteps.length) {
    const totalPercent = otherSteps.reduce((acc, step) => acc + step.percent, 0);
    const totalDuration = otherSteps.reduce((acc, step) => acc + step.duration, 0);
    groupedData.push({
      stepId: 'other',
      name: 'Other',
      percent: totalPercent,
      duration: totalDuration,
      tooltipLines: otherSteps.map((step) => ({
        id: step.id,
        label: step.name,
        percent: step.percent,
        duration: step.duration
      })),
      constituentSteps: otherSteps.map((step) => step.id)
    });
  }

  return groupedData;
};

const CleaningStepCategoriesPieChart = ({
  data,
  selectedSteps,
  onSelectSteps,
  getColorById,
  setSteps
}: Props): JSX.Element => {
  const theme = useTheme();

  const groupedData = groupData(data);
  // Find the group whose constituent steps contains at least one of the selected steps
  const selectedGroups = groupedData.filter((group) =>
    group.constituentSteps.some((cStep) => selectedSteps.includes(cStep))
  );
  const selectedGroupsIds = selectedGroups.map((selectedGroup) => selectedGroup?.stepId);

  // Return a color for a given step, with special exception for `other` type
  // Otherwise return a color from the colorMap
  const getColor = (stepId: string): string => {
    if (stepId === 'other') {
      return theme.colors.black;
    } else {
      return getColorById(stepId);
    }
  };

  // Create pie slices from the grouped data
  const pieChartData: PieSliceDatum[] = groupedData
    .map((group) => ({
      id: group.stepId,
      label: `${moment.duration(group.duration).asHours().toFixed(1)} (${group.percent.toFixed(
        1
      )}%)`,
      percent: group.percent,
      color: getColor(group.stepId),
      hidden: selectedGroupsIds.length > 0 && !selectedGroupsIds.includes(group.stepId),
      tooltip: <ToolTipContent lines={group.tooltipLines} />
    }))
    .sort(sortPieChartData);

  const onSliceClick = (slice: PieSliceDatum) => {
    // Set the selected steps to be constituent steps of the clicked slice
    const group = groupedData.find((group) => group.stepId === slice.id);
    onSelectSteps(group?.constituentSteps ?? []);
    setSteps(group?.constituentSteps ?? []);
  };

  const cleaningStepCategoriesSettings = {
    title: 'Cleaning Step Categories (in h)'
  };

  return (
    <DashboardWidget {...cleaningStepCategoriesSettings}>
      <div className="graph_container">
        {groupedData.length ? (
          <div className="pie_chart_wrapper">
            <PieChart data={pieChartData} onSliceClick={onSliceClick} />
            <Typography mb="1rem" color="mediumGrey3" size="0.75rem">
              Hover for more info
            </Typography>
            <LegendsContainer>
              {groupedData.map((group) => (
                <GraphLegend
                  id={group.stepId}
                  key={group.stepId}
                  color={getColor(group.stepId)}
                  label={group.name}
                  active={
                    selectedGroupsIds.includes(group.stepId) || selectedGroupsIds.length === 0
                  }
                  onClick={() => onSelectSteps(group.constituentSteps ?? [])}
                />
              ))}
            </LegendsContainer>
          </div>
        ) : (
          <div className="no_data">No Data</div>
        )}
      </div>
    </DashboardWidget>
  );
};

export default CleaningStepCategoriesPieChart;
