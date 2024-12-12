import { DefaultTheme } from 'styled-components';

// Types
import {
  CleaningStepCategories,
  ProteinMachineCategoryStates,
  ProteinMachineState,
  ProteinMachineStateCategoryName
} from 'types/protein';
import { AlarmType } from 'types/machine-health/alarms';
import { AlertCriticality } from 'types/machine-health/alerts';

// Design system color palette
export const themeColors = {
  black: '#000000',
  darkBlue1: '#005FAA',
  darkBlue2: '#004577',
  primaryBlue4: '#F1F7FF',
  primaryBlue3: '#B6CAF0',
  primaryBlue5: '#0076CC',
  lightBlue: '#F1F7FF',
  mediumBlue: '#0A70FF',
  mediumBlue2: '#8AA6EE',
  mediumBlue3: '#B6CAF0',
  mediumBlue4: '#F1F7FF',
  greyBlue: '#324872',
  greyBlue2: '#596d9c',
  greyBlue3: '#7a93cf',
  darkBlue: '#0D4D88',
  darkGrey: '#303E47',
  darkGrey2: '#414B60',
  darkGray3: '#353b4b',
  mediumGrey4: '#828485',
  mediumGrey3: '#828285',
  mediumGrey2: '#A3A3A3',
  mediumGrey1: '#C2C2C6',
  lightGrey8: '#666666',
  lightGrey7: '#D1D6DB',
  lightGrey6: '#D8DDe3',
  lightGrey5: '#D2D6DC',
  lightGrey4: '#DEDEDE',
  lightGrey3: '#E5E9ED',
  lightGrey2: '#F1F3F4',
  lightGrey1: '#F9FAFB',
  white: '#FFFFFF',
  errorRed: '#DC2626',
  darkRed: '#AB091E',
  darkRed2: '#983C3C',
  negativeRed: '#EF4444',
  negativeRed2: '#FD8479',
  negativeRed3: '#FFBCB2',
  negativeRed4: '#FFEFEC',
  atRiskYellow: '#EA7600',
  atRiskYellow2: '#F99F5C',
  atRiskYellow3: '#FFC9A2',
  atRiskYellow4: '#FFF6E7',
  onTrackGreen: '#28B981',
  onTrackGreen2: '#6FCB9F',
  onTrackGreen3: '#B5E4CB',
  onTrackGreen4: '#D1EEDE',
  onTrackGreen5: '#EDF8F2',
  richGold: '#9A5020',
  grey: '#3C4257',
  green: '#4CE749',
  green2: '#008200',
  darkGreen: '#316D4F',
  buttonPrimary: '#2F446C',
  defaultFont: '#233957',
  buttonSecondary: '#86A7B9',
  lightPurple: '#f9f5ff',
  darkPurple: '#631a81',
  lightMediumGrey: '#d1d6db',
  documentationGrey: '#DAE9FF',
  gray900: '#101828',
  disabledColor: '#b4b4b4',
  extendedPalettePurple2: '#694085'
};

// TODO - use specific colors from design team. These are entirely random placeholder colors.
const orderedCleaningStepColors = ['#3681BF', '#89105D', '#56B2A1', '#2F446C'];

const changeoverStepDurationsColors = [
  '#2C476F',
  '#7D96C3',
  '#694085',
  '#7EBCC3',
  '#C2C2C6',
  '#da9f74',
  '#9e5f31',
  '#407e85'
];

// TODO - use specific colors from design team. These are entirely random placeholder colors.
const cleaningStepColors = {
  [CleaningStepCategories.Rinse]: '#91D926',
  [CleaningStepCategories.Defrost]: '#3681BF',
  [CleaningStepCategories.Filling]: '#D98526',
  [CleaningStepCategories.Inspection]: '#5026D9',
  [CleaningStepCategories.Disinfection]: '#D926C4',
  [CleaningStepCategories.Drying]: '#26D9B8',
  [CleaningStepCategories.Detergent]: '#265CD9',
  [CleaningStepCategories.Complete]: '#2FD926',
  [CleaningStepCategories.UndefinedSequence]: '#2F446C',
  [CleaningStepCategories.EvaporatorEquipmentDefrostRinse]: '#D92665',
  [CleaningStepCategories.EvaporatorDefrost]: '#89105D',
  [CleaningStepCategories.ConveyorDefrost]: '#56B2A1',
  [CleaningStepCategories.InvalidGroup]: '#EbbA71',
  [CleaningStepCategories.Cooldown]: '#91B2B8',
  [CleaningStepCategories.PreRinse]: '#460761',
  [CleaningStepCategories.Chemical]: '#A3009B',
  [CleaningStepCategories.Neutralization]: '#5A3DDB',
  [CleaningStepCategories.Sanitation]: '#36282A',
  [CleaningStepCategories.Undefined]: '#0D2E2E',
  [CleaningStepCategories.Manual]: '#4F6936',
  [CleaningStepCategories.Caustic]: '#575129',
  [CleaningStepCategories.SteamSanitize]: '#558A6C'
};

// TODO - use specific colors from design team. These are entirely random placeholder colors.
const alarmIdColors = [
  '#FFC9A2',
  '#2F446C',
  '#F4F0FD',
  '#E5DAFB',
  '#CFDCE7',
  '#2F446C',
  '#994E01',
  '#FD8479',
  '#0A70FF'
];

// TODO - use specific colors from design team. These are entirely random placeholder colors.
const proteinMachineStateColors = {
  [ProteinMachineState.Idle]: '#A7A7A7',
  [ProteinMachineState.WaitingTobeSelected]: '#324BA0',
  [ProteinMachineState.SelectedWaitingToBeStarted]: '#A03232',
  [ProteinMachineState.StartingUp]: '#A05B32',
  [ProteinMachineState.Running]: '#119911',
  [ProteinMachineState.PausedByOperatorOrExternal]: '#87A032',
  [ProteinMachineState.Stop]: '#7F7F7F',
  [ProteinMachineState.ShutDownActive]: '#32A072',
  [ProteinMachineState.CompletedWaitingForOperator]: '#328BA0',
  [ProteinMachineState.Alarm]: '#F60000',
  [ProteinMachineState.CriticalAlarm]: '#9232A0',
  [ProteinMachineState.Warning]: '#FFA019',
  [ProteinMachineState.PauseInProgress]: '#325FA0'
};

// We use the golden ratio to get a good distribution/separation of colors
// https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/

const randomColorMap: { [key: number]: string } = {};

const GOLDEN_RATIO_CONJUGATE = 0.618033988749895;

/*
  Generate a golden ratio color. This produces pseudo-random colors in succession based on the input value.
*/

export const getGoldenRatioColor = (currentHue: number): [string, number] => {
  currentHue += GOLDEN_RATIO_CONJUGATE;
  currentHue %= 1;

  const hue = Math.floor(currentHue * 360);
  const randomColor = `hsl(${hue}, 70%, 50%)`;

  return [randomColor, currentHue];
};

let hue = 0;

new Array(100).fill(null).forEach((_, i) => {
  const [randomColor, currentHue] = getGoldenRatioColor(hue);
  randomColorMap[i] = randomColor;
  hue = currentHue;
});

const machineUtilizationColors = {
  run: '#93C5FD',
  clean: '#C4B5FD',
  idle: '#F0ABFC',
  stopped: '#FECDD3',
  stopByAlarm: '#FD8479'
};

const asepticMachineUtilizationColors = {
  productionUptime: '#69c196',
  productionDowntime: '#ea7600',
  sterilization: '#7EBCC3',
  cleaning: '#694085',
  maintenance: '#2C476F',
  idle: '#7D96C3',
  shadowColor: '#f3f4f5',
  laneAlarm: '#2d476f'
};

const alarmStatusColors = {
  [AlarmType.CriticalAlarm]: '#EF4444',
  [AlarmType.WarningInformation]: '#5F5C65',
  [AlarmType.Alarm]: '#A6A2D2',
  [AlarmType.Undefined]: '#E5E3E3',
  [AlarmType.AvureCriticalAlarm]: '#FF4A4A',
  [AlarmType.AvureCriticalAlarmOld]: '#FF4A4A',
  [AlarmType.AvureProductAlarm]: '#2024A2',
  [AlarmType.AvureProductAlarmOld]: '#2024A2',
  [AlarmType.AvureWarningAlarm]: '#FFB266',
  [AlarmType.AvureWarningAlarmOld]: '#FFB266',
  [AlarmType.AsepticFoilAlarm]: '#FFB266',
  [AlarmType.AsepticInfeedModule]: '#FF4A4A',
  [AlarmType.AsepticSealing]: '#5F5C65'
};

const alertCriticalityColors = {
  [AlertCriticality.Low]: '#FFFFFF',
  [AlertCriticality.Medium]: '#FFF6E7',
  [AlertCriticality.High]: '#FFFFFF'
};

const alertCriticalityIconFillColors = {
  [AlertCriticality.Low]: '#EA7600',
  [AlertCriticality.Medium]: '#EA7600',
  [AlertCriticality.High]: '#AB091E'
};

const machineConnectionStatusColors = {
  good: themeColors.onTrackGreen,
  error: themeColors.negativeRed,
  bad: themeColors.negativeRed,
  medium: themeColors.atRiskYellow,
  'never-connected': themeColors.lightGrey6
};

const stateCategoriesColors = {
  [ProteinMachineCategoryStates.Running]: '#4ADE80',
  [ProteinMachineCategoryStates.Cleaning]: '#FDE047',
  [ProteinMachineCategoryStates.Stop]: themeColors.negativeRed,
  [ProteinMachineCategoryStates.StopByAlarm]: themeColors.negativeRed2,
  [ProteinMachineCategoryStates.Idle]: themeColors.atRiskYellow
};

const ProteinMachineStateCatgoryColors = {
  [ProteinMachineStateCategoryName.Running]: '#4ADE80',
  [ProteinMachineStateCategoryName.Cleaning]: '#FDE047',
  [ProteinMachineStateCategoryName.Alarm]: themeColors.atRiskYellow,
  [ProteinMachineStateCategoryName.Stop]: themeColors.negativeRed,
  [ProteinMachineStateCategoryName.StopAlarm]: themeColors.negativeRed,
  [ProteinMachineStateCategoryName.Idle]: themeColors.atRiskYellow
};

const kpiChartColors = ['#FF6384', '#4BC0C0', '#35A2EB', '#FFB673', '#9966FF', '#FFCD56'];

const asepticColors = {
  lightRed: '#F47E8D'
};

const prosealColors = {
  darkPurple: '#654383',
  orange: '#FFB673',
  darkRed: '#E2524D'
};

const dsiExtendedColors = {
  blue: '#405C85',
  darkBlue: '#2C476F',
  green: '#7EBCC3',
  baseGreen: '#407E85',
  lightPurple: '#8378C3',
  mediumPurple: '#895EA7',
  lightPink: '#C47888'
};

const navFlyoutColors = {
  green: '#407E85',
  mediumGreen: '#4AB1BC',
  lightGreen: '#EBF9FA',
  pink: '#854050',
  mediumPink: '#C47888',
  lightPink: '#FCEEF1',
  blue: '#4B6D9E',
  mediumBlue: '#7D96C3',
  lightBlue: '#E9F1FF',
  primaryBlue: '#0076CC'
};

const machineManagementColors = {
  lightGreen: '#EFF7F3',
  lightOrange: '#FDF6E9'
};

export const colors = {
  ...themeColors,
  asepticColors,
  dsiExtendedColors,
  navFlyoutColors,
  machineManagementColors,
  proteinMachineStateColors,
  orderedCleaningStepColors,
  randomColorMap,
  cleaningStepColors,
  machineUtilizationColors,
  asepticMachineUtilizationColors,
  alarmStatusColors,
  alarmIdColors,
  alertCriticalityColors,
  alertCriticalityIconFillColors,
  machineConnectionStatusColors,
  stateCategoriesColors,
  prosealColors,
  ProteinMachineStateCatgoryColors,
  changeoverStepDurationsColors,
  kpiChartColors,
  donutChart: {
    target: '#0076CC',
    delta: '#C83D95'
  },
  buttons: {
    primary: {
      fill: '#0A70FF',
      border: 'none',
      shadow: 'none'
    },
    secondary: {
      fill: '#FFFFFF',
      border: '0.125rem solid #1C65C8',
      shadow: 'none'
    },
    tertiary: {
      fill: '#FFFFFF',
      border: '0.0625rem solid #D1D5DB',
      shadow: 'none'
    },
    warning: {
      fill: '#EDA268',
      border: 'none',
      shadow: 'none'
    },
    danger: {
      fill: '#DD524C',
      border: 'none',
      shadow: 'none'
    }
  },
  borders: {
    border01: {
      fill: 'rgba(255, 255, 255, 1.0)',
      border: '0.0625rem solid #C2C2C2',
      shadow: 'none'
    },
    border02: {
      fill: 'rgba(255, 255, 255, 1.0)',
      border: '0.0625rem solid #D8DDe3',
      shadow: '0 0.0625rem 0.125rem 0 rgba(0,0,0,0.05)'
    },
    nav: {
      fill: 'white',
      border: '0.0625rem solid #C2C2C6',
      shadow: 'none'
    },
    cartNav: {
      fill: 'white',
      borderDefault: '0.0625rem solid #D2D6DC',
      borderActive: '0.0625rem solid #0A70FF',
      borderVisited: '0.0625rem solid #303E47',
      shadow: '0rem 0.0625rem 0.125rem rgba(55, 65, 81, 0.08)'
    },
    error: {
      fill: 'red',
      border: '0.0625rem solid #FF0000',
      shadow: 'none'
    }
  },
  shadows: {
    dropshadow: {
      fill: '#FFFFFF',
      border: 'none',
      shadow: '0 0.25rem 0.375rem 0 rgba(0,0,0,0.05)'
    }
  },
  disabled: {
    dark: {
      fill: '#C2C2C2',
      border: 'none',
      shadow: 'none'
    },
    light: {
      fill: '#A3A3A3',
      border: 'none',
      shadow: 'none'
    }
  },
  icons: {
    default: {
      fill: '#C2C2C6'
    },
    dark: {
      fill: '#303E47'
    },
    active: {
      fill: '#FFFFFF'
    },
    hover: {
      fill: 'rgb(1, 140, 216)',
      border: 'none',
      shadow: '0 0.0625rem 0.125rem 0 rgba(0,0,0,0.05)'
    },
    sidenav: {
      fill: '#303E47'
    }
  },
  validations: {
    success: {
      primary: {
        fill: 'rgb(40, 185, 129)',
        border: 'none',
        shadow: '0 0.25rem 0.375rem 0 rgba(0,0,0,0.05)'
      },
      accent: {
        fill: 'rgba(40, 185, 129, 0.1)',
        border: 'none',
        shadow: '0 0.25rem 0.375rem 0 rgba(0,0,0,0.05)'
      },
      accent50: {
        fill: '#EFFCF6',
        border: 'none',
        shadow: 'none'
      }
    },
    warning: {
      primary: {
        fill: '#CB6E17',
        border: 'none',
        shadow: 'none'
      },
      accent: {
        fill: '#FFF0DB',
        border: 'none',
        shadow: 'none'
      },
      accent50: {
        fill: '#FFF7EC',
        border: 'none',
        shadow: 'none'
      }
    },
    error: {
      primary: {
        fill: '#AB091E',
        border: 'none',
        shadow: 'none'
      },
      accent: {
        fill: '#FFE3E3',
        border: 'none',
        shadow: 'none'
      },
      accent50: {
        fill: '#FFEEEE',
        border: 'none',
        shadow: 'none'
      }
    }
  },
  field: {
    white: {
      fill: '#FFFFFF',
      border: 'none',
      shadow: '0 0.0625rem 0.125rem 0 rgba(0,0,0,0.05)'
    },
    grey: {
      fill: 'rgb(244, 247, 249)',
      border: 'none',
      shadow: '0 0.0625rem 0.125rem 0 rgba(0,0,0,0.05)'
    },
    active: {
      fill: 'rgb(240, 240, 240)',
      border: '0.125rem solid #1C65C8',
      shadow: '0 0.0625rem 0.125rem 0 rgba(0,0,0,0.05)'
    },
    disabled: {
      fill: 'rgb(224, 228, 231)',
      border: 'none',
      shadow: '0 0.0625rem 0.125rem 0 rgba(0,0,0,0.05)'
    },
    search: {
      enabled: '#4F545A',
      filled: '#353B4B',
      shadow: 'none'
    },
    select: {
      enabled: '#5D6A86',
      filled: 'none',
      shadow: 'none'
    },
    switch: {
      handleOff: '#C2C2C6',
      handleOn: '#018CD8',
      trackOff: '#9b9b9e',
      trackOn: '#65addb'
    }
  },
  background: {
    background1: '#FFFFFF',
    background2: '#F9FAFB',
    // Not provided
    background3: '',
    background4: '#E7EDF3',
    background5: '#018CD8',
    // Not provided
    background6: '',
    background7: '#F7FAFC',
    background8: '#F0F4F8',
    background9: '#6E90A7',
    background10: '#F6FBFF',
    link: '#E5EDFF'
  },
  text: {
    active: '#0076CC',
    black: '#000000',
    darkgray: '#222222',
    mutedgray: '#757C89',
    link: '#004166',
    white: '#FFFFFF'
  },
  table: {
    primary: '#353B4B',
    link: '#004166',
    active: '#F59E0C'
  },
  indicators: {
    good: '#28B981',
    warning: '#F59E0C',
    bad: '#EF4444'
  },
  headings: {
    h1: 'black',
    h2: '#303E47'
  },
  card: {
    cta: '#584CCF'
  },
  loader: {
    main: '#D0D0D0'
  }
};

export const typography = {
  family:
    '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  headings: {
    h1: {
      weight: '500',
      size: '2.1875rem',
      lineHeight: '2.5rem'
    },
    h2: {
      weight: '700',
      size: '1.3125rem',
      lineHeight: 'normal'
    },
    h3: {
      weight: '500',
      size: '1.25rem',
      lineHeight: '2rem'
    },
    h4: {
      weight: '600',
      size: '1rem',
      lineHeight: '1.25rem'
    },
    h5: {
      weight: '500',
      size: '1rem',
      lineHeight: '1.25rem'
    },
    h6: {
      weight: '500',
      size: '0.75rem',
      lineHeight: '1rem'
    }
  },
  components: {
    button: {
      weight: '700',
      size: '0.875rem',
      lineHeight: '1rem'
    },
    input: {
      weight: '400',
      size: '0.875rem',
      lineHeight: '1.125rem'
    },
    tableColumn: {
      weight: '500',
      size: '0.87rem',
      lineHeight: '1rem'
    },
    tableRow: {
      weight: '600',
      size: '0.875rem',
      lineHeight: '1.25rem'
    },
    tableRowLight: {
      weight: '400',
      size: '0.875rem',
      lineHeight: '1.25rem'
    },
    tableHeader: {
      weight: '500',
      size: '0.75rem',
      lineHeight: '1rem'
    },
    tableRow2: {
      weight: '500',
      size: '0.8125rem',
      lineHeight: '1.25rem'
    },
    pageHeader: {
      weight: 'bold',
      size: '1.1875rem',
      lineHeight: '1.3125rem'
    },
    groupHeader: {
      weight: '700',
      size: '1.3125rem',
      lineHeight: '1.538125rem'
    },
    cardHeader: {
      weight: 'bold',
      size: '1.1875rem',
      lineHeight: '1.3125rem'
    },
    catalogCardHeader: {
      weight: 'bold',
      size: '1rem',
      lineHeight: '1.1875rem'
    },
    cardCta: {
      weight: 'bold',
      size: '0.875rem',
      lineHeight: '1rem'
    },
    rangeLabel: {
      weight: '700',
      size: '0.625rem',
      lineHeight: '1rem'
    }
  },
  text: {
    helper: {
      weight: '500',
      size: '0.75rem',
      lineHeight: '1rem'
    },
    modelHeading: {
      weight: '700',
      size: '0.875rem',
      lineHeight: '1.875rem'
    },
    base: {
      weight: '400',
      size: '0.875rem',
      lineHeight: '1.25rem'
    },
    bodySmall: {
      weight: '400',
      size: '0.75rem',
      lineHeight: '1rem'
    },
    bodyMediumBold: {
      weight: '500',
      size: '0.8125rem',
      lineHeight: '1.125rem'
    }
  }
};

const theme: DefaultTheme = {
  logo: '/assets/imgs/ob-logo-large-600.png',
  logoSmall: '/assets/imgs/ob-small-100.png',
  colors,
  typography
};

export default theme;
