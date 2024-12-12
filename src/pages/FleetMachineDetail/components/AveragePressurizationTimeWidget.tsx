import React, { useEffect, useMemo, useState } from 'react';
import { useMachinePressurization } from '../hooks/useMachinePressurization';
import styled from 'styled-components';
import { ChartLegend, TimeStampFooter, PieChart, WidgetUi } from 'common/components';
// this needs to be globalized now that it's being used in other places
import { OEEValueTiles } from 'common/pages/fleet/machine/proseal/MachineProduction/components/DailyRateMetrics/OEEValueTiles';
import { default as theme } from 'themes';
export const Customcss = styled.div`
  position: relative;
  .chart-legend {
    float: left;
  }
  .widget-ui__sub-header {
    ul {
      li {
        span {
          font-size: 17px;
          font-weight: 400;
        }
        &:before {
          border-radius: 8.8em;
          width: 1.5em;
          height: 1.5em;
        }
      }
    }
  }
  .chartcss_machine {
    padding-top: 10px;
    position: relative;
    .oee-value-tiles__label {
      font-size: 16px;
    }
    .oee-value-tiles__value {
      font-size: 32px;
      font-weight: 600;
    }
    .oee-value-tiles__label {
      font-size: 15px;
      font-weight: 400;
      color: #a3a3a3;
      margin: 5px 20px;
      left: 10px;
      right: 10px;
      padding-left: 5px;
      padding-right: 5px;
    }
    .dimensions-container {
      width: 200px;
      height: 200px;
      margin: 0px auto;
      left: 0;
      right: 0;
    }
  }
  footer {
    padding-top: 40px;
  }
`;
export const Labelcstm = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  width: 70%;
  margin: 0px auto;
  h3 {
    margin: 0;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
  }
  p {
    margin-top: 5px;
  }
`;

// todo: add these to style guide
const demoColors: Record<string, string> = {
  'Average Target Time': theme.colors.donutChart.target,
  'Average Excess Pressure Time': theme.colors.donutChart.delta
};
export interface KPIWidgetProgresProps {
  group: string;
  count: number;
  color: string;
}

interface Props {
  values: KPIWidgetProgresProps[];
  gridArea: string;
}

const Provided = ({ values, gridArea }: Props): JSX.Element => {
  const [tilesdata, setTilesdata] = useState<
    {
      group: string;
      count: number | string;
      color: string;
    }[]
  >([]);

  const [tilesLabel, setTilesLabel] = useState<string>('Average Delta');
  const doughnutval = values?.filter((items) => 'Average Actual Time' !== items.group);
  const pieChartData =
    doughnutval?.reduce((acc, item: KPIWidgetProgresProps) => {
      const key = item.group;
      const value = Number(item.count).toFixed(2);
      return { ...acc, [key]: value };
    }, {}) || [];

  const legendItemsData = Object.entries(pieChartData).map(([key]) => ({
    // group will be the key whos value will be used to get the color and other info
    label: key,
    // set the colors above.  make sure you use the right key as the id.
    color: demoColors?.[key as string] as string
  }));
  const widgetSettings = {
    gridArea,
    title: 'Average Pressurization Time',
    className: 'machine-states-widget',
    SubHeader: (
      <div className="widget-ui__sub-header">
        <ChartLegend
          items={legendItemsData}
          handleClick={(e) => InsideDoughnutData(e.label as string)}
        />
      </div>
    ),
    Footer: <TimeStampFooter />,
    // hasButtons: {
    //   headerRight: ['calendar']
    // },
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
    const tiles = chartData?.filter((items) => label === items.group);
    setTilesdata(tiles);
    if (label === 'Average Excess Pressure Time') {
      setTilesdata(tiles);
      setTilesLabel('Average Delta');
    }
    if (label === 'Average Target Time') {
      setTilesdata(tiles);
      setTilesLabel('Average Target');
    }
  };
  useEffect(() => {
    if (tilesdata && tilesdata.length > 0) setTilesdata(tilesdata);
    console.log(tilesdata, 'tilesdata');
  }, [tilesdata, tilesLabel]);

  const average = chartData?.filter((items) => 'Average Excess Pressure Time' === items.group);

  const tiles: {
    label: string;
    value: string | number;
    id: string;
  }[] =
    tilesdata && tilesdata.length > 0
      ? average && average[0]?.group === 'Average Excess Pressure Time'
        ? [
            {
              label: tilesLabel,
              value: `${tilesdata[0].count} sec` as string,
              id: tilesdata[0].group
            }
          ]
        : [
            {
              label: tilesLabel,
              value: `${tilesdata[0].count} sec` as string,
              id: tilesdata[0].group
            }
          ]
      : [
          {
            label: tilesLabel,
            value: average && average?.length > 0 ? `${average[0].count} sec` : 0,
            id: `average`
          }
        ];
  return (
    <Customcss>
      <WidgetUi
        {...widgetSettings}
        Main={
          <PieChart
            {...{
              className: 'widget-ui__main chartcss_machine',
              data: chartData,
              groupKey: 'group',
              isDoughnut: true,
              InsideLabel: (
                <OEEValueTiles className="daily-rate-metrics-widget__stats" tiles={tiles} />
              ),
              colors: demoColors,
              format: {
                tooltip: ({ datum }: { datum: Record<string, unknown> }) => {
                  return [`${datum.group}`, `\n`, `${datum.count} (sec)`];
                }
              }
            }}
          />
        }
      />
      <Labelcstm>
        <div className="firstlabel">
          <h3>{`${values[0]?.count} sec`}</h3>
          <p>{values[0]?.group}</p>
        </div>
        <div className="secondlabel">
          <h3>{`${values[1]?.count} sec`}</h3>
          <p>{values[1]?.group}</p>
        </div>
      </Labelcstm>
    </Customcss>
  );
};

export const AveragePressurizationTimeWidget = ({
  gridArea
}: {
  gridArea: string;
}): JSX.Element => {
  const { data } = useMachinePressurization();

  const CachedWidget = useMemo(() => {
    const widgetSettings = {
      gridArea,
      title: 'Average Pressurization Time',
      values: [
        {
          group: `Average Actual Time`,
          count: Math.round(data?.avgPressurizeTime as number),
          color: '#0076CC'
        },
        {
          group: `Average Target Time`,
          count: Math.round(data?.avgIdealPressurizeTime as number),
          color: '#E04854'
        },
        {
          group: `Average Excess Pressure Time`,
          count: Math.round(data?.avgDeltaPressurizeTime as number),
          color: '#18A03C'
        }
      ]
    };
    return <Provided {...widgetSettings} />;
  }, [data]);

  return CachedWidget;
};
