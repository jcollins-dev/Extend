// 3rd party libs
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { find, isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

// components
import { Column, Row } from 'components';
import {
  ChangeOverWidget,
  OeeWidget,
  ThroughputKPICard,
  MachineUtilizationWidget,
  MachineModesGraphWidget,
  LaneAlarmsWidget,
  ActiveRecipeKpiWidget
} from 'components/machine-health/linear-filler';
import { MachineActiveIssues } from 'components/machine-health';
import { Value } from 'components/KPICard/CardComponents';

// Types
import {
  AsepticMachineHealthInterval,
  AsepticMachineHealthKpiItem,
  AsepticMachineHealthType,
  MachineType,
  AsepticMachineModesItem,
  AsepticMachineModesGraphItem
} from 'types/machine-health';
import { AsepticChangeoverType, MachineInfo } from 'types/machine-health/aseptic';
import { MachineInfoKeysEnum, MachineInfoTitleKeyMapper } from 'constants/aseptic';

import useMachineHealthKpi from 'hooks/useMachineHealthKpi';
import { OeeData } from 'components/machine-health/linear-filler/OeeWidget';
import theme from 'themes';

// Styling
const Container = styled.div`
  width: 100%;
  padding: 1.5rem 3.125rem 0 3.125rem;
  margin-top: 2rem;
`;
const IssuesContainer = styled.div`
  height: 26.25rem;
`;
interface Props {
  currentChangeoverSummary: AsepticChangeoverType;
  isChangeoverLoading?: boolean;
  changeoverError?: unknown;
}
const Overview = ({
  currentChangeoverSummary,
  isChangeoverLoading,
  changeoverError
}: Props): ReactElement => {
  const {
    machineHealth: resultMachineInfo,
    isLoading: isLoadingMachineInfo,
    error: machineInfoError
  } = useMachineHealthKpi(
    AsepticMachineHealthType.MachineInfo,
    AsepticMachineHealthInterval.Last8Hours,
    false
  );

  const {
    machineHealth: resultMachineModes,
    isLoading: isLoadingMachineModes,
    error: machineModesError
  } = useMachineHealthKpi(
    AsepticMachineHealthType.MachineUtilization,
    AsepticMachineHealthInterval.Last7Days,
    true
  );

  const { machineHealth: oeeAPIResponse, isLoading: oeeIsLoading } = useMachineHealthKpi(
    AsepticMachineHealthType.OEE,
    AsepticMachineHealthInterval.Last7Days,
    false
  );

  const { t } = useTranslation(['mh', 'common']);

  const oeeCumulative = find(oeeAPIResponse, function (o) {
    return o.id === 'oee_overall_rate';
  });

  const oeeAvailability = find(oeeAPIResponse, function (o) {
    return o.id === 'oee_availability_rate';
  });

  const oeePerformance = find(oeeAPIResponse, function (o) {
    return o.id === 'oee_performance_rate';
  });

  const oeeQuality = find(oeeAPIResponse, function (o) {
    return o.id === 'oee_quality_rate';
  });

  const oeeCumulativeValue =
    oeeCumulative && oeeCumulative?.value && oeeCumulative?.value.value.toString();
  const oeeCumulativeUnit = oeeCumulative && oeeCumulative?.unit;

  const oeeAvailabilityValue =
    oeeAvailability && oeeAvailability?.value && oeeAvailability?.value.value;
  const oeeAvailabilityUnit = oeeAvailability && oeeAvailability?.unit;

  const oeePerformanceValue =
    oeePerformance && oeePerformance?.value && oeePerformance?.value.value;
  const oeePerformanceUnit = oeePerformance && oeePerformance?.unit;

  const oeeQualityValue = oeeQuality && oeeQuality?.value && oeeQuality?.value.value;
  const oeeQualityUnit = oeeQuality && oeeQuality?.unit;

  const oeeData: OeeData = {
    id: 'OEE',
    status: oeeCumulativeValue + '' + oeeCumulativeUnit,
    period: 'Last Week',
    availability: {
      value: oeeAvailabilityValue + '' + oeeAvailabilityUnit,
      color: theme.colors.darkGrey,
      mb: '0.625rem',
      size: '1.3125rem'
    },
    performance: {
      value: oeePerformanceValue + '' + oeePerformanceUnit,
      color: theme.colors.darkGrey,
      mb: '0.625rem',
      size: '1.3125rem'
    },
    quality: {
      value: oeeQualityValue + '' + oeeQualityUnit,
      color: theme.colors.darkGrey,
      mb: '0.625rem',
      size: '1.3125rem'
    }
  };

  const getValues = () => {
    const values: Value[] = [];
    if (!isEmpty(resultMachineInfo)) {
      resultMachineInfo?.forEach((item: AsepticMachineHealthKpiItem) => {
        const value = item && item.value && item.value.value;
        const id = item && item.id && item.id;
        values.push({
          valueTitle: MachineInfoTitleKeyMapper[id as keyof MachineInfo],
          value:
            id == MachineInfoKeysEnum.RUN_LENGTH_IN_SECONDS
              ? value.toLocaleString()
              : value.toLocaleString() && id == MachineInfoKeysEnum.APPROVED_BOTTLES
              ? value > 0
                ? value
                : t('na', { ns: 'common' })
              : value.toLocaleString(),
          unit: !isEmpty(id) ? id.substring(id.indexOf('_') + 1).replaceAll('_', ' ') : '',
          key: id,
          unitTitle: !isEmpty(id) ? id.split('_')[0] : ''
        });
      });
    }
    return values;
  };
  const machineModesData: AsepticMachineModesGraphItem[] = [
    {
      id: 1,
      label: t('actual_status'),
      parentProperty: '1',
      data: []
    }
  ];
  resultMachineModes?.map((item: AsepticMachineModesItem) => {
    machineModesData[0].data.push({
      stateCode: item.modeNumber.toString(),
      stateName: item.modeDescr,
      startTimestamp: item.startTime,
      endTimestamp: item.endTime
    });
  });
  return (
    <Container>
      <Row>
        <Column size={4}>
          <ActiveRecipeKpiWidget
            values={getValues()}
            error={machineInfoError ? (t('failed_to_load_machine_info') as string) : ''}
            isLoading={!machineInfoError && isLoadingMachineInfo}
          />
        </Column>
        <Column size={4}>
          <ThroughputKPICard />
          <OeeWidget
            data={oeeData}
            machineType={MachineType.Aseptic}
            isLoadingOEE={oeeIsLoading}
            isHideGuide={false}
            isHideTooltip={false}
          />
        </Column>
        <Column size={4}>
          <IssuesContainer>
            <MachineActiveIssues
              title={t('current_issues') as string}
              machineType={MachineType.Aseptic}
              scrollHeight={360}
              hideArrow={true}
            />
          </IssuesContainer>
        </Column>
      </Row>
      <Row>
        <Column size={4}>
          <MachineUtilizationWidget />
        </Column>
        <Column size={4}>
          <ChangeOverWidget
            currentChangeoverSummary={currentChangeoverSummary}
            isLoading={isChangeoverLoading}
            error={changeoverError}
          />
        </Column>
        <Column size={4}>
          <LaneAlarmsWidget />
        </Column>
      </Row>
      <Row>
        <Column size={12}>
          <MachineModesGraphWidget
            data={machineModesData}
            isLoading={!machineModesError && isLoadingMachineModes}
            error={machineModesError ? (t('failed_to_load_machine_modes') as string) : ''}
          />
        </Column>
      </Row>
    </Container>
  );
};

export default Overview;
