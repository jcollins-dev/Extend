// 3rd party libs
import React, { ReactElement, useCallback, useEffect, useReducer, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isValidPlcTagName } from './ReviewMachineMtlAttrsTable';

// Api
import {
  useGetReviewMachineAllMasterMachineTagListsQuery,
  useSaveReviewMachineMtlDsdmMutation,
  useSaveReviewMachineMtlKdmMutation,
  useSaveReviewMachineMtlMqttMutation
} from 'api';

// Components
import { Button, Loader, SearchInput, Switch, Typography } from 'components';
import { cloneDeep, debounce } from 'lodash';
import { SEARCH_COOLDOWN } from 'constants/search';
import { useTranslation } from 'react-i18next';
import { DigitalEdgeType } from 'types';
import {
  ReviewMachineMtlMqtt,
  ReviewMachineMtlDsdm,
  ReviewMachineMtlKdm,
  ReviewMachineMtlAttrsKdm,
  ReviewMachineMtlAttrsDsdm,
  ReviewMachineMtlAttrsMqtt,
  ReviewMachineMtlRequest,
  ReviewMachineMtlKdmReq,
  ReviewMachineMtlAttrsKdmReq,
  ReviewMachineMtlDsdmReq,
  ReviewMachineMtlAttrsDsdmReq,
  ReviewMachineMtlAttrsMqttReq
} from 'types/machine-management';
import ReviewMachineMtlTable from './ReviewMachineMtlTable';
import ConfigFileModal from 'pages/MachineManagement/ConfigFileModal';

import { JBTRoutes } from 'constants/routes';
import UnsavedChangesModal from 'pages/MachineManagement/UnsavedChangesModal';

// Styling
const MtlWrapperContainer = styled.div`
  flex-grow: 1;
  width: 100%;
  padding: 1.5rem 1.175rem 1.5rem 2rem;
  overflow-y: auto;
  margin-bottom: 3.5rem;
  position: relative;
`;

const ActionButton = styled(Button)`
  margin-left: 1rem;
  width: 14rem;
`;

const ButtonDiv = styled.div`
  position: fixed;
  align-items: end;
  bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  z-index: 8;
  width: calc(100% - 16.325rem);
  background: white;
  border-top: 0.0625rem solid rgb(209, 214, 219);
  height: fit-content;
`;

const Divider = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.mediumGrey1,
  height: 1,
  width: '100%'
}));

const SearchBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 0.625rem;
  gap: 1.25rem;
  height: 4.5rem;
  input {
    flex: 1;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
`;

const SwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  height: 4.5rem;
`;

const ReviewMachineMtlValidationFields = {
  KDM: [
    'driverId',
    'deviceTypeId',
    'ipAddress',
    'port',
    'plcTagName',
    'plcTagAddress',
    'machineDataType',
    'machineScanRate',
    'machineChangeThreshold',
    'machineScaling'
  ],
  DSDM: [
    'databaseName',
    'databaseIp',
    'databasePort',
    'databaseUsername',
    'databasePassword',
    'machineDataType',
    'tableName',
    'machineDataType'
  ],
  MQTT: ['machineTopicName']
};

const filterMtlAttrsData = (
  mtlAttrsRowData: ReviewMachineMtlAttrsDsdm,
  value: string | boolean,
  filterType: string
): unknown => {
  if (filterType === 'tagName') {
    return (
      (mtlAttrsRowData?.masterTagName
        ? (mtlAttrsRowData?.masterTagName as string).toLowerCase()
        : ''
      ).includes((value as string).toLowerCase()) ||
      (mtlAttrsRowData?.masterDescription
        ? (mtlAttrsRowData?.masterDescription as string).toLowerCase()
        : ''
      ).includes((value as string).toLowerCase()) ||
      (mtlAttrsRowData?.omnibluTagName
        ? (mtlAttrsRowData?.omnibluTagName as string).toLowerCase()
        : ''
      ).includes((value as string).toLowerCase())
    );
  } else {
    return mtlAttrsRowData.isValid === (value as boolean);
  }
};
type ReviewMachineMtlAction =
  | {
      type: 'isLoading';
      value: boolean;
    }
  | {
      type: 'updateMtlData';
      rowId: string;
      key: string;
      value: number | string;
    }
  | {
      type: 'updateMtlAttrsData';
      rowId: string;
      key: string;
      value: number | string;
    }
  | {
      type: 'setMtlData';
      value: ReviewMachineMtlKdm[] | ReviewMachineMtlDsdm[] | ReviewMachineMtlMqtt[];
      digitalEdgeType: DigitalEdgeType;
    }
  | {
      type: 'filterMtlData';
      filterType: string;
      showOnlyInvalid: boolean;
      value: string | boolean;
    };

const setMtlRowValidity = (
  mtlData: ReviewMachineMtlKdm | ReviewMachineMtlDsdm | ReviewMachineMtlMqtt,
  digitalEdgeType: DigitalEdgeType
) => {
  let isValid = true;
  for (const [k, v] of Object.entries(mtlData)) {
    if (
      ReviewMachineMtlValidationFields[digitalEdgeType].filter((item) => item === k).length > 0 &&
      (v == undefined || (v as string).length === 0)
    ) {
      isValid = false;
      break;
    }
  }
  mtlData.isValid = isValid;
};

const setMtlAttrsRowValidity = (
  mtlAttrsRow: ReviewMachineMtlAttrsKdm | ReviewMachineMtlAttrsDsdm | ReviewMachineMtlAttrsMqtt,
  digitalEdgeType: DigitalEdgeType
) => {
  let isValid = true;
  for (const [k, v] of Object.entries(mtlAttrsRow)) {
    if (
      ReviewMachineMtlValidationFields[digitalEdgeType].filter((item) => item === k).length > 0 &&
      (v == undefined || (v as string).length === 0)
    ) {
      isValid = false;
      break;
    } else if (k === 'plcTagName' && !isValidPlcTagName(v as string).isValid) {
      isValid = false;
      break;
    }
  }
  mtlAttrsRow.isValid = isValid;
};
interface ReviewMachineMtlState {
  isLoading: boolean;
  digitalEdgeType: DigitalEdgeType;
  reviewMachineMtlData: ReviewMachineMtlKdm[] | ReviewMachineMtlDsdm[] | ReviewMachineMtlMqtt[];
  filteredMtlData: ReviewMachineMtlKdm[] | ReviewMachineMtlDsdm[] | ReviewMachineMtlMqtt[];
}

const updateMtlDataFn = (
  reviewMachineMtlData: ReviewMachineMtlKdm[] | ReviewMachineMtlDsdm[] | ReviewMachineMtlMqtt[],
  digitalEdgeType: DigitalEdgeType,
  action: { type: 'updateMtlData'; rowId: string; key: string; value: number | string }
) => {
  const mtlData = reviewMachineMtlData.map((mtlRowData) => {
    return mtlRowData.machineTagListId === action.rowId
      ? { ...mtlRowData, [action.key]: action.value || undefined, isTouched: true }
      : mtlRowData;
  });
  const mtlValidData = mtlData.map((mtlRowData) => {
    setMtlRowValidity(mtlRowData, digitalEdgeType);
    return mtlRowData;
  });
  return mtlValidData;
};

const updateMtlAttrsDataFn = (
  reviewMachineMtlData: ReviewMachineMtlKdm[] | ReviewMachineMtlDsdm[] | ReviewMachineMtlMqtt[],
  digitalEdgeType: DigitalEdgeType,
  action: { type: 'updateMtlAttrsData'; rowId: string; key: string; value: number | string }
) => {
  return reviewMachineMtlData.map((mtlRowData) => {
    mtlRowData.attributes = mtlRowData.attributes.map((mtlAttrsRowData) => {
      return mtlAttrsRowData.rowId === action.rowId
        ? {
            ...mtlAttrsRowData,
            [action.key]: action.value || undefined,
            isTouched: true
          }
        : mtlAttrsRowData;
    });

    mtlRowData.attributes = mtlRowData.attributes.map((mtlAttrsRowData) => {
      setMtlAttrsRowValidity(mtlAttrsRowData, digitalEdgeType);
      return mtlAttrsRowData;
    });
    return mtlRowData;
  });
};

const reducer = (state: ReviewMachineMtlState, action: ReviewMachineMtlAction) => {
  switch (action.type) {
    case 'isLoading':
      return { ...state, isLoading: action.value };
    case 'updateMtlData': {
      const mtlValidData = updateMtlDataFn(
        state.reviewMachineMtlData,
        state.digitalEdgeType,
        action
      );
      const mtlFilteredValidData = updateMtlDataFn(
        state.filteredMtlData,
        state.digitalEdgeType,
        action
      );
      return {
        ...state,
        reviewMachineMtlData: mtlValidData,
        filteredMtlData: mtlFilteredValidData
      };
    }
    case 'updateMtlAttrsData': {
      const mtlData = updateMtlAttrsDataFn(
        state.reviewMachineMtlData,
        state.digitalEdgeType,
        action
      );
      const mtlFilteredData = updateMtlAttrsDataFn(
        state.filteredMtlData,
        state.digitalEdgeType,
        action
      );
      return {
        ...state,
        reviewMachineMtlData: mtlData,
        filteredMtlData: mtlFilteredData
      };
    }
    case 'setMtlData': {
      return {
        ...state,
        reviewMachineMtlData: action.value,
        filteredMtlRowData: cloneDeep(action.value),
        digitalEdgeType: action.digitalEdgeType
      };
    }
    case 'filterMtlData': {
      let filteredMtlRowData:
        | ReviewMachineMtlKdm[]
        | ReviewMachineMtlDsdm[]
        | ReviewMachineMtlMqtt[] = cloneDeep(state.reviewMachineMtlData);
      if (
        !action.showOnlyInvalid &&
        action.filterType === 'tagName' &&
        (!action.value || (action.value as string).length === 0)
      ) {
        filteredMtlRowData = state.reviewMachineMtlData;
      } else {
        switch (state.digitalEdgeType) {
          case DigitalEdgeType.KDM: {
            filteredMtlRowData = filteredMtlRowData.map((mtlRowData) => {
              const filteredMtlAttrsRowData = (
                mtlRowData.attributes as ReviewMachineMtlAttrsKdm[]
              ).filter((mtlAttrsRowData) => {
                return filterMtlAttrsData(mtlAttrsRowData, action.value, action.filterType);
              });
              mtlRowData.attributes = filteredMtlAttrsRowData;
              return mtlRowData;
            });
            break;
          }
          case DigitalEdgeType.DSDM: {
            filteredMtlRowData = filteredMtlRowData.map((mtlRowData) => {
              const filteredMtlAttrsRowData = (
                mtlRowData.attributes as ReviewMachineMtlAttrsDsdm[]
              ).filter((mtlAttrsRowData) => {
                return filterMtlAttrsData(mtlAttrsRowData, action.value, action.filterType);
              });
              mtlRowData.attributes = filteredMtlAttrsRowData;
              return mtlRowData;
            });
            break;
          }
          case DigitalEdgeType.MQTT: {
            filteredMtlRowData = filteredMtlRowData.map((mtlRowData) => {
              const filteredMtlAttrsRowData = (
                mtlRowData.attributes as ReviewMachineMtlAttrsMqtt[]
              ).filter((mtlAttrsRowData) => {
                return filterMtlAttrsData(mtlAttrsRowData, action.value, action.filterType);
              });
              mtlRowData.attributes = filteredMtlAttrsRowData;
              return mtlRowData;
            });
            break;
          }
          default:
            break;
        }
      }
      return {
        ...state,
        filteredMtlData: filteredMtlRowData
      };
    }
    default:
      return state;
  }
};

const addRowId = (
  rows: ReviewMachineMtlKdm[] | ReviewMachineMtlDsdm[] | ReviewMachineMtlMqtt[] | undefined,
  digitalEdgeType: DigitalEdgeType
): ReviewMachineMtlKdm[] | ReviewMachineMtlDsdm[] | ReviewMachineMtlMqtt[] => {
  const mtlRows = rows?.map((mtlData) => {
    setMtlRowValidity(mtlData, digitalEdgeType);
    mtlData.isTouched = false;
    const mtlAttrsRowsWithId = mtlData.attributes.map((mtlAttrsRow, index) => {
      mtlAttrsRow.rowId = `${mtlAttrsRow.masterTagListAttrId}-${mtlAttrsRow.machineTagListAttrId}-${index}`;
      setMtlAttrsRowValidity(mtlAttrsRow, digitalEdgeType);
      mtlAttrsRow.isTouched = false;
      mtlAttrsRow.isDuplicate = false;

      return mtlAttrsRow;
    });
    mtlData.attributes = mtlAttrsRowsWithId;
    return mtlData;
  });
  return mtlRows as ReviewMachineMtlKdm[] | ReviewMachineMtlDsdm[] | ReviewMachineMtlMqtt[];
};

const ReviewMachineMtl = (): ReactElement => {
  const { machineId } = useParams<{ machineId: string }>();
  const [isOpenConfigModal, setIsOpenConfigModal] = useState(false);
  const [isOpenUnsavedChangesModal, setIsOpenUnsavedChangesModal] = useState(false);
  const {
    data: reviewMachineMtl,
    isLoading: reviewMachineMtlLoading,
    refetch: refetchReviewMachineTagLists
  } = useGetReviewMachineAllMasterMachineTagListsQuery({ machineId });
  const [saveReviewMachineMtlKdm] = useSaveReviewMachineMtlKdmMutation();
  const [saveReviewMachineMtlDsdm] = useSaveReviewMachineMtlDsdmMutation();
  const [saveReviewMachineMtlMqtt] = useSaveReviewMachineMtlMqttMutation();

  let reviewMachineMtlData:
    | ReviewMachineMtlKdm[]
    | ReviewMachineMtlDsdm[]
    | ReviewMachineMtlMqtt[]
    | undefined = undefined;
  switch (reviewMachineMtl?.digitalEdgeType) {
    case DigitalEdgeType.KDM:
      reviewMachineMtlData = cloneDeep(reviewMachineMtl.dataKdm);
      break;
    case DigitalEdgeType.DSDM:
      reviewMachineMtlData = cloneDeep(reviewMachineMtl.dataDsdm);
      break;
    case DigitalEdgeType.MQTT:
      reviewMachineMtlData = cloneDeep(reviewMachineMtl.dataMqtt);
      break;
    default:
      break;
  }

  const [state, dispatch] = useReducer(reducer, {
    digitalEdgeType: reviewMachineMtl?.digitalEdgeType || DigitalEdgeType.KDM,
    reviewMachineMtlData: reviewMachineMtlData || [],
    filteredMtlData: reviewMachineMtlData || [],
    isLoading: reviewMachineMtlLoading
  });
  useEffect(() => {
    refetchReviewMachineTagLists();
    const value = addRowId(
      reviewMachineMtlData,
      reviewMachineMtl?.digitalEdgeType as DigitalEdgeType
    );
    dispatch({ type: 'isLoading', value: reviewMachineMtlLoading });
    dispatch({
      type: 'setMtlData',
      value,
      digitalEdgeType: reviewMachineMtl?.digitalEdgeType as DigitalEdgeType
    });
  }, [reviewMachineMtl]);

  const { t } = useTranslation(['mh']);
  const theme = useTheme();
  const history = useHistory();
  const [showOnlyInvalid, setShowOnlyInvalid] = useState<boolean>(false);
  const [searchVal, setSearchVal] = useState<string>('');

  const showExitButtons = (): boolean => {
    if (reviewMachineMtlLoading || !state.reviewMachineMtlData) {
      return false;
    }
    let mtlRowDataNotValid = false;
    let mtlRowAttrsDataNotValid = false;
    mtlRowDataNotValid = state.reviewMachineMtlData?.some((mtlData) => mtlData.isValid === false);
    for (const mtlRowData of state.reviewMachineMtlData) {
      mtlRowAttrsDataNotValid = mtlRowData.attributes?.some((mtlAttrsData) => {
        return mtlAttrsData.isValid === false;
      });
      if (mtlRowAttrsDataNotValid) {
        break;
      }
    }
    return !mtlRowDataNotValid;
  };

  const showConfigButtons = (): boolean => {
    if (reviewMachineMtlLoading || !state.reviewMachineMtlData) {
      return false;
    }
    let mtlRowDataNotValid = false;
    let mtlRowAttrsDataNotValid = false;
    mtlRowDataNotValid = state.reviewMachineMtlData?.some((mtlData) => mtlData.isValid === false);
    for (const mtlRowData of state.reviewMachineMtlData) {
      mtlRowAttrsDataNotValid = mtlRowData.attributes?.some((mtlAttrsData) => {
        return mtlAttrsData.isValid === false;
      });
      if (mtlRowAttrsDataNotValid) {
        break;
      }
    }
    return !mtlRowDataNotValid && !mtlRowAttrsDataNotValid;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const searchVal = e.target.value;
    setSearchVal(searchVal);
    dispatch({
      type: 'filterMtlData',
      filterType: 'tagName',
      value: searchVal,
      showOnlyInvalid: showOnlyInvalid
    });
  };

  const handleShowOnlyInvalid = (): void => {
    setShowOnlyInvalid(!showOnlyInvalid);
    dispatch({
      type: 'filterMtlData',
      filterType: 'showOnlyInvalid',
      value: showOnlyInvalid,
      showOnlyInvalid: showOnlyInvalid
    });
  };

  const isReviewMachineMtlTouched = (): boolean => {
    let mtlRowDataIsTouched = false;
    let mtlRowAttrsDataIsTouched = false;
    mtlRowDataIsTouched = state.reviewMachineMtlData?.some((mtlData) => mtlData.isTouched === true);
    for (const mtlRowData of state.reviewMachineMtlData) {
      mtlRowAttrsDataIsTouched = mtlRowData.attributes?.some((mtlAttrsData) => {
        return mtlAttrsData.isTouched === true;
      });
      if (mtlRowAttrsDataIsTouched) {
        break;
      }
    }
    return mtlRowDataIsTouched || mtlRowAttrsDataIsTouched;
  };

  const cancelHandler = () => {
    if (isReviewMachineMtlTouched()) {
      setIsOpenUnsavedChangesModal(true);
    } else {
      history.push(JBTRoutes.onboardingPage.replace(':machineId', machineId));
    }
  };

  const generateAndInvokeReviewMachineMtlRequest = (): ReviewMachineMtlRequest => {
    const reviewMachineMtlRequest: ReviewMachineMtlRequest = {} as ReviewMachineMtlRequest;
    reviewMachineMtlRequest.machineId = machineId;
    switch (state.digitalEdgeType) {
      case DigitalEdgeType.KDM: {
        const machineTagList: ReviewMachineMtlKdmReq[] = [];
        const machineTagListAttributes: ReviewMachineMtlAttrsKdmReq[] = [];
        state.reviewMachineMtlData.map((mtlRowData) => {
          if (mtlRowData.isTouched) {
            const reviewMachineMtlKdmReq: ReviewMachineMtlKdmReq = {} as ReviewMachineMtlKdmReq;
            reviewMachineMtlKdmReq.id = mtlRowData.machineTagListId;
            reviewMachineMtlKdmReq.machineId = machineId;
            reviewMachineMtlKdmReq.driverId = mtlRowData.driverId as string;
            reviewMachineMtlKdmReq.deviceTypeId = mtlRowData.deviceTypeId as string;
            reviewMachineMtlKdmReq.ipAddress = mtlRowData.ipAddress as string;
            reviewMachineMtlKdmReq.port = mtlRowData.port as number;
            machineTagList.push(reviewMachineMtlKdmReq);
          }

          mtlRowData.attributes.map((mtlRowAttrsData) => {
            if (mtlRowAttrsData.isTouched) {
              const reviewMachineMtlAttrsKdmReq: ReviewMachineMtlAttrsKdmReq =
                {} as ReviewMachineMtlAttrsKdmReq;
              reviewMachineMtlAttrsKdmReq.id = mtlRowAttrsData.machineTagListAttrId as string;
              reviewMachineMtlAttrsKdmReq.machineTagListKdmId =
                mtlRowData.machineTagListId as string;
              reviewMachineMtlAttrsKdmReq.plcTagName = mtlRowAttrsData.plcTagName as string;
              reviewMachineMtlAttrsKdmReq.plcTagAddress = mtlRowAttrsData.plcTagAddress as string;
              reviewMachineMtlAttrsKdmReq.description =
                mtlRowAttrsData.machineDescription as string;
              reviewMachineMtlAttrsKdmReq.dataType = mtlRowAttrsData.machineDataType as string;

              reviewMachineMtlAttrsKdmReq.scanRate = mtlRowAttrsData.machineScanRate
                ? parseInt(`${mtlRowAttrsData.machineScanRate}`)
                : 0;
              reviewMachineMtlAttrsKdmReq.changeThreshold = mtlRowAttrsData.machineChangeThreshold
                ? parseFloat(`${mtlRowAttrsData.machineChangeThreshold}`)
                : 0;
              reviewMachineMtlAttrsKdmReq.scaling = mtlRowAttrsData.machineScaling as string;
              reviewMachineMtlAttrsKdmReq.scaledDataType =
                mtlRowAttrsData.machineScaledDataType as string;
              reviewMachineMtlAttrsKdmReq.rawHigh = mtlRowAttrsData.machineRawHigh
                ? parseFloat(`${mtlRowAttrsData.machineRawHigh}`)
                : undefined;
              reviewMachineMtlAttrsKdmReq.rawLow = mtlRowAttrsData.machineRawLow
                ? parseFloat(`${mtlRowAttrsData.machineRawLow}`)
                : undefined;
              reviewMachineMtlAttrsKdmReq.scaledHigh = mtlRowAttrsData.machineScaledHigh
                ? parseFloat(`${mtlRowAttrsData.machineScaledHigh}`)
                : undefined;
              reviewMachineMtlAttrsKdmReq.scaledLow = mtlRowAttrsData.machineScaledLow
                ? parseFloat(`${mtlRowAttrsData.machineScaledLow}`)
                : undefined;
              machineTagListAttributes.push(reviewMachineMtlAttrsKdmReq);
            }
          });
        });
        reviewMachineMtlRequest.machineTagList = machineTagList;
        reviewMachineMtlRequest.machineTagListAttributes = machineTagListAttributes;
        break;
      }
      case DigitalEdgeType.DSDM: {
        const machineTagList: ReviewMachineMtlDsdmReq[] = [];
        const machineTagListAttributes: ReviewMachineMtlAttrsDsdmReq[] = [];
        state.reviewMachineMtlData.map((mtlRowData) => {
          if (mtlRowData.isTouched) {
            const reviewMachineMtlDsdmReq: ReviewMachineMtlDsdmReq = {} as ReviewMachineMtlDsdmReq;
            reviewMachineMtlDsdmReq.id = mtlRowData.machineTagListId;
            reviewMachineMtlDsdmReq.machineId = machineId;
            reviewMachineMtlDsdmReq.databaseName = mtlRowData.databaseName as string;
            reviewMachineMtlDsdmReq.databaseIp = mtlRowData.databaseIp as string;
            reviewMachineMtlDsdmReq.databasePort = mtlRowData.databasePort as number;
            reviewMachineMtlDsdmReq.databaseUsername = mtlRowData.databaseUsername as string;
            reviewMachineMtlDsdmReq.databasePassword = mtlRowData.databasePassword as string;
            machineTagList.push(reviewMachineMtlDsdmReq);
          }
          mtlRowData.attributes.map((mtlRowAttrsData) => {
            if (mtlRowAttrsData.isTouched) {
              const reviewMachineMtlAttrsDsdmReq: ReviewMachineMtlAttrsDsdmReq =
                {} as ReviewMachineMtlAttrsDsdmReq;
              reviewMachineMtlAttrsDsdmReq.id = mtlRowAttrsData.machineTagListAttrId as string;
              reviewMachineMtlAttrsDsdmReq.machineTagListDsdmId =
                mtlRowData.machineTagListId as string;
              reviewMachineMtlAttrsDsdmReq.tableName = mtlRowAttrsData.tableName as string;
              reviewMachineMtlAttrsDsdmReq.indexColumn = mtlRowAttrsData.indexColumn as string;
              reviewMachineMtlAttrsDsdmReq.description =
                mtlRowAttrsData.machineDescription as string;
              reviewMachineMtlAttrsDsdmReq.dataType = mtlRowAttrsData.machineDataType as string;
              reviewMachineMtlAttrsDsdmReq.isPrimaryKey =
                mtlRowAttrsData.machineIsPrimaryKey as boolean;
              machineTagListAttributes.push(reviewMachineMtlAttrsDsdmReq);
            }
          });
        });
        reviewMachineMtlRequest.machineTagList = machineTagList;
        reviewMachineMtlRequest.machineTagListAttributes = machineTagListAttributes;
        break;
      }
      case DigitalEdgeType.MQTT: {
        const machineTagListAttributes: ReviewMachineMtlAttrsMqttReq[] = [];
        state.reviewMachineMtlData.map((mtlRowData) => {
          mtlRowData.attributes.map((mtlRowAttrsData) => {
            if (mtlRowAttrsData.isTouched) {
              const reviewMachineMtlAttrsMqttReq: ReviewMachineMtlAttrsMqttReq =
                {} as ReviewMachineMtlAttrsMqttReq;
              reviewMachineMtlAttrsMqttReq.id = mtlRowAttrsData.machineTagListAttrId as string;
              reviewMachineMtlAttrsMqttReq.machineTagListMqttId = machineId as string;
              reviewMachineMtlAttrsMqttReq.topicName = mtlRowAttrsData.machineTopicName as string;
              reviewMachineMtlAttrsMqttReq.tagName = mtlRowAttrsData.machineTagName as string;
              reviewMachineMtlAttrsMqttReq.description =
                mtlRowAttrsData.machineDescription as string;
              machineTagListAttributes.push(reviewMachineMtlAttrsMqttReq);
            }
          });
        });
        reviewMachineMtlRequest.machineTagListAttributes = machineTagListAttributes;
        break;
      }
      default:
        break;
    }
    return reviewMachineMtlRequest;
  };

  const saveReviewMachineMtl = useCallback(
    async (checkForConfigModal) => {
      dispatch({ type: 'isLoading', value: true });
      const reviewMachineMtlRequest: ReviewMachineMtlRequest =
        generateAndInvokeReviewMachineMtlRequest();

      switch (state.digitalEdgeType) {
        case DigitalEdgeType.KDM: {
          await saveReviewMachineMtlKdm(reviewMachineMtlRequest)
            .unwrap()
            .then(() => {
              if (checkForConfigModal) {
                setIsOpenConfigModal(true);
                dispatch({ type: 'isLoading', value: false });
              } else {
                history.push(JBTRoutes.onboardingPage.replace(':machineId', machineId));
              }
            })
            .catch((error) => {
              console.log(error);
              dispatch({ type: 'isLoading', value: false });
              toast.error(t('failed_to_save_review_machine_mtl'));
            });
          break;
        }
        case DigitalEdgeType.DSDM: {
          await saveReviewMachineMtlDsdm(reviewMachineMtlRequest)
            .unwrap()
            .then(() => {
              if (checkForConfigModal) {
                setIsOpenConfigModal(true);
                dispatch({ type: 'isLoading', value: false });
              } else {
                history.push(JBTRoutes.onboardingPage.replace(':machineId', machineId));
              }
            })
            .catch((error) => {
              console.log(error);
              dispatch({ type: 'isLoading', value: false });
              toast.error(t('failed_to_save_review_machine_mtl'));
            });
          break;
        }
        case DigitalEdgeType.MQTT: {
          await saveReviewMachineMtlMqtt(reviewMachineMtlRequest)
            .unwrap()
            .then(() => {
              if (checkForConfigModal) {
                setIsOpenConfigModal(true);
                dispatch({ type: 'isLoading', value: false });
              } else {
                history.push(JBTRoutes.onboardingPage.replace(':machineId', machineId));
              }
            })
            .catch((error) => {
              console.log(error);
              dispatch({ type: 'isLoading', value: false });
              toast.error(t('failed_to_save_review_machine_mtl'));
            });
          break;
        }
        default:
          break;
      }
    },
    [state.reviewMachineMtlData]
  );

  const saveAndExitHandler = () => {
    saveReviewMachineMtl(false);
  };

  const saveAndGenerateConfig = () => {
    saveReviewMachineMtl(true);
  };

  const unsavedChangesContinueHandler = () => {
    history.push(JBTRoutes.onboardingPage.replace(':machineId', machineId));
    setIsOpenUnsavedChangesModal(false);
  };

  const updateReviewMachineMtlRow = useCallback((rowId, key, value) => {
    dispatch({ type: 'updateMtlData', rowId, key, value });
  }, []);

  const updateReviewMachineMtlAttrsRow = useCallback((rowId, key, value) => {
    dispatch({ type: 'updateMtlAttrsData', rowId, key, value });
  }, []);

  return (
    <>
      <ConfigFileModal
        open={isOpenConfigModal}
        machineId={machineId}
        onClose={() => setIsOpenConfigModal(false)}
      />
      <UnsavedChangesModal
        open={isOpenUnsavedChangesModal}
        cancelHandler={() => setIsOpenUnsavedChangesModal(false)}
        continueHandler={unsavedChangesContinueHandler}
        closeHandler={() => setIsOpenUnsavedChangesModal(false)}
      />
      <MtlWrapperContainer>
        <SearchBarContainer>
          <SwitchContainer>
            <Typography color={theme.colors.darkGrey} mb={0}>
              {t('show_only_invalid_tags')}
            </Typography>
            <Switch
              checked={!!showOnlyInvalid}
              handleDiameter={12}
              height={6}
              offColor={theme.colors.mediumGrey2}
              offHandleColor={theme.colors.mediumGrey3}
              onChange={handleShowOnlyInvalid}
              width={20}
            />
          </SwitchContainer>
          <SearchContainer>
            <SearchInput
              borderRadius="0.625rem"
              onChange={debounce(handleSearchChange, SEARCH_COOLDOWN)}
              placeholder={t('search_tag_name') as string}
              variant="white"
            />
          </SearchContainer>
        </SearchBarContainer>
        {state.isLoading ? (
          <Loader />
        ) : (
          <>
            <ReviewMachineMtlTable
              reviewMachineMtlData={
                searchVal.length > 0 || showOnlyInvalid
                  ? state.filteredMtlData
                  : state.reviewMachineMtlData
              }
              digitalEdgeType={reviewMachineMtl?.digitalEdgeType as DigitalEdgeType}
              updateReviewMachineMtlRow={updateReviewMachineMtlRow}
              updateReviewMachineMtlAttrsRow={updateReviewMachineMtlAttrsRow}
            ></ReviewMachineMtlTable>
          </>
        )}
      </MtlWrapperContainer>
      <Divider />
      <ButtonDiv>
        <ActionButton onClick={cancelHandler}>{t('cancel', { ns: 'common' })}</ActionButton>
        <ActionButton disabled={!showExitButtons()} onClick={saveAndExitHandler}>
          {t('save_and_exit', { ns: 'common' })}
        </ActionButton>
        <ActionButton
          disabled={!showConfigButtons()}
          variant="primary"
          onClick={saveAndGenerateConfig}
        >
          {t('save_and_generate_config', { ns: 'common' })}
        </ActionButton>
      </ButtonDiv>
    </>
  );
};

export default ReviewMachineMtl;
