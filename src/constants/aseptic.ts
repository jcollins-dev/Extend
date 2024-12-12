import theme from 'themes';
import { asepticMachineUtilizationMapperType } from 'types/machine-health/aseptic';

export const asepticOEEGuide = {
  details: {
    overall: {
      title: 'Overall Equipment Effectiveness',
      text: 'Overall Equipment Effectiveness (OEE) is the gold standard for measuring manufacturing productivity. It identifies the percentage of manufacturing time that is truly productive. An OEE score of 100% means you are manufacturing only good parts, as fast as possible, with no stop time. The OEE is calculated by multiplying these three variables (Availability, Performance and Quality).'
    },
    availability: {
      title: 'Availability rate',
      text: 'Availability rate takes into account availability loss, which includes any events that stop planned production for an appreciable length of time. In the report, availability rate is calculated by dividing the total duration of when the machine is in production mode by the total planned operation time. This means the sum of cleaning-, sterilization- and maintenance time are considered availability loss.'
    },
    performance: {
      title: 'Performance rate',
      text: 'Performance takes into account performance loss, which accounts for anything that causes the manufacturing process to run at less than the maximum possible speed when it is running. In the report, performance rate is calculated by dividing the total bottle infeed count by the maximum machine capacity (while the machine is in production mode). This means all machine stops during production mode, and slow machine cycles are considered performance loss.'
    },
    quality: {
      title: 'Quality rate',
      text: 'Quality takes into account quality loss, which accounts for manufactured parts that do not meet quality standards. In the report, performance rate is calculated by dividing the total amount of approved bottles by the total bottle infeed. This means the production time of all rejected bottles are considered quality loss.'
    }
  },
  indications: {
    availability: {
      text: 'Low availability indicates potential changeover improvements',
      linkText: 'Reported in Changeover tab'
    },
    performance: {
      text: 'Low performance indicates frequent production stops',
      linkText: 'Reported in Alarms tab'
    },
    quality: {
      text: 'Low quality indicates TBD',
      linkText: 'Reported in Quality tab'
    }
  }
};

export const MachineInfoTitleKeyMapper = {
  recipe_name: 'Active Recipe',
  run_length_in_seconds: 'Run Length',
  approvedbottles: 'Bottles Produced'
};

export const MachineInfoKeysEnum = {
  RECIPE_NAME: 'recipe_name',
  RUN_LENGTH_IN_SECONDS: 'run_length_in_seconds',
  APPROVED_BOTTLES: 'approvedbottles'
};

export const MachineUtilizationLabelsMapper: asepticMachineUtilizationMapperType = {
  Prod: 'Production' + '\n' + 'Uptime',
  'Production Downtime': 'Production' + '\n' + 'Downtime',
  Idle: 'Idle',
  Mainten: 'Maintenance',
  Cleaning: 'Cleaning',
  Steril: 'Sterilization'
};

export const asepticMachineUtilizationColorsMapper: asepticMachineUtilizationMapperType = {
  Prod: theme.colors.asepticMachineUtilizationColors.productionUptime,
  'Production Downtime': theme.colors.asepticMachineUtilizationColors.productionDowntime,
  Steril: theme.colors.asepticMachineUtilizationColors.sterilization,
  Cleaning: theme.colors.asepticMachineUtilizationColors.cleaning,
  Mainten: theme.colors.asepticMachineUtilizationColors.maintenance,
  Idle: theme.colors.asepticMachineUtilizationColors.idle
};

export interface LaneAlarmsBarChartType {
  x: string;
  y: number;
  color: string;
  showLabel: boolean;
  widget?: string;
}

export const foilPressMapper: { [key: string]: string } = {
  minimum_cap_size: 'Minimum Cap Size',
  maximum_cap_size: 'Maximum Cap Size',
  min_distance_to_edge: 'Minimum Distance to Edge',
  min_distance_between_caps: 'Minimum Distance Between Caps'
};
