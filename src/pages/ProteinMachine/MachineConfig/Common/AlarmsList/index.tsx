// Third Party
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import saveAs from 'file-saver';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

// Components
import { BaseTable, Button, Loader, Pagination, SearchInput, Typography } from 'components';
import { ButtonBar, TutorialButton, UploadCSVModal } from 'components/machine-health';

// Types
import { BaseType, SortClickHandler, SortState } from 'types';
import { ConfiguredAlarm } from 'types/machine-health/alarms';

// API
import {
  useGetAccountInfoQuery,
  useGetMachineConfiguredAlarmsQuery,
  useImportConfiguredAlarmsMutation
} from 'api';

// Helpers
import { addQuotes } from 'helpers/strings';
import { generateColumnConfigs } from './utils';

// Constants
import { PAGE_LENGTH, SEARCH_COOLDOWN } from 'constants/search';
import { tutorialPlaceholderStepsData } from 'constants/machineConfig';

// Hooks
import { useSearch, useSort } from 'hooks';

// Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 6rem 1.375rem;
  width: 100%;
`;

const StyledSearchWrapper = styled.div`
  height: 2.625rem;
  width: 19.25rem;
`;

/* Initial states for searching */
const alarmListSearchByProps = ['text'];

// Instantiate sort state outside of the component
// otherwise we get an infinite loop in the useSort hook
// because the object is a different instance each time
const defaultSortState: Record<string, SortState> = {
  id: SortState.unsorted,
  text: SortState.unsorted,
  category: SortState.unsorted,
  locationGroup: SortState.unsorted
};

const ITEMS_PER_PAGE = PAGE_LENGTH.XLARGE;

const MachineConfigAlarmsList = (): ReactElement => {
  const { machineId } = useParams<{ machineId: string }>();
  const {
    data: machineInfo,
    isLoading: isLoadingAccountInfo
    // Don't prevent the page from displaying if the account info is not found; we aren't using the error.
  } = useGetAccountInfoQuery({
    machineId
  });

  const {
    data: configuredAlarms,
    isFetching,
    error
  } = useGetMachineConfiguredAlarmsQuery({ machineId: machineId });
  const [importConfiguredAlarms] = useImportConfiguredAlarmsMutation();

  const [pageNumber, setPageNumber] = useState<number>(0);
  const [searchVal, setSearchVal] = useState<string>('');
  const [sortState, setSortState] = useState<Record<string, SortState>>(defaultSortState);

  const [uploadCSVModal, setUploadCSVModal] = useState<boolean>(false);

  const searchedAlarmsList = useSearch<ConfiguredAlarm>(
    searchVal,
    configuredAlarms,
    alarmListSearchByProps
  );

  const sortedAlarmsList = useSort(sortState, searchedAlarmsList);

  const paginatedAlarmsList = useMemo(() => {
    // pageNumber is 0-indexed for array slicing
    const start = pageNumber * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sortedAlarmsList.slice(start, end);
  }, [pageNumber, sortedAlarmsList]);

  useEffect(() => {
    // Reset page number to 0 when search value changes
    setPageNumber(0);
  }, [searchVal]);

  // Interaction handler functions
  const sortHandler: SortClickHandler = (key, currentSortState) => {
    const newSortState = {
      ...defaultSortState,
      [key]:
        currentSortState === SortState.ascending
          ? SortState.descending
          : currentSortState === SortState.descending
          ? SortState.unsorted
          : SortState.ascending
    };
    setSortState(newSortState);
  };

  if (isFetching || isLoadingAccountInfo) {
    return <Loader />;
  }

  if (error) {
    console.error(error);
    <Typography color="negativeRed">Failed to load data</Typography>;
  }

  const uploadMachineConfigsCSV = async (currentFile: File | null) => {
    if (currentFile === null) {
      console.error('Trying to upload null file');
      return;
    }

    importConfiguredAlarms({
      file: currentFile,
      machineId: machineId
    })
      .unwrap()
      .then(() => {
        toast.success(`Alarms List imported`);
        setUploadCSVModal(false);
      })
      .catch((error) => {
        toast.error(
          `Failed importing Alarm List${error?.data?.detail ? `: ${error.data.detail}` : ''}`
        );
        console.error(error?.data?.detail || error);
      });
  };

  const downloadMachineConfigsCSV = () => {
    const csv: BlobPart[] = [];

    csv.push(
      [
        addQuotes('ID'),
        addQuotes('Text'),
        addQuotes('Category'),
        addQuotes('Location Group'),
        '\n'
      ].join(',')
    );

    if (configuredAlarms) {
      for (const item of configuredAlarms) {
        const row = [
          addQuotes(item.id.toString()),
          addQuotes(item.text),
          addQuotes(item.category),
          addQuotes(item.locationGroup),
          '\n'
        ].join(',');
        csv.push(row);
      }
    }

    const { serialNumber } = machineInfo ?? {};

    let fileName = 'machine-config-alarms';
    serialNumber && (fileName += `_${serialNumber}`);
    fileName += '.csv';

    saveAs(new Blob(csv, { type: 'text/csv;charset=utf-8', endings: 'native' }), fileName);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchVal(event.target.value);
  };

  return (
    <Container>
      <ButtonBar columnGap="1.5rem" title="" padding="1.375rem 0">
        <StyledSearchWrapper>
          <SearchInput
            borderRadius="0.625rem"
            onChange={debounce(handleSearchChange, SEARCH_COOLDOWN)}
            placeholder="Search by Text"
            variant="white"
          />
        </StyledSearchWrapper>
        <Button onClick={() => setUploadCSVModal(true)} variant="primary" width="8.75rem">
          Upload CSV
        </Button>
        <Button onClick={() => downloadMachineConfigsCSV()} variant="primary" width="8.75rem">
          Download CSV
        </Button>
        <TutorialButton stepsData={tutorialPlaceholderStepsData} />
      </ButtonBar>
      <BaseTable
        columnConfigs={generateColumnConfigs(sortState)}
        data={paginatedAlarmsList}
        rowKey={(record: BaseType) => `${record.id}`}
        sortHandler={sortHandler}
        title="All Alarms"
      />
      <Pagination
        itemsPerPage={ITEMS_PER_PAGE}
        numItems={sortedAlarmsList.length}
        onPageChange={(selected: number) => setPageNumber(selected)}
        currentPage={pageNumber}
      />
      <UploadCSVModal
        cancelLabel="Back"
        description="Before uploading make sure you have all the fields including ID, Text, Category, and Location Group"
        setVisible={setUploadCSVModal}
        title="Upload Alarms"
        uploadCallback={(currentFile: File | null) => uploadMachineConfigsCSV(currentFile)}
        uploadLabel="Upload"
        visible={uploadCSVModal}
      />
    </Container>
  );
};
export default MachineConfigAlarmsList;
