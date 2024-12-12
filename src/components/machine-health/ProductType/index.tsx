// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import round from 'lodash/round';
import { useTranslation } from 'react-i18next';

// Components
import { Typography, KPICard } from 'components';
import { DataRenderer } from 'components/machine-health';
import SingleValueCard from 'components/KPICard/SingleValueCard';

// Helpers
import { BusinessUnit } from 'types/dsi';

// Hooks
import useMachineHealthByProductTypeKpi from 'hooks/useMachineHealthByProductTypeKpi';

interface Props {
  productTypeValue: string;
  startDatetime: string;
  endDatetime: string;
  legendBgColor?: string;
  headerColor?: string;
}

const StyledKPICard = styled(KPICard)(({ theme }) => ({
  backgroundColor: `${theme.colors.white}`
}));

const CardHeader = styled('div')(({ theme }) => ({
  backgroundColor: `${theme.colors.white}`,
  padding: '0.625rem',
  margin: '0.625rem',
  borderBottom: `0.0625rem solid ${theme.colors.lightGrey5}`,
  textAlign: 'center',
  paddingBottom: 0
}));

const CardContent = styled('div')(() => ({
  paddingTop: '0.625rem',
  paddingBottom: '1.25rem'
}));

const ProductType = ({ productTypeValue, startDatetime, endDatetime }: Props): JSX.Element => {
  const { machineHealth: productTypeKpiResult, isLoading } = useMachineHealthByProductTypeKpi(
    BusinessUnit.DSI,
    productTypeValue,
    startDatetime,
    endDatetime
  );

  const { t } = useTranslation(['mh']);
  const outputValueModified = productTypeKpiResult?.at(0)?.value.value ?? -1;
  const output = {
    value: outputValueModified === -1 ? '-' : round(outputValueModified).toLocaleString(),
    unit: productTypeKpiResult?.at(0)?.unit ?? '-'
  };

  return (
    <DataRenderer isLoading={isLoading}>
      <StyledKPICard>
        <CardHeader>
          <Typography size="1rem" weight="semi-bold" className="kpi-card__value-title">
            {productTypeValue}
          </Typography>
        </CardHeader>
        <CardContent>
          <SingleValueCard
            value1={{
              unit: t('calculated_output') as string,
              unitSize: '1rem',
              value: `${output.value} ${output.unit}`,
              size: '1.875rem',
              mb: '0'
            }}
          />
        </CardContent>
      </StyledKPICard>
    </DataRenderer>
  );
};

export default ProductType;
