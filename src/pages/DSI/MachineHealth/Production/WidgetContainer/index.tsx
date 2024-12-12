// 3rd party libs
import React, { ReactElement, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import {
  faArrowTrendUp,
  faCircle,
  faFastForward,
  faPercentage,
  faTruck,
  faWeightHanging
} from '@fortawesome/free-solid-svg-icons';

import { KPIWidgetV2 } from 'components/machine-health/widget/KPIWidget';
// Components
import { PageGrid, gridDSISettingQualityPerformance, PageGridColHeader } from 'components';

// Types
import { DSIKPIType, MachineHealthInterval } from 'types/dsi';

/* temp store translations */
const Translate = () => {
  const { t } = useTranslation(['mh']);

  const translations = useMemo(
    () => ({
      ['avg_last_1min']: t('avg_last_1min'),
      ['efficiency']: t('efficiency'),
      ['gap']: t('gap'),
      ['target']: t('target'),
      ['todays_total_goods_output']: t('todays_total_goods_output'),
      ['setting']: t('setting'),
      ['quality_performance']: t('quality_performance'),
      ['loading']: t(DSIKPIType.Loading),
      ['unit_pcs_hr']: t('unit_pcs_hr'),
      ['ThroughputPieceCount']: t(DSIKPIType.ThroughputPieceCount)
    }),
    []
  );

  return translations;
};

/** generate settings column api card data */
const settingCol = () => [
  {
    ga: 's-1',
    kpi: {
      key: DSIKPIType.BeltSpeed,
      values: [
        {
          duration: Translate().avg_last_1min,
          kpiType: DSIKPIType.BeltSpeed,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true
        }
      ]
    },
    TitleIcon: <FontAwesomeIcon icon={faFastForward} />
  },
  {
    ga: 's-2',
    kpi: {
      key: DSIKPIType.Loading,
      values: [
        {
          title: Translate().efficiency,
          duration: Translate().avg_last_1min,
          kpiType: DSIKPIType.LoadingEfficiency,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true
        },
        {
          title: Translate().gap,
          duration: Translate().avg_last_1min,
          kpiType: DSIKPIType.LoadingGap,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true
        }
      ],
      TitleIcon: <FontAwesomeIcon icon={faTruck} />
    }
  }
];

/** generate quality col api card data */
const qualityCol = () => [
  {
    ga: 'q-1',
    kpi: {
      key: DSIKPIType.Yield,
      values: [
        {
          duration: Translate().avg_last_1min,
          kpiType: DSIKPIType.Yield,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true
        },
        {
          duration: Translate().target,
          kpiType: DSIKPIType.Yield,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true,
          target: true
        }
      ]
    },
    TitleIcon: <FontAwesomeIcon icon={faArrowTrendUp} />
  },
  {
    ga: 'q-3',
    kpi: {
      key: DSIKPIType.ProductProcessed,
      values: [
        {
          duration: Translate().avg_last_1min,
          kpiType: DSIKPIType.ProductProcessed,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true
        },
        {
          duration: Translate().target,
          kpiType: DSIKPIType.ProductProcessed,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true,
          target: true
        }
      ]
    },
    TitleIcon: <FontAwesomeIcon icon={faPercentage} />
  },
  {
    ga: 'q-2',
    kpi: {
      key: DSIKPIType.ThroughputRate,
      values: [
        {
          duration: Translate().avg_last_1min,
          kpiType: DSIKPIType.ThroughputRate,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true
        },
        {
          duration: Translate().target,
          kpiType: DSIKPIType.ThroughputRate,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true,
          target: true
        },
        {
          duration: Translate().todays_total_goods_output,
          kpiType: DSIKPIType.OutputWeight,
          interval: MachineHealthInterval.CurrentDay,
          includeHistoricData: false
        }
      ]
    },
    TitleIcon: <FontAwesomeIcon icon={faWeightHanging} />
  },

  {
    ga: 'q-4',
    kpi: {
      key: DSIKPIType.ThroughputPieceCount,
      values: [
        {
          duration: Translate().avg_last_1min,
          kpiType: DSIKPIType.ThroughputPieceCount,
          interval: MachineHealthInterval.LastHour,
          includeHistoricData: true,
          unit: Translate().unit_pcs_hr
        },
        {
          duration: Translate().todays_total_goods_output,
          kpiType: DSIKPIType.OutputPiece,
          interval: MachineHealthInterval.CurrentDay,
          includeHistoricData: false
        }
      ]
    },
    TitleIcon: <FontAwesomeIcon icon={faCircle} />,
    hideStatusIcon: false
  }
];

const WidgetContainer = (): ReactElement => {
  const Setting = useCallback(
    () => settingCol().map(({ ga, ...item }) => <KPIWidgetV2 key={ga} {...{ ga, ...item }} />),
    []
  );

  const Quality = useCallback(
    () => qualityCol().map(({ ga, ...item }) => <KPIWidgetV2 key={ga} {...{ ga, ...item }} />),
    []
  );

  return (
    <PageGrid {...gridDSISettingQualityPerformance}>
      <PageGridColHeader ga="setting">{Translate().setting}</PageGridColHeader>
      {Setting()}
      <PageGridColHeader ga="quality">{Translate().quality_performance}</PageGridColHeader>
      {Quality()}
    </PageGrid>
  );
};

export default WidgetContainer;
