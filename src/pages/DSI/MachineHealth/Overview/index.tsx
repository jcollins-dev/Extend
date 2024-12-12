// 3rd party libs
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowTrendUp,
  faCircle,
  faPercentage,
  faWeightHanging
} from '@fortawesome/free-solid-svg-icons';
import { find, isEmpty } from 'lodash';
import round from 'lodash/round';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// components
import {
  Column,
  Divider,
  Row,
  PageGrid,
  gridDSIMachineImage,
  gridDSIQualityPerformance,
  PageGridColHeader
} from 'components';

import { KPIWidgetV2 } from 'components/machine-health/widget/KPIWidget';
import {
  ActiveRecipeKpiWidget,
  MachineModesGraphWidget
} from 'components/machine-health/linear-filler';
import OeeWidget from 'components/machine-health/linear-filler/OeeWidget/OeeWidgetV2';
import { MachineActiveIssues, KPIWidget } from 'components/machine-health';
import useMachineStates from 'hooks/useMachineStates';
import { Value } from 'components/KPICard/CardComponents';
import useMachineHealthByBuKpi from 'hooks/useMachineHealthByBuKpi';

// Types
import { MachineType } from 'types/machine-health';
import { BusinessUnit, DSIKpiId, DSIKPIType, MachineHealthInterval } from 'types/dsi';
import { OeeData } from 'components/machine-health/linear-filler/OeeWidget';
import { MachineAccountInfoQueryParams } from 'types/protein';

// Theme
import theme from 'themes';

// Styling
const Container = styled.div`
  width: 100%;
  //padding: 1.5rem 3.125rem 0 3.125rem;
  //margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5vw;
`;
const IssuesContainer = styled.div`
  height: 16.0625rem;
`;

const OverviewV2 = (): ReactElement => {
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const businessUnit = BusinessUnit.DSI;
  const { t } = useTranslation(['mh']);
  const { result: machineStates, isLoading: isLoadingMachineState } = useMachineStates(
    machineId,
    businessUnit
  );
  const {
    machineHealth: currentKpiResult,
    isLoading: isLoadingCurrentKpi,
    error
  } = useMachineHealthByBuKpi(
    machineId,
    DSIKPIType.DsiCurrentKpi,
    MachineHealthInterval.LastHour,
    false,
    BusinessUnit.DSI
  );

  const { machineHealth: outputWeightResult, isLoading: isLoadingOutputWeight } =
    useMachineHealthByBuKpi(
      machineId,
      DSIKPIType.OutputWeight,
      MachineHealthInterval.CurrentDay,
      false,
      BusinessUnit.DSI
    );
  const { machineHealth: outputPieceResult, isLoading: isLoadingOutputPiece } =
    useMachineHealthByBuKpi(
      machineId,
      DSIKPIType.OutputPiece,
      MachineHealthInterval.CurrentDay,
      false,
      BusinessUnit.DSI
    );
  const { machineHealth: oeeResult, isLoading: isLoadingOEE } = useMachineHealthByBuKpi(
    machineId,
    DSIKPIType.MachineInfoOEE,
    MachineHealthInterval.CurrentDay,
    false,
    BusinessUnit.DSI
  );

  const appName = find(currentKpiResult, function (o) {
    return o.id === DSIKpiId.App;
  });

  const currentPsu = find(currentKpiResult, function (o) {
    return o.id === DSIKpiId.CurrentPSU;
  });

  const outputWeight =
    (outputWeightResult &&
      outputWeightResult[0] &&
      outputWeightResult[0].value &&
      outputWeightResult[0].value.value &&
      round(outputWeightResult[0].value.value, 0).toLocaleString()) ??
    '';

  const outputPiece =
    (outputPieceResult &&
      outputPieceResult[0] &&
      outputPieceResult[0].value &&
      outputPieceResult[0].value.value &&
      round(outputPieceResult[0].value.value, 0).toLocaleString()) ??
    '';
  const weightUnit =
    (outputWeightResult && outputWeightResult[0] && outputWeightResult[0].unit) ?? '';
  const pieceUnit = (outputPieceResult && outputPieceResult[0] && outputPieceResult[0].unit) ?? '';

  const oeeCumulative = find(oeeResult, function (o) {
    return o.id === DSIKpiId.OeeCumulative;
  });

  const oeeAvailability = find(oeeResult, function (o) {
    return o.id === DSIKpiId.OeeAvailability;
  });

  const oeePerformance = find(oeeResult, function (o) {
    return o.id === DSIKpiId.OeePerformance;
  });

  const oeeQuality = find(oeeResult, function (o) {
    return o.id === DSIKpiId.OeeQuality;
  });

  const oeeCumulativeValue =
    oeeCumulative &&
    oeeCumulative.value &&
    oeeCumulative.value.value &&
    round(Math.min(oeeCumulative.value.value * 100, 100), 0);
  const oeeCumulativeUnit = oeeCumulative && oeeCumulative.unit;

  const oeeAvailabilityValue =
    oeeAvailability &&
    oeeAvailability.value &&
    oeeAvailability.value.value &&
    round(Math.min(oeeAvailability.value.value * 100, 100), 0);
  const oeeAvailabilityUnit = oeeAvailability && oeeAvailability?.unit;

  const oeePerformanceValue =
    oeePerformance &&
    oeePerformance.value &&
    oeePerformance.value.value &&
    round(Math.min(oeePerformance.value.value * 100, 100), 0);
  const oeePerformanceUnit = oeePerformance && oeePerformance?.unit;

  const oeeQualityValue =
    oeeQuality &&
    oeeQuality.value &&
    oeeQuality.value.value &&
    round(Math.min(oeeQuality.value.value * 100, 100), 0);

  const oeeQualityUnit = oeeQuality && oeeQuality?.unit;

  const dsiOeeData: OeeData = {
    id: 'OEE',
    status: oeeCumulativeValue ? oeeCumulativeValue + '' + oeeCumulativeUnit : '-',
    period: t('current_prod_day'),
    availability: {
      value: oeeAvailabilityValue ? oeeAvailabilityValue + '' + oeeAvailabilityUnit : '-',
      color: theme.colors.darkGrey,
      mb: '0.625rem',
      size: '1.3125rem'
    },
    performance: {
      value: oeePerformanceValue ? oeePerformanceValue + '' + oeePerformanceUnit : '-',
      color: theme.colors.darkGrey,
      mb: '0.625rem',
      size: '1.3125rem'
    },
    quality: {
      value: oeeQualityValue ? oeeQualityValue + '' + oeeQualityUnit : '-',
      color: theme.colors.darkGrey,
      mb: '0.625rem',
      size: '1.3125rem'
    }
  };

  const getValues = () => {
    const values: Value[] = [];
    if (!isEmpty(currentKpiResult)) {
      values.push({
        valueTitle: t('product_setup') as string,
        value: (currentPsu && currentPsu.value && currentPsu.value.value) ?? '-',
        unit: '',
        key: 'product-setup-unit',
        unitTitle: ''
      });
      if (appName) {
        appName.values.forEach((appNameItem, index) => {
          values.push({
            value: appNameItem && appNameItem?.value,
            valueTitle: t('application', { item: index + 1 }) as string,
            unit: '',
            key: `application-${index}`
          });
        });
      }
      values.push({
        valueTitle: t('cumulative_finished_goods') as string,
        value: '',
        unit: '',
        key: 'cumulative-output',
        unitTitle: t('cumulative_output') as string,
        values: [
          { value: `${outputWeight} ${weightUnit}`, unit: 'Weight' },
          { value: `${outputPiece} ${pieceUnit}`, unit: 'Pieces' }
        ]
      });
    }
    return values;
  };

  return (
    <Container>
      <PageGrid {...gridDSIMachineImage}>
        <ActiveRecipeKpiWidget
          ga="machine"
          isLoading={isLoadingCurrentKpi || isLoadingOutputWeight || isLoadingOutputPiece}
          error={error ? (t('failed_to_load_machine_info') as string) : ''}
          height={25}
          containerHeight="17.1875rem"
          values={getValues()}
          scroll={true}
        />
        <MachineActiveIssues
          ga="c-1"
          title={t('current_issues') as string}
          machineType={MachineType.DSI}
          scrollHeight={185}
          height="16rem"
          hideArrow={true}
        />
        <OeeWidget
          ga="c-2"
          data={dsiOeeData}
          machineType={MachineType.DSI}
          height="12.8125rem"
          isLoadingOEE={isLoadingOEE}
          isHideTooltip={true}
        />
      </PageGrid>

      <PageGrid {...gridDSIQualityPerformance}>
        <PageGridColHeader ga="quality">{t('quality')}</PageGridColHeader>
        <KPIWidgetV2
          ga="q-1"
          kpi={{
            key: DSIKPIType.Yield,
            values: [
              {
                duration: t('avg_last_1min') as string,
                kpiType: DSIKPIType.Yield,
                interval: MachineHealthInterval.LastHour,
                includeHistoricData: true
              },
              {
                duration: t('avg_current_prod_day') as string,
                kpiType: DSIKPIType.Yield,
                interval: MachineHealthInterval.CurrentDay,
                includeHistoricData: false
              },
              {
                duration: t('target') as string,
                kpiType: DSIKPIType.Yield,
                interval: MachineHealthInterval.LastHour,
                includeHistoricData: true,
                target: true
              }
            ]
          }}
          TitleIcon={<FontAwesomeIcon icon={faArrowTrendUp} size="1x" />}
        />
        <PageGridColHeader ga="performance">{t('performance')}</PageGridColHeader>
        <KPIWidgetV2
          ga="p-1"
          kpi={{
            key: DSIKPIType.ProductProcessed,
            values: [
              {
                duration: t('avg_last_1min') as string,
                kpiType: DSIKPIType.ProductProcessed,
                interval: MachineHealthInterval.LastHour,
                includeHistoricData: true
              },
              {
                duration: t('avg_current_prod_day') as string,
                kpiType: DSIKPIType.ProductProcessed,
                interval: MachineHealthInterval.CurrentDay,
                includeHistoricData: false
              },
              {
                duration: t('target') as string,
                kpiType: DSIKPIType.ProductProcessed,
                interval: MachineHealthInterval.LastHour,
                includeHistoricData: true,
                target: true
              }
            ]
          }}
          TitleIcon={<FontAwesomeIcon icon={faPercentage} size="1x" />}
        />

        <KPIWidgetV2
          ga="p-2"
          kpi={{
            key: DSIKPIType.ThroughputRate,
            values: [
              {
                duration: t('avg_last_1min') as string,
                kpiType: DSIKPIType.ThroughputRate,
                interval: MachineHealthInterval.LastHour,
                includeHistoricData: true
              },
              {
                duration: t('avg_current_prod_day') as string,
                kpiType: DSIKPIType.ThroughputRate,
                interval: MachineHealthInterval.CurrentDay,
                includeHistoricData: false
              },
              {
                duration: t('target') as string,
                kpiType: DSIKPIType.ThroughputRate,
                interval: MachineHealthInterval.LastHour,
                includeHistoricData: true,
                target: true
              }
            ]
          }}
          TitleIcon={<FontAwesomeIcon icon={faWeightHanging} size="1x" />}
        />

        <KPIWidgetV2
          ga="p-3"
          kpi={{
            key: DSIKPIType.ThroughputPieceCount,
            values: [
              {
                duration: t('avg_last_1min') as string,
                kpiType: DSIKPIType.ThroughputPieceCount,
                interval: MachineHealthInterval.LastHour,
                includeHistoricData: true,
                unit: t('unit_pcs_hr') as string
              },
              {
                duration: t('avg_current_prod_day') as string,
                kpiType: DSIKPIType.ThroughputPieceCount,
                interval: MachineHealthInterval.CurrentDay,
                includeHistoricData: false,
                unit: t('unit_pcs_hr') as string
              }
              /*  {
                duration: 'Target',
                kpiType: DSIKPIType.ThroughputPieceCount,
                interval: MachineHealthInterval.LastHour,
                includeHistoricData: true,
                target: true
              }*/
            ]
          }}
          TitleIcon={<FontAwesomeIcon icon={faCircle} size="1x" />}
        />
      </PageGrid>
      <div>
        <PageGridColHeader ga="performance">{t('availability')}</PageGridColHeader>

        <MachineModesGraphWidget
          isLoading={isLoadingMachineState}
          intervalSpacing={false}
          title={t('machine_state') as string}
          data={[
            {
              id: 1,
              label: t('state_timeline') as string,
              parentProperty: '1',
              data: machineStates ?? []
            }
          ]}
        />
      </div>
    </Container>
  );
};

export const Overview = (): ReactElement => {
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const businessUnit = BusinessUnit.DSI;
  const { t } = useTranslation(['mh']);
  const { result: machineStates, isLoading: isLoadingMachineState } = useMachineStates(
    machineId,
    businessUnit
  );
  const {
    machineHealth: currentKpiResult,
    isLoading: isLoadingCurrentKpi,
    error
  } = useMachineHealthByBuKpi(
    machineId,
    DSIKPIType.DsiCurrentKpi,
    MachineHealthInterval.LastHour,
    false,
    BusinessUnit.DSI
  );

  const { machineHealth: outputWeightResult, isLoading: isLoadingOutputWeight } =
    useMachineHealthByBuKpi(
      machineId,
      DSIKPIType.OutputWeight,
      MachineHealthInterval.CurrentDay,
      false,
      BusinessUnit.DSI
    );
  const { machineHealth: outputPieceResult, isLoading: isLoadingOutputPiece } =
    useMachineHealthByBuKpi(
      machineId,
      DSIKPIType.OutputPiece,
      MachineHealthInterval.CurrentDay,
      false,
      BusinessUnit.DSI
    );
  const { machineHealth: oeeResult, isLoading: isLoadingOEE } = useMachineHealthByBuKpi(
    machineId,
    DSIKPIType.MachineInfoOEE,
    MachineHealthInterval.CurrentDay,
    false,
    BusinessUnit.DSI
  );

  const appName = find(currentKpiResult, function (o) {
    return o.id === DSIKpiId.App;
  });

  const currentPsu = find(currentKpiResult, function (o) {
    return o.id === DSIKpiId.CurrentPSU;
  });

  const outputWeight =
    (outputWeightResult &&
      outputWeightResult[0] &&
      outputWeightResult[0].value &&
      outputWeightResult[0].value.value &&
      round(outputWeightResult[0].value.value, 0).toLocaleString()) ??
    '';

  const outputPiece =
    (outputPieceResult &&
      outputPieceResult[0] &&
      outputPieceResult[0].value &&
      outputPieceResult[0].value.value &&
      round(outputPieceResult[0].value.value, 0).toLocaleString()) ??
    '';
  const weightUnit =
    (outputWeightResult && outputWeightResult[0] && outputWeightResult[0].unit) ?? '';
  const pieceUnit = (outputPieceResult && outputPieceResult[0] && outputPieceResult[0].unit) ?? '';

  const oeeCumulative = find(oeeResult, function (o) {
    return o.id === DSIKpiId.OeeCumulative;
  });

  const oeeAvailability = find(oeeResult, function (o) {
    return o.id === DSIKpiId.OeeAvailability;
  });

  const oeePerformance = find(oeeResult, function (o) {
    return o.id === DSIKpiId.OeePerformance;
  });

  const oeeQuality = find(oeeResult, function (o) {
    return o.id === DSIKpiId.OeeQuality;
  });

  const oeeCumulativeValue =
    oeeCumulative &&
    oeeCumulative.value &&
    oeeCumulative.value.value &&
    round(Math.min(oeeCumulative.value.value * 100, 100), 0);
  const oeeCumulativeUnit = oeeCumulative && oeeCumulative.unit;

  const oeeAvailabilityValue =
    oeeAvailability &&
    oeeAvailability.value &&
    oeeAvailability.value.value &&
    round(Math.min(oeeAvailability.value.value * 100, 100), 0);
  const oeeAvailabilityUnit = oeeAvailability && oeeAvailability?.unit;

  const oeePerformanceValue =
    oeePerformance &&
    oeePerformance.value &&
    oeePerformance.value.value &&
    round(Math.min(oeePerformance.value.value * 100, 100), 0);
  const oeePerformanceUnit = oeePerformance && oeePerformance?.unit;

  const oeeQualityValue =
    oeeQuality &&
    oeeQuality.value &&
    oeeQuality.value.value &&
    round(Math.min(oeeQuality.value.value * 100, 100), 0);

  const oeeQualityUnit = oeeQuality && oeeQuality?.unit;

  const dsiOeeData: OeeData = {
    id: 'OEE',
    status: oeeCumulativeValue ? oeeCumulativeValue + '' + oeeCumulativeUnit : '-',
    period: t('current_prod_day'),
    availability: {
      value: oeeAvailabilityValue ? oeeAvailabilityValue + '' + oeeAvailabilityUnit : '-',
      color: theme.colors.darkGrey,
      mb: '0.625rem',
      size: '1.3125rem'
    },
    performance: {
      value: oeePerformanceValue ? oeePerformanceValue + '' + oeePerformanceUnit : '-',
      color: theme.colors.darkGrey,
      mb: '0.625rem',
      size: '1.3125rem'
    },
    quality: {
      value: oeeQualityValue ? oeeQualityValue + '' + oeeQualityUnit : '-',
      color: theme.colors.darkGrey,
      mb: '0.625rem',
      size: '1.3125rem'
    }
  };

  const getValues = () => {
    const values: Value[] = [];
    if (!isEmpty(currentKpiResult)) {
      values.push({
        valueTitle: t('product_setup') as string,
        value: (currentPsu && currentPsu.value && currentPsu.value.value) ?? '-',
        unit: '',
        key: 'product-setup-unit',
        unitTitle: ''
      });
      if (appName) {
        appName.values.forEach((appNameItem, index) => {
          values.push({
            value: appNameItem && appNameItem?.value,
            valueTitle: t('application', { item: index + 1 }) as string,
            unit: '',
            key: `application-${index}`
          });
        });
      }
      values.push({
        valueTitle: t('cumulative_finished_goods') as string,
        value: '',
        unit: '',
        key: 'cumulative-output',
        unitTitle: t('cumulative_output') as string,
        values: [
          { value: `${outputWeight} ${weightUnit}`, unit: 'Weight' },
          { value: `${outputPiece} ${pieceUnit}`, unit: 'Pieces' }
        ]
      });
    }
    return values;
  };

  return (
    <Container>
      <Row>
        <Column size={6}>
          <ActiveRecipeKpiWidget
            isLoading={isLoadingCurrentKpi || isLoadingOutputWeight || isLoadingOutputPiece}
            error={error ? (t('failed_to_load_machine_info') as string) : ''}
            height={25}
            containerHeight="17.1875rem"
            values={getValues()}
            scroll={true}
          />
        </Column>
        <Column size={6} className="has-md-text">
          <IssuesContainer>
            <MachineActiveIssues
              title={t('current_issues') as string}
              machineType={MachineType.DSI}
              scrollHeight={185}
              height="16rem"
              hideArrow={true}
            />
          </IssuesContainer>
          <OeeWidget
            data={dsiOeeData}
            machineType={MachineType.DSI}
            height="12.8125rem"
            isLoadingOEE={isLoadingOEE}
            isHideTooltip={true}
          />
        </Column>
      </Row>
      <Row>
        <Column size={3}>
          <Divider title={t('quality') as string} />
        </Column>
        <Column size={9}>
          <Divider title={t('performance') as string} />
        </Column>
      </Row>
      <Row>
        <Column size={3} className="has-md-text">
          <KPIWidget
            mb="0"
            kpi={{
              key: DSIKPIType.Yield,
              values: [
                {
                  duration: t('avg_last_1min') as string,
                  kpiType: DSIKPIType.Yield,
                  interval: MachineHealthInterval.LastHour,
                  includeHistoricData: true
                },
                {
                  duration: t('avg_current_prod_day') as string,
                  kpiType: DSIKPIType.Yield,
                  interval: MachineHealthInterval.CurrentDay,
                  includeHistoricData: false
                },
                {
                  duration: t('target') as string,
                  kpiType: DSIKPIType.Yield,
                  interval: MachineHealthInterval.LastHour,
                  includeHistoricData: true,
                  target: true
                }
              ]
            }}
            height="16.25rem"
            leftIcon={<FontAwesomeIcon icon={faArrowTrendUp} size="1x" />}
          />
        </Column>
        <Column size={3} className="has-md-text">
          <KPIWidget
            mb="0"
            kpi={{
              key: DSIKPIType.ProductProcessed,
              values: [
                {
                  duration: t('avg_last_1min') as string,
                  kpiType: DSIKPIType.ProductProcessed,
                  interval: MachineHealthInterval.LastHour,
                  includeHistoricData: true
                },
                {
                  duration: t('avg_current_prod_day') as string,
                  kpiType: DSIKPIType.ProductProcessed,
                  interval: MachineHealthInterval.CurrentDay,
                  includeHistoricData: false
                },
                {
                  duration: t('target') as string,
                  kpiType: DSIKPIType.ProductProcessed,
                  interval: MachineHealthInterval.LastHour,
                  includeHistoricData: true,
                  target: true
                }
              ]
            }}
            height="16.25rem"
            leftIcon={<FontAwesomeIcon icon={faPercentage} size="1x" />}
          />
        </Column>
        <Column size={3}>
          <KPIWidget
            mb="0"
            kpi={{
              key: DSIKPIType.ThroughputRate,
              values: [
                {
                  duration: t('avg_last_1min') as string,
                  kpiType: DSIKPIType.ThroughputRate,
                  interval: MachineHealthInterval.LastHour,
                  includeHistoricData: true
                },
                {
                  duration: t('avg_current_prod_day') as string,
                  kpiType: DSIKPIType.ThroughputRate,
                  interval: MachineHealthInterval.CurrentDay,
                  includeHistoricData: false
                },
                {
                  duration: t('target') as string,
                  kpiType: DSIKPIType.ThroughputRate,
                  interval: MachineHealthInterval.LastHour,
                  includeHistoricData: true,
                  target: true
                }
              ]
            }}
            height="16.25rem"
            leftIcon={<FontAwesomeIcon icon={faWeightHanging} size="1x" />}
          />
        </Column>
        <Column size={3}>
          <KPIWidget
            mb="0"
            kpi={{
              key: DSIKPIType.ThroughputPieceCount,
              values: [
                {
                  duration: t('avg_last_1min') as string,
                  kpiType: DSIKPIType.ThroughputPieceCount,
                  interval: MachineHealthInterval.LastHour,
                  includeHistoricData: true,
                  unit: t('unit_pcs_hr') as string
                },
                {
                  duration: t('avg_current_prod_day') as string,
                  kpiType: DSIKPIType.ThroughputPieceCount,
                  interval: MachineHealthInterval.CurrentDay,
                  includeHistoricData: false,
                  unit: t('unit_pcs_hr') as string
                }
                /*  {
                  duration: 'Target',
                  kpiType: DSIKPIType.ThroughputPieceCount,
                  interval: MachineHealthInterval.LastHour,
                  includeHistoricData: true,
                  target: true
                }*/
              ]
            }}
            height="16.25rem"
            leftIcon={<FontAwesomeIcon icon={faCircle} size="1x" />}
            hideStatusIcon={false}
          />
        </Column>
      </Row>

      <Row>
        <Column size={12}>
          <Divider title={t('availability') as string} />
        </Column>
      </Row>
      <Row>
        <Column size={12}>
          <MachineModesGraphWidget
            isLoading={isLoadingMachineState}
            intervalSpacing={false}
            title={t('machine_state') as string}
            data={[
              {
                id: 1,
                label: t('state_timeline') as string,
                parentProperty: '1',
                data: machineStates ?? []
              }
            ]}
          />
        </Column>
      </Row>
    </Container>
  );
};

export default OverviewV2;
