// Third Party
import React, { useEffect, useMemo, useState, useRef, MutableRefObject } from 'react';
import saveAs from 'file-saver';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faInfoCircle,
  faPencil,
  faTrashCan,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { sortBy } from 'lodash';
import { toast } from 'react-toastify';

// Components
import {
  BaseSelect,
  BaseTable,
  Button,
  Column,
  Input,
  Loader,
  Pagination,
  Row,
  SearchInput,
  Typography,
  WarningPrompt
} from 'components';
import {
  ButtonBar,
  TutorialButton,
  UploadCSVModal,
  UnitClassesModal
} from 'components/machine-health';

// Types
import { BaseType, ColumnConfig, SortState } from 'types';
import { MachineMasterTag, MachineTagType, MachineUnitClass } from 'types/protein';

// Constants
import { MACHINE_TAG_DATA_TYPES } from 'constants/machineTags';
import { PAGE_LENGTH, SEARCH_COOLDOWN } from 'constants/search';
import { tutorialPlaceholderStepsData } from 'constants/machineConfig';

// API
import {
  useDeleteMachineMasterTagMutation,
  useGetMachineMasterTagListQuery,
  useGetMachineTagUnitClassesQuery,
  useImportConfiguredMasterTagListMutation,
  useUpdateMachineMasterTagMutation
} from 'api';

// Theme
import theme from 'themes';

// Hooks & Providers
import { useMachine, useSearch, useSort } from 'hooks';
import { useLanguage } from 'providers';

// Helpers
import { addQuotes } from 'helpers/strings';
import { mapBusinessUnitId } from 'helpers/machine';

// Styling
const Container = styled.div`
  flex-grow: 1;
  width: 100%;
  padding-left: 6rem;
  padding-right: 6rem;
  padding-bottom: 3rem;
`;

const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  width: 2.75rem;
  height: 2.75rem;
`;

const DisclaimerContainer = styled.div`
  background-color: ${(props) => props.theme.colors.lightGrey1};
  border: 0.05rem solid;
  border-color: ${(props) => props.theme.colors.mediumGrey1};
  border-radius: 0.5rem;
  width: 100%;
  height: 2.25rem;
  padding: 1.475rem 1.25rem 1.475rem 1.25rem;
  display: flex;
  margin: 0 0 1.25rem;
  align-items: center;
`;

const WordBreak = styled.span<{ capitalize?: boolean }>`
  text-transform: ${(props) => (props.capitalize ? 'capitalize' : 'none')};
  word-break: break-all;
`;

const IconContainer = styled.div`
  display: flex;
  margin-bottom: 0;
`;

const StyledSearchWrapper = styled.div`
  height: 2.625rem;
  width: 19.25rem;
`;

/* Initial states for searching */
const masterTagListSearchByProps = ['friendlyName', 'id'];

type MasterTagListTableColumns = keyof Pick<
  MachineMasterTag,
  'id' | 'friendlyName' | 'unitClassId' | 'dataType'
>;

const ITEMS_PER_PAGE = PAGE_LENGTH.XLARGE;

// Instantiate sort state outside of the component
// otherwise we get an infinite loop in the useSort hook
// because the object is a different instance each time
const SORT_STATE = { id: SortState.ascending };

const EditField = (props: {
  tagId: string;
  columnId: MasterTagListTableColumns;
  displayValue: string;
  placeholder: string;
  currentEditingFriendlyName: MutableRefObject<string>;
}) => {
  const [value, setValue] = useState(props.displayValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    props.currentEditingFriendlyName.current = event.target.value;
  };

  return (
    <Input
      placeholder={props.placeholder}
      value={value}
      onChange={handleChange}
      borderRadius="0.5rem"
    />
  );
};

const EditDropdownField = (props: {
  tagId: string;
  columnId: MasterTagListTableColumns;
  displayValue: string;
  currentRef: MutableRefObject<string>;
  options?: MachineUnitClass[] | MachineTagType[];
}) => {
  const [value, setValue] = useState(props.displayValue);

  // Display the dropdown values with their names, but send only the unit class ID to the API
  const selectOptions = sortBy(props.options, (obj: MachineUnitClass) => obj?.name)
    .map((option) => ({
      value: (option as MachineUnitClass).id,
      label: (option as MachineUnitClass).name
    }))
    .filter((option) => option.label !== props.displayValue);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    setValue(value);
    props.currentRef.current = value;
  };

  return (
    <BaseSelect
      variant="white"
      value={value}
      handleChange={handleChange}
      options={selectOptions ?? []}
      placeholder={props.displayValue === '--' ? 'Select Unit Class' : props.displayValue}
      id={props.tagId}
    />
  );
};

const generateColumnConfigs = (
  currentEditingRow: string,
  onEditIconClick: (id: string) => void,
  onSaveIconClick: (id: string) => void,
  onDeleteIconClick: (id: string) => void,
  onResetEdit: () => void,
  currentEditingFriendlyName: MutableRefObject<string>,
  currentEditingUnitClass: MutableRefObject<string>,
  currentEditingDataType: MutableRefObject<string>,
  dataTypes: MachineTagType[],
  displayableUserLanguage: string,
  unitClasses?: MachineUnitClass[]
): ColumnConfig[] => {
  return [
    {
      title: 'Tag Name',
      dataIndex: 'id',
      key: 'id',
      render: (_, value) => {
        const { id } = value as MachineMasterTag;
        return <WordBreak>{id}</WordBreak>;
      }
    },
    {
      title: `Friendly Name (${displayableUserLanguage})`,
      dataIndex: 'friendlyName',
      key: 'friendlyName',
      render: (_, value) => {
        const { id, friendlyName } = value as MachineMasterTag;
        const displayValue = friendlyName ?? '--';

        return currentEditingRow === id ? (
          <EditField
            tagId={id}
            columnId={'friendlyName'}
            displayValue={displayValue}
            placeholder={'Localized Value'}
            currentEditingFriendlyName={currentEditingFriendlyName}
          />
        ) : (
          <WordBreak>{displayValue}</WordBreak>
        );
      }
    },
    {
      title: 'Unit Class',
      dataIndex: 'unitClassId',
      key: 'unitClassId',
      render: (_, value) => {
        const { id, unitClassId } = value as MachineMasterTag;
        const foundUnitClass = unitClasses?.find((unitClass) => unitClass.id === unitClassId);
        const displayValue = foundUnitClass ? foundUnitClass.name : '--';

        return currentEditingRow === id ? (
          <EditDropdownField
            columnId={'unitClassId'}
            displayValue={displayValue}
            tagId={id}
            options={unitClasses}
            currentRef={currentEditingUnitClass}
          />
        ) : (
          displayValue
        );
      },
      width: 165
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      key: 'dataType',
      render: (_, value) => {
        const { id, dataType } = value as MachineMasterTag;
        const foundDisplayValue = dataTypes?.find((type) => type.id === dataType);
        const displayValue = foundDisplayValue ? foundDisplayValue.name : '--';

        return currentEditingRow === id ? (
          <EditDropdownField
            columnId={'dataType'}
            currentRef={currentEditingDataType}
            displayValue={displayValue}
            options={dataTypes}
            tagId={id}
          />
        ) : (
          <WordBreak capitalize>{displayValue}</WordBreak>
        );
      },
      width: 135
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, value) => {
        const { id } = value as MachineMasterTag;
        return (
          <Row marginBottom="0">
            <Column>
              {currentEditingRow === id ? (
                <IconContainer>
                  <IconButton onClick={() => onDeleteIconClick(id)}>
                    <FontAwesomeIcon
                      style={{ fontSize: '1rem' }}
                      color={theme.colors.negativeRed}
                      icon={faTrashCan}
                    />
                  </IconButton>
                  <IconButton onClick={() => onSaveIconClick(id)}>
                    <FontAwesomeIcon
                      color={theme.colors.onTrackGreen}
                      style={{ fontSize: '1rem' }}
                      icon={faCheck}
                    />
                  </IconButton>
                  <IconButton onClick={() => onResetEdit()}>
                    <FontAwesomeIcon
                      color={theme.colors.atRiskYellow}
                      style={{ fontSize: '1rem' }}
                      icon={faXmark}
                    />
                  </IconButton>
                </IconContainer>
              ) : (
                <IconButton onClick={() => onEditIconClick(id)}>
                  <FontAwesomeIcon style={{ fontSize: '1rem' }} icon={faPencil} />
                </IconButton>
              )}
            </Column>
          </Row>
        );
      }
    }
  ];
};

const MachineMasterTagList = (): JSX.Element => {
  const { machine } = useMachine();
  const businessUnitId = mapBusinessUnitId(machine?.businessUnit) || 3;
  const { languageId, languageNameInEnglish } = useLanguage();

  // Fetch master tags
  const {
    data: machineTags,
    isFetching: isFetchingMachineTags,
    error: machineTagsError
  } = useGetMachineMasterTagListQuery({ businessUnitId, languageId });

  // Fetch unit classes
  const {
    data: machineUnitClasses,
    isFetching: isFetchingTagUnitClass,
    error: machineUnitClassError
  } = useGetMachineTagUnitClassesQuery();

  const [deleteMachineMasterTag] = useDeleteMachineMasterTagMutation();
  const [updateMachineMasterTag] = useUpdateMachineMasterTagMutation();
  const [importConfiguredMasterTagList, { isLoading: isUpdating }] =
    useImportConfiguredMasterTagListMutation();

  // Local state for table interactions
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentEditingRow, setCurrentEditingRow] = useState('');
  const [masterTagToDelete, setMasterTagToDelete] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [searchVal, setSearchVal] = useState<string>('');
  const [showWarningPrompt, setShowWarningPrompt] = useState(false);
  const [tableData, setTableData] = useState(machineTags);
  const [uploadCSVModal, setUploadCSVModal] = useState<boolean>(false);
  const [unitClassesModal, setUnitClassesModal] = useState<boolean>(false);

  const searchedMasterTagList = useSearch<MachineMasterTag>(
    searchVal,
    tableData,
    masterTagListSearchByProps
  );

  const sortedMasterTagList = useSort<MachineMasterTag>(SORT_STATE, searchedMasterTagList);

  const paginatedMasterTagList = useMemo(() => {
    // pageNumber is 0-indexed for array slicing
    const start = pageNumber * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sortedMasterTagList.slice(start, end);
  }, [pageNumber, sortedMasterTagList]);

  useEffect(() => {
    // Reset page number to 0 when search value changes
    setPageNumber(0);
  }, [searchVal]);

  const currentEditingFriendlyName = useRef('');
  const currentEditingUnitClass = useRef('');
  const currentEditingDataType = useRef('');

  const isFetching = isFetchingMachineTags || isFetchingTagUnitClass;
  const hasError = machineTagsError || machineUnitClassError;
  const hasData = machineTags && machineUnitClasses && tableData;

  // Event Handlers
  const onEditIconClick = (id: string) => {
    setCurrentEditingRow(id);

    // Reset refs
    currentEditingFriendlyName.current = '';
    currentEditingUnitClass.current = '';
    currentEditingDataType.current = '';
  };

  const onResetEdit = () => {
    setCurrentEditingRow('');

    // Reset refs
    currentEditingFriendlyName.current = '';
    currentEditingUnitClass.current = '';
    currentEditingDataType.current = '';
  };

  const onSaveIconClick = (id: string) => {
    // Explicitly reject mutations when data is not available
    if (!hasData) return;

    const matchedMasterTag = tableData.find((tag) => tag.id === id) as MachineMasterTag;
    if (!matchedMasterTag) return;

    const newFriendlyName = currentEditingFriendlyName.current
      ? currentEditingFriendlyName.current
      : matchedMasterTag.friendlyName;

    const newUnitClassId = currentEditingUnitClass.current
      ? currentEditingUnitClass.current
      : matchedMasterTag.unitClassId;

    const newDataType = currentEditingDataType.current
      ? currentEditingDataType.current
      : matchedMasterTag.dataType;

    updateMachineMasterTag({
      tagId: matchedMasterTag.id,
      friendlyName: newFriendlyName,
      unitClassId: newUnitClassId,
      dataType: newDataType,
      languageId: languageId,
      businessUnitId
    })
      .unwrap()
      .then((masterTagResponse) => {
        if (masterTagResponse) {
          toast.success('Updated master tag!', {
            toastId: 'master-tag-updated'
          });
        } else {
          toast('⚠️ There was a problem updating the master tag');
        }
      })
      .catch(async (err) => {
        console.error('Failed to update master tag list', err);
        toast('⚠️ There was a problem updating the master tag');
      });

    // Make row not editable once user clicks
    setCurrentEditingRow('');

    // Reset refs
    currentEditingFriendlyName.current = '';
    currentEditingUnitClass.current = '';
  };

  const onDeleteIconClick = (id: string) => {
    // prompt user to confirm delete
    setShowWarningPrompt(true);
    setMasterTagToDelete(id);
  };

  useEffect(() => {
    if (confirmDelete && masterTagToDelete) {
      deleteMachineMasterTag({ businessUnitId, tagId: masterTagToDelete })
        .unwrap()
        .catch((err) => {
          console.error('Failed to delete machine master tag', err);
          toast('⚠️ There was a problem deleting the master tag');
        });

      setShowWarningPrompt(false);
      setConfirmDelete(false);
      setMasterTagToDelete(null);
    }
  }, [confirmDelete, masterTagToDelete]);

  // Update table columns based on user action
  const columnConfigs = useMemo(
    () =>
      generateColumnConfigs(
        currentEditingRow,
        onEditIconClick,
        onSaveIconClick,
        onDeleteIconClick,
        onResetEdit,
        currentEditingFriendlyName,
        currentEditingUnitClass,
        currentEditingDataType,
        MACHINE_TAG_DATA_TYPES,
        languageNameInEnglish,
        machineUnitClasses
      ),
    [
      currentEditingRow,
      machineUnitClasses,
      onEditIconClick,
      onSaveIconClick,
      onResetEdit,
      currentEditingFriendlyName,
      currentEditingUnitClass,
      onDeleteIconClick
    ]
  );

  // Required to update local state with fetched data once available
  useEffect(() => {
    setTableData(machineTags?.map((tag) => ({ ...tag, key: tag.id })));
  }, [machineTags]);

  if (hasError) {
    <Typography color="negativeRed">Failed to load data</Typography>;
  }

  if (isFetching || isUpdating) {
    return <Loader />;
  }

  const downloadMachineConfigsCSV = () => {
    const csv: BlobPart[] = [];

    // need BOM so excel can open and save as UTF-8
    csv.push('\uFEFF');

    csv.push(
      [
        addQuotes('ID'),
        addQuotes('Friendly Name'),
        addQuotes('Unit Class ID'),
        addQuotes('Unit Class Name'),
        addQuotes('Language ID'),
        addQuotes('Data Type'),
        '\n'
      ].join(',')
    );

    if (machineTags) {
      for (const item of machineTags) {
        const row = [
          addQuotes(item.id),
          addQuotes(item.friendlyName || ''),
          addQuotes(item.unitClassId || ''),
          addQuotes(item.unitClassName || ''),
          addQuotes(languageId || 'en'),
          addQuotes(item.dataType || ''),
          '\n'
        ].join(',');
        csv.push(row);
      }
    }

    saveAs(
      new Blob(csv, { type: 'text/csv;charset=utf-8', endings: 'native' }),
      `machine-config-master-tag-list.csv`
    );
  };

  const uploadMachineConfigsCSV = (currentFile: File | null) => {
    if (currentFile === null || !businessUnitId) {
      console.error('Trying to upload null file');
      return;
    }

    importConfiguredMasterTagList({
      file: currentFile,
      businessUnitId,
      languageId
    })
      .unwrap()
      .then(() => {
        toast.success(`Master Tag List imported`);
      })
      .catch((error) => {
        toast.error(
          `Failed importing Master Tag List${error?.data?.detail ? `: ${error.data.detail}` : ''}`
        );
        console.error(error?.data?.detail || error);
      });

    setUploadCSVModal(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchVal(event.target.value);
  };

  return (
    <Container>
      <ButtonBar title="" padding="1.375rem 0">
        <StyledSearchWrapper>
          <SearchInput
            borderRadius="0.625rem"
            onChange={debounce(handleSearchChange, SEARCH_COOLDOWN)}
            placeholder="Search by Tag Name or Friendly Name"
            variant="white"
          />
        </StyledSearchWrapper>
        <Button variant="primary" width="8.75rem" onClick={() => setUnitClassesModal(true)}>
          Unit Classes
        </Button>
        <Button variant="primary" width="8.75rem" onClick={() => setUploadCSVModal(true)}>
          Upload CSV
        </Button>
        <Button variant="primary" width="8.75rem" onClick={() => downloadMachineConfigsCSV()}>
          Download CSV
        </Button>
        <TutorialButton stepsData={tutorialPlaceholderStepsData} />
      </ButtonBar>
      <DisclaimerContainer title="">
        <FontAwesomeIcon icon={faInfoCircle} />
        <Typography style={{ marginTop: '1.15rem', paddingLeft: '0.65rem' }} size="0.8125rem">
          Any name change will take place on all machines that use the same tag. Friendly names on
          this page can be entered in {languageNameInEnglish}.
        </Typography>
      </DisclaimerContainer>
      <BaseTable
        columnConfigs={columnConfigs}
        data={paginatedMasterTagList}
        renderCustomEmptyText={() => {
          return (
            <Typography
              color="darkGrey"
              weight="medium"
              style={{ marginLeft: '1.25rem', marginTop: '1.5rem' }}
            >
              No tags available.
            </Typography>
          );
        }}
        rowKey={(record: BaseType) => `${record.id}`}
        title="Master Tag List"
      />
      <Pagination
        itemsPerPage={ITEMS_PER_PAGE}
        numItems={sortedMasterTagList.length}
        onPageChange={(selected: number) => setPageNumber(selected)}
        currentPage={pageNumber}
      />
      <UploadCSVModal
        cancelLabel="Back"
        description={
          <>
            Before uploading make sure you have all the fields including ID, Friendly Name, Unit
            Class ID, Unit Class Name, Language ID, and Data Type.
            <p>
              Unit Class Names and Unit Class IDs can be found in the Unit Class Table on the
              previous page.
            </p>
          </>
        }
        setVisible={setUploadCSVModal}
        title="Upload Master Tag List"
        uploadCallback={(currentFile: File | null) => uploadMachineConfigsCSV(currentFile)}
        uploadLabel="Upload"
        visible={uploadCSVModal}
      />
      <UnitClassesModal handleModal={setUnitClassesModal} isOpen={unitClassesModal} />
      <WarningPrompt
        helperText={`The Master Tag ${masterTagToDelete} will be no longer available for the tags in machine health. Are you sure you want to delete it?`}
        isConfirmPrompt
        isVisible={showWarningPrompt}
        onCancelCallback={() => setShowWarningPrompt(false)}
        onConfirmCallback={() => setConfirmDelete(true)}
        title="Confirm Deletion"
      />
    </Container>
  );
};

export default MachineMasterTagList;
