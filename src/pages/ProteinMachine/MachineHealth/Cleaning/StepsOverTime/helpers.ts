// Types
import { CleaningStep, DecoratedCleaningStep, CleaningStepGroup } from 'types/protein';

// CleaningStepsGroups keyed by their id
interface GroupedSteps {
  [id: string]: CleaningStepGroup;
}

/**
 * Helper to decide if a step is anomalous
 * - If duration less than 2 mins
 */
const isAnomalous = (step: DecoratedCleaningStep): boolean => {
  if (step.duration < 120 * 1000) {
    return true;
  }
  return false;
};

/**
 * Remove all anomalous steps
 */
const removeAnomalousSteps = (steps: DecoratedCleaningStep[]): DecoratedCleaningStep[] =>
  steps.filter((step) => !isAnomalous(step));

/**
 * Decorate cleaning steps with additional data for future calculations
 */
export const decorateSteps = (steps: CleaningStep[]): DecoratedCleaningStep[] =>
  steps.map((step) => {
    const startDateTime = new Date(step.startTime);
    const endDateTime = new Date(step.endTime);
    const duration = endDateTime.getTime() - startDateTime.getTime();

    return {
      ...step,
      duration,
      startDateTime,
      endDateTime
    };
  });

/**
 * Group decorated cleaning steps by their id into CleaningStepGroups
 */
export const groupSteps = (steps: DecoratedCleaningStep[]): GroupedSteps => {
  const groupedSteps: GroupedSteps = {};
  let totalDuration = 0;

  // Put steps into groups and calculate total duration for that group
  steps.forEach((step) => {
    const existingGroup = groupedSteps[step.id];
    totalDuration += step.duration;

    if (existingGroup) {
      existingGroup.steps.push(step);
      existingGroup.duration += step.duration;
      if (step.duration > existingGroup.maxDuration) {
        existingGroup.maxDuration = step.duration;
      }
      if (step.duration < existingGroup.minDuration) {
        existingGroup.minDuration = step.duration;
      }
    } else {
      groupedSteps[step.id] = {
        id: step.id,
        name: step.name,
        parentName: step.parentName,
        steps: [step],
        duration: step.duration,
        percent: 0, // Temporarily assign as 0 (to satisfy TS) as it will be calculated after
        averageDuration: 0, // Temporarily assign as 0 (to satisfy TS) as it will be calculated after
        minDuration: step.duration,
        maxDuration: step.duration
      };
    }
  });

  // Decorate each step group with duration as a percentage of the total, and average duration
  Object.values(groupedSteps).forEach((stepGroup) => {
    // Calculate percentage of total duration
    stepGroup.percent = (stepGroup.duration / totalDuration) * 100;

    // Calculate average duration of steps within this group
    const totalDurations = stepGroup.steps.map((step) => step.duration).reduce((a, b) => a + b, 0);
    const average = totalDurations / stepGroup.steps.length;
    stepGroup.averageDuration = average;
  });

  return groupedSteps;
};

/**
 * Helper to process all data needed to render the various UI components on the screen, taking a list of cleaning
 * steps, and aggregating into applicable formats.
 */
export const processData = (
  steps?: CleaningStep[],
  excludeAnomalousSteps = false
): {
  orderedGroupedSteps: CleaningStepGroup[] | null;
  decoratedSteps: DecoratedCleaningStep[];
} => {
  if (!steps) {
    return { decoratedSteps: [], orderedGroupedSteps: null };
  }
  // Decorate steps with data that will be useful in future calculations
  let decoratedSteps = decorateSteps(steps);
  excludeAnomalousSteps = false;

  if (excludeAnomalousSteps) {
    decoratedSteps = removeAnomalousSteps(decoratedSteps);
  }

  // Group individual steps by step id
  const groupedSteps = groupSteps(decoratedSteps);

  // Order groups by duration descending
  const orderedGroupedSteps = Object.values(groupedSteps).sort((a, b) => b.duration - a.duration);

  return { decoratedSteps, orderedGroupedSteps };
};
