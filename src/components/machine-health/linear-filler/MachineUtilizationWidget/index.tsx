// 3rd party libs
import React, { useState } from 'react';
import styled from 'styled-components';
import { VictoryAxisProps, VictoryTheme } from 'victory';
import { useTranslation } from 'react-i18next';

// Components
import { KPICard } from 'components';
import CustomizedBarChart from '../CustomizedBarChart';
import { useContainerSize } from 'hooks';
import { Loader } from 'components';

//Hooks
import useMachineHealthKpi from 'hooks/useMachineHealthKpi';

// Themes
import theme from 'themes';
import Typography from 'components/Typography/Typography';
import {
  AsepticMachineHealthInterval,
  AsepticMachineHealthType,
  AsepticMachineHealthKpiItem
} from 'types/machine-health';
import { asepticMachineUtilizationMapperType } from 'types/machine-health/aseptic';

// Helpers
import {
  MachineUtilizationLabelsMapper,
  asepticMachineUtilizationColorsMapper,
  LaneAlarmsBarChartType
} from 'constants/aseptic';

const ChartContainer = styled.div`
height: 15.938rem;
width= 100%;
display: flex;
gap: 1rem;
padding-bottom: 1rem;
`;

const InitAxisStyle: VictoryAxisProps = {
  style: {
    tickLabels: {
      padding: 2,
      fill: theme.colors.mediumGrey2,
      fontSize: 13,
      lineHeight: 16,
      fontWeight: 400
    }
  }
};

const toBarChartInput = (data?: AsepticMachineHealthKpiItem[]) => {
  const values: LaneAlarmsBarChartType[] = [];
  if (!data) return [];
  const { shadowColor } = theme.colors.asepticMachineUtilizationColors;

  data.map((data) => {
    values.push(
      {
        x: MachineUtilizationLabelsMapper[data.id as keyof asepticMachineUtilizationMapperType],
        y: 100,
        color: shadowColor,
        showLabel: false
      },
      {
        x: MachineUtilizationLabelsMapper[data.id as keyof asepticMachineUtilizationMapperType],
        y: data.value.value ? Math.round(data.value.value) : 0,
        color:
          asepticMachineUtilizationColorsMapper[
            data.id as keyof asepticMachineUtilizationMapperType
          ],
        showLabel: true
      }
    );
  });
  return values;
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const headerRenderer = (heading?: string, address?: string) => {
  return (
    <HeaderContainer>
      <Typography mb={0} size="1rem" weight="bold">
        {heading}
      </Typography>
      <Typography mb={0} size="0.875rem" weight="normal">
        {address}
      </Typography>
    </HeaderContainer>
  );
};
const MachineUtilizationWidget = (): JSX.Element => {
  const {
    machineHealth: resultMachineUtilization,
    isLoading: isLoadingMachineUtilization,
    error: machineUtilizationError
  } = useMachineHealthKpi(
    AsepticMachineHealthType.MachineUtilization,
    AsepticMachineHealthInterval.Last7Days,
    false
  );
  const { t } = useTranslation(['mh']);
  const [axis] = useState<VictoryAxisProps>(InitAxisStyle);
  const { width, height, containerRef: graphContainerRef } = useContainerSize();
  const { containerRef: headerRef } = useContainerSize();
  return (
    <KPICard
      component={headerRenderer(t('machine_utilization') as string, t('last_week') as string)}
      ref={headerRef}
    >
      <ChartContainer ref={graphContainerRef}>
        {machineUtilizationError && (
          <Typography color="negativeRed" style={{ marginLeft: '2rem', marginTop: '1.5rem' }}>
            {t('failed_to_load_machine_utilization_data')}
          </Typography>
        )}
        {!machineUtilizationError &&
          (isLoadingMachineUtilization ? (
            <Loader margin="auto" />
          ) : (
            <CustomizedBarChart
              domainPadding={{
                x: 0
              }}
              theme={VictoryTheme.material}
              dims={{ width, height }}
              bars={toBarChartInput(resultMachineUtilization)}
              format={(tick) => `${tick}%`}
              config={{
                bar: {
                  barRatio: 1,
                  labels: ({ datum }) => (datum.showLabel ? `${datum.y}%` : ''),
                  style: { labels: { fontSize: 14, fontWeight: 450 } }
                },
                yAxis: axis
              }}
              padding={{ bottom: 40 }}
            />
          ))}
      </ChartContainer>
    </KPICard>
  );
};

export default MachineUtilizationWidget;
