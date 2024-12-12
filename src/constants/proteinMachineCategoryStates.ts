import theme from 'themes';
import { ProteinMachineCategoryStates, ProteinMachineStateCategoryName } from 'types/protein';

export const proteinMachineCategoryStatesToString: Record<ProteinMachineStateCategoryName, string> =
  {
    [ProteinMachineStateCategoryName.Cleaning]: 'Cleaning',
    [ProteinMachineStateCategoryName.Running]: 'Running',
    [ProteinMachineStateCategoryName.Alarm]: 'Alarm',
    [ProteinMachineStateCategoryName.Stop]: 'Paused',
    [ProteinMachineStateCategoryName.StopAlarm]: 'Stop by alarm',
    [ProteinMachineStateCategoryName.Idle]: 'Idle'
  };

export const proteinMachineCategoryValuesToString: Record<ProteinMachineCategoryStates, string> = {
  [ProteinMachineCategoryStates.Cleaning]: 'Cleaning',
  [ProteinMachineCategoryStates.Running]: 'Running',
  [ProteinMachineCategoryStates.Stop]: 'Paused',
  [ProteinMachineCategoryStates.StopByAlarm]: 'Stop by alarm',
  [ProteinMachineCategoryStates.Idle]: 'Idle'
};

export const defaultCellColor = { color: theme.colors.darkGrey, background: theme.colors.white };

export const getCellColors: Record<
  ProteinMachineStateCategoryName,
  { color: string; background: string }
> = {
  running: {
    ...defaultCellColor,
    background: theme.colors.onTrackGreen4
  },
  cleaning: defaultCellColor,
  idle: { color: theme.colors.atRiskYellow, background: theme.colors.atRiskYellow4 },
  stop: {
    color: theme.colors.ProteinMachineStateCatgoryColors.stop,
    background: theme.colors.negativeRed4
  },
  alarm: { color: theme.colors.atRiskYellow, background: theme.colors.atRiskYellow4 },
  stop_alarm: {
    ...defaultCellColor,
    background: theme.colors.negativeRed2
  }
};
