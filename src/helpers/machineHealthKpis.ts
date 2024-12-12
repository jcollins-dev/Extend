import theme from 'themes';
import { MachineHealthKpiStatus } from 'types/machine-health';
import { MachineStateNames } from 'types/dsi';

export const getCellColor = (
  condition: MachineHealthKpiStatus
): { background: string; color: string } => {
  const cellColor = {
    background: 'inherit',
    color: 'inherit'
  };
  switch (condition) {
    case 'good':
      cellColor.background = theme.colors.onTrackGreen4;
      break;
    case 'warning':
      cellColor.background = theme.colors.atRiskYellow4;
      cellColor.color = theme.colors.richGold;
      break;
    case 'bad':
      cellColor.background = theme.colors.negativeRed4;
      cellColor.color = theme.colors.darkRed;
      break;
    default:
      break;
  }
  return cellColor;
};

/**
 * @param status
 */
export const getColor = (status: string): string => {
  if (MachineHealthKpiStatus.Bad === status) {
    return theme.colors.negativeRed;
  }
  if (MachineHealthKpiStatus.Warning === status) {
    return theme.colors.atRiskYellow;
  }
  return theme.colors.darkGrey;
};

/**
 * @param status
 */
export const getBackgroundColor = (status: string): string => {
  if (MachineHealthKpiStatus.Bad === status) {
    return theme.colors.negativeRed4;
  }
  if (MachineHealthKpiStatus.Warning === status) {
    return theme.colors.atRiskYellow4;
  }
  return theme.colors.lightGrey1;
};

/**
 * @param status
 */
export const getBorderColor = (status: string): string => {
  if (MachineHealthKpiStatus.Bad === status) {
    return theme.colors.negativeRed3;
  }
  if (MachineHealthKpiStatus.Warning === status) {
    return theme.colors.atRiskYellow3;
  }
  return theme.colors.mediumGrey1;
};

/**
 * @param state
 */
export const getMachineStateCellColors = (
  state: MachineStateNames
): { color: string; background: string } => {
  const stateColors = {
    [MachineStateNames.Running]: {
      color: theme.colors.onTrackGreen,
      background: theme.colors.onTrackGreen4
    },
    [MachineStateNames.NotRunning]: {
      color: theme.colors.negativeRed,
      background: theme.colors.negativeRed4
    },
    [MachineStateNames.Offline]: {
      color: theme.colors.atRiskYellow,
      background: theme.colors.atRiskYellow4
    },
    [MachineStateNames.NoProduct]: {
      color: theme.colors.atRiskYellow,
      background: theme.colors.atRiskYellow4
    }
  };
  return (
    stateColors[state] ?? {
      color: theme.colors.darkGrey,
      background: theme.colors.white
    }
  );
};
