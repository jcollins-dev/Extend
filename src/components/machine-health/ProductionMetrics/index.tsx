// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { isNumber } from 'lodash';
import { useTranslation } from 'react-i18next';

// Theme
import themes from 'themes';

// Components
import { DashboardWidget } from 'components';

// Api
import { useGetMachineProductionMetricsQuery } from 'api';

// Types
import { ProteinMachineRouteQueryParams } from 'types/protein';

// Utils
import { formatDuration } from 'helpers';

// Styling
const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  text-align: center;
`;

const Kpi = styled.div<{ small?: boolean }>`
  color: ${themes.colors.darkGrey};
  font-size: 1.3125rem;
  font-weight: 700;
  line-height: 1.35rem;
  ${({ small }) =>
    small &&
    `
  color: ${themes.colors.mediumGrey2};
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.125rem;
  `}
`;

const renderer = (desc: string, metric?: number) => {
  if (!isNumber(metric)) return null;
  return (
    <Content>
      <Kpi>{formatDuration(metric, 'hours:mins')}</Kpi>
      <Kpi small>{desc}</Kpi>
    </Content>
  );
};

const ProductionMetrics = (): JSX.Element => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { data, isLoading, error } = useGetMachineProductionMetricsQuery({ machineId });
  const { t } = useTranslation(['mh']);

  const widgetSettings = {
    title: t('production_metrics'),
    SubTitle: t('last_24hh_mm'),
    isLoading: isLoading ? true : false,
    hasError: error && t('failed_to_load_production_metrics')
  };

  return (
    <DashboardWidget {...widgetSettings}>
      <Container>
        {renderer(t('production_last_24'), data?.productionTime)}
        {renderer(t('throughput_last_24'), data?.throughput)}
      </Container>
    </DashboardWidget>
  );
};
export default ProductionMetrics;
