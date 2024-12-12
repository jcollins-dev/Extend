// 3rd party libs
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useHistory } from 'react-router-dom';

// API
import {
  useGetUnmappedCustomMasterTagListQuery,
  // useGetUnmappedMasterTagListQuery,
  useGetMasTagListTableColumnQuery,
  useSaveMasterToMachineMappingMutation,
  // useGetUnmappedMachineTagListQuery,
  useDeleteCustomMasterTagListMutation,
  useGetManualUnmappedMasterTagListQuery,
  useGetManualUnmappedMachineTagListQuery
} from 'api';

// Routing
import { JBTRoutes } from 'constants/routes';
import { useParams } from 'react-router';

// Components
import { Button, Loader, Typography, WarningPrompt } from 'components';
import {
  KdmUnmappedMachineTagList,
  MasterTagListColumn,
  TagListRowStatus,
  UnmappedMasterTagListType,
  WipTagListRowData,
  MasterToMachineMappingPayload,
  MachineMasterMap,
  UnmappedMachineTagList,
  KdmUnmappedMasterTagList,
  DeleteCustomMasterTagsParams
} from 'types/machine-management';

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import UnmappedMasterTagList from 'components/UnmappedMasterTagList';
import UnmappedCustomMasterTagList from 'components/UnmappedCustomMasterTagList';
import { DigitalEdgeType } from 'types';
import { TagColumnData } from 'pages/MasterTagListDashBoard/MasterTagListDetailsTable';

// Helpers
import { hasAllRequiredData } from 'pages/MasterTagListDashBoard';
import { useWizard } from 'react-use-wizard';
import { toast } from 'react-toastify';
import UnmappedMachineTags from 'components/UnmappedMachineTagList';
import { useTranslation } from 'react-i18next';

//styling
const Root = styled.div`
  height: 17rem;
  width: 32rem;
  margin: auto;
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0.125rem solid;
  border-radius: 0.625rem;
  border-color: #e2e2e2;
`;

const CreateButton = styled.div`
  display: flex;
  max-width: 21rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  * + * {
    margin-left: 1rem;
  }
`;
const TableContainer = styled.div`
  padding: 2rem 1rem 1rem 2rem;
`;
interface ContentContainerProps {
  pxFromTop?: number;
}
const ContentContainer = styled.div<ContentContainerProps>`
  width: 100%;
  height: 100%;
  display: block;
`;
const ButtonsContainer = styled.div`
  width: 100%;
  padding-right: 0.75rem;
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: white;
  border-top: 0.0625rem solid ${(props) => props.theme.colors.lightMediumGrey};

  button {
    margin: 1rem;
    width: auto;
  }
`;
const SearchBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2rem 2.625rem;
  gap: 0.5625rem;
  width: 100%;
  height: 2.5rem;
`;
const SearchBox = styled.input`
  width: 100%;
  height: 2.5rem;
  font-size: 0.8125rem;
  border-radius: 0.5rem;
  border: 0.0625rem solid ${(props) => props.theme.colors.lightGrey4};
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  &:focus {
    outline-color: ${(props) => props.theme.colors.mediumBlue3};
  }
`;
const IconContainer = styled.div`
  display: flex;
  margin-bottom: 0;
`;
const AddCustomButtonContainer = styled.div`
  width: 15rem;
`;
const CustomTagsTitle = styled.div`
  padding-left: 2rem;
  display: inline-flex;
`;
const DeleteButtonContainer = styled.div`
  width: 11rem;
  height: fit-content;
  margin-left: 2rem;
  margin-top: 0.5rem;
`;
export type unmappedTableColumnsType = {
  [key: string]: string;
};
export const unmappedTableColumns: unmappedTableColumnsType = {
  master_tag_name: 'MasterTagName',
  omniblu_tag_name: 'omnibluTagName',
  data_type: 'dataType',
  scan_rate: 'scanRate',
  change_threshold: 'changeThreshold',
  scaling_options: 'scalingOptions',
  scaled_data_type: 'scaledDataType',
  raw_high: 'rawHigh',
  raw_low: 'rawLow',
  scaled_low: 'scaledLow',
  scaled_high: 'scaledHigh',
  unit_of_measure: 'unitOfMeasure',
  used_by: 'usedBy',
  topic_name: 'topicName',
  sql_table_name: 'sqlTableName',
  sql_column_name: 'sqlColumnName',
  is_primary_key: 'isPrimaryKey',
  machine_tag_name: 'machineTagName'
};
export const notMissingRequired: string[] = [
  'machineTagName',
  'machineTopicName',
  'machineTagName',
  'machineSqlTable',
  'machineSqlColumn',
  'masterSqlTable',
  'masterSqlColumn',
  'masterMQTTTopic',
  'masterMQTTTag',
  'masterTagName'
];

interface MapTagsProps {
  machineToMaster?: boolean;
  unmappedCustomData?: UnmappedMasterTagListType;
}

const MapTags = ({ machineToMaster }: MapTagsProps): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const theme = useTheme();
  const { goToStep } = useWizard();
  const history = useHistory();
  const { t } = useTranslation(['mh']);
  const [tagListData, setTagListData] = useState<WipTagListRowData[]>([]);
  const [updatedUnmappedMasterTagList, setUpdatedUnmappedMasterTagList] =
    useState<UnmappedMasterTagListType>({
      id: '',
      digitalEdgeType: DigitalEdgeType.DSDM,
      data: []
    });
  const [updatedUnmappedMachineTagList, setUpdatedUnmappedMachineTagList] =
    useState<UnmappedMachineTagList>({
      id: '',
      digitalEdgeType: DigitalEdgeType.DSDM,
      data: []
    });
  const [filteredColumnList, setFilteredColumnList] = useState<MasterTagListColumn[]>([]);
  const [filteredCustomColumnList, setFilteredCustomColumnList] = useState<MasterTagListColumn[]>(
    []
  );
  const [selectedMachineFlyoutMachineTag, setSelectedMachineFlyoutMachineTag] = useState<
    MachineMasterMap[]
  >([]);
  const [selectTagListToDelete, setSelectTagListToDelete] = useState<WipTagListRowData[]>([]);
  const [isViewConfirmDelete, setIsViewConfirmDelete] = useState(false);
  const [saveMasterToMachineMapping] = useSaveMasterToMachineMappingMutation();

  const {
    data: ManualUnmappedMasterTagListData,
    isLoading: ManualUnmappedMasterTagListDataLoading
  } = useGetManualUnmappedMasterTagListQuery(
    { machineId, includeManuallyMapped: true },
    { refetchOnMountOrArgChange: true }
  );
  const {
    data: UnmappedCustomMasterTagListData,
    isLoading: UnmappedCustomMasterTagListDataLoading
  } = useGetUnmappedCustomMasterTagListQuery({ machineId }, { refetchOnMountOrArgChange: true });
  const { data: columnListData } = useGetMasTagListTableColumnQuery(
    ManualUnmappedMasterTagListData ? ManualUnmappedMasterTagListData?.digitalEdgeType : ''
  );

  const { data: manualUnmappedMachineTags, isLoading: manualUnmappedMachineTagsLoading } =
    useGetManualUnmappedMachineTagListQuery(
      { machineId, includeManuallyMapped: true },
      { refetchOnMountOrArgChange: true }
    );

  const gotoMasterTagListDashBoard = () => {
    history.push(JBTRoutes.machineMasterTagListDashBoard);
  };
  const [deleteCustomMasterTagList, { isLoading: isDeletingCustomMtl }] =
    useDeleteCustomMasterTagListMutation();
  useEffect(() => {
    const array: MasterTagListColumn[] = [];
    columnListData
      ?.filter((column) => column.required)
      .map((column) => {
        column.name.includes('_')
          ? array.push({
              name: unmappedTableColumns[column.name],
              dataType: column.dataType,
              required: column.required
            })
          : array.push(column);
      });
    switch (ManualUnmappedMasterTagListData?.digitalEdgeType) {
      case 'KDM':
        array.splice(2, 0, { name: 'machineTagName', dataType: 'str', required: true });
        break;
      case 'MQTT':
        array.splice(2, 0, { name: 'machineTopicName', dataType: 'str', required: true });
        array.splice(3, 0, { name: 'machineTagName', dataType: 'str', required: true });
        break;
      case 'DSDM':
        array.splice(2, 0, { name: 'machineSqlTable', dataType: 'str', required: true });
        array.splice(3, 0, { name: 'machineSqlColumn', dataType: 'str', required: true });
    }
    setFilteredColumnList(array);
  }, [columnListData]);

  useEffect(() => {
    const array: MasterTagListColumn[] = [];
    columnListData?.map((column) => {
      column.name.includes('_')
        ? array.push({
            name: unmappedTableColumns[column.name],
            dataType: column.dataType,
            required: column.required
          })
        : array.push(column);
    });
    switch (UnmappedCustomMasterTagListData?.digitalEdgeType) {
      case 'KDM':
        array.splice(3, 0, { name: 'machineTagName', dataType: 'str', required: true });
        break;
      case 'MQTT':
        array.splice(3, 0, { name: 'machineTopicName', dataType: 'str', required: true });
        array.splice(4, 0, { name: 'machineTagName', dataType: 'str', required: true });
        break;
      case 'DSDM':
        array.splice(3, 0, { name: 'machineSqlTable', dataType: 'str', required: true });
        array.splice(4, 0, { name: 'machineSqlColumn', dataType: 'str', required: true });
    }
    setFilteredCustomColumnList(array);
  }, [columnListData, UnmappedCustomMasterTagListData]);
  // To set the page number to 0 and clear search when tab changes.
  useEffect(() => {
    if (
      UnmappedCustomMasterTagListData &&
      ManualUnmappedMasterTagListData &&
      manualUnmappedMachineTags
    ) {
      const copyMachineTags = manualUnmappedMachineTags?.data;
      const mappedMasterTags = copyMachineTags?.filter(
        (item) => item.masterTagListAttributeKdmId !== null
      );

      const copyList = ManualUnmappedMasterTagListData;
      if (mappedMasterTags) {
        const newState = copyList.data.map((item) => {
          for (const mappedItem of mappedMasterTags) {
            if (item.id == mappedItem.masterTagListAttributeKdmId) {
              if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'KDM') {
                return {
                  ...item,
                  machineTagName: mappedItem.plcTagName ? mappedItem.plcTagName : '',
                  machineTagListKdmId: mappedItem.machineTagListKdmId
                    ? mappedItem.machineTagListKdmId
                    : ''
                };
              } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'MQTT') {
                return {
                  ...item,
                  machineTagName: mappedItem.tagName ? mappedItem.tagName : '',
                  machineTopicName: mappedItem.topicName ? mappedItem.topicName : '',
                  machineTagListMqttId: mappedItem.machineTagListMqttId
                    ? mappedItem.machineTagListMqttId
                    : ''
                };
              } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'DSDM') {
                return {
                  ...item,
                  machineSqlTable: mappedItem.tableName ? mappedItem.tableName : '',
                  machineSqlColumn: mappedItem.indexColumn ? mappedItem.indexColumn : '',
                  machineTagListDsmId: mappedItem.machinetagListDsdmId
                    ? mappedItem.machinetagListDsdmId
                    : ''
                };
              }
            } else {
              continue;
            }
          }
          return item;
        });
        setUpdatedUnmappedMasterTagList({
          digitalEdgeType: copyList.digitalEdgeType,
          data: newState,
          id: copyList.id
        });
      } else {
        setUpdatedUnmappedMasterTagList(ManualUnmappedMasterTagListData);
      }
      setUpdatedUnmappedMachineTagList(manualUnmappedMachineTags);
      const wipCustomUnmappedData: WipTagListRowData[] = [];
      UnmappedCustomMasterTagListData?.data.map((rowData, index) => {
        wipCustomUnmappedData.push({
          row: index,
          data: rowData,
          rowStatus: TagListRowStatus.Unmapped
        });
      });
      updateTagListData(wipCustomUnmappedData);
    }
  }, [ManualUnmappedMasterTagListData, UnmappedCustomMasterTagListData, manualUnmappedMachineTags]);

  const handleAssignTagButtonClick = (
    machineTagId: KdmUnmappedMachineTagList,
    selectedRowData: WipTagListRowData
  ) => {
    const copyList = updatedUnmappedMasterTagList;
    const masterMachineMap: MachineMasterMap = {};
    const newState = copyList.data.map((item) => {
      if (item.id == selectedRowData.data.id) {
        masterMachineMap.masterTagListAttrId = item.id;
        masterMachineMap.machineTagListAttrId = machineTagId.id;
        if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'KDM') {
          return {
            ...item,
            machineTagName: machineTagId.plcTagName ? machineTagId.plcTagName : '',
            machineTagListKdmId: machineTagId.machineTagListKdmId
              ? machineTagId.machineTagListKdmId
              : ''
          };
        } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'MQTT') {
          return {
            ...item,
            machineTagName: machineTagId.tagName ? machineTagId.tagName : '',
            machineTopicName: machineTagId.topicName ? machineTagId.topicName : '',
            machineTagListMqttId: machineTagId.machineTagListMqttId
              ? machineTagId.machineTagListMqttId
              : ''
          };
        } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'DSDM') {
          return {
            ...item,
            machineSqlTable: machineTagId.tableName ? machineTagId.tableName : '',
            machineSqlColumn: machineTagId.indexColumn ? machineTagId.indexColumn : '',
            machineTagListDsmId: machineTagId.machinetagListDsdmId
              ? machineTagId.machinetagListDsdmId
              : ''
          };
        }
      }
      return item;
    });

    setUpdatedUnmappedMasterTagList({
      digitalEdgeType: copyList.digitalEdgeType,
      data: newState,
      id: copyList.id
    });
    setSelectedMachineFlyoutMachineTag([masterMachineMap, ...selectedMachineFlyoutMachineTag]);
  };

  const handleAssignMasterTagButtonClick = (
    masterTagId: KdmUnmappedMasterTagList,
    selectedRowData: WipTagListRowData
  ) => {
    const copyList = updatedUnmappedMachineTagList;
    const masterMachineMap: MachineMasterMap = {};
    const newState = copyList.data?.map((item) => {
      if (item.id == selectedRowData.data.id) {
        masterMachineMap.machineTagListAttrId = item.id;
        masterMachineMap.masterTagListAttrId = masterTagId.id;
        if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'KDM') {
          return {
            ...item,
            masterTagName: masterTagId.masterTagName ? masterTagId.masterTagName : ''
          };
        } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'MQTT') {
          return {
            ...item,
            masterMqttTag: masterTagId.masterTagName ? masterTagId.masterTagName : '',
            masterMqttTopic: masterTagId.topicName ? masterTagId.topicName : ''
          };
        } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'DSDM') {
          return {
            ...item,
            masterSqlTable: masterTagId.sqlTableName ? masterTagId.sqlTableName : '',
            masterSqlColumn: masterTagId.sqlColumnName ? masterTagId.sqlColumnName : ''
          };
        }
      }
      return item;
    });

    setUpdatedUnmappedMachineTagList({
      digitalEdgeType: copyList.digitalEdgeType,
      data: newState,
      id: copyList.id
    });
    setSelectedMachineFlyoutMachineTag([masterMachineMap, ...selectedMachineFlyoutMachineTag]);
  };

  const handleAssignCustomTagButtonClick = (
    machineTagId: KdmUnmappedMachineTagList,
    selectedRowData: WipTagListRowData
  ) => {
    const copyList = tagListData;
    const newState = copyList.map((item) => {
      if (item.data.id == selectedRowData.data.id) {
        if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'KDM') {
          return {
            row: item.row,
            rowStatus: item.rowStatus,
            data: {
              ...item.data,
              machineTagName: machineTagId.plcTagName,
              machineTagListAttributeKdmId: machineTagId.id
            }
          };
        } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'MQTT') {
          return {
            row: item.row,
            rowStatus: item.rowStatus,
            data: {
              ...item.data,
              machineTopicName: machineTagId.topicName,
              machineTagName: machineTagId.tagName,
              machineTagListAttributeMqttId: machineTagId.id
            }
          };
        } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'DSDM') {
          return {
            row: item.row,
            rowStatus: item.rowStatus,
            data: {
              ...item.data,
              machineSqlColumn: machineTagId.indexColumn,
              machineSqlTable: machineTagId.tableName,
              machineTagListAttributeDsdmId: machineTagId.id
            }
          };
        }
      }
      return item;
    });
    updateTagListData(newState);
  };
  const handleSearchChange = (searchedValue: string) => {
    if (machineToMaster) {
      const filteredUnmappedMachineTagList = manualUnmappedMachineTags?.data?.filter((mtl) => {
        return (
          mtl.description?.toUpperCase().includes(searchedValue) ||
          mtl.plcTagName?.toUpperCase().includes(searchedValue) ||
          mtl.topicName?.toUpperCase().includes(searchedValue) ||
          mtl.tagName?.toUpperCase().includes(searchedValue) ||
          mtl.indexColumn?.toUpperCase().includes(searchedValue) ||
          mtl.tableName?.toUpperCase().includes(searchedValue)
        );
      });
      if (manualUnmappedMachineTags && filteredUnmappedMachineTagList) {
        setUpdatedUnmappedMachineTagList({
          id: '',
          digitalEdgeType: manualUnmappedMachineTags?.digitalEdgeType,
          data: filteredUnmappedMachineTagList
        });
      }
    } else {
      const filteredUnmappedMasterTagList = ManualUnmappedMasterTagListData?.data?.filter((mtl) => {
        return (
          mtl.masterTagName?.toUpperCase().includes(searchedValue) ||
          mtl.description?.toUpperCase().includes(searchedValue) ||
          mtl.omniBluTagName?.toUpperCase().includes(searchedValue) ||
          mtl.sqlTableName?.toUpperCase().includes(searchedValue) ||
          mtl.topicName?.toUpperCase().includes(searchedValue)
        );
      });
      if (ManualUnmappedMasterTagListData && filteredUnmappedMasterTagList) {
        setUpdatedUnmappedMasterTagList({
          id: '',
          digitalEdgeType: ManualUnmappedMasterTagListData?.digitalEdgeType,
          data: filteredUnmappedMasterTagList
        });
      }
    }
  };

  const updateTagListData = (tagList: WipTagListRowData[]) => {
    setTagListData(tagList);
  };

  const addNewTagListRow = () => {
    const newRow = getNewRowData();
    // When a row is added, always add it to the end of the list so the uploaded file stays at the beginning, to align with Rows from validation
    if (tagListData) updateTagListData([...tagListData, newRow]);
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
      rowStatus: TagListRowStatus.Draft
    };
  };

  const forwardRowData = (column: TagColumnData) => {
    const copyTagListData: WipTagListRowData[] = tagListData
      ? [...tagListData]
      : [
          {
            row: column.parentRow,
            rowStatus: TagListRowStatus.Draft,
            data: {}
          }
        ];
    copyTagListData.forEach((tag) => {
      if (tag.row === column.parentRow) {
        tag.data = {
          ...tag.data,
          [column.name]: column.value
        };
        // when data changes, update this row status according to new data
        tag.rowStatus = hasAllRequiredData(
          [tag],
          filteredColumnList.filter((column) => !notMissingRequired.includes(column.name))
        )
          ? TagListRowStatus.Unmapped
          : TagListRowStatus.Error;
      }
    });
    updateTagListData(copyTagListData);
  };

  const handleContinue = () => {
    const payload: MasterToMachineMappingPayload = {};
    payload.machineId = machineId;
    payload.machineMasterMap = selectedMachineFlyoutMachineTag;
    if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'KDM') {
      payload.customMasterTagListAttributeKdm = tagListData.map((row) => {
        return row.data;
      });
    } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'MQTT') {
      payload.customMasterTagListAttributeMqtt = tagListData.map((row) => {
        return row.data;
      });
    } else if (UnmappedCustomMasterTagListData?.digitalEdgeType == 'DSDM') {
      payload.customMasterTagListAttributeDsdm = tagListData.map((row) => {
        return row.data;
      });
    }
    saveMasterToMachineMapping(payload)
      .unwrap()
      .then(() => {
        goToStep(3);
      })
      .catch((error) => {
        console.warn('Save tags mapping error: ', error);
        toast('⚠️ There was a problem mapping tag list.');
      });
  };
  const handleOnChangeCheckBox = (checked: boolean, selectedRowToDelete: WipTagListRowData) => {
    checked
      ? setSelectTagListToDelete([selectedRowToDelete, ...selectTagListToDelete])
      : setSelectTagListToDelete(
          selectTagListToDelete.filter((row) => row.row !== selectedRowToDelete.row)
        );
  };
  const deleteSelectedRows = () => {
    let updatedList: WipTagListRowData[] = [];
    const selectedCustomMasterTagIds = selectTagListToDelete.map((tag) => tag.data.id as string);
    const payload: DeleteCustomMasterTagsParams = {
      machineId: machineId,
      customTagIds: selectedCustomMasterTagIds
    };
    deleteCustomMasterTagList(payload).then(() => {
      if (tagListData) {
        updatedList = tagListData?.filter((tag) => !selectTagListToDelete.includes(tag));
      }
      updateTagListData(updatedList);
      setSelectTagListToDelete([]);
      setIsViewConfirmDelete(false);
    });
  };
  return (
    <>
      {ManualUnmappedMasterTagListDataLoading &&
        UnmappedCustomMasterTagListDataLoading &&
        updatedUnmappedMasterTagList.data.length == 0 &&
        tagListData?.length == 0 &&
        filteredColumnList.length == 0 && <Loader />}
      {!ManualUnmappedMasterTagListDataLoading &&
        !UnmappedCustomMasterTagListData &&
        (!ManualUnmappedMasterTagListData || ManualUnmappedMasterTagListData?.length === 0) && (
          <Root>
            <Typography color={theme.colors.darkGrey} variant="h3">
              {t('there_are_no_tag_template_lists_yet')}
            </Typography>
            <CreateButton>
              <Button
                variant="primary"
                disabled={false}
                onClick={() => {
                  gotoMasterTagListDashBoard();
                }}
              >
                {t('create_a_new_tag_template_list')}
              </Button>
            </CreateButton>
          </Root>
        )}
      {!manualUnmappedMachineTagsLoading &&
        !ManualUnmappedMasterTagListDataLoading &&
        !UnmappedCustomMasterTagListDataLoading &&
        ManualUnmappedMasterTagListData &&
        UnmappedCustomMasterTagListData &&
        manualUnmappedMachineTags &&
        updatedUnmappedMasterTagList &&
        tagListData &&
        ManualUnmappedMasterTagListData?.length !== 0 &&
        UnmappedCustomMasterTagListData?.length !== 0 &&
        filteredColumnList.length !== 0 && (
          <ContentContainer>
            <SearchBar>
              <IconContainer>
                <FontAwesomeIcon style={{ fontSize: '1rem', cursor: 'auto' }} icon={faSearch} />
              </IconContainer>
              <SearchBox
                type="text"
                placeholder="Search Tags..."
                onChange={(e) => {
                  handleSearchChange(e.target.value.toUpperCase());
                }}
              />
              {!machineToMaster && (
                <AddCustomButtonContainer>
                  <Button
                    bgColor={theme.colors.mediumBlue}
                    variant={'primary'}
                    onClick={addNewTagListRow}
                  >
                    Add a Custom Tag +
                  </Button>
                </AddCustomButtonContainer>
              )}
            </SearchBar>
            <TableContainer>
              {machineToMaster ? (
                <UnmappedMachineTags
                  unmappedData={updatedUnmappedMachineTagList || []}
                  headerBgColor={theme.colors.lightGrey1}
                  digitalEdgeType={updatedUnmappedMachineTagList.digitalEdgeType}
                  updateRowData={forwardRowData}
                  columnList={filteredColumnList}
                  assignMasterTag={handleAssignMasterTagButtonClick}
                />
              ) : (
                <UnmappedMasterTagList
                  unmappedData={updatedUnmappedMasterTagList || []}
                  headerBgColor={theme.colors.lightGrey1}
                  digitalEdgeType={UnmappedCustomMasterTagListData.digitalEdgeType}
                  tagListData={tagListData}
                  updateRowData={forwardRowData}
                  columnList={filteredColumnList}
                  assignMachineTag={handleAssignTagButtonClick}
                />
              )}
            </TableContainer>
            {!machineToMaster && (
              <>
                <CustomTagsTitle>
                  <Typography variant="h2">Custom Tags</Typography>
                  <DeleteButtonContainer>
                    {isDeletingCustomMtl && <Loader size={40} margin={0} />}
                    {!isDeletingCustomMtl && (
                      <Button
                        variant="danger"
                        onClick={() => {
                          setIsViewConfirmDelete(true);
                        }}
                        disabled={selectTagListToDelete.length === 0}
                      >
                        {selectTagListToDelete.length === 1 ? 'Delete a Tag' : 'Delete Tags'}
                      </Button>
                    )}
                  </DeleteButtonContainer>
                </CustomTagsTitle>
                <TableContainer>
                  <UnmappedCustomMasterTagList
                    isDataLoading={UnmappedCustomMasterTagListDataLoading}
                    headerBgColor={theme.colors.lightGrey1}
                    digitalEdgeType={UnmappedCustomMasterTagListData.digitalEdgeType}
                    tagListData={tagListData}
                    updateRowData={forwardRowData}
                    columnList={filteredCustomColumnList}
                    assignMachineTag={handleAssignCustomTagButtonClick}
                    handleOnChangeCheckBox={handleOnChangeCheckBox}
                  />
                </TableContainer>
                <WarningPrompt
                  helperText={`Are you sure you want to delete selected tags?`}
                  isConfirmPrompt
                  isVisible={isViewConfirmDelete}
                  onCancelCallback={() => setIsViewConfirmDelete(false)}
                  onConfirmCallback={() => deleteSelectedRows()}
                  title={selectTagListToDelete.length === 1 ? 'Delete a Tag' : 'Delete Tags'}
                />
              </>
            )}
          </ContentContainer>
        )}
      <ButtonsContainer>
        <Button
          disabled={false}
          variant="thin"
          onClick={() => {
            window.location.assign(JBTRoutes.onboardingPage.replace(':machineId', machineId));
          }}
        >
          Cancel
        </Button>
        <Button
          bgColor={theme.colors.mediumBlue}
          disabled={
            tagListData.length > 0
              ? !hasAllRequiredData(
                  tagListData,
                  filteredCustomColumnList.filter(
                    (column) => !notMissingRequired.includes(column.name)
                  )
                )
              : false
          }
          variant="primary"
          onClick={() => {
            handleContinue();
          }}
        >
          Continue
        </Button>
      </ButtonsContainer>
    </>
  );
};

export default MapTags;
