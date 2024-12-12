// 3rd party libs
import React, { ReactElement } from 'react';
import theme from 'themes';
import { last, replace } from 'lodash';
import round from 'lodash/round';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { Column, Row, Typography, KPICardWidget } from 'components';
import KPIInformationWidget from 'components/machine-health/widget/KPIInformationWidget';
import TwoColumnCard from 'components/KPICard/TwoColumnCard';
import SingleValueCard from 'components/KPICard/SingleValueCard';
import { DataRenderer } from 'components/machine-health';
import { Value } from 'components/KPICard/CardComponents';

// Types
import {
  BusinessUnit,
  DSIKPIType,
  MachineHealthInterval,
  MachineKpiItem,
  MachineStateNames
} from 'types/dsi';
import { MachineHealthKpiItem, MachineHealthKpiStatus } from 'types/machine-health';

// Hooks
import useMachineHealthByBuKpi from 'hooks/useMachineHealthByBuKpi';

// Helpers
import { getColor } from 'helpers';
import { useDSImachineStatus } from 'providers';

interface V2Props {
  kpi: {
    key: string;
    values: {
      kpiType: DSIKPIType;
      interval: MachineHealthInterval;
      includeHistoricData: boolean;
      title?: string;
      duration?: string;
      unit?: string;
      target?: boolean;
    }[];
  };
  TitleIcon?: React.ReactNode;
  hideStatusIcon?: boolean;
  ga?: string;
  gridArea?: string;
}

export const KPIWidgetV2 = ({
  kpi,
  TitleIcon,
  hideStatusIcon,
  ga,
  gridArea
}: V2Props): ReactElement => {
  const { machineId } = useParams<{ machineId: string }>();
  const { machineStatus } = useDSImachineStatus();

  const { t } = useTranslation(['mh']);

  const getLastValue = (item: MachineHealthKpiItem | undefined) => last(item?.values);
  const getValue = (item: MachineHealthKpiItem | undefined) => item?.value;

  const values: Value[] = [];

  let isLoadingValue = true;

  kpi.values.forEach((valueItem, index) => {
    const { machineHealth, isLoading: isLoading } = useMachineHealthByBuKpi(
      machineId,
      valueItem.kpiType,
      valueItem.interval ?? MachineHealthInterval.LastHour,
      valueItem.includeHistoricData,
      BusinessUnit.DSI
    );

    isLoadingValue = isLoading;

    const machineHealthItem = machineHealth && machineHealth[0];

    const machineHealthHolder = valueItem.includeHistoricData
      ? getLastValue(machineHealthItem)
      : getValue(machineHealthItem);

    const roundedValue =
      (machineHealthHolder?.value && round(machineHealthHolder.value, 0).toLocaleString()) || '-';

    let value = (roundedValue && roundedValue.toLocaleString()) ?? '-';

    if (valueItem.target) {
      const target = (machineHealthHolder?.target && round(machineHealthHolder.target, 0)) || 0;
      value = `${target.toLocaleString() || `-`}`;
    }

    const status = (!valueItem.target && machineHealthHolder?.status) || '';

    if (kpi.values.length === 1) {
      values[2] = {
        value: value ?? '-',
        valueTitle: valueItem && valueItem.title,
        unit: valueItem.unit ? valueItem.unit : machineHealthItem?.unit ?? '',
        key: '',
        duration: (valueItem && valueItem.duration) ?? '',
        status: status,
        unitTitle: '',
        unitTitleColor: '',
        target: valueItem.target
      };

      if (valueItem.kpiType === 'BeltSpeed') {
        if (machineStatus !== MachineStateNames.Running) {
          values[2].value = '-';
        }
      }
    } else {
      values[index] = {
        value: value ?? '-',
        valueTitle: valueItem && valueItem.title,
        unit: valueItem.unit ? valueItem.unit : machineHealthItem?.unit ?? '',
        key: '',
        duration: (valueItem && valueItem.duration) ?? '',
        status: status,
        unitTitle: '',
        unitTitleColor: '',
        target: valueItem.target
      };

      if (valueItem.kpiType === 'BeltSpeed') {
        if (machineStatus !== MachineStateNames.Running) {
          values[index].value = '-';
        }
      }
    }
  });

  const item: MachineKpiItem = {
    title: t(
      kpi.key && kpi.key.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`).replace(/(^_)/g, '')
    ),
    kpiType: (kpi && kpi.key) ?? '',
    value1: values && values[0],
    value2: values && values[1],
    value3: values && values[2],
    status: values && values[0] && values[0].status
  };

  const { value1, value2, value3, status } = item;

  let kpiValues = value1 || value2 || value3 ? [{}] : undefined;
  let kpiProgress;

  // TODO: Clean this up, it's coded this way to pass typeScript checks
  if (kpiValues) {
    if (value1) {
      kpiValues = [
        {
          units: value1.unit as string,
          value: value1.value as string,
          duration: value1.duration as string,
          target: value1.target,
          title: value1.valueTitle
        }
      ];
    }

    if (value2)
      kpiValues.push({
        units: value2.unit as string,
        value: value2.value as string,
        duration: value2.duration as string,
        target: value2.target,
        title: value2.valueTitle
      });

    if (value3)
      kpiValues.push({
        units: value3.unit as string,
        value: value3.value as string,
        duration: value3.duration as string,
        target: value3.target,
        title: value3.valueTitle
      });

    let kpiTargetVal;
    // filter values to take out target with 0 and set targetVal if present for progress bar
    kpiValues = kpiValues
      .map(({ target, value, ...rest }: { target?: boolean; value?: string }) => {
        if (target && value !== '0') {
          kpiTargetVal = Number(replace(`${value}`, `,`, ``));
        }
        return { target, value, ...rest }; // target && value === '0' ? '-' : { target, value, ...rest };
      })
      .filter((x) => x);

    if (value1?.value && kpiTargetVal) {
      const kpiCurrent = Number(replace(`${value1.value}`, `,`, ``));
      kpiProgress = round((kpiCurrent / kpiTargetVal) * 100, 2);
    }
  }

  const widgetSettings = {
    ga,
    gridArea,
    title: item && t(item.title),
    isLoading: isLoadingValue ? true : false,
    hasStatus: status !== '' ? status : undefined,
    TitleIcon,
    hideStatusIcon,
    kpiValues,
    kpiProgress
  };

  return <KPICardWidget {...widgetSettings} />;
};

interface Props {
  kpi: {
    key: string;
    values: {
      kpiType: DSIKPIType;
      interval: MachineHealthInterval;
      includeHistoricData: boolean;
      title?: string;
      duration?: string;
      unit?: string;
      target?: boolean;
    }[];
  };
  height?: string;
  size?: string;
  weight?: 'bold' | 'medium' | 'normal' | undefined;
  mb?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  hideStatusIcon?: boolean;
}

const KPIWidget = ({
  kpi,
  height,
  size,
  weight,
  mb,
  rightIcon,
  leftIcon,
  hideStatusIcon
}: Props): ReactElement => {
  const { machineId } = useParams<{ machineId: string }>();
  const { t } = useTranslation(['mh']);
  const getLastValue = (item: MachineHealthKpiItem | undefined) => {
    return item && item.values && last(item.values);
  };

  const getValue = (item: MachineHealthKpiItem | undefined) => {
    return item && item.value && item.value;
  };

  let target = 0;
  const values: Value[] = [];
  let isLoadingValue = false;
  kpi.values.forEach((valueItem, index) => {
    const { machineHealth, isLoading: isLoading } = useMachineHealthByBuKpi(
      machineId,
      valueItem.kpiType,
      valueItem.interval ?? MachineHealthInterval.LastHour,
      valueItem.includeHistoricData,
      BusinessUnit.DSI
    );

    isLoadingValue = isLoading;
    const machineHealthItem = machineHealth && machineHealth[0];
    const machineHealthHolder = valueItem.includeHistoricData
      ? getLastValue(machineHealthItem)
      : getValue(machineHealthItem);

    const roundedValue =
      machineHealthHolder && machineHealthHolder.value && round(machineHealthHolder.value, 0);
    let value = (roundedValue && roundedValue.toLocaleString()) ?? '-';

    if (valueItem.target) {
      const targetValue =
        machineHealthHolder && machineHealthHolder.target && round(machineHealthHolder.target, 0);
      target = targetValue ?? 0;
      value = (targetValue && targetValue.toLocaleString()) ?? '-';
    }

    const status =
      machineHealthHolder && machineHealthHolder.status && !valueItem.target
        ? machineHealthHolder.status
        : '';

    if (kpi.values.length === 1) {
      values[2] = {
        value: value ?? '-',
        valueTitle: valueItem && valueItem.title,
        unit: valueItem.unit ? valueItem.unit : machineHealthItem?.unit ?? '',
        key: '',
        duration: (valueItem && valueItem.duration) ?? '',
        status: status,
        unitTitle: '',
        unitTitleColor: ''
      };
    } else {
      values[index] = {
        value: value ?? '-',
        valueTitle: valueItem && valueItem.title,
        unit: valueItem.unit ? valueItem.unit : machineHealthItem?.unit ?? '',
        key: '',
        duration: (valueItem && valueItem.duration) ?? '',
        status: status,
        unitTitle: '',
        unitTitleColor: ''
      };
    }
  });

  const item: MachineKpiItem = {
    title: t(
      kpi.key && kpi.key.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`).replace(/(^_)/g, '')
    ),
    kpiType: (kpi && kpi.key) ?? '',
    value1: values && values[0],
    value2: values && values[1],
    value3: values && values[2],
    status: values && values[0] && values[0].status
  };

  let progressCalculated;

  if (
    (kpi.key === DSIKPIType.ThroughputPieceCount || kpi.key === DSIKPIType.ThroughputRate) &&
    target !== 0 &&
    item.value1 &&
    item.value1.value
  ) {
    const currentValue = item.value1.value;
    const currentValueNumber = currentValue
      ? parseInt(replace(`${item.value1.value}`, ',', ''))
      : undefined;
    progressCalculated = currentValueNumber
      ? round((currentValueNumber / target) * 100, 2)
      : undefined;
  }
  const renderValues = (innerValues: Value[]) => {
    return innerValues.map((innerValue: Value, index) => {
      return (
        <Column key={index}>
          <Typography
            size="1.125rem"
            weight="semi-bold"
            mb="0.3125rem"
            color={theme.colors.darkGrey}
            style={{ marginTop: 0, textAlign: 'center' }}
          >
            {innerValue.value}
          </Typography>
          <Typography
            size="1.3125rem"
            mb={0}
            color={theme.colors.mediumGrey2}
            style={{ marginTop: 0, textAlign: 'center' }}
          >
            {innerValue.unit}
          </Typography>
        </Column>
      );
    });
  };
  return (
    <DataRenderer isLoading={isLoadingValue}>
      <KPIInformationWidget
        mb={mb ? mb : '1.25rem'}
        title={item && (t(item.title) as string)}
        size={size}
        weight={weight}
        height={height ? height : '18.75rem'}
        status={item && item.status}
        rightIcon={rightIcon}
        leftIcon={leftIcon}
        hideStatusIcon={hideStatusIcon}
        progressBarValue={{
          value: progressCalculated != 0 ? progressCalculated : undefined,
          status: item && item.status ? item.status : MachineHealthKpiStatus.NA
        }}
      >
        {item && item.value1 && item.value2 && (
          <TwoColumnCard
            values={[
              {
                key: item && item.value1.key,
                valueTitle: item && item.value1.valueTitle,
                mb: '0.3125rem',
                value: (
                  <>
                    <Typography
                      as="span"
                      size="1.6875rem"
                      weight="bold"
                      mb={0}
                      color={getColor((item && item.value1.status) ?? MachineHealthKpiStatus.NA)}
                    >
                      {item && item.value1.value}
                      <span style={{ fontSize: '1rem' }}> {item && item.value1.unit} </span>
                    </Typography>
                  </>
                ),
                size: '1.3125rem',
                unit: (item && item.value1.duration) ?? '',
                unitSize: '1rem',
                unitTitle: (item && item.value1.unitTitle) ?? '',
                unitTitleColor: (item && item.value1.unitTitleColor) ?? ''
              },
              {
                key: item && item.value2.key,
                valueTitle: item && item.value2.valueTitle,
                mb: '0.3125rem',
                value: (
                  <>
                    <Typography
                      as="span"
                      size="1.6875rem"
                      weight="bold"
                      mb={0}
                      color={getColor((item && item.value2.status) ?? MachineHealthKpiStatus.NA)}
                    >
                      {item && item.value2.value}
                      <span style={{ fontSize: '1rem' }}> {item && item.value2.unit} </span>
                    </Typography>
                  </>
                ),
                size: '1.3125rem',
                unit: (item && item.value2.duration) ?? '',
                unitSize: '1rem',
                unitTitle: (item && item.value2.unitTitle) ?? '',
                unitTitleColor: (item && item.value2.unitTitleColor) ?? ''
              }
            ]}
          />
        )}
        {item && item.value3 && (
          <SingleValueCard
            value1={{
              value: (
                <>
                  <Typography
                    style={{ marginTop: kpi.key === DSIKPIType.BeltSpeed ? 50 : 10 }}
                    size={
                      kpi &&
                      (kpi.key === DSIKPIType.PumpPressure || kpi.key === DSIKPIType.BeltSpeed)
                        ? '2rem'
                        : '1.125rem'
                    }
                    weight="bold"
                    mb={0}
                    color={getColor((item && item.value3.status) ?? MachineHealthKpiStatus.NA)}
                  >
                    {item && item.value3 && item.value3.value}
                    <span style={{ fontSize: '1rem' }}> {item && item.value3.unit} </span>
                  </Typography>
                </>
              ),
              unit: (item && item.value3 && item.value3.duration) ?? '',
              unitSize: '1rem',
              mb: '0.3125rem'
            }}
          />
        )}
        {item && item.values && <Row>{renderValues(item.values)}</Row>}
      </KPIInformationWidget>
    </DataRenderer>
  );
};

export default KPIWidget;
