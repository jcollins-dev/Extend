import React from 'react';
import { ProgressBarsChart, WidgetUi, TimeStampFooter } from 'common/components';
import { DateRangeProvider } from 'components';

const Provided = (): JSX.Element => {
  //const { data } = useDowntimeData()

  const widgetSettings = {
    className: `downtime-widget`,
    title: `Downtime`,
    Footer: <TimeStampFooter>Last 2 hours</TimeStampFooter>,
    hasButtons: {
      headerRight: ['calendar']
    }
  };

  // this is demo data, we might need to loop through the data return and get the top 3 items.
  // we need to figure out what makes an item a top item, is it number of times it appears or
  // based on some sort of total
  const barsData = [
    {
      barTitle: 'pot crush',
      value: 85
    },
    {
      barTitle: 'tray length',
      value: 35
    },
    {
      barTitle: 'stop by operator',
      value: 15
    }
  ];

  const chartSettings = {
    className: `widget-ui__main`,
    format: {
      barLabel: (props: Record<string, unknown>) => {
        return <>{props.value}%</>;
      }
    },
    data: barsData,
    colors: ['#C83D95', '#822191', '#835DD0']
  };

  return <WidgetUi {...widgetSettings} Main={<ProgressBarsChart {...chartSettings} />} />;
};

export const Downtime = (): JSX.Element => (
  <DateRangeProvider>
    <Provided />
  </DateRangeProvider>
);
