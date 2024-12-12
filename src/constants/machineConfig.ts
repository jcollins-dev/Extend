// 3rd Party Libs
import {
  IconDefinition,
  faBorderAll,
  faChartColumn,
  faCube,
  faFileLines,
  faGauge,
  faImage,
  faTableColumns
} from '@fortawesome/free-solid-svg-icons';
import { faBell, faRectangleList } from '@fortawesome/free-regular-svg-icons';

// Types
import { ColumnConfig } from 'types';
import { WidgetType } from 'types/protein';

export const WidgetTableColumnConfigs: ColumnConfig[] = [
  {
    dataIndex: 'type',
    key: 'type',
    title: 'Type'
  },
  {
    dataIndex: 'tagsZones',
    key: 'tagsZones',
    title: 'Tags/Zones'
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: 'Name'
  }
];

export const WidgetTableTagColumnConfigs: ColumnConfig[] = [
  {
    dataIndex: 'tagType',
    key: 'tagType',
    title: 'Type'
  },
  {
    dataIndex: 'tagsZones',
    key: 'tagsZones',
    title: 'Tags/Zones'
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: ''
  }
];

export const RowIdDelimiter = '__';

export const TagIdPrefix = 'FE_ID_';

export const MaxTagLength = 15;

// icon map -> look up fa icons ny widgetType
export const WidgetTypeToIconMap: { [key in WidgetType]?: IconDefinition } = {
  [WidgetType.Alerts]: faBell,
  [WidgetType.CurrentIssues]: faBell,
  [WidgetType.DurationChart]: faChartColumn,
  [WidgetType.KpiCard]: faRectangleList,
  [WidgetType.MachineImage]: faImage,
  [WidgetType.MachineOverview]: faBorderAll,
  [WidgetType.MachineOverviewFlyout]: faBorderAll,
  [WidgetType.MachineOverviewFlyoutZone]: faCube,
  [WidgetType.MachineOverviewZone]: faCube,
  [WidgetType.MatrixWidget]: faTableColumns,
  [WidgetType.ProductionMetrics]: faFileLines,
  [WidgetType.State]: faGauge,
  [WidgetType.TagGroup]: faCube,
  [WidgetType.TorqueChart]: faChartColumn,
  [WidgetType.MachineUtilization]: faChartColumn,
  [WidgetType.CleaningLastSession]: faFileLines,
  [WidgetType.KeyIndicatorsHistory]: faChartColumn
};

// Map a widget type to a label suffix, so we can assemble full labels for a specific widget
// E.g. MH_PP_OV_KPI-CARD
export const widgetTypeToLabelSuffixMap: Partial<Record<WidgetType, string>> = {
  [WidgetType.KpiCard]: 'KPI-CARD',
  [WidgetType.MatrixWidgetGroup]: 'MATRIX-WIDGET-GROUP',
  [WidgetType.DurationChart]: 'DURATION-CHART',
  [WidgetType.RatioChart]: 'RATIO-CHART'
};

export const tutorialPlaceholderStepsData = [
  {
    description:
      "We've simplified the way you can configure a machine and its utilities. This guide will show you how you can customise the machine and save edits for other machines.",
    header: 'Machine Customiser',
    imgSrc: 'https://via.placeholder.com/300x200?text=Image+1+-+300x200'
  },
  {
    description:
      'Each section is a tab. They allow you to structure groups of information and data for both production and movement.',
    header: 'Tabs',
    imgSrc: 'https://via.placeholder.com/325x200?text=Image+2+-+325x200'
  },
  {
    description:
      'Groups are different matrix charts you can add that display data across multiple zones.',
    header: 'Widget Groups',
    imgSrc: 'https://via.placeholder.com/400x200?text=Image+3+-+400x200'
  },
  {
    description:
      'These are the cards within the group, designed for showing different zones within a machine.',
    header: 'Widgets',
    imgSrc: 'https://via.placeholder.com/350x250?text=Image+4+-+350x250'
  },
  {
    description:
      'These are the individual sensors you want to show the data from. Each tag will be available in both the widget and chart.',
    header: 'Tags',
    imgSrc: 'https://via.placeholder.com/500x400?text=Image+5+-+500x400'
  },
  {
    description:
      'When the user clicks on a widget a line chart will be visible showing historic data from all the tags.',
    header: 'Detail View',
    imgSrc: 'https://via.placeholder.com/500x400?text=Image+5+-+500x400'
  }
];

export const DATA_DATE_LIMIT_DAYS = 30;
