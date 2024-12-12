// 3rd party libs
import React from 'react';
import theme from 'themes';
import { isEmpty, round } from 'lodash';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { KPIOverTimeGraph, Typography } from 'components';
import { useTimeZone } from 'providers';
import { DataRenderer } from 'components/machine-health';

// Types
import { Series, Interpolation, DatePoint } from 'types/graph';

// Helpers
import { BusinessUnit, DSIKPIType, MachineHealthInterval } from 'types/dsi';
import { formatDate, getUserTimeZone, isUSTimeZone } from 'helpers';

// Utils
import {
  axisH,
  formatLineSeriesTooltip
} from 'components/machine-health/MachineIndicatorsGraph/utils';

// Hooks
import useMachineHealthByBuKpi from 'hooks/useMachineHealthByBuKpi';
import { getXaxisOffset } from 'helpers/graph';

export interface ChartOverTimeMHProps {
  kpiType: DSIKPIType;
  interval: MachineHealthInterval;
  dataType?: string;
  legendBgColor?: string;
  headerColor?: string;
}

// Styling
const StyledContainer = styled.div`
  display: flex;
`;

const ChartOverTime = ({
  legendBgColor,
  headerColor,
  kpiType,
  interval,
  dataType
}: ChartOverTimeMHProps): JSX.Element => {
  const { timeZone } = useTimeZone();
  const { machineId } = useParams<{ machineId: string }>();

  console.log({
    machineId,
    kpiType,
    interval,
    uk: true,
    bu: BusinessUnit.DSI,
    dataType
  });

  const { machineHealth, isFetching, isLoading, error } = useMachineHealthByBuKpi(
    machineId,
    kpiType,
    interval,
    true,
    BusinessUnit.DSI,
    dataType,
    600000
  );
  const { t } = useTranslation(['mh']);
  const machineHealthItem = machineHealth && machineHealth[0];
  const values = machineHealthItem && machineHealthItem && machineHealthItem.values;
  const headingLabel = kpiType.replace(/([A-Z])/g, ' $1');
  const label = headingLabel.charAt(0).toUpperCase() + headingLabel.slice(1);
  // const label = t(kpiType);
  const heading = { label, color: headerColor };
  const subheading = { label: machineHealthItem?.unit, color: headerColor };
  const series: Series[] = [];
  const points: { id: string; data: DatePoint[] }[] = [];

  // Data line
  series[0] = {
    id: '0',
    label: label,
    unit: machineHealthItem?.unit ?? '',
    color: theme.colors.dsiExtendedColors.blue,
    mode: 'LINE',
    data: []
  };
  // draw points on chart
  points[0] = {
    id: 'value',
    data: []
  };
  // Target line
  series[1] = {
    id: '1',
    label: '',
    unit: machineHealthItem?.unit ?? '',
    color: theme.colors.dsiExtendedColors.green,
    mode: 'LINE',
    data: []
  };
  // draw points on chart
  points[1] = {
    id: 'target',
    data: []
  };
  if (!error) {
    values?.forEach((value, i) => {
      const dateTitle = isUSTimeZone(getUserTimeZone())
        ? `${formatDate(new Date(value.timestamp), 'numeric-date-time', timeZone, 'en-US')}`
        : `${formatDate(new Date(value.timestamp), 'numeric-date-time', timeZone)}`;

      const metadata = {
        mainTitle: dateTitle ?? '',
        data: [
          { title: `${label}:`, value: `${round(value.value, 1)} ${machineHealthItem?.unit}` },
          {
            title: value.target ? 'Target:' : '',
            value: value.target ? round(value.target, 1).toString() : ''
          },
          { title: 'PSU:', value: value.psuName },
          { title: 'Applications:', values: value.appName }
        ]
      };

      // Add a step to the chart if current value is 0 and a previous value exists
      const prevVal = values[i - 1];

      if (value.value === 0 && prevVal) {
        const date = new Date(prevVal.timestamp);
        const prevDate = new Date(date.setSeconds(date.getSeconds() + 1));
        series[0].data.push({
          x: prevDate,
          y: 0,
          metadata: {
            ...metadata,
            mainTitle: dateTitle ? `(Next known data point) ${dateTitle}` : ''
          }
        });

        points[0].data.push({ x: prevDate, y: 0 });
      }

      series[0].data.push({
        x: new Date(value.timestamp),
        y: round(value.value, 1),
        /* To pass any information to chart to be rendered on the right side panel */
        metadata
      });

      points[0].data.push({ x: new Date(value.timestamp), y: round(value.value, 1) });

      // Add a step to the chart if current value is 0 and a next value exists
      const nextVal = values[i + 1];

      if (value.value === 0 && nextVal) {
        const date = new Date(nextVal.timestamp);
        const nextDate = new Date(date.setSeconds(date.getSeconds() - 1));
        series[0].data.push({
          x: nextDate,
          y: 0,
          metadata: {
            ...metadata,
            mainTitle: dateTitle ? `(Previous known data point) ${dateTitle}` : ''
          }
        });

        points[0].data.push({ x: nextDate, y: 0 });
      }

      // If there is a target, perform the same steps as above except for the steps to 0
      if (value.target) {
        series[1].data.push({
          x: new Date(value.timestamp),
          y: round(value.target, 1),
          /* To pass any information to chart to be rendered on the right side panel */
          metadata
        });

        points[1].data.push({ x: new Date(value.timestamp), y: round(value.target, 1) });
      }
    });

    if (!isEmpty(series[1].data)) {
      series[1].label = t('target') as string;
    }
  }

  const domainX = getXaxisOffset(formatLineSeriesTooltip(series));

  return (
    <DataRenderer isLoading={isLoading || isFetching}>
      <StyledContainer>
        <KPIOverTimeGraph
          interpolation={Interpolation.MonotoneX}
          legendBgColor={legendBgColor}
          graphContainerHeight="18.3125rem"
          title=""
          heading={
            <>
              <Typography weight="medium" size="1rem" color={heading && heading.color} mb={0}>
                {heading && heading.label}
              </Typography>
              <Typography weight="medium" size="1rem" color={subheading && subheading.color}>
                ({subheading && subheading.label})
              </Typography>
            </>
          }
          series={!error ? formatLineSeriesTooltip(series) : []}
          xDomain={[domainX.min, domainX.max]}
          axisH={axisH(timeZone)}
          axisV={{
            style: {
              grid: {
                stroke: theme.colors.lightGrey3
              },
              axis: {
                stroke: theme.colors.lightGrey3
              }
            },
            tickFormat: (t) => round(t, 1)
          }}
          metadata={{
            mainTitle: '',
            data: [
              { title: `${label}:` },
              { title: !isEmpty(series[1].data) ? `${t('target')}:` : '' },
              { title: `${t('psu')}:` },
              { title: `${t('applications')}:` }
            ]
          }}
          tooltip={{
            color: theme.colors.white,
            bg: theme.colors.darkGrey
          }}
          points={
            interval !== MachineHealthInterval.LastDay &&
            interval !== MachineHealthInterval.CurrentDay &&
            interval !== MachineHealthInterval.LastWeek &&
            interval !== MachineHealthInterval.LastMonth
              ? points
              : undefined
          }
        />
      </StyledContainer>
    </DataRenderer>
  );
};

export default ChartOverTime;
