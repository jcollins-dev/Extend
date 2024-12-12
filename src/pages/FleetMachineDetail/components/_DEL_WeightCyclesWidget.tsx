import React from 'react';
import { useFleetMachineHealthById } from '../hooks';
import { KPIWidget } from 'components';
import { useTranslation } from 'react-i18next';
import { kpiValueToCardText, getKpiUnitOfMeasure } from '../helpers';
import { MachineHealthKpiKey } from 'types/machine-health';

export const WeightCyclesWidget = (): JSX.Element => {
  const { uoms, cardsData, isLoading, hasError } = useFleetMachineHealthById();
  const { t } = useTranslation(['mh']);

  const widgetSettings = {
    isLoading,
    hasError,
    title: t('weight_cycle') as string,
    hasStatus: cardsData?.weightMachineHour?.[0]?.threshold?.status,
    values: [
      {
        value: kpiValueToCardText(cardsData?.weightMachineHour?.[0]?.values?.actual) as string,
        label: getKpiUnitOfMeasure(MachineHealthKpiKey.WeightMachineHour, uoms)
      }
    ]
  };
  return <KPIWidget {...widgetSettings} />;
};
