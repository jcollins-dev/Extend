import React from 'react';
import { useFleetMachineHealthById } from '../../hooks';
import { KPIWidget } from 'components';
import { useTranslation } from 'react-i18next';
import { kpiValueToCardText, getKpiUnitOfMeasure } from '../../helpers';
import { MachineHealthKpiKey } from 'types/machine-health';

export const AverageCyclesWaitTimeWidget = (): JSX.Element => {
  const { uoms, cardsData, isLoading, hasError } = useFleetMachineHealthById();
  const { t } = useTranslation(['mh']);

  const widgetSettings = {
    isLoading,
    hasError,
    title: t('wait_time_per_cycle') as string,
    hasStatue: cardsData?.waitTimeMachineHour?.[0]?.threshold?.status,
    values: [
      {
        value:
          (kpiValueToCardText(cardsData?.waitTimeMachineHour?.[0]?.values?.actual) as string) ||
          '-',
        label: getKpiUnitOfMeasure(MachineHealthKpiKey.WaitTimeMachineHour, uoms)
      }
    ]
  };
  return <KPIWidget {...widgetSettings} />;
};
