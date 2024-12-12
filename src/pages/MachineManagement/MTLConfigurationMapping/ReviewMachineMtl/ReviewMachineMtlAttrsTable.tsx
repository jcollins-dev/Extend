// Third Party
import {
  BaseSelect,
  BaseTable,
  Button,
  Checkbox,
  Indicator,
  Input,
  Modal,
  Typography,
  TooltipWrapper,
  ReviewTableLabel
} from 'components';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme, DefaultTheme } from 'styled-components';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';

import { BaseType, ChangeEvent, ColumnConfig, DigitalEdgeType, ModalSize } from 'types';
import {
  ReviewMachineMtlAttrsDsdm,
  ReviewMachineMtlAttrsKdm,
  ReviewMachineMtlAttrsMqtt,
  ReviewMachineMtlDsdm,
  ReviewMachineMtlKdm,
  ReviewMachineMtlMqtt,
  ScaledDataType,
  ScalingOptions,
  ScanRate,
  UpdateRowValueFunc,
  ReviewMachinePlgTagNameValidCheck,
  DataType
} from 'types/machine-management';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { KDMOptionalColumns, DSDMOpitonalColumns } from 'constants/optionalmtltablecolumns';
interface ReviewMachineMtlAttrsTableProps {
  reviewMachineMtlData: ReviewMachineMtlKdm | ReviewMachineMtlDsdm | ReviewMachineMtlMqtt;
  digitalEdgeType: DigitalEdgeType;
  onRowUpdate: UpdateRowValueFunc;
  showColumnOptions?: boolean;
  setShowcolumOptions?: React.Dispatch<React.SetStateAction<boolean>>;
}
interface OptionalColumnsState {
  key: string;
  name: string;
  isSelected: boolean;
}
const InputWrapper = styled.div`
  gap: 0.25rem;
  display: flex;
  flex-direction: row;
  position: relative;
  width: max-content;

  select {
    padding-right: 2rem;
  }

  input {
    width: 10rem;
  }
`;
const LabelWrapper = styled.div`
  gap: 0.25rem;
  display: flex;
  flex-direction: row;
  position: relative;
  cursor: pointer;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  justify-content: left;
`;
const OptionColumnCheckboxWrapper = styled.div`
  display: flex;
  justify-content: left;
  border: 0.125rem solid ${(props) => props.theme.colors.lightGrey6};
  padding: 0.625rem;
  border-radius: 0.313rem;
  margin-bottom: 0.625rem;
`;
const SelectionHeader = styled.div`
  margin-left: 1rem;
`;
const StyledTableWrapper = styled.div`
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const StyledIndicator = styled(Indicator)`
  cursor: pointer;

  margin: 0;
`;

const WarningIconContainer = styled.div`
  cursor: pointer;
  position: absolute;
  right: 0.5rem;
  top: 0.25rem;
`;

const OptionsModalContainer = styled.div`
  width: 100%;
  padding: 0.5rem 2rem;

  p {
    margin-bottom: 0.5rem;
  }
`;
const OptionalColumnName = styled.div`
  margin-left: 0.625rem;
`;
const OptionalColumnContainer = styled.div`
  width: 100%;
  padding: 0.625rem 0.75rem;
  height: 30rem;
  overflow: scrool;
  margin-bottom: 0.5rem;
`;
const SelectAllOptionalColumn = styled.div`
  display: flex;
  padding: 0.625rem 0.75rem;
`;
const ModalButtonsContainer = styled.div`
  width: 100%;
  padding-right: 0.75rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: white;

  button {
    margin: 1rem;
    width: auto;
  }
`;
type TableRow = ReviewMachineMtlAttrsKdm | ReviewMachineMtlAttrsDsdm | ReviewMachineMtlAttrsMqtt;
export const isValidPlcTagName = (
  tagName: string | undefined
): ReviewMachinePlgTagNameValidCheck => {
  const underScore = '_';
  const spaceSymbol = ' ';

  const illegalCharacter: string[] = ['.', '"', '@'];
  if (tagName) {
    if (tagName.startsWith(underScore)) {
      return {
        isValid: false,
        errorMessage: 'Cannot start with an underscore'
      };
    }
    if (tagName.includes(spaceSymbol)) {
      return {
        isValid: false,
        errorMessage: 'Cannot start with a space'
      };
    }
    tagName = tagName.trim();
    for (const char of illegalCharacter) {
      if (tagName.includes(char)) {
        let errorMessage = '';
        if (char === '.') {
          errorMessage = 'Cannot contain periods';
        } else if (char === '"') {
          errorMessage = 'Cannot contain double quotes';
        } else {
          errorMessage = 'Cannot contain @';
        }
        return {
          isValid: false,
          errorMessage: errorMessage
        };
      }
    }
    // return !tagName.startsWith(underScore) && !containsIllegalCharacter;
  }
  return {
    isValid: true,
    errorMessage: 'No error'
  };
};
const filterVisibleColumns = (options: string[], cols: ColumnConfig[]): ColumnConfig[] => {
  return cols.filter(
    (col) => col.hide == false || (options && options.includes(col.key as string))
  );
  //return cols;
};
const generateColumnConfigs = ({
  digitalEdgeType,
  theme,
  updateRow,
  t,
  colOptions
}: {
  digitalEdgeType: DigitalEdgeType;
  theme: DefaultTheme;
  updateRow: UpdateRowValueFunc;
  t: TFunction<'fpns'[], undefined>;
  colOptions: string[];
}): ColumnConfig[] => {
  switch (digitalEdgeType) {
    case DigitalEdgeType.KDM:
      return filterVisibleColumns(colOptions, [
        {
          title: t('status') as string,
          dataIndex: 'isValid',
          key: 'isValid',
          hide: false,

          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            if (data.isDuplicate) {
              data.isValid = false;
            }
            return data.isValid ? (
              <StyledIndicator color={theme.colors.onTrackGreen}>
                {t('valid', { ns: 'common' })}
              </StyledIndicator>
            ) : (
              <StyledIndicator color={theme.colors.negativeRed}>
                {t('error', { ns: 'common' })}
              </StyledIndicator>
            );
          }
        },
        {
          title: t('master_tag_name') as string,
          dataIndex: 'masterTagName',
          key: 'masterTagName',

          hide: false,
          render(value) {
            return (
              <LabelWrapper>
                <ReviewTableLabel value={value} />
              </LabelWrapper>
            );
          }
        },
        {
          title: t('plc_tag_name_*') as string,
          dataIndex: 'plcTagName',
          key: 'plcTagName',

          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            const validPlcTagName = isValidPlcTagName(data.plcTagName);
            return (
              <LabelWrapper>
                <ReviewTableLabel value={data.plcTagName} />
                {(!data.plcTagName ||
                  data?.plcTagName.length === 0 ||
                  !validPlcTagName.isValid ||
                  data.isDuplicate) && (
                  <WarningIconContainer>
                    <TooltipWrapper
                      Tooltip={
                        !validPlcTagName.isValid
                          ? validPlcTagName.errorMessage
                          : data.isDuplicate
                          ? 'PLC tag name must be unique'
                          : 'PLC Tag Name is required'
                      }
                    >
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </LabelWrapper>
            );
          }
        },
        {
          title: t('plc_address_*') as string,
          dataIndex: 'plcTagAddress',
          key: 'plcTagAddress',

          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            return (
              <LabelWrapper>
                <ReviewTableLabel value={data.plcTagAddress} />
                {(!data.plcTagAddress || data?.plcTagAddress.length === 0) && (
                  <WarningIconContainer>
                    <TooltipWrapper Tooltip="PLC Address is required">
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </LabelWrapper>
            );
          }
        },
        {
          title: t('master_description') as string,
          dataIndex: 'masterDescription',
          key: 'masterDescription',

          hide: false,
          render(value) {
            const description = value as string;
            return (
              <LabelWrapper>
                <ReviewTableLabel value={description} />
              </LabelWrapper>
            );
          }
        },
        {
          title: t('machine_description') as string,
          dataIndex: 'machineDescription',
          key: 'machineDescription',

          hide: true,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            return (
              <InputWrapper>
                <ReviewTableLabel value={data.machineDescription} />
              </InputWrapper>
            );
          }
        },
        {
          title: t('master_data_type') as string,
          dataIndex: 'masterDataType',
          key: 'masterDataType',

          hide: false,
          render(value) {
            return (
              <LabelWrapper>
                <ReviewTableLabel value={value} />
              </LabelWrapper>
            );
          }
        },
        {
          title: t('machine_data_type_*') as string,
          dataIndex: 'machineDataType',
          key: 'machineDataType',

          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            const selectType: Record<string, unknown> = DataType;
            return (
              <InputWrapper>
                <BaseSelect
                  value={data.machineDataType as string}
                  variant="white"
                  options={Object.keys(selectType).map((key) => {
                    const currentValue = selectType[key] as string;
                    return { label: currentValue.replaceAll('_', ' '), value: currentValue };
                  })}
                  handleChange={(event) => {
                    updateRow(data.rowId, 'machineDataType', event.target.value as string);
                  }}
                />
                {(!data.machineDataType || data?.machineDataType.length === 0) && (
                  <WarningIconContainer>
                    <TooltipWrapper Tooltip="Machine Data Type is required">
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </InputWrapper>
            );
          }
        },
        {
          title: t('omniblu_tag_name') as string,
          dataIndex: 'omnibluTagName',
          key: 'omnibluTagName',

          hide: true,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('master_scan_rate') as string,
          dataIndex: 'masterScanRate',
          key: 'masterScanRate',

          hide: false,
          render(value) {
            return (
              <LabelWrapper>
                <ReviewTableLabel value={value} />
              </LabelWrapper>
            );
          }
        },
        {
          title: (t('machine_scan_rate') + '*') as string,
          dataIndex: 'machineScanRate',
          key: 'machineScanRate',

          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            const scanRateOptions: { label: string; value: string }[] = Object.keys(ScanRate).map(
              (key: string) => ({
                label: ScanRate[key as keyof typeof ScanRate],
                value: ScanRate[key as keyof typeof ScanRate]
              })
            );
            return (
              <InputWrapper>
                <BaseSelect
                  options={scanRateOptions}
                  variant="white"
                  value={data.machineScanRate ?? ''}
                  handleChange={(event) => {
                    updateRow(data.rowId, 'machineScanRate', event.target.value as string);
                  }}
                />
                {(!data.machineScanRate || data?.machineScanRate.length === 0) && (
                  <WarningIconContainer>
                    <TooltipWrapper Tooltip="Machine Scan Rate is required">
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </InputWrapper>
            );
          }
        },
        {
          title: t('master_change_threshold') as string,
          dataIndex: 'masterChangeThreshold',
          key: 'masterChangeThreshold',
          hide: false,
          render(value) {
            return (
              <LabelWrapper>
                <ReviewTableLabel value={value} />
              </LabelWrapper>
            );
          }
        },
        {
          title: (t('machine_change_threshold') + '*') as string,
          dataIndex: 'machineChangeThreshold',
          key: 'machineChangeThreshold',

          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            return (
              <InputWrapper>
                <Input
                  style={{width: '5rem'}}
                  type="number"
                  variant="white"
                  placeholder={t('machine_change_threshold') + '*'}
                  value={data.machineChangeThreshold}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineChangeThreshold', event.target.value as string)
                  }
                />

                {data.machineChangeThreshold === undefined && (
                  <WarningIconContainer>
                    <TooltipWrapper Tooltip="Machine Change Threshold is required">
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </InputWrapper>
            );
          }
        },
        {
          title: (t('machine_scaling') + '*') as string,
          dataIndex: 'machineScaling',
          key: 'machineScaling',

          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            const scalingOptions: { label: string; value: string }[] = Object.keys(
              ScalingOptions
            ).map((key: string) => ({
              label: ScalingOptions[key as keyof typeof ScalingOptions],
              value: ScalingOptions[key as keyof typeof ScalingOptions]
            }));
            return (
              <InputWrapper>
                <BaseSelect
                  options={scalingOptions}
                  variant="white"
                  value={data.machineScaling ?? ''}
                  handleChange={(event) => {
                    updateRow(data.rowId, 'machineScaling', event.target.value as string);
                  }}
                />
                {(!data.machineScaling || data?.machineScaling.length === 0) && (
                  <WarningIconContainer>
                    <TooltipWrapper Tooltip="Machine Scaling is required">
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </InputWrapper>
            );
          }
        },
        {
          title: t('machine_scaled_data_type') as string,
          dataIndex: 'machineScaledDataType',
          key: 'machineScaledDataType',

          hide: true,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            const scaledDataTypeOptions: { label: string; value: string }[] = Object.keys(
              ScaledDataType
            ).map((key: string) => ({
              label: ScaledDataType[key as keyof typeof ScaledDataType],
              value: ScaledDataType[key as keyof typeof ScaledDataType]
            }));
            return (
              <InputWrapper>
                <BaseSelect
                  options={scaledDataTypeOptions}
                  variant="white"
                  value={data.machineScaledDataType ?? ''}
                  handleChange={(event) => {
                    updateRow(data.rowId, 'machineScaledDataType', event.target.value as string);
                  }}
                />
              </InputWrapper>
            );
          }
        },
        {
          title: t('machine_raw_high') as string,
          dataIndex: 'machineRawHigh',
          key: 'machineRawHigh',

          hide: true,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            return (
              <InputWrapper>
                <Input
                  variant="white"
                  placeholder={t('machine_raw_high')}
                  value={data.machineRawHigh}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineRawHigh', event.target.value as string)
                  }
                />
              </InputWrapper>
            );
          }
        },
        {
          title: t('machine_raw_low') as string,
          dataIndex: 'machineRawLow',
          key: 'machineRawLow',

          hide: true,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            return (
              <InputWrapper>
                <Input
                  variant="white"
                  placeholder={t('machine_raw_low')}
                  value={data.machineRawLow}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineRawLow', event.target.value as string)
                  }
                />
              </InputWrapper>
            );
          }
        },
        {
          title: t('machine_scaled_high') as string,
          dataIndex: 'machineScaledHigh',
          key: 'machineScaledHigh',

          hide: true,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            return (
              <InputWrapper>
                <Input
                  variant="white"
                  placeholder={t('machine_scaled_high')}
                  value={data.machineScaledHigh}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineScaledHigh', event.target.value as string)
                  }
                />
              </InputWrapper>
            );
          }
        },
        {
          title: t('machine_scaled_low') as string,
          dataIndex: 'machineScaledLow',
          key: 'machineScaledLow',

          hide: true,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsKdm;
            return (
              <InputWrapper>
                <Input
                  variant="white"
                  placeholder={t('machine_scaled_low')}
                  value={data.machineScaledLow}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineScaledLow', event.target.value as string)
                  }
                />
              </InputWrapper>
            );
          }
        },
        {
          title: t('unit_of_measure') as string,
          dataIndex: 'unitOfMeasure',
          key: 'unitOfMeasure',

          hide: true,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('used_by') as string,
          dataIndex: 'usedBy',
          key: 'usedBy',

          hide: true,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        }
      ]);
      break;
    case DigitalEdgeType.DSDM:
      return filterVisibleColumns(colOptions, [
        {
          title: t('status') as string,
          dataIndex: 'isValid',
          key: 'isValid',

          hide: false,
          render(value) {
            return value ? (
              <StyledIndicator color={theme.colors.onTrackGreen}>
                {t('valid', { ns: 'common' })}
              </StyledIndicator>
            ) : (
              <StyledIndicator color={theme.colors.negativeRed}>
                {t('error', { ns: 'common' })}
              </StyledIndicator>
            );
          }
        },
        {
          title: t('master_sql_table') as string,
          dataIndex: 'sqlTableName',
          key: 'sqlTableName',

          hide: false,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('machine_sql_table_*') as string,
          dataIndex: 'tableName',
          key: 'tableName',

          hide: true,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsDsdm;
            return (
              <InputWrapper>
                <Input
                  value={data.tableName}
                  variant="white"
                  placeholder={t('machine_sql_table_*')}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'tableName', event.target.value as string)
                  }
                />
                {(!data.tableName || data?.tableName.length === 0) && (
                  <WarningIconContainer>
                    <TooltipWrapper Tooltip="Table Name is required">
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </InputWrapper>
            );
          }
        },
        {
          title: t('master_sql_column') as string,
          dataIndex: 'sqlColumnName',
          key: 'sqlColumnName',

          hide: false,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('machine_sql_column') as string,
          dataIndex: 'indexColumn',
          key: 'indexColumn',

          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsDsdm;
            return (
              <InputWrapper>
                <Input
                  value={data.indexColumn}
                  placeholder={t('machine_sql_column')}
                  variant="white"
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'indexColumn', event.target.value as string)
                  }
                />
              </InputWrapper>
            );
          }
        },
        {
          title: t('machine_is_primary_key') as string,
          dataIndex: 'machineIsPrimaryKey',
          key: 'machineIsPrimaryKey',

          hide: true,
          render(value, record: ReviewMachineMtlAttrsDsdm) {
            return (
              <CheckboxWrapper>
                <Checkbox
                  width={20}
                  height={20}
                  label=""
                  checked={record.machineIsPrimaryKey as boolean}
                  onChange={(event: ChangeEvent) =>
                    updateRow(record.rowId, 'machineIsPrimaryKey', event.target.checked)
                  }
                />
              </CheckboxWrapper>
            );
          }
        },
        {
          title: t('master_description') as string,
          dataIndex: 'masterDescription',
          key: 'masterDescription',

          hide: false,
          render(value) {
            const description = value as string;
            return <ReviewTableLabel value={description} />;
          }
        },
        {
          title: t('machine_description') as string,
          dataIndex: 'machineDescription',
          key: 'machineDescription',

          hide: true,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsDsdm;
            return (
              <InputWrapper>
                <Input
                  value={data.machineDescription}
                  variant="white"
                  placeholder={t('machine_description')}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineDescription', event.target.value as string)
                  }
                />
              </InputWrapper>
            );
          }
        },
        {
          title: t('master_data_type') as string,
          dataIndex: 'masterDataType',
          key: 'masterDataType',

          hide: false,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('machine_data_type_*') as string,
          dataIndex: 'machineDataType',
          key: 'machineDataType',

          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsDsdm;
            return (
              <InputWrapper>
                <Input
                  value={data.machineDataType}
                  variant="white"
                  placeholder={t('machine_data_type_*')}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineDataType', event.target.value as string)
                  }
                />
                {(!data.machineDataType || data?.machineDataType.length === 0) && (
                  <WarningIconContainer>
                    <TooltipWrapper Tooltip="Machine Data Type is required">
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </InputWrapper>
            );
          }
        },
        {
          title: t('omniblu_tag_name') as string,
          dataIndex: 'omnibluTagName',
          key: 'omnibluTagName',

          hide: true,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('unit_of_measure') as string,
          dataIndex: 'unitOfMeasure',
          key: 'unitOfMeasure',

          hide: true,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('used_by') as string,
          dataIndex: 'usedBy',
          key: 'usedBy',

          hide: true,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        }
      ]);
    case DigitalEdgeType.MQTT:
      return [
        {
          title: t('status') as string,
          dataIndex: 'isValid',
          key: 'isValid',
          width: '5%',
          hide: false,
          render(value) {
            return value ? (
              <StyledIndicator color={theme.colors.onTrackGreen}>
                {t('valid', { ns: 'common' })}
              </StyledIndicator>
            ) : (
              <StyledIndicator color={theme.colors.negativeRed}>
                {t('error', { ns: 'common' })}
              </StyledIndicator>
            );
          }
        },
        {
          title: t('master_topic') as string,
          dataIndex: 'masterTopicName',
          key: 'masterTopicName',
          width: '8%',
          hide: false,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('machine_topic_*') as string,
          dataIndex: 'machineTopicName',
          key: 'machineTopicName',
          width: '10%',
          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsMqtt;
            return (
              <InputWrapper>
                <Input
                  value={data.machineTopicName}
                  variant="white"
                  placeholder={t('machine_topic_*')}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineTopicName', event.target.value as string)
                  }
                />
                {(!data.machineTopicName || data?.machineTopicName.length === 0) && (
                  <WarningIconContainer>
                    <TooltipWrapper Tooltip="Machine Topic Name is required">
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </InputWrapper>
            );
          }
        },
        {
          title: t('master_tag_name') as string,
          dataIndex: 'masterTagName',
          key: 'masterTagName',
          width: '8%',
          hide: false,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('machine_tag_name') as string,
          dataIndex: 'machineTagName',
          key: 'machineTagName',
          width: '10%',
          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsMqtt;
            return (
              <InputWrapper>
                <Input
                  variant="white"
                  placeholder={t('machine_tag_name')}
                  value={data.machineTagName}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineTagName', event.target.value as string)
                  }
                />
              </InputWrapper>
            );
          }
        },
        {
          title: t('master_description') as string,
          dataIndex: 'masterDescription',
          key: 'masterDescription',
          width: '11%',
          hide: false,
          render(value) {
            const description = value as string;
            return <ReviewTableLabel value={description} />;
          }
        },
        {
          title: t('machine_description') as string,
          dataIndex: 'machineDescription',
          key: 'machineDescription',
          width: '10%',
          hide: false,
          render(value, record) {
            const data = record as ReviewMachineMtlAttrsMqtt;
            return (
              <InputWrapper>
                <Input
                  variant="white"
                  placeholder={t('machine_description')}
                  value={data.machineDescription}
                  onChange={(event: ChangeEvent) =>
                    updateRow(data.rowId, 'machineDescription', event.target.value as string)
                  }
                />
              </InputWrapper>
            );
          }
        },
        {
          title: t('master_data_type') as string,
          dataIndex: 'masterDataType',
          key: 'masterDataType',
          width: '6%',
          hide: false,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('omniblu_tag_name') as string,
          dataIndex: 'omnibluTagName',
          key: 'omnibluTagName',
          width: '7%',
          hide: false,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('unit_of_measure') as string,
          dataIndex: 'unitOfMeasure',
          key: 'unitOfMeasure',
          width: '5%',
          hide: false,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        },
        {
          title: t('used_by') as string,
          dataIndex: 'usedBy',
          key: 'usedBy',
          width: '8%',
          hide: false,
          render(value) {
            return <ReviewTableLabel value={value} />;
          }
        }
      ];
  }
};

const detectAndMarkDuplicates = (
  attributes: ReviewMachineMtlAttrsKdm[] | ReviewMachineMtlAttrsDsdm[] | ReviewMachineMtlAttrsMqtt[]
): ReviewMachineMtlAttrsKdm[] | ReviewMachineMtlAttrsDsdm[] | ReviewMachineMtlAttrsMqtt[] => {
  if (attributes) {
    const hash = new Map();
    attributes.forEach((item, index) => {
      if (hash.has(item.plcTagName)) {
        attributes[hash.get(item.plcTagName)].isDuplicate = true;
        item.isDuplicate = true;
      } else {
        hash.set(item.plcTagName, index);
        item.isDuplicate = false;
      }
    });
  }
  return attributes;
};
const ReviewMachineMtlAttrsTable: FC<ReviewMachineMtlAttrsTableProps> = ({
  reviewMachineMtlData,
  digitalEdgeType,
  onRowUpdate,
  showColumnOptions,
  setShowcolumOptions
}: ReviewMachineMtlAttrsTableProps): ReactElement => {
  const { t } = useTranslation(['mh', 'common']);
  const theme = useTheme();
  const [colOptions, setcolOptions] = useState<string[]>([]);
  const [KDMColumns, setKDMColumns] = useState<OptionalColumnsState[]>([]);
  const [DSDMColumns, setDSDMColumns] = useState<OptionalColumnsState[]>([]);
  const [selectAllOptionalColumns, setSelectAllOptionalColumns] = useState<boolean>(false);
  const [EnableOptionSave, setEnableOptionSave] = useState<boolean>(false);
  useEffect(() => {
    if (digitalEdgeType === 'KDM' && KDMColumns.length === 0) {
      KDMOptionalColumns.forEach((opt) => {
        KDMColumns.push({ key: camelCase(opt), name: opt, isSelected: false });
      });
    }
    if (digitalEdgeType === 'DSDM' && DSDMColumns.length === 0) {
      DSDMOpitonalColumns.forEach((opt) => {
        DSDMColumns.push({ key: camelCase(opt), name: opt, isSelected: false });
      });
    }
  });
  reviewMachineMtlData.attributes = detectAndMarkDuplicates(reviewMachineMtlData.attributes);
  KDMColumns.sort((a, b) => a.name.localeCompare(b.name));
  DSDMColumns.sort((a, b) => a.name.localeCompare(b.name));
  let mtlAttrsDataDigitalEdge:
    | ReviewMachineMtlAttrsKdm[]
    | ReviewMachineMtlAttrsDsdm[]
    | ReviewMachineMtlAttrsMqtt[] = [];
  switch (digitalEdgeType) {
    case DigitalEdgeType.KDM:
      mtlAttrsDataDigitalEdge = reviewMachineMtlData?.attributes as ReviewMachineMtlAttrsKdm[];
      break;
    case DigitalEdgeType.DSDM:
      mtlAttrsDataDigitalEdge = reviewMachineMtlData?.attributes as ReviewMachineMtlAttrsDsdm[];
      break;
    case DigitalEdgeType.MQTT:
      mtlAttrsDataDigitalEdge = reviewMachineMtlData?.attributes as ReviewMachineMtlAttrsMqtt[];
      break;
    default:
      mtlAttrsDataDigitalEdge = [];
      break;
  }
  const onCloseCommentModal = () => {
    /* eslint-disable  @typescript-eslint/no-non-null-assertion */
    setShowcolumOptions!(false);
  };
  const handleOptionChange = (name: string, isSelected: boolean) => {
    if (digitalEdgeType === DigitalEdgeType.KDM) {
      KDMColumns.forEach((col) => {
        if (col.name === name) {
          col.isSelected = !isSelected;
        }
      });
      setKDMColumns([...KDMColumns]);
    } else if (digitalEdgeType === DigitalEdgeType.DSDM) {
      DSDMColumns.forEach((col) => {
        if (col.name === name) {
          col.isSelected = !isSelected;
        }
      });
      setDSDMColumns([...DSDMColumns]);
    }
    handleEnableSave();
  };
  const handleSelectAllOptionsChange = () => {
    if (digitalEdgeType === DigitalEdgeType.KDM) {
      KDMColumns.forEach((col) => {
        col.isSelected = !selectAllOptionalColumns;
      });
      setKDMColumns([...KDMColumns]);
    }
    setSelectAllOptionalColumns(!selectAllOptionalColumns);
    handleEnableSave();
  };
  const handleEnableSave = () => {
    setEnableOptionSave(true);
  };
  const handleOptionSelectionSave = () => {
    let optionList: OptionalColumnsState[] = [];
    if (digitalEdgeType === DigitalEdgeType.KDM) {
      optionList = KDMColumns;
    } else if (digitalEdgeType === DigitalEdgeType.DSDM) {
      optionList = DSDMColumns;
    }
    optionList.forEach((col) => {
      if (col.isSelected) {
        if (!colOptions.includes(col.key)) {
          colOptions.push(col.key);
        }
      } else if (colOptions.includes(col.key)) {
        colOptions.splice(colOptions.indexOf(col.key), 1);
      }
    });
    setcolOptions([...colOptions]);
    onCloseCommentModal();
  };
  return (
    <StyledTableWrapper id="reviewTagsPageTab">
      <Modal
        onClose={onCloseCommentModal}
        size={ModalSize.XXSMALL_AUTO_HEIGHT}
        title="Column Options"
        visible={showColumnOptions as boolean}
        widthOverride="25rem"
      >
        <OptionsModalContainer>
          <SelectionHeader>
            <Typography variant="body2" color={theme.colors.darkGrey}>
              Select columns to show
            </Typography>
          </SelectionHeader>

          <OptionalColumnContainer>
            {digitalEdgeType === 'KDM' &&
              KDMColumns.map((opt, index) => {
                return (
                  <OptionColumnCheckboxWrapper key={index}>
                    <Checkbox
                      key={index}
                      id={`${opt.name}-${index}`}
                      width={20}
                      height={20}
                      checked={opt.isSelected}
                      onChange={() => {
                        handleOptionChange(opt.name, opt.isSelected);
                      }}
                    />
                    <OptionalColumnName>{opt.name}</OptionalColumnName>
                  </OptionColumnCheckboxWrapper>
                );
              })}
            {digitalEdgeType === 'DSDM' &&
              DSDMColumns.map((opt, index) => {
                return (
                  <OptionColumnCheckboxWrapper key={index}>
                    <Checkbox
                      key={index}
                      id={`${opt.name}-${index}`}
                      width={20}
                      height={20}
                      checked={opt.isSelected}
                      onChange={() => {
                        handleOptionChange(opt.name, opt.isSelected);
                      }}
                    />
                    <OptionalColumnName>{opt.name}</OptionalColumnName>
                  </OptionColumnCheckboxWrapper>
                );
              })}
          </OptionalColumnContainer>
          <SelectAllOptionalColumn>
            <Checkbox
              id={`opt-all`}
              width={15}
              height={15}
              checked={selectAllOptionalColumns}
              onChange={() => {
                handleSelectAllOptionsChange();
              }}
            />
            <OptionalColumnName>Select All</OptionalColumnName>
          </SelectAllOptionalColumn>
        </OptionsModalContainer>
        <ModalButtonsContainer>
          <Button onClick={onCloseCommentModal} bgColor={theme.colors.primaryBlue4}>
            Cancel
          </Button>
          <Button
            disabled={!EnableOptionSave}
            onClick={() => {
              handleOptionSelectionSave();
            }}
            bgColor={theme.colors.mediumBlue}
            variant="primary"
          >
            Save
          </Button>
        </ModalButtonsContainer>
      </Modal>
      <BaseTable
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs({
          digitalEdgeType,
          theme,
          updateRow: onRowUpdate,
          t,
          colOptions
        })}
        data={mtlAttrsDataDigitalEdge}
        scroll={{ x: '135rem' }}
        borderRadius="0rem"
        renderCustomEmptyText={() => {
          return (
            <Typography
              color="darkGrey"
              weight="medium"
              style={{ marginLeft: '1.25rem', marginTop: '1.5rem' }}
            >
              {t('no_tags_available')}
            </Typography>
          );
        }}
        rowKey={(record: BaseType, index?: number) =>
          `${(record as TableRow).machineTagListAttrId}-${index}`
        }
        borderBottomRow
        headerSticky
      />
    </StyledTableWrapper>
  );
};

export default ReviewMachineMtlAttrsTable;
