import React, { useMemo } from 'react';
import { KPIWidget } from 'components';
import { useMachinePressurization } from '../hooks/useMachinePressurization';
import moment from 'moment';

interface DefaultProps {
  className?: string;
  gridArea?: string;
  machineId?: string;
}

export const UnnecessaryPressurizationWidget = ({
  className,
  gridArea
}: DefaultProps): JSX.Element => {
  const { isLoading, hasError, data } = useMachinePressurization();

  const CachedWidget = useMemo(() => {
    const duration = data ? moment.duration(data?.sumDeltaPressurizeTime, `seconds`) : undefined;

    const hh = Number(duration?.hours()) < 10 ? `0${duration?.hours()}` : `${duration?.hours()}`;
    const mm =
      Number(duration?.minutes()) < 10 ? `0${duration?.minutes()}` : `${duration?.minutes()}`;
    const ss =
      Number(duration?.seconds()) < 10 ? `0${duration?.seconds()}` : `${duration?.seconds()}`;

    const timeString = !duration ? undefined : `${hh}:${mm}:${ss}`;

    const values = timeString
      ? [
          {
            value: timeString
          }
        ]
      : undefined;

    const widgetSettings = {
      className,
      gridArea,
      isLoading,
      hasError,
      values,
      title: 'Delta Pressurization Time'
    };

    return <KPIWidget {...widgetSettings} />;
  }, [data]);

  return CachedWidget;
};
