import React, { ReactElement, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import {
  faPencil,
  faLandmark,
  faCaretRight,
  faTrashCan,
  faServer,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

// Constants
import { JBTRoutes } from 'constants/routes';

// Types
import { DigitalEdgeType, ModalSize } from 'types';
import {
  MasterTagListAttributeMqtt,
  MasterTagListAttributeDsdm,
  MasterTagListAttributeKdm,
  MasterTagListHeader,
  MasterTagListPayload,
  WipTagListRowData,
  MasterTagListColumn,
  MasterTagListWrapped,
  TagListRowStatus,
  WipTagListRowErrorData,
  Tabs
} from 'types/machine-management';
import { APIError } from 'types/errors';

// Components
import {
  BaseSelect,
  Breadcrumbs,
  Button,
  Loader,
  Modal,
  TooltipWrapper,
  Typography,
  WarningPrompt
} from 'components';
import MasterTagListDetailsTable from './MasterTagListDetailsTable';
import MtlImportSummaryFlyout from './MtlImportSummaryFlyout';
import VersionHistoryFlyout from 'pages/MachineManagement/MasterTagList/VersionHistoryFlyout';

// API
import {
  useGetMachineTypesQuery,
  useGetBusinessUnitsQuery,
  useGetMachineModelsQuery,
  useDeleteMasterTagListVersionMutation,
  useGetMasTagListTableColumnQuery,
  useSendMasTagListTableColumnDataMutation,
  useGetMasterTagListVersionByIdQuery
} from 'api';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Hooks
import { useQueryParams } from 'hooks';

// Helpers
import { snakeCaseKeysDeep } from 'helpers';
import MachinesMasterModal from './MachinesMasterModal';
import { WarningIconContainer } from 'pages/AlertsPage/CreateAlert/index.elements';
import { useTranslation } from 'react-i18next';

// Row validation helper functions
export const hasAllRequiredData = (
  tagListData: WipTagListRowData[],
  columnList?: MasterTagListColumn[]
): boolean => {
  const requiredCols: string[] = [];
  if (columnList) {
    columnList.forEach((column) => {
      if (column.required) {
        requiredCols.push(column.name);
      }
    });
  }
  if (tagListData.length > 0 && requiredCols.length > 0) {
    return tagListData.every((row) => {
      return requiredCols.every((reqColName) => {
        const currentVal = row.data[reqColName];
        if (reqColName === 'data_type') {
          return currentVal !== undefined && currentVal !== '' && currentVal !== null;
        } else if (reqColName === 'scan_rate') {
          return currentVal !== undefined && currentVal !== 0 && currentVal !== null;
        } else if (reqColName === 'scaling') {
          return currentVal !== undefined && currentVal !== '' && currentVal !== null;
        }
        return currentVal !== undefined && currentVal !== null;
      });
    });
  }
  return false;
};

// Styling
const SubHeader = styled.div`
  height: 13rem;
  margin: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 0.125rem solid;
  border-radius: 0.625rem;
  border-color: #e2e2e2;
  background-color: ${(props) => props.theme.colors.lightGrey2};
`;
const TagListTableContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: auto;
  padding-bottom: 5.25rem;
`;
const columnStyles = `
  height: 9.375rem;
  width: 45%;
  margin-left: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  border: 0.125rem solid;
  border-radius: 0.625rem;
  border-color: #e2e2e2;
  background-color: #fff;
`;
const SubHeaderColumn = styled.div`
  ${columnStyles}
  align-items: center;
  flex-basis: 30%;
  position: relative;
`;
const SubHeaderColumnSelect = styled.div`
  ${columnStyles}
  border: none;
  background-color: inherit;
  flex-basis: 30%;
`;

const TagListHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  position: relative;
  height: 4.6875rem;
  flex-shrink: 0;
  flex-grow: 0;
`;
const TagListInput = styled.input`
  font-size: 1rem;
  &:focus {
    outline-color: ${(props) => props.theme.colors.mediumBlue3};
  }
`;
const DescriptionTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0.375rem;
  padding: 1rem;
  overflow: auto;
  resize: none;

  &:focus {
    outline-color: ${(props) => props.theme.colors.mediumBlue3};
  }
`;

const SaveModalContainer = styled.div`
  width: 100%;
  padding: 0.5rem 2rem;

  p {
    margin-bottom: 0.5rem;
  }
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.75rem;
  height: 4.375rem;
  overflow: auto;
  resize: none;
  margin-bottom: 0.5rem;

  border-radius: 0.5rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.mediumGrey1};

  &:focus {
    outline-color: ${(props) => props.theme.colors.mediumBlue3};
  }
`;
const SelectContainer = styled.div`
  height: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const IndividualSelect = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 1.5rem;
`;
const TagListNameContainer = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 0;
`;
const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
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
const ButtonsContainer = styled.div`
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

const CustomizedButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

const TopButtonsContainer = styled(ButtonsContainer)`
  display: flex;
  border-top: none;
  flex-grow: 1;
  justify-content: flex-end;

  button {
    margin: 0 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

type Props = {
  toggleContent?: boolean;
};
const Footer = styled.div<Props>`
  width: ${({ toggleContent }) =>
    toggleContent ? 'calc(100% - 4.325rem)' : 'calc(100% - 16.325rem)'};
  z-index: 13;
  position: fixed;
  bottom: 2rem;
`;

const MasterTagListDashBoard = ({ toggleContent }: Props): ReactElement => {
  // Query parameter retrieval
  const query = useQueryParams();
  const mtlId = query.get('mtlId') || '';
  const versionId = query.get('versionId') || undefined;
  const duplicate = query.get('duplicate') || false;
  const { t } = useTranslation(['mh']);
  const theme = useTheme();
  const history = useHistory();

  const [businessUnit, setBusinessUnit] = useState<string>('');
  const [businessUnitId, setBusinessUnitId] = useState<string>('');
  const [machineNameId, setMachineNameId] = useState<string>('');
  const [digitalEdgeType, setDigitalEdgeType] = useState<DigitalEdgeType>();
  const [digitalEdgeTypeId, setDigitalEdgeTypeId] = useState<string>('');
  const [machineModel, setMachineModel] = useState<string>('');
  const [machineModelId, setMachineModelId] = useState<string>('');
  const [machineType, setMachineType] = useState<string>('');
  const [masterTagListDesc, setMasterTagListDesc] = useState<string>('');
  const [isEditTagName, setIsEditTagName] = useState<boolean>(false);
  const [showTagListTable, setShowTagListTable] = useState<boolean>(false);
  const [tagListName, setTagListName] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showVersionHistoryFlyout, setShowVersionHistoryFlyout] = useState<boolean>(false);
  const [showMachinesMasterModal, setShowMachinesMasterModal] = useState<boolean>(false);
  const [showWarningPrompt, setShowWarningPrompt] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [versionComment, setVersionComment] = useState<string>();
  const [tagListData, setTagListData] = useState<WipTagListRowData[]>([]);
  const [tagListDataWithErrors, setTagListDataWithErrors] = useState<WipTagListRowErrorData[]>([]);
  const [showImportSummary, setShowImportSummary] = useState<boolean>(false);
  const [highlightedRow, setHighlightedRow] = useState<number>();
  const [isTagsDeleted, setIsTagsDeleted] = useState(false);

  // API hooks
  const { data: machineTypes } = useGetMachineTypesQuery();
  const filteredMachineTypes = machineTypes?.filter((mt) => !mt.name.includes('model_'));
  const { data: businessUnits } = useGetBusinessUnitsQuery();
  const { data: machineModels } = useGetMachineModelsQuery(machineType);
  const { data: columnListData, isFetching: isColoumListDataFetching } =
    useGetMasTagListTableColumnQuery(digitalEdgeType ? digitalEdgeType : skipToken);
  const { data: masterTagListWrapped, isFetching: isMTLFetching } =
    useGetMasterTagListVersionByIdQuery(
      versionId
        ? { masterTagListId: mtlId, masterTagListVersionId: versionId }
        : { masterTagListId: mtlId }
    );
  const [saveMasterTagListData] = useSendMasTagListTableColumnDataMutation();
  const [deleteMasterTagListVersion] = useDeleteMasterTagListVersionMutation();

  useEffect(() => {
    if (masterTagListWrapped && !isMTLFetching && tagListData.length == 0 && !isTagsDeleted) {
      setMachineType(masterTagListWrapped?.masterTagList?.machineType?.code || '');
      setMachineModel(masterTagListWrapped?.masterTagList?.machineModel?.id || '');
      setMachineModelId(masterTagListWrapped?.masterTagList?.machineModel?.id || '');
      setBusinessUnit(masterTagListWrapped?.masterTagList?.businessUnit?.id || '');
      setBusinessUnitId(masterTagListWrapped?.masterTagList?.businessUnit?.id || '');
      setTagListName(
        duplicate
          ? masterTagListWrapped?.masterTagList?.name + '_duplicate' || ''
          : masterTagListWrapped?.masterTagList?.name || ''
      );
      setMasterTagListDesc(masterTagListWrapped?.masterTagList?.description || '');
      setDigitalEdgeTypeId(masterTagListWrapped?.masterTagList?.digitalEdgeType || '');
      setMachineNameId(masterTagListWrapped.masterTagList?.machineType?.code || '');
      switch (masterTagListWrapped?.masterTagList?.digitalEdgeType + '') {
        case DigitalEdgeType.KDM:
          setDigitalEdgeType(DigitalEdgeType.KDM);
          break;
        case DigitalEdgeType.DSDM:
          setDigitalEdgeType(DigitalEdgeType.DSDM);
          break;
        case DigitalEdgeType.MQTT:
          setDigitalEdgeType(DigitalEdgeType.MQTT);
          break;
        default:
          break;
      }
      if (masterTagListWrapped?.masterTagList?.digitalEdgeType) {
        setShowTagListTable(true);
        const tagDataFromExistingVersion = constructMasterTagListTableData(masterTagListWrapped);
        setTagListData(tagDataFromExistingVersion);
      }
    }
  }, [masterTagListWrapped, tagListData]);

  const constructMasterTagListTableData = (mtl?: MasterTagListWrapped) => {
    const tagListRowData: WipTagListRowData[] = [];

    mtl?.masterTagListAttributeDsdm?.forEach((dsdm, idx) => {
      tagListRowData.push({
        row: idx,
        rowStatus: TagListRowStatus.Valid,
        data: {
          ...snakeCaseKeysDeep(dsdm)
        }
      });
    });
    mtl?.masterTagListAttributeKdm?.forEach((kdm, idx) => {
      tagListRowData.push({
        row: idx,
        rowStatus: TagListRowStatus.Valid,
        data: {
          ...snakeCaseKeysDeep(kdm)
        }
      });
    });
    mtl?.masterTagListAttributeMqtt?.forEach((mqtt, idx) => {
      tagListRowData.push({
        row: idx,
        rowStatus: TagListRowStatus.Valid,
        data: {
          ...snakeCaseKeysDeep(mqtt)
        }
      });
    });

    return tagListRowData;
  };

  const onTagListNameEditIconClick = () => {
    setIsEditTagName(true);
  };
  useEffect(() => {
    if (confirmDelete) {
      deleteMasterTagListVersion(
        versionId
          ? {
              masterTagListId: mtlId,
              masterTagListVersionId: versionId
            }
          : {
              masterTagListId: mtlId
            }
      )
        .unwrap()
        .then(() => {
          toast.success(`Tag Template List version deleted!`, {
            toastId: 'mtl-deleted'
          });
        })
        .catch((error) => {
          console.warn('Delete MTL version error: ', error);
          toast('⚠️ There was a problem while deleting the MTL version.');
        });
    }
  }, [confirmDelete, mtlId, versionId]);

  const goToMachineManagement = () => {
    history.push(`${JBTRoutes.machineManagement}?tab=${Tabs.MasterTagList}`);
  };
  const constructMasterTagListPayload = (
    kdm: MasterTagListAttributeKdm[],
    mqtt: MasterTagListAttributeMqtt[],
    dsdm: MasterTagListAttributeDsdm[]
  ) => {
    const masterTagList: MasterTagListHeader = {
      id: mtlId && duplicate === false ? mtlId : undefined,
      name: tagListName,
      description: masterTagListDesc,
      businessUnitId: businessUnitId,
      machineTypeId: machineNameId,
      machineModelId: machineModelId,
      digitalEdgeType: digitalEdgeTypeId
    };
    const payload: MasterTagListPayload = {
      versionComment: versionComment,
      masterTagList: masterTagList,
      masterTagListAttributeMqtt: mqtt,
      masterTagListAttributeDsdm: dsdm,
      masterTagListAttributeKdm: kdm
    };

    return payload;
  };

  const getTagListPayload = ():
    | MasterTagListAttributeDsdm[]
    | MasterTagListAttributeKdm[]
    | MasterTagListAttributeMqtt[] => {
    const draftTagList:
      | MasterTagListAttributeKdm[]
      | MasterTagListAttributeMqtt[]
      | MasterTagListAttributeDsdm[] = [];
    tagListData?.forEach((tagList) => {
      if (tagList.rowStatus && tagList.data) {
        draftTagList.push(
          tagList.data as
            | MasterTagListAttributeDsdm
            | MasterTagListAttributeKdm
            | MasterTagListAttributeMqtt
        );
      }
    });
    return draftTagList;
  };

  const updateTagListName = (name: string) => {
    setTagListName(() => name);
  };
  const handleTagsDeleted = (tagsDeleted: boolean) => {
    setIsTagsDeleted(tagsDeleted);
  };

  const requestVersionComment = () => {
    if (!hasRequiredFields) {
      toast.error(`Fix errors before saving.`);
    } else if (!saveTagListEnabled) {
      toast.error(`Provide required data before saving.`);
    } else {
      if (!versionComment) {
        setShowModal(true);
      } else {
        attachVersionComment();
      }
    }
  };

  const uploadMasterTagList = async () => {
    // Convert to expected payload
    let masterTagListPayload: MasterTagListPayload | undefined = undefined;
    switch (digitalEdgeType) {
      case DigitalEdgeType.KDM:
        masterTagListPayload = constructMasterTagListPayload(getTagListPayload(), [], []);
        break;
      case DigitalEdgeType.DSDM:
        masterTagListPayload = constructMasterTagListPayload([], [], getTagListPayload());
        break;
      case DigitalEdgeType.MQTT:
        masterTagListPayload = constructMasterTagListPayload([], getTagListPayload(), []);
        break;
      default:
        break;
    }

    if (masterTagListPayload) {
      await saveMasterTagListData(masterTagListPayload)
        .unwrap()
        .then(() => {
          toast.success(`Master TagList Saved Successfully!`);
          setShowModal(false);
          setVersionComment('');
          goToMachineManagement();
        })
        .catch((error: APIError) => {
          toast.error(`Master TagList save failed!: ${error.data}`);
          console.log(error);
        });
    } else {
      toast.error(`Master TagList save failed due to data loss. Please refresh and try again.`);
    }
  };
  const handleVersionCommentChange = (comment: string) => {
    setVersionComment(comment);
  };
  const attachVersionComment = async () => {
    if (versionComment) {
      await uploadMasterTagList();
    } else {
      toast.error(`Master TagList version comment is required!`);
    }
  };

  const onCloseCommentModal = () => {
    setShowModal(false);
  };

  // Click and change handlers
  const handleUpdateRowData = (tagList: WipTagListRowData[]) => {
    setTagListData(tagList);
  };
  const handleUpdateRowErrorData = (rowErrorData: WipTagListRowErrorData[]) => {
    setTagListDataWithErrors(rowErrorData);
  };
  const handleImportErrorSelect = (rowNumber: number) => {
    // Get the row
    const selectedRow = tagListData.find((row) => row.row === rowNumber);
    if (selectedRow) {
      // Set it as highlighted
      setHighlightedRow(rowNumber);
    }
  };

  const handleShowVersions = () => {
    setShowVersionHistoryFlyout(true);
  };

  const handleShowMachinesMaster = () => {
    setShowMachinesMasterModal(true);
  };

  // Reset the tag list data when the user changes the digital edge type
  useEffect(() => {
    setTagListData([]);
    setHighlightedRow(undefined);
  }, [digitalEdgeType]);

  // Check if all rows have required fields
  const hasRequiredFields = hasAllRequiredData(tagListData, columnListData);

  const saveTagListEnabled =
    hasRequiredFields &&
    tagListName !== '' &&
    masterTagListDesc !== '' &&
    digitalEdgeType &&
    businessUnit !== '' &&
    machineType !== '' &&
    machineModel !== '';

  const isTaglistDataUploaded = () => {
    if (tagListData.length > 0) {
      return true;
    }
    return false;
  };

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: t('tag_templates'),
            link: `${JBTRoutes.machineManagement}?tab=${Tabs.MasterTagList}`
          },
          { label: tagListName || t('tag_template_list_dashboard') }
        ]}
      />
      <Modal
        onClose={onCloseCommentModal}
        size={ModalSize.XSMALL_AUTO_HEIGHT}
        title="Save Tag Template List Version"
        visible={showModal}
        widthOverride="29.8125rem"
      >
        <SaveModalContainer>
          <Typography variant="body2" color={theme.colors.darkGrey}>
            Tag Template list versions can be viewed and edited from the Machine Management section
          </Typography>
          <CommentTextarea
            value={versionComment}
            placeholder="Enter Version Comment"
            onChange={(e) => {
              handleVersionCommentChange(e.target.value);
            }}
          />
        </SaveModalContainer>
        <ModalButtonsContainer>
          <Button onClick={onCloseCommentModal} bgColor={theme.colors.primaryBlue4}>
            Cancel
          </Button>
          <Button
            disabled={versionComment === '' || versionComment === undefined}
            onClick={attachVersionComment}
            bgColor={theme.colors.mediumBlue}
            variant="primary"
          >
            Save
          </Button>
        </ModalButtonsContainer>
      </Modal>
      <MachinesMasterModal
        visible={showMachinesMasterModal}
        masterTagListId={mtlId}
        masterTagListName={masterTagListWrapped?.masterTagList?.name}
        handleClose={() => setShowMachinesMasterModal(false)}
      />
      <TagListHeader>
        <TagListNameContainer>
          <IconButton>
            <FontAwesomeIcon style={{ fontSize: '1rem', cursor: 'auto' }} icon={faLandmark} />
          </IconButton>
          <TagListInput
            style={
              isEditTagName
                ? { border: `0.0625rem solid ${theme.colors.primaryBlue3}` }
                : { border: 'none' }
            }
            disabled={!isEditTagName}
            value={tagListName}
            placeholder={t('tag_template_list_name') as string}
            onBlur={() => {
              setIsEditTagName(false);
            }}
            onChange={(e) => {
              updateTagListName(e.target.value);
            }}
          />
          {!tagListName && !mtlId && (
            <WarningIconContainer top="0.3rem" style={{ position: 'unset', margin: 'auto' }}>
              <TooltipWrapper Tooltip={t('tag_template_list_name_is_required') as string}>
                <FontAwesomeIcon
                  fontSize="0.75rem"
                  color={theme.colors.negativeRed}
                  icon={faExclamationCircle}
                />
              </TooltipWrapper>
            </WarningIconContainer>
          )}
          <IconButton
            style={isEditTagName ? { visibility: 'hidden' } : { visibility: 'unset' }}
            onClick={onTagListNameEditIconClick}
          >
            <FontAwesomeIcon style={{ fontSize: '0.75rem' }} icon={faPencil} />
          </IconButton>
        </TagListNameContainer>
        <TopButtonsContainer>
          {tagListData.length > 0 && tagListDataWithErrors.length > 0 && (
            <Button bgColor={theme.colors.primaryBlue4} onClick={() => setShowImportSummary(true)}>
              View Import Results
            </Button>
          )}
          {mtlId && duplicate === false && (
            <>
              <CustomizedButton onClick={handleShowMachinesMaster}>
                <FontAwesomeIcon icon={faServer} />
                View Machines Using This Master
                <FontAwesomeIcon icon={faCaretRight} />
              </CustomizedButton>
              <CustomizedButton onClick={handleShowVersions}>
                <FontAwesomeIcon icon={faClock} />
                Versions
                <FontAwesomeIcon icon={faCaretRight} />
              </CustomizedButton>
              <CustomizedButton variant="danger" onClick={() => setShowWarningPrompt(true)}>
                <FontAwesomeIcon icon={faTrashCan} />
                Delete Tag List
              </CustomizedButton>
            </>
          )}
        </TopButtonsContainer>
      </TagListHeader>
      <SubHeader>
        <SubHeaderColumn>
          <DescriptionTextarea
            disabled={mtlId !== '' && duplicate === false}
            value={masterTagListDesc}
            onChange={(e) => {
              setMasterTagListDesc(() => e.target.value);
            }}
            placeholder={t('enter_tag_template_list_description') as string}
          />
          {!masterTagListDesc && !mtlId && (
            <WarningIconContainer top="1.2rem">
              <TooltipWrapper Tooltip={t('tag_template_list_description_is_required') as string}>
                <FontAwesomeIcon
                  fontSize="0.75rem"
                  color={theme.colors.negativeRed}
                  icon={faExclamationCircle}
                />
              </TooltipWrapper>
            </WarningIconContainer>
          )}
        </SubHeaderColumn>

        <SubHeaderColumnSelect>
          <SelectContainer>
            {!businessUnits || !machineTypes || !machineModels ? (
              <Loader margin="auto" />
            ) : (
              <>
                <IndividualSelect>
                  <BaseSelect
                    value={businessUnit}
                    variant={mtlId !== '' && duplicate === false ? 'disabled' : 'white'}
                    options={
                      businessUnits
                        ? businessUnits.map((bu) => ({
                            label: bu.displayName as string,
                            value: bu.id.toString()
                          }))
                        : ['']
                    }
                    handleChange={(event) => {
                      setBusinessUnit(() => event.target.value);
                      setBusinessUnitId(event.target.options[event.target.selectedIndex].value);
                    }}
                    placeholder={'[Business Unit]*'}
                    isRequied={!mtlId ? true : false}
                    tooltipText="Business Unit Is Required"
                  />
                </IndividualSelect>
                <IndividualSelect>
                  <BaseSelect
                    value={machineType}
                    variant={mtlId !== '' && duplicate === false ? 'disabled' : 'white'}
                    options={
                      filteredMachineTypes
                        ? filteredMachineTypes.map((mt) => ({
                            label: mt.name as string,
                            value: mt.code as string
                          }))
                        : ['']
                    }
                    handleChange={(event) => {
                      setMachineType(() => event.target.value);
                      setMachineNameId(
                        () => event.target.options[event.target.selectedIndex].value
                      );
                    }}
                    placeholder={'[Machine Type]*'}
                    isRequied={!mtlId ? true : false}
                    tooltipText="Machine Type Is Required"
                  />
                </IndividualSelect>
              </>
            )}
          </SelectContainer>
        </SubHeaderColumnSelect>
        <SubHeaderColumnSelect>
          <SelectContainer>
            {!businessUnits || !machineTypes || !machineModels ? (
              <Loader margin="auto" />
            ) : (
              <>
                <IndividualSelect>
                  <BaseSelect
                    value={machineModel}
                    variant={
                      (mtlId !== '' && duplicate === false) || !machineType ? 'disabled' : 'white'
                    }
                    options={
                      machineModels
                        ? machineModels.map((model) => ({
                            label: model.name as string,
                            value: model.id as string
                          }))
                        : ['']
                    }
                    handleChange={(event) => {
                      setMachineModel(event.target.value);
                      setMachineModelId(event.target.options[event.target.selectedIndex].value);
                    }}
                    placeholder={'[Machine Model]*'}
                    isRequied={(mtlId !== '' && duplicate === false) || !machineType ? false : true}
                    tooltipText="Machine Model Is Required"
                  />
                </IndividualSelect>
                <IndividualSelect>
                  <BaseSelect
                    value={digitalEdgeType || ''}
                    variant={mtlId !== '' && duplicate === false ? 'disabled' : 'white'}
                    options={[
                      {
                        label: 'PLC',
                        value: DigitalEdgeType.KDM
                      },
                      {
                        label: 'SQL',
                        value: DigitalEdgeType.DSDM
                      },
                      {
                        label: DigitalEdgeType.MQTT,
                        value: DigitalEdgeType.MQTT
                      }
                    ]}
                    handleChange={(event) => {
                      setDigitalEdgeType(
                        event.target.value !== ''
                          ? (event.target.value as DigitalEdgeType)
                          : undefined
                      );
                      setDigitalEdgeTypeId(
                        () => event.target.options[event.target.selectedIndex].value
                      );
                      // Show the table
                      setShowTagListTable(true);
                    }}
                    placeholder={'[Digital Edge Type]*'}
                    isRequied={!mtlId ? true : false}
                    tooltipText="Digital Edge Type Is Required"
                  />
                </IndividualSelect>
              </>
            )}
          </SelectContainer>
        </SubHeaderColumnSelect>
      </SubHeader>
      <TagListTableContainer>
        {showTagListTable && isColoumListDataFetching ? (
          <Loader margin="auto" />
        ) : showTagListTable && digitalEdgeType ? (
          columnListData && (
            <MasterTagListDetailsTable
              columnList={columnListData}
              tagListData={tagListData}
              updateTagListData={handleUpdateRowData}
              digitalEdgeType={digitalEdgeType}
              updateTagListWithErrorsData={handleUpdateRowErrorData}
              selectedRow={highlightedRow}
              handleTagsDeleted={handleTagsDeleted}
            />
          )
        ) : undefined}
      </TagListTableContainer>
      <Footer toggleContent={toggleContent}>
        <ButtonsContainer>
          <Button
            disabled={false}
            variant="thin"
            onClick={() => {
              goToMachineManagement();
            }}
          >
            Cancel
          </Button>
          <Button
            bgColor={theme.colors.mediumBlue}
            variant={'primary'}
            disabled={!isTaglistDataUploaded()}
            onClick={requestVersionComment}
          >
            Save Tag List
          </Button>
        </ButtonsContainer>
      </Footer>
      {showVersionHistoryFlyout && (
        <VersionHistoryFlyout
          masterTagListId={mtlId}
          onClose={() => setShowVersionHistoryFlyout(false)}
        />
      )}
      <WarningPrompt
        helperText={`Are you sure you want to delete the latest version of this Tag Template List?`}
        isConfirmPrompt
        isVisible={showWarningPrompt}
        onCancelCallback={() => setShowWarningPrompt(false)}
        onConfirmCallback={() => setConfirmDelete(true)}
        title="Confirm Deletion"
      />
      <MtlImportSummaryFlyout
        importData={tagListData}
        visible={showImportSummary}
        onClose={() => setShowImportSummary(false)}
        onErrorSelect={handleImportErrorSelect}
      />
    </>
  );
};

export default MasterTagListDashBoard;
