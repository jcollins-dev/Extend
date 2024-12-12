import React, { useState } from 'react';

import { ChartLegend, TimeStampFooter, PieChart, WidgetUi } from 'common/components';
// this needs to be globalized now that it's being used in other places
import { OEEValueTiles } from 'common/pages/fleet/machine/proseal/MachineProduction/components/DailyRateMetrics/OEEValueTiles';
import { useDateRange } from 'components';
import { useGetPressurizeStateDataByIdQuery } from 'api';
import { useParams } from 'react-router-dom';
import { PressurizeState } from 'types/protein';

// todo: add these to style guide
const demoColors: Record<string, string> = {
  Waiting: '#8A8886',

  'In cycle': '#0076CC',

  'Operator stop': '#E04854',

  'Warm-up': '#18A03C',

  Starved: '#E66C37',

  Washing: '#00A6FF',

  'Machine stop': '#750985',

  Blocked: '#FF1A1A',

  'PLC Start': '#009EB3'
};

interface Props {
  data: PressurizeState[] | undefined;
}
const Provided = ({ data }: Props): JSX.Element => {
  const [tilesdata, setTilesdata] = useState<
    {
      group: string;
      count: unknown;
      color: string;
    }[]
  >([]);

  const [tilesLabel, setTilesLabel] = useState<string>('');

  const pieChartData =
    data?.reduce((acc, item: PressurizeState) => {
      const key = item.machineState;
      const value = (Number(item.totalTimeSeconds) / 3600).toFixed(2);
      return { ...acc, [key]: value };
    }, {}) || [];

  const legendItemsData = Object.entries(pieChartData).map(([key]) => ({
    // group will be the key whos value will be used to get the color and other info
    label: key,
    // set the colors above.  make sure you use the right key as the id.
    color: demoColors?.[key as string] as string
  }));
  const widgetSettings = {
    title: 'Machine States (Hours)',
    className: 'machine-states-widget',
    SubHeader: (
      <div className="widget-ui__sub-header">
        <ChartLegend
          items={legendItemsData || []}
          handleClick={(e) => InsideDoughnutData(e.label as string)}
        />
      </div>
    ),
    Footer: <TimeStampFooter />,
    hasButtons: {
      headerRight: ['calendar']
    },
    styleType: 'v1'
  };
  // need to convert the data to this format
  let chartData = Object.entries(pieChartData).map(([key, value]) => ({
    // group will be the key whos value will be used to get the color and other info
    group: key,
    count: Number(value),
    // set the colors above.  make sure you use the right key as the id.
    color: demoColors?.[key as string] as string
  }));

  chartData = chartData.slice().sort((a, b) => b.count - a.count);

  const InsideDoughnutData = (label: string) => {
    setTilesLabel(label);
    const tiles = chartData?.filter((items) => label === items.group);
    setTilesdata(tiles);
  };

  const average = chartData?.filter((items) => 'In cycle' === items.group);

  const tiles: {
    label: string;
    value: number;
    id: string;
  }[] =
    tilesdata && tilesdata.length > 0
      ? average && average[0]?.group === 'In cycle'
        ? [
            {
              label: tilesdata[0].group,
              value: tilesdata[0].count as number,
              id: tilesdata[0].group
            }
          ]
        : [
            {
              label: tilesdata[0].group,
              value: tilesdata[0].count as number,
              id: tilesdata[0].group
            }
          ]
      : [
          {
            label: tilesLabel ? tilesLabel : 'In cycle',
            value: average && average?.length > 0 ? (average[0]?.count as number) : 0,
            id: `average`
          }
        ];

  return (
    <WidgetUi
      {...widgetSettings}
      Main={
        <PieChart
          {...{
            className: 'widget-ui__main',
            data: chartData,
            groupKey: 'group',
            isDoughnut: true,
            InsideLabel: (
              <OEEValueTiles className="daily-rate-metrics-widget__stats" tiles={tiles} />
            ),
            colors: demoColors,
            format: {
              tooltip: ({ datum }: { datum: Record<string, unknown> }) => {
                return [`${datum.group}`, `\n`, `${datum.count} (Hours)`];
              }
            }
          }}
        />
      }
    />
  );
};

export const OEEWidget = (): JSX.Element => {
  const { utcTZConvertedISO } = useDateRange();
  const { machineId } = useParams<{ machineId: string }>();

  const params = {
    startDatetime: utcTZConvertedISO.startTime,
    endDatetime: utcTZConvertedISO.endTime,
    machineId: machineId
  };
  const { data } = useGetPressurizeStateDataByIdQuery(params);

  return <Provided data={data} />;
};
