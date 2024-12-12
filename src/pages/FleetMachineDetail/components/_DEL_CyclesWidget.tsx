import React from 'react';
import { useFleetMachineHealthById } from '../hooks';
import { KPIWidget } from 'components';
import { useTranslation } from 'react-i18next';

export const CyclesWidget = (): JSX.Element => {
  const { cardsData, isLoading, hasError, machineProductionData } = useFleetMachineHealthById();

  const { t } = useTranslation(['mh']);

  let total = '–';

  if (machineProductionData) {
    let count = 0;

    machineProductionData.map((item) => {
      if (item?.failCycles) {
        const total = (item?.failCycles as string)?.replace(/\s/g, '')?.split('/').at(-1);
        count = count + Number(total);
      }
    });

    total = `${count}`;
  }

  total = total === `0` ? `_` : total;

  const widgetSettings = {
    isLoading,
    hasError,
    title: t('cycles') as string,
    hasStatus: cardsData?.cyclecountMachineHour?.[0]?.threshold?.status,
    values: [
      {
        value: total,
        label: total === `_` ? '-' : (t('total_in_last_hour') as string)
      }
    ]
  };
  return <KPIWidget {...widgetSettings} />;
};
