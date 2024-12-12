import { DSIKPIType, MachineHealthInterval } from 'types/dsi';
import theme from 'themes';

export const chartTypes: DSIKPIType[] = [
  DSIKPIType.Yield,
  DSIKPIType.ThroughputRate,
  DSIKPIType.ThroughputPieceCount,
  DSIKPIType.ProductProcessed,
  DSIKPIType.InfeedPieceSize,
  DSIKPIType.BeltSpeed,
  DSIKPIType.LoadingEfficiency,
  DSIKPIType.LoadingGap
];

export const headerColors: { [key: string]: string } = {
  [DSIKPIType.InfeedPieceSize]: theme.colors.dsiExtendedColors.darkBlue,
  [DSIKPIType.Yield]: theme.colors.dsiExtendedColors.darkBlue,
  [DSIKPIType.ThroughputRate]: theme.colors.dsiExtendedColors.darkBlue,
  [DSIKPIType.ThroughputPieceCount]: theme.colors.dsiExtendedColors.darkBlue,
  [DSIKPIType.ProductProcessed]: theme.colors.dsiExtendedColors.darkBlue,
  [DSIKPIType.BeltSpeed]: theme.colors.dsiExtendedColors.darkBlue,
  [DSIKPIType.LoadingEfficiency]: theme.colors.dsiExtendedColors.darkBlue,
  [DSIKPIType.LoadingGap]: theme.colors.dsiExtendedColors.darkBlue
};

export const bgColors: { [key: string]: string } = {
  [DSIKPIType.InfeedPieceSize]: theme.colors.lightGrey1,
  [DSIKPIType.Yield]: theme.colors.lightGrey1,
  [DSIKPIType.ThroughputRate]: theme.colors.lightGrey1,
  [DSIKPIType.ThroughputPieceCount]: theme.colors.lightGrey1,
  [DSIKPIType.ProductProcessed]: theme.colors.lightGrey1,
  [DSIKPIType.BeltSpeed]: theme.colors.lightGrey1,
  [DSIKPIType.LoadingEfficiency]: theme.colors.lightGrey1,
  [DSIKPIType.LoadingGap]: theme.colors.lightGrey1
};

export const dsiOEEGuide = {
  details: {
    overall: {
      title: 'oee_overall_title',
      text: 'oee_overall_text'
    },
    availability: {
      title: 'oee_availability_rate_title',
      text: 'oee_availability_rate_text'
    },
    performance: {
      title: 'oee_performance_rate_title',
      text: 'oee_performance_rate_text'
    },
    quality: {
      title: 'oee_quality_rate_title',
      text: 'oee_quality_rate_text'
    }
  },
  indications: {
    availability: {
      text: '',
      linkText: ''
    },
    performance: {
      text: '',
      linkText: ''
    },
    quality: {
      text: '',
      linkText: ''
    }
  }
};

export const timeInterval: Record<string, MachineHealthInterval> = {
  '0': MachineHealthInterval.Last15Min,
  '1': MachineHealthInterval.Last30Min,
  '2': MachineHealthInterval.LastHour,
  '3': MachineHealthInterval.LastShift,
  '4': MachineHealthInterval.LastDay,
  '5': MachineHealthInterval.LastWeek,
  '6': MachineHealthInterval.LastMonth,
  '7': MachineHealthInterval.CurrentDay
};
