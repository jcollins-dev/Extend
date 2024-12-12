import React from 'react';

import { StyledChartsProps } from '../StyledCharts.types';

import {
  calculateStackedMaxDomain,
  convertToStackedChartData,
  generateDateRangeCategories
} from '../_helpers/';

import { StyledBarChartContainer } from './StyledBarChart.elements';

import {
  useDateRange,
  WidgetUi,
  DimensionsContainer,
  filterSelectedData,
  useFilterSelected
} from 'components';

import {
  Bar,
  VictoryBar,
  VictoryTooltip,
  VictoryChart,
  VictoryStack,
  VictoryAxis,
  VictoryLabel
} from 'victory';

import {
  defaultFlyoutStyles,
  defaultLabelStyles,
  defaultTickLabelsStyles
} from '../StyledCharts.styles';

import { CategoryPropType, VictoryStyleInterface } from 'victory-core';

export type StyledBarChartPropsDataItem = Record<string, unknown>;

export type StyledBarChartPropsData = StyledBarChartPropsDataItem[];

const axisStyles = {
  tickLabels: defaultTickLabelsStyles,
  axis: {
    stroke: 'rgba(0,0,0,.7)',
    strokeWidth: 0.3
  }
};

export interface StyledBarChartProps extends StyledChartsProps {
  data?: StyledBarChartPropsData;
  categoryKey: string;
}

export const StyledBarChart = ({
  data,
  apiData,
  format
}: //categoryKey
StyledBarChartProps): JSX.Element => {
  if (apiData) {
    if (!apiData.data && !apiData.isLoading && !apiData.hasError && !apiData.hasMessage) {
      return <div>no data</div>;
    }
  }

  const [selected] = useFilterSelected();

  const defaultChartStyles = {
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
    },
    labels: defaultLabelStyles
  };

  // build the chart here to use in different places below
  return (
    <StyledBarChartContainer className="chart-wrapper">
      <DimensionsContainer
        Component={({ width, height }) => (
          <VictoryChart {...{ width, height, domainPadding: [0, 30] }}>
            <VictoryBar
              colorScale="qualitative"
              data={data}
              style={defaultChartStyles}
              dataComponent={
                <Bar
                  ariaLabel={({ datum }) => (datum.x ? `bar-${datum.x.replace(/ /g, '')}` : ``)}
                />
              }
              labelComponent={<VictoryTooltip flyoutStyle={defaultFlyoutStyles} />}
              labels={({ datum }) => {
                console.log({ datum });
                const label = format?.tooltip?.(datum);
                return label || `${datum.x}: ${datum.y}`;
              }}
            />
            <VictoryAxis dependentAxis style={axisStyles} />
            <VictoryAxis style={axisStyles} />
          </VictoryChart>
        )}
      />
    </StyledBarChartContainer>
  );
};

export interface StyledStackedBarChartProps extends StyledChartsProps {
  data?: Record<string, StyledBarChartPropsData>;
  categoryKey?: string;
}

export const StyledStackedBarChart = ({
  apiData,
  data,
  groupKey,
  categoryKey,
  //checkIfSelected,
  colorScale,
  colors,
  //handle,
  format,
  filteredByKeys,
  widgetUiSettings,
  type
}: //categoryKey
StyledStackedBarChartProps): JSX.Element => {
  // check if this chart is a staccked bar chart over time
  // if it is, we'll automaticall calculate the categories to align
  // the bottom (y) axis labels and bars
  const overTimeChart = type === 'stacked-bar-over-time';
  if (overTimeChart) categoryKey = 'date';

  // get the current date range of the chart
  const { isoDateRange } = useDateRange();

  let hasMessage = apiData?.hasMessage;
  let hasError = apiData?.hasError;
  const isLoading = apiData?.isLoading;

  if (!categoryKey || !groupKey) hasError = 'missing category or group key';
  if (!data && !apiData) hasMessage = 'no data message';

  // thanks TS
  groupKey = String(groupKey);
  categoryKey = String(categoryKey);

  if (hasMessage || isLoading || hasError) {
    if (widgetUiSettings)
      return (
        <WidgetUi
          {...widgetUiSettings}
          {...{ isLoading, hasError, hasMessage }}
          className="styled-bar-chart styled-bar-chart--stacked styled-chart"
        />
      );

    // return empty if loading and no message support ui
    if (isLoading) return <></>;
    else if (hasError || hasMessage) return <div>{hasMessage || hasError}</div>;
  }

  const [selected, setSelected] = useFilterSelected();

  if (apiData) {
    // something is wrong here, to trouble shoot, check the api call / data
    if (!apiData.data && !apiData.isLoading && !apiData.hasError && !apiData.hasMessage) {
      hasMessage = 'no data message';

      // we have api data
    } else if (apiData.data && apiData.data.length > 0) {
      // check for filters
      if (selected && filteredByKeys) {
        // build current filters
        const filtersToUse = filteredByKeys.reduce(
          (acc, key) => (selected[key] ? { ...acc, [key]: selected[key] } : acc),
          {}
        );

        // filter the data
        const filteredData = filterSelectedData({ data: apiData.data, selected: filtersToUse });

        // adding this condition to pass TS check
        if (filteredData)
          data = convertToStackedChartData(filteredData, groupKey, categoryKey, {
            filteredByKeys,
            convertToDate: overTimeChart
          });
      } else {
        // adding this condition to pass TS check
        if (apiData.data)
          data = convertToStackedChartData(apiData.data, groupKey, categoryKey, {
            filteredByKeys,
            convertToDate: overTimeChart
          });
      }
    }
  }

  // select handler for the bars
  const handleSelect = (datum: Record<string, unknown>) => {
    // check to make sure this component is wrapped in a FilterSelectedProvider
    if (!setSelected) {
      console.log('ERROR: this component requires FilterSelectedProvider parent');
      return;
    }

    return setSelected('set', {
      //[groupKey as string]: datum[groupKey as string] as string,
      [categoryKey as string]: datum[categoryKey as string] as string
    });
  };

  // calculate the highest total for the y axis
  // this takes into account all the bars that are stacked.
  // the script goes through each group and adds up the total for each date
  // and uses the hightest count as the max domain for the x axis
  const maxDomain = calculateStackedMaxDomain(data);

  const defaultChartStyles: VictoryStyleInterface = {
    data: {
      cursor: 'pointer',
      transition: 'opacity 500ms ease, color 500ms ease',
      fontFamily: 'inherit',
      strokeWidth: 0,
      fillOpacity: ({ datum }: { datum?: Record<string, unknown> }) => {
        let isTransparent = false;

        if (selected) isTransparent = true;

        if (selected && selected[categoryKey as string] && datum) {
          if ([...selected[categoryKey as string]].includes(datum[categoryKey as string] as string))
            isTransparent = false;
        }
        /*
        const curGroupKey = datum?.groupKey as string;
        const curGroup = datum?.[curGroupKey] as string;
        
        let isTransparent = false;

        if (selected && selected[curGroupKey]) {
          console.log('selected')
          if ([...selected[curGroupKey]].includes(curGroup)) isTransparent = false;
          else isTransparent = true;
        }
        */
        return isTransparent ? 0.5 : 1;
      }
    }

    //labels: defaultLabelStyles,
  };

  // here the colors of the bars are set based on the incoming colors object.
  // the reason it's being added is because undefined is not an option for TS and victory styles props
  // and we can't send it an empty string or the color will be black.
  if (colors && defaultChartStyles.data)
    defaultChartStyles.data.fill = ({ datum }: { datum?: Record<string, unknown> }): string => {
      return colors[datum?.[groupKey as string] as string]
        ? colors[datum?.[groupKey as string] as string]
        : '';
    };

  // if type is stacked-bar-over-time, we need to get all the dates from the data to set the domain
  // automatically.  This is to show empty days on the chart.  to hide empty dates, change type to 'stacked-bar'
  let overTimeCategories: CategoryPropType | undefined = undefined;
  if (overTimeChart && data) {
    if (isoDateRange.startTime !== ``) {
      overTimeCategories = {
        x: generateDateRangeCategories(data, [isoDateRange.startTime, isoDateRange.endTime])
      };
    }
  }

  let categoryCounter: number | undefined = undefined;

  if (overTimeCategories) {
    categoryCounter = overTimeCategories?.x?.length;
  }

  const Chart = (
    <StyledBarChartContainer className="chart-wrapper">
      <DimensionsContainer
        className="widget-ui-main has-overflow"
        Component={({ width, height }) => {
          return (
            <VictoryChart
              {...{
                categories: overTimeCategories,
                width,
                height,
                domainPadding: { x: [30, 30], y: [0, 0] },
                padding: { top: 20, bottom: 50, left: 20, right: 20 }
              }}
            >
              <VictoryStack>
                {data &&
                  Object.entries(data).map(([group, data]) => (
                    <VictoryBar
                      barWidth={calculateBarWidth({ width, height, count: categoryCounter })}
                      colorScale={colors ? undefined : colorScale || 'qualitative'}
                      domain={!categoryCounter || categoryCounter < 3 ? undefined : { x: [0, 6] }}
                      maxDomain={{ y: maxDomain }}
                      width={width}
                      height={height}
                      key={group}
                      data={data}
                      events={[
                        {
                          target: 'data',
                          eventHandlers: {
                            onClick: () => ({
                              // send bar data to click handler
                              mutation: (props) =>
                                handleSelect(props.datum as Record<string, unknown>)
                            })
                          }
                        }
                      ]}
                      dataComponent={<Bar ariaLabel={({ datum }) => datum.x} />}
                      labelComponent={
                        format?.label ? (
                          <VictoryLabel
                            lineHeight={[1, 1.75]}
                            style={[
                              {
                                fontSize: 13,
                                fontFamily: 'inherit',
                                textAnchor: 'left',
                                opacity: 0.8
                              },
                              {
                                fontSize: 15,
                                fontFamily: 'inherit',
                                textAnchor: 'left',
                                fontWeight: '500'
                              }
                            ]}
                          />
                        ) : (
                          <VictoryTooltip
                            flyoutStyle={defaultFlyoutStyles}
                            flyoutPadding={{ top: 10, left: 15, bottom: 15, right: 15 }}
                            labelComponent={
                              <VictoryLabel
                                lineHeight={[1, 1.75]}
                                style={[
                                  {
                                    fontSize: 13,
                                    fontFamily: 'inherit',
                                    textAnchor: 'left',
                                    opacity: 0.8
                                  },
                                  {
                                    fontSize: 15,
                                    fontFamily: 'inherit',
                                    textAnchor: 'left',
                                    fontWeight: '500'
                                  }
                                ]}
                              />
                            }
                            style={[
                              {
                                fontSize: 12,
                                fontFamily: 'inherit',
                                textAnchor: 'left',
                                opacity: 0.8
                              },
                              {
                                fontSize: 15,
                                fontFamily: 'inherit',
                                textAnchor: 'left',
                                fontWeight: '500'
                              }
                            ]}
                          />
                        )
                      }
                      labels={({ datum }) => {
                        let d: string | string[] = [`${datum.x}`, `${datum.y}`];

                        if (format?.tooltip) d = format?.tooltip(datum) as string[];

                        return d;
                      }}
                      style={defaultChartStyles}
                    />
                  ))}
              </VictoryStack>

              <VictoryAxis dependentAxis style={axisStyles} tickFormat={format?.axisX} />
              <VictoryAxis style={axisStyles} tickFormat={format?.axisY} fixLabelOverlap />
            </VictoryChart>
          );
        }}
      />
    </StyledBarChartContainer>
  );

  if (widgetUiSettings) {
    return (
      <WidgetUi
        {...widgetUiSettings}
        Main={Chart}
        className="styled-bar-chart styled-bar-chart--stacked styled-chart"
      />
    );
  }

  return Chart;
};

// a function to calculate the width of bars in a bar chart
const calculateBarWidth = (props?: Record<string, unknown>): number => {
  // set a base width to return if there are errors no missing props
  let baseWidth = 10;

  // no props, sending the default base width
  if (!props) return baseWidth;

  // break down props
  // doing it this way to make it easier to work with TS
  const width = props.width;
  const count = props.count;

  // one bar makes up what percentage of the bar count
  const barRatio = Math.round(Number(width) / Number(count) / 2); // Math.round((Number(width) / Number(count)) * 100)

  // missing props
  if (!width) return baseWidth;

  // we have what we need, calculate the bar width
  // based on the number of bars and the width of the chart
  if (count) baseWidth = Number(width) / (barRatio + 5);

  // don't go too wide or too narrow
  baseWidth = count === 4 ? 35 : barRatio > 40 ? 40 : barRatio;

  return baseWidth;
};
