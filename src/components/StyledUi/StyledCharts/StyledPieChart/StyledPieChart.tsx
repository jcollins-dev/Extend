import React from 'react';
import { StyledChartsProps } from '../StyledCharts.types';
import {
  VictoryTheme,
  Slice,
  VictoryContainer,
  VictoryPie,
  VictoryPieProps,
  VictoryTooltip,
  VictoryLabel,
  Rect
} from 'victory';
import { ColorScalePropType, VictoryStyleInterface } from 'victory-core';
import { defaultFlyoutStyles } from '../StyledCharts.styles';
import { StyledPieChartLegend, StyledPieChartLegendProps } from './StyledPieChartLegend';
import { StyledPieChartWithLegendContainer } from './StyledPieChart.elements';
import { convertToChartData } from '../_helpers';
import { useFilterSelected, filterSelectedData, WidgetUi } from 'components/StyledUi';

export type StyledPieChartPropsDataItem = Record<string, unknown>;

export type StyledPieChartPropsData = Record<string, unknown>[];

export interface StyledPieChartProps extends StyledChartsProps {
  // set these props if you want to render a legend
  legendSettings?: StyledPieChartLegendProps;
  autoLegend?: boolean;
}

interface Props extends StyledPieChartProps {
  data?: Record<string, unknown>[];
}

const generateLegendItems = (data: Record<string, unknown>[]) => {
  return data.map(({ x }) => ({ label: x as string, id: x as string }));
};

export const StyledPieChart = ({
  //data,
  apiData,
  groupKey,
  autoLegend,
  colorScale,
  colors,
  format,
  legendSettings,
  width,
  filteredByKeys,
  setsColors,
  widgetUiSettings
}: Props): JSX.Element => {
  console.log({ apiData });
  let data: Record<string, unknown>[] | undefined = undefined;

  if (!apiData) return <div>error loading chart: missing apiData prop</div>;
  if (!groupKey) return <div>error loading chart: missing `groupKey`</div>;

  const [selected, setSelected] = useFilterSelected();

  if (apiData) {
    const { data: dataUse, isLoading, hasError, hasMessage } = apiData;

    if (isLoading || hasError || hasMessage)
      return (
        <WidgetUi {...widgetUiSettings} {...{ isLoading, hasError, hasMessage }}>
          loaded
        </WidgetUi>
      );
    else if (!dataUse && !isLoading && !hasError && !hasMessage)
      return (
        <WidgetUi {...widgetUiSettings} hasMessage="error loading chart: mising apiData settings" />
      );
    else if (dataUse) {
      // check for filters
      if (selected && filteredByKeys) {
        const filtersToUse = filteredByKeys.reduce(
          (acc: Record<string, string[]> | undefined, key) =>
            key !== groupKey && selected[key] ? { ...acc, [key]: selected[key] } : acc,
          undefined
        );

        const filteredData = filtersToUse
          ? filterSelectedData({ data: apiData.data, selected: filtersToUse })
          : apiData.data;

        data =
          filteredData &&
          convertToChartData(filteredData, groupKey, {
            calculatePercents: true
          });
      } else {
        data = convertToChartData(dataUse, groupKey, {
          calculatePercents: true
        });
      }
    }
  }

  const handleSelect = (datum: Record<string, unknown>) => {
    if (!setSelected) {
      console.log('ERROR: this component requires FilterSelectedProvider parent');
      return;
    }

    return setSelected(filteredByKeys ? 'set' : 'toggle', {
      ...selected,
      [groupKey]: datum[groupKey] as string
    } as Record<string, string>);
  };

  const defaultChartStyles: VictoryStyleInterface = {
    data: {
      cursor: 'pointer',
      transition: 'opacity 500ms ease, color 500ms ease',
      fontFamily: 'inherit',
      strokeWidth: 0,
      fillOpacity: ({ datum }: { datum?: Record<string, unknown> }) => {
        const curGroupKey = datum?.groupKey as string;
        const curGroup = datum?.[curGroupKey] as string;
        let isTransparent = false;

        if (selected && selected[curGroupKey]) {
          if ([...selected[curGroupKey]].includes(curGroup)) isTransparent = false;
          else isTransparent = true;
        }

        return isTransparent ? 0.5 : 1;
      }
    }
  };

  const defaultWidth = width || 175;
  const defaultHeight = width || 175;

  // TODO:  A lot of these settings are shared with the stacked bar chart.  We should move them to a shared file.
  const defaultPieChartSettings: VictoryPieProps = {
    // set the width and height so the text doesn't get small
    width: defaultWidth,
    height: defaultHeight,

    // set padding to 0 so the chart takes up the whole container
    domainPadding: 0,
    padding: 0,

    // set the position of the tooltip
    labelRadius: Number(defaultWidth) * 0.3,

    // adding the ariaLabel prop to the slice component to get the colors from
    dataComponent: <Slice ariaLabel={({ datum }) => datum.x} />,

    events: [
      {
        target: 'data',
        eventHandlers: {
          onClick: () => ({
            // send bar data to click handler
            mutation: (props) => handleSelect(props.datum as Record<string, unknown>)
          })
        }
      }
    ]
  };

  if (!colors)
    defaultPieChartSettings.colorScale = (colorScale as ColorScalePropType) || 'qualitative';

  // build the chart here to use in different places below
  // we could possibly cache this
  const Chart = (
    <>
      <VictoryPie
        theme={VictoryTheme.material}
        data={data}
        labelRadius={Number(defaultWidth) * 0.5}
        labelComponent={
          <VictoryLabel
            backgroundComponent={<Rect className="pie-chart-label-background" />}
            renderInPortal
            backgroundPadding={5}
            backgroundStyle={{ fill: 'rgba(0, 0, 0, 0.5)' }}
            style={{
              fill: 'white',
              fontFamily: 'inherit',
              fillOpacity: ({ datum }: { datum?: Record<string, unknown> }) => {
                const curGroupKey = datum?.groupKey as string;
                const curGroup = datum?.[curGroupKey] as string;
                let isTransparent = false;

                if (selected && selected[curGroupKey]) {
                  if ([...selected[curGroupKey]].includes(curGroup)) isTransparent = false;
                  else isTransparent = true;
                }

                return isTransparent ? 0.3 : 1;
              }
            }}
          />
        }
        containerComponent={
          <VictoryContainer
            responsive={false}
            {...{ width: defaultWidth, height: defaultWidth }}
            className={setsColors ? `colors-chart` : `victory-pie-chart-wrapper`}
          />
        }
        labels={({ datum }) => {
          return format?.label ? (format.label(datum) as string) : `${datum.x}`;
        }}
        style={defaultChartStyles}
        {...defaultPieChartSettings}
      />

      {/* end the base chart, which contains the labels */}
      <VictoryPie
        theme={VictoryTheme.material}
        data={data}
        labelComponent={
          <VictoryTooltip orientation="top" flyoutStyle={defaultFlyoutStyles} renderInPortal />
        }
        containerComponent={
          <VictoryContainer
            responsive={false}
            {...{ width: defaultWidth, height: defaultWidth }}
            className={setsColors ? `colors-chart` : `victory-pie-chart-wrapper`}
          />
        }
        labels={({ datum }) => {
          return format?.tooltip ? (format.tooltip(datum) as string) : `${datum.x}: ${datum.y}`;
        }}
        style={{ data: { fill: 'transparent', stroke: 'transparent', cursor: 'pointer' } }}
        {...defaultPieChartSettings}
      />
    </>
  );

  // return just a chart, there is no legend for this
  if (!legendSettings && !autoLegend) {
    if (widgetUiSettings) {
      return (
        <WidgetUi {...widgetUiSettings} className="styled-pie-chart styled-chart">
          {Chart}
        </WidgetUi>
      );
    } else {
      return Chart;
    }
  }

  // set the legend settings
  if (autoLegend)
    legendSettings = {
      ...legendSettings,
      items: generateLegendItems(data as Record<string, unknown>[])
    };

  if (format?.legendItem)
    legendSettings = { ...legendSettings, formatLegendItem: format.legendItem };

  const handleLegendClick = (props: Record<string, unknown>) => {
    return handleSelect({ [groupKey]: props.id as string });
  };

  legendSettings = { ...legendSettings, colors, selected: selected?.[groupKey] };

  const ChartWithLegend = (
    <StyledPieChartWithLegendContainer>
      <div className="styled-pie-chart__chart">{Chart}</div>
      <StyledPieChartLegend {...legendSettings} handle={handleLegendClick} />
    </StyledPieChartWithLegendContainer>
  );

  if (widgetUiSettings) {
    return (
      <WidgetUi
        {...widgetUiSettings}
        className="styled-pie-chart styled-pie-chart--with-legend styled-chart"
      >
        {ChartWithLegend}
      </WidgetUi>
    );
  }

  return ChartWithLegend;
};
