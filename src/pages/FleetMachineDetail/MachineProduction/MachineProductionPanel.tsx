// 3rd party libs
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
// Components
import { FleetMachineOverviewWidget, NewPerformanceTable, OEEWidget } from './components';

import { DateRangeProvider, WidgetUi, useDateRange } from 'components';

// Custom hooks
import { useColorMap } from 'hooks';

// Types
import { CycleProductionChart, MachineActiveIssues } from 'components/machine-health';

// API
import { usePressurizeCycleDataById } from '../hooks';
import { PressurizeCycle } from 'types/protein';

const MachineProductionPanelContainer = styled.div`
  .widget-ui.processed-batches,
  .widget-ui.unprocessed-batches {
    margin-bottom: 1rem;
  }
  .dot-pulse {
    margin: 0 auto;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1em;
  margin-bottom: 1em;
  min-height: 200px;

  .widget-ui {
    height: 100%;
    min-height: 100%;

    .widget-ui-main {
      min-height: 100%;
    }
  }

  .pie-chart-container .dimensions-container {
    width: 180px;
    height: 180px;
  }

  .widget-ui--machine-overview-widget {
    flex-grow: 0;
  }

  .kpi-card {
    flex-grow: 1;
  }
  .machine-states-widget {
    .chart-legend,
    .oee-value-tiles__label {
      font-size: 1em;
    }
  }
`;

const CycleTableContainer = styled.div`
  header {
    display: flex;
    gap: inherit;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
    font-size: 1.3em;
    padding: 0.25rem;
  }
`;

const CycleChartContainer = styled.div`
  margin-top: 1rem;
`;

// Keep these apart from the rest of page
const KpiCards = (): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const { timeZone } = useDateRange();
  return (
    <CardsContainer>
      <FleetMachineOverviewWidget />
      <DateRangeProvider {...{ subtractDaysCount: 1, timeZone }}>
        <OEEWidget />
      </DateRangeProvider>
      <MachineActiveIssues tooltipContent={t('go_to_alarms') as string} />
    </CardsContainer>
  );
};

export const MachineProductionPanel = (): JSX.Element => {
  const { timeZone, dateRange } = useDateRange();

  const { t } = useTranslation(['mh']);

  const onDayFilterBarClick = () => {
    console.log('Filter Bar Click');
  };

  const cycleColors = ['#28b981', '#f04444'];
  const getColorById = useColorMap(cycleColors);

  const { data: cycleData, isLoading: cycleDataIsLoading } = usePressurizeCycleDataById();

  // On a first render we show load icon, but hide when page stays open and keeps receiving new data
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [cycleDataIsLoading]);

  const isLoadingState = isFirstRender.current ? cycleDataIsLoading : false;

  const widgetSettings = {
    isLoading: isLoadingState,
    Main: (
      <CycleTableContainer className="widget-ui-main">
        <header>{t('last_10_cycles')}</header>
        <NewPerformanceTable />
      </CycleTableContainer>
    )
  };

  return (
    <MachineProductionPanelContainer id="MachineProductionPanel">
      <KpiCards />

      <WidgetUi {...widgetSettings} />

      {!isLoadingState && (
        <CycleChartContainer>
          <CycleProductionChart
            title={t('high_pressure_processed_batches')}
            count={`(${t('count')})`}
            totalTitle={t('total_batches-processed')}
            barValueType="count"
            onBarClick={onDayFilterBarClick}
            data={cycleData as PressurizeCycle[]}
            dateRange={{
              from: dateRange.startTime,
              to: dateRange.endTime
            }}
            timeZone={timeZone}
            selectedId={true}
            getColorById={getColorById}
            isLoading={isLoadingState}
            className="processed-batches"
          />

          <CycleProductionChart
            title={t('high_pressure_reprocessed_batches')}
            count={`(${t('count')})`}
            totalTitle={t('total_batches-reprocessed')}
            barValueType="count"
            onBarClick={onDayFilterBarClick}
            data={cycleData as PressurizeCycle[]}
            dateRange={{
              from: dateRange.startTime,
              to: dateRange.endTime
            }}
            timeZone={timeZone}
            selectedId={false}
            getColorById={getColorById}
            isLoading={isLoadingState}
            className="reprocessed_batches"
          />
        </CycleChartContainer>
      )}
    </MachineProductionPanelContainer>
  );
};
