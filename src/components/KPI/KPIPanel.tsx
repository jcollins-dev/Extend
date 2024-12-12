// 3rd Party
import React, { ReactElement } from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import _, { keys, includes } from 'lodash';
import { useTranslation } from 'react-i18next';

// Components
import { Loader, Typography } from 'components';
import KPIChartPanel from './KPIChartPanel';

// Constants
import { ChartDataItem, MachineVisionKpiItem } from 'types/machine-vision';
import { foilPressMapper } from 'constants/aseptic';

// Helpers
import { getLocalizationKey } from 'helpers';

interface Props {
  chartHeight?: string;
  KPIData: MachineVisionKpiItem | undefined;
  isLoading?: boolean;
  isError?: boolean;
  showxAxis?: boolean;
  roundAxisFormat?: boolean;
  custom?: JSX.Element;
  isZoomEnabled?: boolean;
}

const chartData = (KPIData: MachineVisionKpiItem) => {
  const data: { x: number; y: number }[] = [];
  if (KPIData) {
    KPIData.values.map((item: ChartDataItem) => {
      data.push({ x: new Date(item.timestamp).getTime(), y: item.value });
    });
  }
  return data;
};

const getMin = (KPIData: MachineVisionKpiItem) => {
  const min = _.minBy(KPIData.values, function (o) {
    return o.value;
  });
  return min ? min.value : 0;
};

const getMax = (KPIData: MachineVisionKpiItem) => {
  const max = _.maxBy(KPIData.values, function (o) {
    return o.value;
  });
  return max ? max.value : 0;
};

// Instantiate default chart data outside of the component,
// otherwise React will create a new array on every render
const defaultChartData = [{ x: 0, y: 0 }];

const KPIPanel = ({
  chartHeight,
  KPIData,
  isLoading,
  isError = false,
  showxAxis = false,
  roundAxisFormat = true,
  custom,
  isZoomEnabled = false
}: Props): ReactElement => {
  const chartValues = KPIData && !_.isEmpty(KPIData.values) ? chartData(KPIData) : defaultChartData;
  const min = KPIData && !_.isEmpty(KPIData.values) ? getMin(KPIData) : 0;
  const max = KPIData && !_.isEmpty(KPIData.values) ? getMax(KPIData) : 0;
  const { t } = useTranslation(['mh']);

  return (
    <>
      {isLoading || isError ? (
        isLoading ? (
          <Loader />
        ) : (
          <Typography color="negativeRed" style={{ marginLeft: '2rem', marginTop: '1.5rem' }}>
            {t('failed_to_load_data', { ns: 'common' })}
          </Typography>
        )
      ) : (
        <KPIChartPanel
          chartData={chartValues}
          heading={{
            value: KPIData
              ? includes(keys(foilPressMapper), KPIData.id)
                ? t(getLocalizationKey(foilPressMapper[KPIData.id]))
                : t(KPIData.id)
              : t('no_data'),
            size: KPIData && includes(keys(foilPressMapper), KPIData.id) ? '1rem' : '0.8125rem',
            weight: KPIData && includes(keys(foilPressMapper), KPIData.id) ? 'bold' : 'normal'
          }}
          height={chartHeight}
          subHeading={
            KPIData && KPIData.value
              ? KPIData.value.value.toLocaleString() + ' ' + KPIData.unit
              : '--'
          }
          custom={custom}
          icon={isZoomEnabled ? undefined : faAngleRight}
          showXaxis={showxAxis}
          roundAxisFormat={roundAxisFormat}
          footerData={{
            left: {
              label: 'Min: ',
              value: min
            },
            right: {
              label: 'Max: ',
              value: max
            }
          }}
          isZoomEnabled={isZoomEnabled}
        />
      )}
    </>
  );
};

export default KPIPanel;
