import React, { ReactElement, Fragment, useState } from 'react';
import styled, { useTheme } from 'styled-components';

// Components
import { insertSpaces, unSnakeColumnName } from './MasterTagListTableHeader';
import {
  Typography,
  Button,
  WarningPrompt,
  BaseSelect,
  Checkbox,
  TooltipWrapper
} from 'components';
import { default as UploadMtlModal } from './UploadMtlModal';

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faSearch } from '@fortawesome/free-solid-svg-icons';

// Helpers
import { capitalizeFirst, snakeCaseKeysDeep } from 'helpers';
import { hasAllRequiredData } from 'pages/MasterTagListDashBoard';

// 3rd party
import { CellContext } from '@tanstack/react-table';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Types
import { TableColumnConfigs, DigitalEdgeType } from 'types';
import {
  MasterTagListColumn,
  ScaledDataType,
  ScalingOptions,
  UnitOfMeasure,
  DataType,
  ScanRate,
  WipTagListRowData,
  WipMasterTagListAttributeKdm,
  TagListRowStatus,
  MtlAttrDsdmWithError,
  MtlAttrKdmWithError,
  MtlAttrMqttWithError,
  WipTagListRowErrorData,
  WipMasterTagListAttributeDsdm,
  WipMasterTagListAttributeMqtt,
  BooleanTag
} from 'types/machine-management';
import { debounce } from 'lodash';
import {
  ButtonsContainer,
  CheckBoxContainer,
  FontContainer,
  IconContainer,
  MasterTagListField,
  SearchBar,
  SearchBox,
  SearchTagSection,
  TableContainer
} from './MasterTagListDetailsTable.elements';
import NewMasterTagListTable from 'components/NewMasterTagListTable/NewMasterTagListTable';

export interface TagColumnData {
  value?: string | number | boolean;
  name: string;
  parentRow: number;
}

export interface ColumnProps {
  isStatusColumn?: boolean;
}

const WarningIconContainer = styled.div`
  cursor: pointer;
  position: absolute;
  right: 0.275rem;
  top: 0.275rem;
`;

export const Column = styled.td<ColumnProps>`
  position: relative;
  border: 0.0625rem solid ${(props) => props.theme.colors.lightGrey1};
  border-collapse: collapse;
  width: ${({ isStatusColumn }) => (isStatusColumn ? '5.625rem' : '11.125rem')};
  border: none;
  padding: 0.6875rem 1rem;
`;

export const StatusPlaceHolder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const FieldContainer = styled.div`
  position: relative;
`;

export interface IndicatorProps {
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
    rowStatus === TagListRowStatus.Valid
      ? theme.colors.onTrackGreen
      : rowStatus === TagListRowStatus.Error
      ? theme.colors.negativeRed
      : theme.colors.mediumGrey2};
  border: 0.1875rem solid ${({ rowStatus, theme }) =>
    rowStatus === TagListRowStatus.Valid
      ? theme.colors.onTrackGreen3
      : rowStatus === TagListRowStatus.Error
      ? theme.colors.negativeRed3
      : theme.colors.lightMediumGrey};
  margin-right: 0.625rem;
`;

const generateTagListData = (originalArray: WipTagListRowData[]) => {
  return originalArray.map((item: WipTagListRowData) => ({
    id: item.data.id,
    master_tag_name: item.data.master_tag_name,
    description: item.data.description,
    data_type: item.data.data_type,
    scan_rate: item.data.scan_rate,
    change_threshold: item.data.change_threshold,
    scaling: item.data.scaling,
    scaled_data_type: item.data.scaled_data_type,
    raw_high: item.data.raw_high,
    raw_low: item.data.raw_low,
    scaled_high: item.data.scaled_high,
    scaled_low: item.data.scaled_low,
    unit_of_measure: item.data.unit_of_measure,
    module: item.data.module,
    function: item.data.function,
    row: item.row
  }));
};

const getMultiValueMasterTagListSelect = (
  val: string,
  selectType: Record<string, unknown>,
  changeHandler: (v: string | number | boolean | undefined, w: string, x: number) => void,
  placeHolderText: string,
  selectId: string,
  parentRow: number,
  rowStatus: TagListRowStatus,
  isBoolean?: boolean
) => {
  return (
    <BaseSelect
      value={isBoolean ? (typeof val === 'boolean' && val === true ? 'True' : 'False') : val}
      variant={rowStatus ? 'white' : 'disabled'}
      options={Object.keys(selectType).map((key) => {
        const currentValue = selectType[key] as string;
        return { label: currentValue.replaceAll('_', ' '), value: currentValue };
      })}
      handleChange={(e) => {
        let newVal: string | number | boolean | undefined = e.target.value;
        if (isBoolean) {
          newVal = newVal === 'True' ? true : newVal === 'False' ? false : undefined;
        }
        if (selectId == 'scan_rate') newVal = Number(newVal);
        changeHandler(newVal, selectId, parentRow);
      }}
      placeholder={placeHolderText}
    />
  );
};

const MasterTagListDetailsTable = ({
  columnList,
  digitalEdgeType,
  tagListData,
  updateTagListData,
  updateTagListWithErrorsData,
  handleTagsDeleted
}: {
  columnList: MasterTagListColumn[];
  digitalEdgeType: DigitalEdgeType;
  tagListData?: WipTagListRowData[];
  updateTagListData: (tagList: WipTagListRowData[]) => void;
  updateTagListWithErrorsData: (rowDataWithErrors: WipTagListRowErrorData[]) => void;
  selectedRow?: number;
  handleTagsDeleted?: (isTagsDeleted: boolean) => void;
}): ReactElement => {
  const theme = useTheme();
  const DEBOUNCE_TIMEOUT = 400;
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectTagListToDelete, setSelectTagListToDelete] = useState<WipTagListRowData[]>([]);
  const [isViewConfirmDelete, setIsViewConfirmDelete] = useState(false);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const queryClient = new QueryClient();

  const handleCheckBoxChange = (checked: boolean, rowData: WipTagListRowData) => {
    handleOnChangeCheckBox(checked, rowData);
  };

  const handleDataTypeSelectChange = (
    value: string | number | boolean | undefined,
    whichSelect: string,
    parentRow: number
  ) => {
    forwardRowData({
      value: value,
      name: whichSelect,
      parentRow: parentRow
    });
  };

  const getToolTip = (column_id: string) => {
    return (
      <WarningIconContainer>
        <TooltipWrapper Tooltip={`${capitalizeFirst(unSnakeColumnName(column_id))} is required`}>
          <FontAwesomeIcon
            fontSize="0.75rem"
            color={theme.colors.negativeRed}
            icon={faExclamationCircle}
          />
        </TooltipWrapper>
      </WarningIconContainer>
    );
  };

  const columnRenderer = (
    tagListData: WipTagListRowData[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cellValue: any,
    dataType: string,
    required: boolean
  ) => {
    const missingRequired = () => {
      if (cellValue.column.id === 'scan_rate') {
        return (
          required &&
          (tagListData[cellValue?.row.id]?.data[cellValue.column.id] === null ||
            tagListData[cellValue?.row.id]?.data[cellValue.column.id] === undefined ||
            tagListData[cellValue?.row.id]?.data[cellValue.column.id] === 0)
        );
      } else {
        return (
          required &&
          (tagListData[cellValue?.row.id]?.data[cellValue.column.id] === null ||
            tagListData[cellValue?.row.id]?.data[cellValue.column.id] === undefined ||
            tagListData[cellValue?.row.id]?.data[cellValue.column.id] === '')
        );
      }
    };

    const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
      forwardRowData({
        value: e.target.value !== '' ? e.target.value : undefined,
        name: cellValue.column.id,
        parentRow: tagListData[cellValue.row.id].row
      });
    };

    switch (dataType) {
      case 'str':
        return (
          <FieldContainer>
            <MasterTagListField
              defaultValue={tagListData[cellValue?.row.id]?.data[cellValue.column.id] as string}
              type="text"
              onChange={(e) => {
                cellValue.table.options.meta.updateData(tagListData, columnList, {
                  value: e.target.value !== '' ? e.target.value : undefined,
                  name: cellValue.column.id,
                  parentRow: tagListData[cellValue.row.id].row
                });
              }}
              onBlur={onBlur}
              placeholder={`Add ${unSnakeColumnName(cellValue.column.id as string)}`}
              disabled={!tagListData[cellValue?.row.id]?.rowStatus}
              name={cellValue.column.id}
            />
            {missingRequired() && getToolTip(cellValue.column.id)}
          </FieldContainer>
        );
      case 'DataType':
        return (
          <FieldContainer>
            {getMultiValueMasterTagListSelect(
              tagListData[cellValue?.row.id]?.data[cellValue.column.id] as string,
              DataType,
              handleDataTypeSelectChange,
              '[Data Type]',
              cellValue.column.id,
              tagListData[cellValue?.row.id]?.row,
              tagListData[cellValue?.row.id]?.rowStatus
            )}
            {missingRequired() && getToolTip(cellValue.column.id)}
          </FieldContainer>
        );
      case 'ScaledDataType':
        return getMultiValueMasterTagListSelect(
          tagListData[cellValue?.row.id]?.data[cellValue.column.id] as string,
          ScaledDataType,
          handleDataTypeSelectChange,
          '[Scaled Type]',
          cellValue.column.id,
          tagListData[cellValue?.row.id]?.row,
          tagListData[cellValue?.row.id]?.rowStatus
        );
      case 'ScalingOptions':
        return (
          <FieldContainer>
            {getMultiValueMasterTagListSelect(
              tagListData[cellValue?.row.id]?.data[cellValue.column.id] as string,
              ScalingOptions,
              handleDataTypeSelectChange,
              '[Scale Opt]',
              cellValue.column.id,
              tagListData[cellValue?.row.id]?.row,
              tagListData[cellValue?.row.id]?.rowStatus
            )}
            {missingRequired() && getToolTip(cellValue.column.id)}
          </FieldContainer>
        );
      case 'ScanRate':
        return (
          <FieldContainer>
            {getMultiValueMasterTagListSelect(
              tagListData[cellValue?.row.id]?.data[cellValue.column.id] as string,
              ScanRate,
              handleDataTypeSelectChange,
              '[Scan Rate]',
              cellValue.column.id,
              tagListData[cellValue?.row.id]?.row,
              tagListData[cellValue?.row.id]?.rowStatus
            )}
            {missingRequired() && getToolTip(cellValue.column.id)}
          </FieldContainer>
        );
      case 'UnitOfMeasure':
        return getMultiValueMasterTagListSelect(
          tagListData[cellValue?.row.id]?.data[cellValue.column.id] as string,
          UnitOfMeasure,
          handleDataTypeSelectChange,
          '[Measure]',
          cellValue.column.id,
          tagListData[cellValue?.row.id]?.row,
          tagListData[cellValue?.row.id]?.rowStatus
        );
      case 'float':
        return (
          <FieldContainer>
            <MasterTagListField
              defaultValue={tagListData[cellValue?.row.id]?.data[cellValue.column.id] as string}
              type="number"
              min="0"
              step="0.1"
              onChange={(e) => {
                cellValue.table.options.meta.updateData(tagListData, columnList, {
                  value: e.target.value !== '' ? Number(e.target.value) : undefined,
                  name: cellValue.column.id,
                  parentRow: tagListData[cellValue.row.id].row
                });
              }}
              onBlur={(e) => {
                forwardRowData({
                  value: e.target.value !== '' ? Number(e.target.value) : undefined,
                  name: cellValue.column.id,
                  parentRow: tagListData[cellValue.row.id].row
                });
              }}
              onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
                e.currentTarget.blur();
              }}
              placeholder={`Add ${unSnakeColumnName(cellValue.column.id as string)}`}
              name={cellValue.column.id}
              disabled={!tagListData[cellValue?.row.id]?.rowStatus}
            />
            {missingRequired() && getToolTip(cellValue.column.id)}
          </FieldContainer>
        );
      case 'int':
        return (
          <FieldContainer>
            <MasterTagListField
              defaultValue={tagListData[cellValue?.row.id]?.data[cellValue.column.id] as string}
              type="number"
              min="0"
              onChange={(e) => {
                cellValue.table.options.meta.updateData(tagListData, columnList, {
                  value: e.target.value !== '' ? Number(e.target.value) : undefined,
                  name: cellValue.column.id,
                  parentRow: tagListData[cellValue.row.id].row
                });
              }}
              onBlur={(e) => {
                forwardRowData({
                  value: e.target.value !== '' ? Number(e.target.value) : undefined,
                  name: cellValue.column.id,
                  parentRow: tagListData[cellValue.row.id].row
                });
              }}
              onWheel={(e: React.WheelEvent<HTMLInputElement>) => {
                e.currentTarget.blur();
              }}
              placeholder={`Add ${unSnakeColumnName(cellValue.column.id as string)}`}
              name={cellValue.column.id}
              disabled={!tagListData[cellValue?.row.id]?.rowStatus}
            />
            {missingRequired() && getToolTip(cellValue.column.id)}
          </FieldContainer>
        );
      case 'UUID':
        return (
          <StatusPlaceHolder>
            <CheckBoxContainer>
              <Checkbox
                id={cellValue?.row.id}
                onChange={(e) => {
                  handleCheckBoxChange(e.target.checked, tagListData[cellValue?.row.id]);
                }}
                checked={selectTagListToDelete.includes(tagListData[cellValue?.row.id])}
              />
            </CheckBoxContainer>
            <StatusIndicator rowStatus={tagListData[cellValue?.row.id]?.rowStatus} />
            <Typography
              variant="stepheading"
              color={
                tagListData[cellValue?.row.id]?.rowStatus === TagListRowStatus.Valid
                  ? theme.colors.onTrackGreen
                  : tagListData[cellValue?.row.id]?.rowStatus === TagListRowStatus.Error
                  ? theme.colors.negativeRed
                  : theme.colors.mediumGrey2
              }
            >
              {tagListData[cellValue?.row.id]?.rowStatus}
            </Typography>
          </StatusPlaceHolder>
        );
      case 'bool':
        return getMultiValueMasterTagListSelect(
          tagListData[cellValue?.row.id]?.data[cellValue.column.id] as string,
          BooleanTag,
          handleDataTypeSelectChange,
          '[Bool]',
          cellValue.column.id,
          tagListData[cellValue?.row.id]?.row,
          tagListData[cellValue?.row.id]?.rowStatus,
          true
        );
    }
    return <MasterTagListField type="text" placeholder={`Unknown`} disabled />;
  };

  const generateHeader = (name: string, required: boolean) => {
    return `${
      name == 'scan_rate'
        ? 'Scan Rate (ms)'
        : name.includes('_')
        ? unSnakeColumnName(name)
        : insertSpaces(name)
    }${required ? '*' : ''}`;
  };

  const generateColumnConfigs = (tagListData: WipTagListRowData[]) =>
    columnList.map((item) => {
      if (item.name === 'id')
        return {
          id: item.name,
          header: '',
          isEnableSorting: false,
          isSelected: true,
          renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
            columnRenderer(tagListData, cellValue, item.dataType, item.required)
        };
      return {
        id: item.name,
        header: generateHeader(item.name, item.required),
        isEnableSorting: false,
        isSelected: true,
        renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
          columnRenderer(tagListData, cellValue, item.dataType, item.required)
      };
    });

  const handleOnChangeCheckBox = (checked: boolean, selectedRowToDelete: WipTagListRowData) => {
    checked
      ? setSelectTagListToDelete([selectedRowToDelete, ...selectTagListToDelete])
      : setSelectTagListToDelete(
          selectTagListToDelete.filter((row) => row?.row !== selectedRowToDelete.row)
        );
  };
  const forwardRowData = (column: TagColumnData) => {
    const copyTagListData: WipTagListRowData[] = tagListData
      ? [...tagListData]
      : [
          {
            row: column.parentRow,
            rowStatus: TagListRowStatus.Draft,
            data: {},
            imported: false
          }
        ];
    copyTagListData.forEach((tag) => {
      if (tag.row === column.parentRow) {
        tag.data = {
          ...tag.data,
          [column.name]: column.value
        };
        // when data changes, update this row status according to new data
        tag.rowStatus = hasAllRequiredData([tag], columnList)
          ? TagListRowStatus.Valid
          : TagListRowStatus.Error;
      } else {
        tag.data = {
          ...tag.data
        };
      }
    });
    updateTagListData(copyTagListData);
  };

  const addNewTagListRow = () => {
    const newRow = getNewRowData();
    // When a row is added, always add it to the end of the list so the uploaded file stays at the beginning, to align with Rows from validation
    if (tagListData) updateTagListData([newRow, ...tagListData]);
    else updateTagListData([newRow]);
  };
  // Default to no data in the rows (the columns are handled by the columnListData)
  const getNewRowData = (): WipTagListRowData => {
    return {
      data: {},
      row:
        tagListData && tagListData.length > 0
          ? Math.max(
              ...tagListData.map((row) => {
                return row.row;
              })
            ) + 1
          : 0,
      rowStatus: TagListRowStatus.Draft,
      imported: false
    };
  };

  /**
   * When a file is uploaded, it will be uploaded at the beginning of the tag list data. Have to reindex the rows numbers to start after the uploaded data.
   * @param tagList
   */
  const reIndexElements = (tagList: WipTagListRowData[]) => {
    const updatedTagLIst = tagList.map((obj, index) => {
      obj.row = index;
      return obj;
    });
    updateTagListData(updatedTagLIst);
  };

  const handleValidatedData = (
    mtlAttributeData: MtlAttrDsdmWithError[] | MtlAttrKdmWithError[] | MtlAttrMqttWithError[]
  ) => {
    const newRowData: WipTagListRowData[] = [];
    const newRowErrorDetails: WipTagListRowErrorData[] = [];
    mtlAttributeData.forEach((attrData, i) => {
      const { errorMessage, hasError, ...attrDataWithoutError } = { ...attrData };
      // Get the row's data
      const rowDataItem = {
        row: i,
        rowStatus: hasError ? TagListRowStatus.Error : TagListRowStatus.Valid,
        errorMessage: errorMessage,
        // Have to snake_case the keys because the API default transform camelCase's them
        data: { ...snakeCaseKeysDeep(attrDataWithoutError) },
        imported: true
      };

      newRowData.push(rowDataItem);

      // Get the row's error details
      newRowErrorDetails.push({
        row: i,
        rowStatus: hasError ? TagListRowStatus.Error : TagListRowStatus.Valid,
        errorMessage: errorMessage
      });
    });

    // Sorting the newRowData based on the 'rowStatus'
    newRowData.sort((a, b) => {
      if (a.rowStatus === 'Error' && b.rowStatus === 'Valid') {
        return -1; // 'Error' comes before 'Valid'
      } else if (a.rowStatus === 'Valid' && b.rowStatus === 'Error') {
        return 1; // 'Valid' comes after 'Error'
      } else {
        return 0; // Maintain the order if both are 'Valid' or both are 'Error'
      }
    });

    // When a file is uploaded, always add it to the beginning of the list to align with Rows from validation
    updateTagListData([]);
    updateTagListData([...newRowData]);
    updateTagListWithErrorsData(newRowErrorDetails);
    reIndexElements([...newRowData]);
  };

  const deleteSelectedRows = () => {
    let updatedList: WipTagListRowData[] = [];
    if (tagListData) {
      updatedList = tagListData?.filter((tag) => !selectTagListToDelete.includes(tag));
    }
    updateTagListData(updatedList);
    setSelectTagListToDelete([]);
    setIsViewConfirmDelete(false);
    handleTagsDeleted && handleTagsDeleted(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setGlobalFilter(event.target.value);
  };

  return (
    <Fragment>
      <SearchTagSection>
        <FontContainer>
          <Typography size="1.125rem" as="h3" mb={0} color="darkGrey" weight="bold">
            All Tags
          </Typography>
        </FontContainer>
        <SearchBar>
          <IconContainer>
            <FontAwesomeIcon style={{ fontSize: '1rem', cursor: 'auto' }} icon={faSearch} />
          </IconContainer>
          <SearchBox
            type="text"
            placeholder="Search Tags..."
            defaultValue={globalFilter ?? ''}
            onChange={debounce(handleSearchChange, DEBOUNCE_TIMEOUT)}
          />
        </SearchBar>
        <ButtonsContainer>
          <Button
            variant="danger"
            onClick={() => {
              setIsViewConfirmDelete(true);
            }}
            disabled={selectTagListToDelete.length === 0}
          >
            Delete
          </Button>
          <Button variant="thin" onClick={() => setShowUploadModal(true)}>
            Import List
          </Button>
          <Button
            bgColor={theme.colors.mediumBlue}
            variant={'primary'}
            onClick={() => {
              addNewTagListRow();
            }}
          >
            Add a Tag +
          </Button>
        </ButtonsContainer>
      </SearchTagSection>
      <TableContainer>
        {tagListData
          ? tagListData.length > 0 && (
              <QueryClientProvider client={queryClient}>
                <NewMasterTagListTable
                  rowData={
                    generateTagListData(tagListData) as
                      | WipMasterTagListAttributeDsdm[]
                      | WipMasterTagListAttributeKdm[]
                      | WipMasterTagListAttributeMqtt[]
                  }
                  columnConfigs={generateColumnConfigs(tagListData)}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </QueryClientProvider>
            )
          : null}
      </TableContainer>
      <UploadMtlModal
        visible={showUploadModal}
        edgeType={digitalEdgeType}
        handleClose={() => setShowUploadModal(false)}
        handleImportSuccess={handleValidatedData}
      />
      <WarningPrompt
        helperText={`Are you sure you want to delete selected tags ?`}
        isConfirmPrompt
        isVisible={isViewConfirmDelete}
        onCancelCallback={() => setIsViewConfirmDelete(false)}
        onConfirmCallback={() => deleteSelectedRows()}
        title={'Delete a Tag'}
      />
    </Fragment>
  );
};

export default MasterTagListDetailsTable;
