import React, { Fragment, ReactElement, useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import Tooltip from 'rc-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

// Components
import { Column, StatusPlaceHolder } from './MasterTagListDetailsTable';
import { BaseSelect, Checkbox, Typography, TooltipWrapper } from 'components';

// Types
import {
  MasterTagListColumn,
  ScaledDataType,
  ScalingOptions,
  UsedBy,
  UnitOfMeasure,
  DataType,
  ScanRate,
  BooleanTag,
  WipTagListRowData,
  WipMasterTagListAttributeKdm,
  TagListRowStatus
} from 'types/machine-management';
import { notMissingRequired } from 'pages/MachineManagement/MTLConfigurationMapping/MapTags';
import { unSnakeColumnName } from './MasterTagListTableHeader';
export interface TagColumnData {
  value?: string | number | boolean;
  name: string;
  parentRow: number;
}

// Styling
const MasterTagListField = styled.input`
  width: 100%;
  height: ${(props) => (props.type != 'checkbox' ? '2.5rem' : '1.5rem')};
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey4};
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  &:focus {
    outline-color: ${(props) => props.theme.colors.mediumBlue3};
  }
  background-color: ${(props) => (props.readOnly || props.disabled ? '#fafafa' : 'white')};
  color: ${(props) => (props.readOnly || props.disabled ? '#545454' : 'black')};
`;
const CheckBoxContainer = styled.div`
  margin-right: 1rem;
`;
interface IndicatorProps {
  rowStatus: TagListRowStatus;
}
const StatusIndicator = styled.div<IndicatorProps>`
  display: flex;
  justify-content: center;
  align-items; center;
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 0.5rem;
  background-color: ${({ rowStatus, theme }) =>
    rowStatus === TagListRowStatus.Valid || rowStatus === TagListRowStatus.Mapped
      ? theme.colors.onTrackGreen
      : rowStatus === TagListRowStatus.Error || rowStatus === TagListRowStatus.Unmapped
      ? theme.colors.negativeRed
      : theme.colors.mediumGrey2};
  border: 0.1875rem solid ${({ rowStatus, theme }) =>
    rowStatus === TagListRowStatus.Valid || rowStatus === TagListRowStatus.Mapped
      ? theme.colors.onTrackGreen3
      : rowStatus === TagListRowStatus.Error || rowStatus === TagListRowStatus.Unmapped
      ? theme.colors.negativeRed3
      : theme.colors.lightMediumGrey};
  margin-right: 0.625rem;
`;

const WarningIconContainer = styled.div`
  cursor: pointer;
  position: absolute;
  right: 1.25rem;
  top: 0.875rem;
`;

export const tooltipColumns: string[] = [
  'omnibluTagName',
  'masterTagName',
  'description',
  'topicName',
  'sqlTableName'
];

const UnmappedNewTagListRow = ({
  columnList,
  updateRowData,
  selectedRowData,
  rowData,
  isSelected,
  showCheckBox = true,
  disabledColumns = false,
  handleTextBoxClick,
  machineToMaster = false
}: {
  columnList: MasterTagListColumn[] | undefined;
  updateRowData?: (val: TagColumnData) => void;
  selectedRowData?: (checked: boolean, row: WipTagListRowData) => void;
  rowData: WipTagListRowData;
  isSelected: boolean;
  showCheckBox?: boolean;
  disabledColumns?: boolean;
  handleTextBoxClick?: (rowData: WipTagListRowData) => void;
  machineToMaster?: boolean;
}): ReactElement => {
  const theme = useTheme();
  const firstColRef = useRef<HTMLTableCellElement>(null);
  const [checkedRowData, setCheckedRowData] = useState<WipTagListRowData>();
  const updatedNotMissingRequired = machineToMaster
    ? notMissingRequired
    : notMissingRequired.filter((col) => col !== 'masterTagName');
  const handleDataTypeSelectChange = (
    value: string | number | boolean | undefined,
    whichSelect: string
  ) => {
    //send data upstream
    updateRowData &&
      updateRowData({
        value: value,
        name: whichSelect,
        parentRow: rowData.row
      });
  };
  const getMultiValueMasterTagListSelect = (
    val: string | undefined,
    selectType: Record<string, unknown>,
    changeHandler: (v: string | number | boolean | undefined, w: string) => void,
    placeHolderText: string,
    selectId: string,
    isBoolean?: boolean
  ) => {
    return (
      <BaseSelect
        value={val === undefined ? '' : val}
        variant={disabledColumns ? 'disabled' : 'white'}
        options={Object.keys(selectType).map((key) => {
          const currentValue = selectType[key] as string;
          return { label: currentValue.replaceAll('_', ' '), value: currentValue };
        })}
        handleChange={(e) => {
          let newVal: string | number | boolean | undefined = e.target.value;
          if (isBoolean) {
            newVal = newVal === 'True' ? true : newVal === 'False' ? false : undefined;
          } else {
            newVal = newVal === '' ? undefined : newVal;
          }
          if (selectId == 'scanRate') newVal = Number(newVal);
          changeHandler(newVal, selectId);
        }}
        placeholder={placeHolderText}
      />
    );
  };
  const getFieldType = (dataType: string, name: string): ReactElement => {
    switch (dataType) {
      case 'str':
        return disabledColumns && tooltipColumns.includes(name) ? (
          <Tooltip
            overlay={rowData.data[name] ? <span>{rowData.data[name] as string}</span> : ''}
            placement={'top'}
            overlayClassName="information-tooltip"
          >
            <MasterTagListField
              value={rowData.data[name] ? (rowData.data[name] as string) : ''}
              type="text"
              onChange={(e) => {
                updateRowData &&
                  updateRowData({
                    value: e.target.value !== '' ? e.target.value : undefined,
                    name: name,
                    parentRow: rowData.row
                  });
              }}
              placeholder={
                !notMissingRequired.includes(name) ? `Add ${unSnakeColumnName(name)}` : ''
              }
              onClick={
                updatedNotMissingRequired.includes(name)
                  ? () => {
                      handleTextBoxClick && handleTextBoxClick(rowData);
                    }
                  : () => true
              }
              readOnly={updatedNotMissingRequired.includes(name) || disabledColumns}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        ) : (
          <MasterTagListField
            value={rowData.data[name] ? (rowData.data[name] as string) : ''}
            type="text"
            onChange={(e) => {
              updateRowData &&
                updateRowData({
                  value: e.target.value !== '' ? e.target.value : undefined,
                  name: name,
                  parentRow: rowData.row
                });
            }}
            placeholder={!notMissingRequired.includes(name) ? `Add ${unSnakeColumnName(name)}` : ''}
            onClick={
              updatedNotMissingRequired.includes(name)
                ? () => {
                    handleTextBoxClick && handleTextBoxClick(rowData);
                  }
                : () => true
            }
            disabled={disabledColumns}
            readOnly={updatedNotMissingRequired.includes(name)}
          />
        );
      case 'DataType':
        return getMultiValueMasterTagListSelect(
          rowData.data[name] as string | undefined,
          DataType,
          handleDataTypeSelectChange,
          '[Data Type]',
          name
        );
      case 'UsedBy':
        return getMultiValueMasterTagListSelect(
          rowData.data[name] as string | undefined,
          UsedBy,
          handleDataTypeSelectChange,
          '[Used By]',
          name
        );
      case 'ScaledDataType':
        return getMultiValueMasterTagListSelect(
          // Have to expect snake_case because the attribute comes from the backend this way
          (rowData.data as WipMasterTagListAttributeKdm).scaledDataType as string | undefined,
          ScaledDataType,
          handleDataTypeSelectChange,
          '[Scaled Type]',
          name
        );
      case 'ScalingOptions':
        return getMultiValueMasterTagListSelect(
          (rowData.data as WipMasterTagListAttributeKdm).scaling as string | undefined,
          ScalingOptions,
          handleDataTypeSelectChange,
          '[Scale Opt]',
          name
        );
      case 'ScanRate':
        return getMultiValueMasterTagListSelect(
          // Have to expect snake_case because the attribute comes from the backend this way
          (rowData.data as WipMasterTagListAttributeKdm).scanRate as string | undefined,
          ScanRate,
          handleDataTypeSelectChange,
          '[Scan Rate]',
          name
        );
      case 'UnitOfMeasure':
        return getMultiValueMasterTagListSelect(
          rowData.data[name] as string | undefined,
          UnitOfMeasure,
          handleDataTypeSelectChange,
          '[Measure]',
          name
        );
      case 'bool':
        return getMultiValueMasterTagListSelect(
          rowData.data[name] !== undefined ? (rowData.data[name] ? 'True' : 'False') : undefined,
          BooleanTag,
          handleDataTypeSelectChange,
          '[Bool]',
          name,
          true
        );
      case 'int':
        return (
          <MasterTagListField
            value={rowData.data[name] !== undefined ? (rowData.data[name] as number) : ''}
            type="number"
            onChange={(e) => {
              updateRowData &&
                updateRowData({
                  value: e.target.value !== '' ? parseInt(e.target.value) : undefined,
                  name: name,
                  parentRow: rowData.row
                });
            }}
            placeholder={`Add ${name.replaceAll('_', ' ')}`}
            disabled={!rowData.rowStatus}
          />
        );
      case 'float':
        return (
          <MasterTagListField
            value={rowData.data[name] !== undefined ? (rowData.data[name] as number) : ''}
            type="number"
            min="0"
            step="0.1"
            onChange={(e) => {
              updateRowData &&
                updateRowData({
                  value: Number(e.target.value),
                  name: name,
                  parentRow: rowData.row
                });
            }}
            placeholder={`Add ${name.replaceAll('_', ' ')}`}
            disabled={disabledColumns}
          />
        );
      case 'isPrimaryKey':
        return (
          <MasterTagListField
            value={rowData.data[name] !== undefined ? (rowData.data[name] as number) : ''}
            type="checkbox"
            disabled={disabledColumns}
          />
        );
    }

    return <MasterTagListField type="text" placeholder={`Unknown`} disabled />;
  };

  const handleCheckBoxChange = (checked: boolean, rowData: WipTagListRowData) => {
    selectedRowData && selectedRowData(checked, rowData);
    checked
      ? setCheckedRowData(rowData)
      : setCheckedRowData({ row: -1, rowStatus: TagListRowStatus.Unmapped, data: {} });
  };
  // If the row has been selected, scroll into view
  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstColRef && firstColRef.current && isSelected) {
        firstColRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [isSelected, firstColRef]);

  return (
    <Fragment>
      <Column isStatusColumn ref={firstColRef}>
        <StatusPlaceHolder>
          {showCheckBox && (
            <CheckBoxContainer>
              <Checkbox
                onChange={(e) => {
                  handleCheckBoxChange(e.target.checked, rowData);
                }}
                checked={rowData.row === checkedRowData?.row}
              />
            </CheckBoxContainer>
          )}
          <StatusIndicator rowStatus={rowData.rowStatus} />
          <Typography
            variant="stepheading"
            color={
              rowData.rowStatus === TagListRowStatus.Valid ||
              rowData.rowStatus === TagListRowStatus.Mapped
                ? theme.colors.onTrackGreen
                : rowData.rowStatus === TagListRowStatus.Error ||
                  rowData.rowStatus === TagListRowStatus.Unmapped
                ? theme.colors.negativeRed
                : theme.colors.mediumGrey2
            }
          >
            {rowData.rowStatus}
          </Typography>
        </StatusPlaceHolder>
      </Column>
      {columnList &&
        columnList &&
        columnList
          .filter((column) => column.name !== 'id')
          .map((column) => {
            const missingRequired =
              !notMissingRequired.includes(column.name) &&
              column.required &&
              (rowData.data[column.name] === null || rowData.data[column.name] === undefined);
            return (
              <Column key={column.name}>
                {getFieldType(column.dataType, column.name)}
                {missingRequired && (
                  <WarningIconContainer>
                    <TooltipWrapper Tooltip={`${column.name.replaceAll('_', ' ')} is required`}>
                      <FontAwesomeIcon
                        fontSize="0.75rem"
                        color={theme.colors.negativeRed}
                        icon={faExclamationCircle}
                      />
                    </TooltipWrapper>
                  </WarningIconContainer>
                )}
              </Column>
            );
          })}
    </Fragment>
  );
};

export default UnmappedNewTagListRow;
