// 3rd party libs
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import styled from 'styled-components';
import theme from 'themes';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import LeftChevron from 'components/HorizontalScrollButtons/LeftScrollButton';
import RightChevron from 'components/HorizontalScrollButtons/RightScrollButton';

// Components
import { Breadcrumbs, Button, Indicator, PageHeader } from 'components';

import {
  useGetOnboardingMachineByIdQuery,
  useUpdateMachineOnboardingStatusMutation,
  useUploadMaintenanceScheduleMutation
} from 'api';

// Maintence Schedule Components
import MaintenceScheduleTable from 'components/MaintenanceScheduleTable';
import RemainingErrorsModal from './RemainingErrorsModal';

// Types
import {
  MaintenceScheduleImportRow,
  MaintenanceFrequencyType,
  MaintenanceCreator,
  MaintenceScheduleImportRowErrorData
} from 'types/maintenance';

// Constants
import { JBTRoutes } from 'constants/routes';
import { skipToken } from '@reduxjs/toolkit/query';
import { isEqual } from 'lodash';
import { UpdateRowFn } from 'types/machine-management';
import { onlyLettersAndNumbers } from 'helpers';

//styling
const ActionButton = styled(Button)`
  margin-left: 1rem;
`;

const ButtonDiv = styled.div`
  position: relative;
  align-items: end;
  bottom: 0%;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  z-index: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  position: relative;
`;

const Divider = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.mediumGrey1,
  height: 1,
  width: '100%'
}));

const StyledIndicator = styled(Indicator)`
  display: relative;
  margin: 0 0 0 15px;
  padding: 10px;
`;

const TableContainer = styled.div`
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-left: 25px;
`;
const TableWrapper = styled.div`
  width: 94%;
  overflow-x: hidden;
  margin-left: 35px;
`;
interface IState {
  validatedRows: MaintenceScheduleImportRow[];
}

type MaintenanceScheduleAction =
  | { type: 'loading' }
  | { type: 'stopLoading' }
  | { type: 'showErrorModal'; maintenceScheduleImportRows: MaintenceScheduleImportRow[] }
  | { type: 'closeErrorModal' }
  | {
      type: 'updateImportRows';
      rowId: number;
      key: string;
      value: number | string | MaintenanceFrequencyType | MaintenanceCreator;
    }
  | {
      type: 'updateRowValidation';
      rowId: number;
      errorKey: string;
      errors: MaintenceScheduleImportRowErrorData[];
    };

interface MaintenanceScheduleState {
  isLoading: boolean;
  showRemainingErrorsModal: boolean;
  maintenceScheduleImportRows: MaintenceScheduleImportRow[];
}

const addRowId = (rows: MaintenceScheduleImportRow[]) =>
  rows.map((row, index) => ({ ...row, rowId: index }));

const reducer = (state: MaintenanceScheduleState, action: MaintenanceScheduleAction) => {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'stopLoading':
      return { ...state, isLoading: false };
    case 'showErrorModal':
      return {
        ...state,
        showRemainingErrorsModal: true,
        isLoading: false,
        maintenceScheduleImportRows: action.maintenceScheduleImportRows
      };
    case 'closeErrorModal':
      return { ...state, showRemainingErrorsModal: false, isLoading: false };
    case 'updateImportRows':
      return {
        ...state,
        maintenceScheduleImportRows: state.maintenceScheduleImportRows.map((row) =>
          row.rowId === action.rowId ? { ...row, [action.key]: action.value || undefined } : row
        )
      };
    case 'updateRowValidation':
      return {
        ...state,
        maintenceScheduleImportRows: state.maintenceScheduleImportRows.map((row) =>
          row.rowId === action.rowId
            ? { ...row, [action.errorKey]: action.errors || undefined }
            : row
        )
      };
    default:
      return state;
  }
};

const MaintenanceSchedule = (): JSX.Element => {
  const location = useLocation();
  const history = useHistory();

  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    showRemainingErrorsModal: false,
    maintenceScheduleImportRows: addRowId((location.state as IState)?.validatedRows || [])
  });

  const allRows = useMemo(() => {
    const errorRows = state.maintenceScheduleImportRows.filter(
      (row: MaintenceScheduleImportRow) => row.errorMessages?.length
    );
    const validRows = state.maintenceScheduleImportRows.filter(
      (row: MaintenceScheduleImportRow) => !row.errorMessages?.length
    );

    return { errorRows, validRows };
  }, []);
  const { errorRows, validRows } = allRows;

  const { machineId } = useParams<{ machineId: string }>();
  const [errorTabId, setErrorTabId] = useState<string>();
  const [validTabId, setValidTabId] = useState<string>();
  const [horizontalScrollRate, setHorizontalScrollRate] = useState<number>();

  const [errorRowsList, setErrorRowsList] = useState<MaintenceScheduleImportRow[]>(errorRows);
  const [validRowsList, setValidRowsList] = useState<MaintenceScheduleImportRow[]>(validRows);

  const { t } = useTranslation(['fpns', 'common']);
  useEffect(() => {
    setErrorTabId('maintenanceErrorTab');
    setValidTabId('maintenanceValidTab');
    setHorizontalScrollRate(800);
  });
  const { data: machine } = useGetOnboardingMachineByIdQuery(
    machineId ? { machineId: machineId } : skipToken
  );

  const [uploadMaintenanceSchedule] = useUploadMaintenanceScheduleMutation();
  const [updateMachineOnboardingStatus] = useUpdateMachineOnboardingStatusMutation();

  const updateMaintenceScheduleRow = useCallback((rowId, key, value) => {
    // dispatch({ type: 'updateImportRows', rowId, key, value });
    const updatedRows = validRowsList.map((item) => {
      return item.rowId === rowId ? { ...item, [key]: value } : item;
    });
    setValidRowsList(updatedRows);
  }, []);
  const updateMaintenceScheduleRowValidation = useCallback((rowId, errorKey, errors) => {
    dispatch({ type: 'updateRowValidation', rowId, errorKey, errors });
  }, []);

  const updateErrorMessage = (
    rowId: number | undefined,
    key: string,
    value: string | string[] | number[] | number | boolean | null | JSX.Element,
    columnName: string | undefined
  ) => {
    let errorData;
    let isValueChanged: boolean | undefined = false;

    const updatedRows: MaintenceScheduleImportRow | undefined = errorRowsList.find((item) => {
      return item.rowId === rowId;
    });
    const errorRow: MaintenceScheduleImportRow | undefined = errorRows.find((item) => {
      return item.rowId === rowId;
    });

    if (columnName === 'skus' || columnName === 'quantities') {
      const data = errorRow?.[key];
      if (typeof value === 'string') {
        const inputValue =
          key === 'quantities' ? value.split(',').map((item) => +item) : value.split(',');
        isValueChanged = !isEqual(data, inputValue);
      }
    } else if (columnName === 'salesforce_machine_id') {
      isValueChanged =
        typeof value === 'string' && value.length === 18 && onlyLettersAndNumbers(value);
    } else {
      isValueChanged = errorRow?.[key] !== value && !!(errorRow?.[key] ?? value);
    }

    if (isValueChanged) {
      const updatedErrorMsg = updatedRows?.errorMessages?.filter(
        (item) => item.columnName !== columnName
      );
      errorData = updatedErrorMsg;
    } else {
      errorData = errorRow?.errorMessages;
    }
    return errorData;
  };

  const updateErrorRows: UpdateRowFn = (rowId, key, value, columnName) => {
    const updatedRows = errorRowsList.map((item) => {
      const errorMsg = updateErrorMessage(rowId, key, value, columnName);
      return item.rowId === rowId ? { ...item, [key]: value, errorMessages: errorMsg } : item;
    });
    setErrorRowsList(updatedRows);
  };

  const onContinue = useCallback(async () => {
    dispatch({ type: 'loading' });
    try {
      const results = await uploadMaintenanceSchedule({
        maintenceScheduleImportRows: validRowsList.concat(errorRowsList),
        manufacturerSchedule: true,
        machineId
      }).unwrap();

      // Check if call succeded based on return type of array
      if (typeof results[0] === 'string') {
        await updateMachineOnboardingStatus({
          machineId,
          maintenanceScheduleStatus: 'Done'
        }).unwrap();

        history.push(JBTRoutes.onboardingPage.replace(':machineId', machineId));
      } else {
        dispatch({
          type: 'showErrorModal',
          maintenceScheduleImportRows: addRowId(results as MaintenceScheduleImportRow[])
        });
      }
    } catch (error) {
      toast.error(t('failed_to_upload_maintenance_schedule'));
      console.log(error);
      dispatch({ type: 'stopLoading' });
    }
  }, [state.maintenceScheduleImportRows]);

  const onCancel = () => {
    window.location.assign(JBTRoutes.onboardingPage.replace(':machineId', machineId));
  };
  const handleScrollLeftErrorTable = () => {
    if (errorTabId) {
      const eTab = document.querySelector(`div#${errorTabId} div div table`);
      if (eTab?.parentElement) {
        // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
        eTab.parentElement.scrollLeft -= horizontalScrollRate!;
      }
    }
  };
  const handleScrollLeftValidTable = () => {
    if (validTabId) {
      const eTab = document.querySelector(`div#${validTabId} div div table`);
      if (eTab?.parentElement) {
        /* eslint-disable  @typescript-eslint/no-non-null-assertion */
        eTab.parentElement.scrollLeft -= horizontalScrollRate!;
      }
    }
  };
  const handleScrollRightErrorTable = () => {
    if (errorTabId) {
      const eTab = document.querySelector(`div#${errorTabId} div div table`);
      if (eTab?.parentElement) {
        /* eslint-disable  @typescript-eslint/no-non-null-assertion */
        eTab.parentElement.scrollLeft += horizontalScrollRate!;
      }
    }
  };
  const handleScrollRightValidTable = () => {
    if (validTabId) {
      const eTab = document.querySelector(`div#${validTabId} div div table`);
      if (eTab?.parentElement) {
        /* eslint-disable  @typescript-eslint/no-non-null-assertion */
        eTab.parentElement.scrollLeft += horizontalScrollRate!;
      }
    }
  };

  return (
    <Container>
      <Breadcrumbs
        items={[
          { label: 'Machine Management', link: JBTRoutes.machineManagement },
          {
            label: machine?.description || 'Retrieving machine...',
            link: JBTRoutes.onboardingPage.replace(':machineId', machineId)
          },
          { label: 'Review Maintenance Schedule' }
        ]}
      />
      <PageHeader heading="Maintenance Schedule" />
      <Divider />
      <Content>
        {/* <DataRenderer isLoading={state.isLoading}> */}
        <StyledIndicator color={theme.colors.negativeRed}>
          {t('errors_count', { ns: 'common', item: errorRowsList.length })}
        </StyledIndicator>
        <TableContainer>
          <LeftChevron handleScroll={handleScrollLeftErrorTable} />
          <RightChevron handleScroll={handleScrollRightErrorTable} />
          <TableWrapper>
            <MaintenceScheduleTable
              data={errorRowsList}
              isDataLoading={state.isLoading}
              onRowUpdate={updateErrorRows}
              onValidation={updateMaintenceScheduleRowValidation}
              id={errorTabId}
            />
          </TableWrapper>
        </TableContainer>
        <StyledIndicator color={theme.colors.onTrackGreen}>
          {t('valid_count', { item: validRows.length })}
        </StyledIndicator>
        <TableContainer>
          <LeftChevron handleScroll={handleScrollLeftValidTable} />
          <RightChevron handleScroll={handleScrollRightValidTable} />
          <TableWrapper>
            <MaintenceScheduleTable
              data={validRowsList}
              isDataLoading={state.isLoading}
              onRowUpdate={updateMaintenceScheduleRow}
              onValidation={updateMaintenceScheduleRowValidation}
              id={validTabId}
            />
          </TableWrapper>
        </TableContainer>
        {/* </DataRenderer> */}
      </Content>
      <Divider />
      <ButtonDiv>
        <ActionButton width="10rem" onClick={onCancel}>
          {t('cancel', { ns: 'common' })}
        </ActionButton>
        <ActionButton
          disabled={!!errorRowsList.some((errorRow) => errorRow.errorMessages?.length)}
          width="10rem"
          variant="primary"
          onClick={onContinue}
        >
          {t('continue', { ns: 'common' })}
        </ActionButton>
      </ButtonDiv>
      <RemainingErrorsModal
        isVisible={state.showRemainingErrorsModal}
        onClose={() => dispatch({ type: 'closeErrorModal' })}
        errorCount={errorRows.length}
      />
    </Container>
  );
};

export default MaintenanceSchedule;
