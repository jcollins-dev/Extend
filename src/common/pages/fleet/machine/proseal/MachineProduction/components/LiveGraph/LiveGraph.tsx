import React from 'react';
import { WidgetUi } from 'common/components/WidgetUi/WidgetUi';
import { LiveGraphContainer } from './LiveGraph.elements';
import { DatepickerBar } from '../DatepickerBar/DatepickerBar';
import { LiveGraphBigChart } from './d3/d3Wrapper';
import { Downtime24hChart } from '../Downtime24hChart/DowntimeChartWrapper';
import { Wheel } from '../Wheel/Wheel';

export const LiveGraph = (): JSX.Element => {
  const widgetSettings = {
    title: 'Live Graph',
    className: 'live-graph-widget'
  };

  return (
    <WidgetUi
      {...widgetSettings}
      Main={
        <LiveGraphContainer className="widget-ui__main">
          <div className="live-graph-widget__time-bar">
            <DatepickerBar />
          </div>
          <div className="live-graph-widget__zoom-bar">
            <Wheel />
          </div>
          <div className="live-graph-widget__stats">
            <Downtime24hChart />
          </div>
          <div className="live-graph-widget__line-chart">
            <LiveGraphBigChart />
          </div>
        </LiveGraphContainer>
      }
    />
  );
};
