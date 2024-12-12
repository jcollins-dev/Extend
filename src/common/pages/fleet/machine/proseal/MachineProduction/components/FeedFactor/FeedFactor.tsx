import React from 'react';
import { WidgetUi } from 'common/components/WidgetUi/WidgetUi';
import { PieChart } from 'common/components/Charts/PieChart/PieChart';
import { useFeedFactorData } from '../../../hooks/useFeedFactorData';
import { OEEValueTiles } from '../DailyRateMetrics/OEEValueTiles';
import { ChartLegend, TimeStampFooter } from 'common/components';

// todo: add these to style guide
const demoColors = {
  overfed: '#118DFF',
  well_fed: '#009EB3',
  underfed: '#C83D95',
  very_underfed: '#E66C37'
};

// set legend items for above chart
const legendItems = [
  {
    label: 'Overfed',
    color: demoColors.overfed
  },
  {
    label: 'Well Fed',
    color: demoColors.well_fed
  },
  {
    label: 'Underfed',
    color: demoColors.underfed
  },
  {
    label: 'Very Underfed',
    color: demoColors.very_underfed
  }
];

// set WidgetUi settings
const widgetSettings = {
  title: 'Feed Factor',
  className: 'feed-factor-widget',
  SubHeader: (
    <div className="widget-ui__sub-header">
      {' '}
      <ChartLegend items={legendItems} />
    </div>
  ),
  Footer: <TimeStampFooter>Last 2 hours</TimeStampFooter>,
  hasButtons: {
    headerRight: ['calendar']
  }
};

export const FeedFactor = (): JSX.Element => {
  // get the data from custom hook made for this component
  const { average, chartData } = useFeedFactorData();

  // this is to use the OEE tile component for stylng of inside label.
  // the tiles component requires this formatting
  // TODO: Make a single tile component based on styleing of OEEValueTiles widget
  const tiles = [
    {
      label: 'Avg. Value',
      value: average,
      id: `average`
    }
  ];

  const convertToText: Record<string, string> = {
    overfed: 'Overfed',
    well_fed: 'Well Fed',
    underfed: 'Underfed',
    very_underfed: 'Very Underfed'
  };

  return (
    <WidgetUi
      {...widgetSettings}
      Main={
        <div className="widget-ui__main">
          <PieChart
            {...{
              data: chartData,
              groupKey: 'group',
              isDoughnut: true,
              InsideLabel: (
                <OEEValueTiles className="daily-rate-metrics-widget__stats" tiles={tiles} />
              ),
              colors: demoColors,
              format: {
                tooltip: ({ datum }: { datum: Record<string, unknown> }) => {
                  const groupId = datum.group as string;
                  return [`${convertToText[groupId]}`, `\n`, `${datum.count}%`];
                }
              }
            }}
          />
        </div>
      }
    />
  );
};
