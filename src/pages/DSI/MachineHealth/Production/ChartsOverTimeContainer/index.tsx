// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { FilterSelectedProvider, Pill, useFilterSelected } from 'components';
import { ChartsFilter } from 'components/machine-health';
import { ChartOverTimeWidget } from '../ChartOverTimeWidget/ChartOverTimeWidget';

// Theme
import theme from 'themes';
import { DSIKPIType, MachineHealthInterval } from 'types/dsi';
import { UseIntervalProvider, useInterval } from '../../_hooks/useInterval';

import useMachineHealthByBuKpi from 'hooks/useMachineHealthByBuKpi';
import { useParams } from 'react-router-dom';
import { BusinessUnit } from 'types/dsi';

// Styling
const TabsContainer = styled.div`
  position: relative;
  padding-bottom: 1.25rem;
  display: flex;
  gap: 1rem;
`;

export const CollapseContainer = styled.div<{ open?: boolean }>`
  background-color: ${theme.colors.lightGrey1};
  border-radius: 0.1875rem;
  border: 0.0625rem solid ${theme.colors.lightGrey3};

  button {
    border-radius: 0.1875rem;
    width: 100%;
    background-color: ${theme.colors.lightGrey1};
    line-height: 1.375rem;
    padding: 0.625rem 1rem;
    border: 0.0625rem solid ${theme.colors.lightGrey3};
    color: ${theme.colors.darkGrey};
    cursor: pointer;
  }

  .chart {
    background: ${theme.colors.background.background1};
    padding: 1rem;
  }

  .collapse-container .rc-collapse-header {
    display: flex;
    align-items: center;
    line-height: 1.375rem;
    padding: 0.625rem 1rem;
    color: ${theme.colors.darkGrey};
    cursor: pointer;
    width: 100%;
  }

  .collapse-container .rc-collapse-header .arrow {
    display: inline-block;
    content: '\\20';
    width: 0;
    height: 0;
    font-size: 0;
    line-height: 0;
    border-top: 0.1875rem solid transparent;
    border-bottom: 0.1875rem solid transparent;
    border-left: 0.25rem solid ${theme.colors.darkGrey};
    vertical-align: middle;
    margin-right: 0.5rem;
  }
`;

interface CollapseButtonProps {
  label: string;
  handleClick: (type: DSIKPIType) => void;
  type: DSIKPIType;
}

export const CollapseButton = ({ label, handleClick, type }: CollapseButtonProps): JSX.Element => (
  <button className="rc-collapse-header" onClick={() => handleClick(type)}>
    <div className="rc-collapse-expand-icon">
      <i className="arrow"></i>
    </div>
    <span className="rc-collapse-header-text">{label}</span>
  </button>
);

const yieldColor = 'rgb(64, 92, 133)';
const targetColor = 'rgb(126, 188, 195)';

const chartWidgets = [
  {
    kpiType: 'Yield',
    label: 'Yield',
    unit: '%',
    charts: [
      { label: 'Yield', xKey: 'timestamp', yKey: 'value', color: yieldColor },
      { label: 'Target', xKey: 'timestamp', yKey: 'target', color: targetColor }
    ]
  },
  {
    kpiType: 'ThroughputRate',
    label: 'Throughput Rate',
    unit: 'lbs/hr',
    charts: [
      { label: 'Throughput Rate', xKey: 'timestamp', yKey: 'value', color: yieldColor },
      { label: 'Target', xKey: 'timestamp', yKey: 'target', color: targetColor }
    ]
  },
  {
    kpiType: 'ThroughputPieceCount',
    label: 'Throughput Piece Count',
    unit: 'pcs',
    charts: [
      { label: 'Throughput Piece Count', xKey: 'timestamp', yKey: 'value', color: yieldColor }
    ]
  },
  {
    kpiType: 'ProcessedProductPercentage',
    label: 'Processed Product Percentage',
    unit: '%',
    charts: [
      {
        label: 'Processed Product Percentage',
        xKey: 'timestamp',
        yKey: 'value',
        color: yieldColor
      },
      { label: 'Target', xKey: 'timestamp', yKey: 'target', color: targetColor }
    ]
  },
  {
    kpiType: 'InfeedPieceSize',
    label: 'Infeed Piece Size',
    unit: 'g',
    charts: [{ label: 'Infeed Piece Size', xKey: 'timestamp', yKey: 'value', color: yieldColor }]
  },
  {
    kpiType: 'BeltSpeed',
    label: 'Belt Speed',
    unit: 'fpm',
    charts: [{ label: 'Belt Speed', xKey: 'timestamp', yKey: 'value', color: yieldColor }]
  },
  //{ kpiType: 'LoadingEfficiency', label: 'Loading Efficiency', charts: [{ label: 'Loading Efficiency', xKey: 'timestamp', yKey: 'value', color: yieldColor }] },
  {
    kpiType: 'LoadingGap',
    label: 'Loading Gap',
    unit: 'mm',
    charts: [{ label: 'Loading Gap', xKey: 'timestamp', yKey: 'value', color: yieldColor }]
  }
];

const IntervalButtons = () => {
  const { interval, setInterval } = useInterval();
  const { t } = useTranslation(['mh']);

  const intervals = [
    { label: t('last_15_min'), value: 'LAST_15_MINUTES' },
    { label: t('last_30_min'), value: 'LAST_30_MINUTES' },
    { label: t('last_hour'), value: 'LAST_HOUR' },
    { label: t('last_day'), value: 'LAST_DAY' },
    { label: 'Current Day', value: 'CURRENT_DAY' },
    { label: t('last_week'), value: 'LAST_WEEK' },
    { label: t('last_month'), value: 'LAST_MONTH' }
  ];

  const Tabs = intervals.map(({ label, value }) => (
    <Pill
      key={value}
      onClick={() => setInterval(value)}
      selected={interval === value ? true : false}
    >
      {label}
    </Pill>
  ));

  return <>{Tabs}</>;
};

const ChartsOverTimeContainer = (): JSX.Element => {
  return (
    <FilterSelectedProvider>
      <ProvidedChartsFilter />

      <UseIntervalProvider>
        <TabsContainer>
          <IntervalButtons />
        </TabsContainer>

        <div>
          {chartWidgets.map(({ label, kpiType, ...rest }: { label: string; kpiType: string }) => (
            <ChartOverTimeWidget
              {...{ title: label, kpiType: kpiType as DSIKPIType, ...rest }}
              key={kpiType}
            />
          ))}
        </div>
      </UseIntervalProvider>
    </FilterSelectedProvider>
  );
};

const ProvidedChartsFilter = () => {
  const handleSelect = useFilterSelected()[1];
  const { machineId } = useParams<{ machineId: string }>();
  const { machineHealth: psuNameListResult } = useMachineHealthByBuKpi(
    machineId,
    DSIKPIType.PsuName,
    MachineHealthInterval.LastHour,
    false,
    BusinessUnit.DSI
  );

  //const currentDayPsuList = find(psuNameListResult, (o) => o.id === DSIKpiId.CurrentPSU);
  const currentDayPsuList = psuNameListResult?.find((o) => o.id === 'psu_name');

  const filterNames = currentDayPsuList?.values;

  const onChangeFilter = (value: string) => {
    console.log({ value });
    if (value === '') {
      handleSelect('clear');
    } else {
      handleSelect('set', { psuName: value });
    }
  };

  return <ChartsFilter onChangeFilter={onChangeFilter} filterNames={filterNames} />;
};

export default ChartsOverTimeContainer;
