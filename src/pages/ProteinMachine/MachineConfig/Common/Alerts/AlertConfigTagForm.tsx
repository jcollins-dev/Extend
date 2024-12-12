// 3rd Party Libs
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import styled, { useTheme } from 'styled-components';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import './alert_config_condition_tag_styles.css';

// Components
import { Button, Typography, Loader, PageLayout } from 'components';
import {
  AlertDescription,
  AlertImportance,
  AlertLocation,
  AlertName,
  MachineState
} from './FormElements';
import AlertConfigConditionTagForm, {
  Props as ConditionProps
} from './AlertConfigConditionTagForm';

// Types
import {
  AlertBoolean,
  AlertColor,
  AlertConfig,
  AlertConfigAlertLocation,
  AlertConfigTimeHorizon,
  AlertConfigTriggerRule,
  AlertConfigType,
  AlertCriticality,
  AlertTriggerValueFormat
} from 'types/machine-health/alerts';
import {
  AlertValidationConfig,
  CONDITION_VALIDATION_OBJECT,
  StyledInputContainerProps,
  VALIDATION_OBJECT
} from './FormElementsTypes';
import { AlertsTableDropdownItem } from 'types/machine-health/widget-table';

// API
import {
  useCreateAlertConfigMutation,
  useGetBusinessUnitMasterTagListQuery,
  useGetMachineDataAnalysisTagsQuery,
  useUpdateAlertConfigMutation
} from 'api';

// Helpers
import { handleFormValidation } from './FormValidation';
import { mapBusinessUnitId } from 'helpers/machine';

// Hooks & Providers
import { useMachine } from 'hooks';
import { useLanguage } from 'providers';

// Styled
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding: 0 0.5rem;
`;
const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;
const StyledFormSection = styled.section<StyledInputContainerProps>`
  div[class*='placeholder'],
  select option:first-child {
    color: #5d6a86;
  }

  &.occurrences {
    .ui-widget__main div > div {
      &:first-child {
        width: 24%;
      }
      &:nth-child(2) {
        width: 20%;
        margin: 0 1rem;
      }
      &:last-child {
        width: 56%;
      }
    }
  }

  .ui-widget {
    width: 100%;
  }

  .ui-widget__main > p {
    font-size: 0.875rem;
    padding-left: 1rem;
  }

  .ui-widget__main {
    overflow: visible;
  }

  .ui-date-range-picker {
    max-width: 435px;
  }

  .dropdown_checkboxes {
    font-family: ${({ theme }) => `${theme.typography.family}`};
    font-size: 0.875rem;
  }

  select {
    background: none;
  }
`;
const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0 1rem 0;

  button {
    width: 100%;
  }
`;
const StyledSmallButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;

  button {
    width: 10rem;
  }
`;
const StyledInputContainer = styled.div<StyledInputContainerProps>`
  display: flex;
  flex-direction: row;
  margin: 0.5rem 0;
  width: 100%;

  & > div {
    padding-left: 0;
    padding-right: 0;
  }

  ${({ theme, hasValidInput }) =>
    !hasValidInput &&
    `select, input, .dropdown_checkboxes > div {
    border: 0.1rem solid ${theme.colors.darkRed};
  }`}
`;
const StyledInputLabel = styled.p`
  align-items: center;
  font-size: 0.875rem;
  display: flex;
  min-width: 150px;
  width: 40%;
`;

const WrappedConditionWithTransition = (props: ConditionProps) => {
  const [show, setShow] = useState(true);
  const { deleteCondition, ...rest } = props;

  const ref = React.useRef(null);

  const wrappedDeleteCondition = () => {
    setShow(false);
    setTimeout(() => deleteCondition(), 300);
  };

  return (
    <CSSTransition nodeRef={ref} in={show} classNames="condition" timeout={300}>
      <div ref={ref}>
        <AlertConfigConditionTagForm {...rest} deleteCondition={wrappedDeleteCondition} />
      </div>
    </CSSTransition>
  );
};
interface Props {
  alertToEdit: AlertConfig | null;
  onClose: () => void;
}

type AlertLevel = keyof typeof AlertCriticality;
type AlertLocation = keyof typeof AlertConfigAlertLocation;

const initValidationForm = (form: AlertConfig | null) => {
  const copyValidationObject = cloneDeep(VALIDATION_OBJECT);
  if (form?.conditions && form.conditions.length > 1) {
    for (let i = 1; i < form.conditions.length; i++) {
      copyValidationObject.conditions.push({ ...CONDITION_VALIDATION_OBJECT });
    }
  }
  return copyValidationObject;
};

/**
 * This component holds all of the form fields and logic for creating or editing an alert.
 * @param alertToEdit Alert to edit, or null if creating a new alert
 * @param onClose Callback to close the flyout
 */

const CreateOrEditAlertTagForm = ({ alertToEdit, onClose }: Props): JSX.Element => {
  const isNewAlert = !alertToEdit?.id;
  const theme = useTheme();
  const { t } = useTranslation(['mh', 'common']);
  const { languageId } = useLanguage();
  const { machineId } = useParams<{ machineId: string }>();
  const { machine } = useMachine();
  const businessUnitId = mapBusinessUnitId(machine?.businessUnit) || 3;

  const [createAlertConfig, { isLoading: isCreating }] = useCreateAlertConfigMutation();
  const [updateAlertConfig, { isLoading: isUpdating }] = useUpdateAlertConfigMutation();

  const [currentAlertData, setCurrentAlertData] = useState<AlertConfig | null>(alertToEdit);
  const [validationAlertData, setValidationAlertData] = useState<AlertValidationConfig>(
    initValidationForm(alertToEdit)
  );

  const {
    data: machineTags,
    isFetching: isFetchingMachineTags,
    error: errorMachineTags
  } = useGetBusinessUnitMasterTagListQuery({
    businessUnitId,
    languageId
  });

  const {
    data: tagValues,
    isFetching: isFetchingTagValues,
    error: errorTagValues
  } = useGetMachineDataAnalysisTagsQuery(machineId ? { machineId } : skipToken, { skip: false });

  const tagList = useMemo(() => {
    const tags: AlertsTableDropdownItem[] = [];

    machineTags?.forEach((tag) => {
      const values = [];
      const foundValue = tagValues?.find((tagValue) => tagValue.tagId === tag.id);
      foundValue && values.push(foundValue);

      tags.push({
        id: tag.id as string,
        ...(tag.friendlyName ? { name: tag.friendlyName as string } : {}),
        label: (tag.friendlyName || tag.id) as string,
        friendlyName: (tag.friendlyName || '') as string,
        values
      });
    });

    tags
      .sort((option1, option2) => {
        const typedOption1 = option1;
        const option1Values = typedOption1.values as { value: number }[];
        const typedOption2 = option2;
        const option2Values = typedOption2.values as { value: number }[];

        if (option1Values.length && !option2Values.length) {
          return -1;
        }
        if (!option1Values.length && option2Values.length) {
          return 1;
        }
        return 0;
      })
      .sort((option1, option2) => {
        const typedOption1 = option1;
        const option1Values = typedOption1.values as { value: number }[];
        const typedOption2 = option2;
        const option2Values = typedOption2.values as { value: number }[];
        if (
          (option1Values[0]?.value != undefined && option2Values[0]?.value != undefined) ||
          (option1Values[0]?.value == undefined && option2Values[0]?.value == undefined)
        ) {
          const option1Id = (typedOption1.id as string).toLowerCase();
          const option2Id = (typedOption2.id as string).toLowerCase();
          if (option1Id < option2Id) {
            return -1;
          }
          if (option1Id > option2Id) {
            return 1;
          }
          return 0;
        }
        return 0;
      });

    return tags;
  }, [machineTags, tagValues]);

  const onSave = async () => {
    if (!currentAlertData) {
      // If we have no alert, do nothing.
      toast.error(t('no_alert_found'));
      return;
    }

    // Perform validation
    const validationResponse = handleFormValidation({ form: currentAlertData, t });
    if (!validationResponse.isValid) {
      const validationData = { ...validationResponse.validationObject };
      setValidationAlertData({ ...validationData });
      if (validationResponse.errorMsg) {
        toast.error(validationResponse.errorMsg);
      } else {
        toast.error(t('fill_out_required_fields', { ns: 'common' }));
      }
      return;
    }

    const updatedAlertData = cloneDeep(currentAlertData);
    updatedAlertData.machineId = machineId;

    const { conditions } = updatedAlertData;
    const { booleanAlertColor, targetBoolean } = conditions?.[0] ?? {};

    // Assign red boolean color based on user selection
    if (updatedAlertData.conditions?.[0]) {
      if (booleanAlertColor === 'red' && targetBoolean !== undefined) {
        updatedAlertData.conditions[0].redAlertBoolean = targetBoolean;
      }
      // Assign orange boolean color based on user selection
      if (booleanAlertColor === 'orange' && targetBoolean !== undefined) {
        updatedAlertData.conditions[0].orangeAlertBoolean = targetBoolean;
      }
    }

    if (isNewAlert) {
      // Create new alert
      await createAlertConfig(updatedAlertData)
        .unwrap()
        .then((res) => {
          if (res) {
            toast.success(t('alert_created_successfully'));
          } else {
            toast.error(t('failed_to_create_alert'));
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(t('failed_to_create_alert'));
        });
    } else {
      await updateAlertConfig(updatedAlertData)
        .unwrap()
        .then((res) => {
          if (res) {
            toast.success(t('alert_edited_successfully'));
          } else {
            toast.error(t('failed_to_edit_alert'));
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(t('failed_to_edit_alert'));
        });
    }

    onClose();
  };

  const handeUpdateValue = (
    valueType: string,
    value: string | AlertLevel | AlertLocation | AlertConfigType | AlertsTableDropdownItem
  ) => {
    if (!currentAlertData) return;

    const copyOfTheState = Object.assign(currentAlertData);

    switch (valueType) {
      case 'alertName':
        setCurrentAlertData({ ...copyOfTheState, name: value });
        break;
      case 'alertDescription':
        setCurrentAlertData({ ...copyOfTheState, description: value });
        break;
      case 'timeframeOfMeanCalculation':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], timeframeOfMeanCalculation: value }]
        });
        break;
      case 'importance':
        setCurrentAlertData({ ...copyOfTheState, importance: value });
        break;
      default:
        return currentAlertData;
    }
  };

  const handleUpdateConditionValue =
    (idx: number) =>
    (
      valueType: string,
      value: string | AlertConfigType | AlertsTableDropdownItem | AlertConfigTimeHorizon
    ) => {
      // create deep copy of condition
      const copyOfTheState = Object.assign({}, currentAlertData, {
        conditions: [...(currentAlertData?.conditions ?? [])]
      });
      const condition = (copyOfTheState.conditions[idx] = { ...copyOfTheState.conditions[idx] });

      switch (valueType) {
        case 'timeframeOfMeanCalculation':
          condition.timeframeOfMeanCalculation = value as AlertConfigTimeHorizon;
          break;
        case 'triggerRule':
          condition.triggerRule = value as AlertConfigType;
          break;
        case 'dataSource':
          condition.dataSource = value as AlertsTableDropdownItem;
          break;
        case 'targetSetpoint':
          condition.targetSetpoint = value as AlertsTableDropdownItem;
          break;
        case 'triggerValueFormat':
          condition.triggerValueFormat = value as AlertTriggerValueFormat;
          break;
        case 'targetBoolean':
          condition.targetBoolean = value as AlertBoolean;
          break;
        case 'booleanAlertColor':
          condition.booleanAlertColor = value as AlertColor;
          break;
      }
      setCurrentAlertData(copyOfTheState);
    };

  const handleUpdateMachineState = (valueType: string, value: string[]) => {
    if (!currentAlertData) return;
    const copyOfTheState = Object.assign(currentAlertData);

    if (valueType === 'machineState') {
      setCurrentAlertData({ ...copyOfTheState, machineState: value });
    }
  };

  const handleUpdateAlertLocation = (valueType: string, value: string[]) => {
    if (!currentAlertData) return;
    const copyOfTheState = Object.assign(currentAlertData);

    if (valueType === 'location') {
      setCurrentAlertData({ ...copyOfTheState, location: value });
    }
  };

  const handleUpdateAlertsValues =
    (idx: number) => (valueType: string, value: number | undefined) => {
      // create deep copy of condition
      const copyOfTheState = Object.assign({}, currentAlertData, {
        conditions: [...(currentAlertData?.conditions ?? [])]
      });
      const condition = (copyOfTheState.conditions[idx] = { ...copyOfTheState.conditions[idx] });

      if (!currentAlertData) return;

      switch (valueType) {
        case 'orangeAlertRangeUpper':
        case 'orangeAlertRangeLower':
        case 'orangeAlertDeviationFromMean':
        case 'redAlertRangeUpper':
        case 'redAlertRangeLower':
        case 'redAlertDeviationFromMean':
          condition[valueType] = value;
          break;
      }
      setCurrentAlertData(copyOfTheState);
    };

  const createCondition = (): void => {
    if (!currentAlertData?.conditions) {
      return;
    }
    const copyOfTheState = Object.assign(currentAlertData);
    const newCondition: AlertConfigTriggerRule = {
      id: uuidv4(),
      dataSourceType: 'tag',
      triggerRule: AlertConfigType.SetPoint
    };
    Promise.resolve().then(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [...copyOfTheState?.conditions, newCondition]
        });
        setValidationAlertData((validationData) => {
          const updatedValidationData = cloneDeep(validationData);
          validationData.conditions.push({ ...CONDITION_VALIDATION_OBJECT });
          return updatedValidationData;
        });
      });
    });
  };

  const deleteCondition = (idx: number) => (): void => {
    const copyOfTheState: AlertConfig = Object.assign({}, currentAlertData, {
      conditions: [...(currentAlertData?.conditions ?? [])]
    });
    copyOfTheState.conditions && copyOfTheState.conditions.splice(idx, 1);
    Promise.resolve().then(() => {
      ReactDOM.unstable_batchedUpdates(() => {
        setCurrentAlertData(copyOfTheState);
        setValidationAlertData((validationData) => {
          const updatedValidationData = cloneDeep(validationData);
          validationData.conditions.splice(idx, 1);
          return updatedValidationData;
        });
      });
    });
  };

  const isLoading = isFetchingMachineTags || isFetchingTagValues;
  const isError = errorMachineTags || errorTagValues;

  return (
    <PageLayout>
      <StyledContainer>
        {isLoading && <Loader size={40} />}
        {isError && (
          <Typography color={theme.colors.darkRed}>{t('could_not_fetch_alert_details')}</Typography>
        )}
        {!isLoading && !isError && (
          <>
            <StyledFormContainer>
              <StyledFormSection>
                <Typography variant="h4">{t('alert_settings')}</Typography>
                <StyledInputContainer hasValidInput={validationAlertData.name}>
                  <StyledInputLabel>{t('alert_name')}:</StyledInputLabel>
                  <AlertName
                    displayValue={currentAlertData?.name ? currentAlertData?.name : ''}
                    handeUpdateValue={handeUpdateValue}
                  />
                </StyledInputContainer>
                <StyledInputContainer hasValidInput={validationAlertData.description}>
                  <StyledInputLabel>{t('alert_description')}:</StyledInputLabel>
                  <AlertDescription
                    displayValue={
                      currentAlertData?.description ? currentAlertData?.description : ''
                    }
                    handeUpdateValue={handeUpdateValue}
                  />
                </StyledInputContainer>
                {/* </StyledFormSection> */}

                {/* <StyledFormSection> */}
                <StyledInputContainer hasValidInput={validationAlertData.machineState}>
                  <MachineState
                    handeUpdateValue={handleUpdateMachineState}
                    machineValue={
                      currentAlertData?.machineState
                        ? (currentAlertData?.machineState as unknown as string[])
                        : []
                    }
                  />
                </StyledInputContainer>

                <StyledInputContainer hasValidInput={validationAlertData.importance}>
                  <AlertImportance
                    handeUpdateValue={handeUpdateValue}
                    value={currentAlertData?.importance ? currentAlertData?.importance : ''}
                  />
                </StyledInputContainer>

                <StyledInputContainer hasValidInput={validationAlertData.location}>
                  <AlertLocation
                    handeUpdateValue={handleUpdateAlertLocation}
                    alertValue={currentAlertData?.location ? currentAlertData?.location : []}
                  />
                </StyledInputContainer>
              </StyledFormSection>
              <>
                {currentAlertData?.conditions?.map((cond, idx) => (
                  <WrappedConditionWithTransition
                    key={cond.id}
                    conditionToEdit={cond}
                    idx={idx}
                    tagList={tagList}
                    deletable={(currentAlertData?.conditions?.length ?? 0) > 1}
                    deleteCondition={deleteCondition(idx)}
                    validationAlertData={validationAlertData}
                    handleUpdateValue={handleUpdateConditionValue(idx)}
                    handleUpdateAlertsValues={handleUpdateAlertsValues(idx)}
                    setValidationAlertData={setValidationAlertData}
                  />
                ))}
              </>
              <StyledButtonContainer>
                <Button
                  onClick={createCondition}
                  disabled={
                    !currentAlertData?.conditions || currentAlertData.conditions.length >= 5
                  }
                  variant="secondary"
                  width="fit-content"
                >
                  {t('add_alert_config_condition')}&nbsp;&#43;
                </Button>
              </StyledButtonContainer>
            </StyledFormContainer>

            <StyledSmallButtonContainer>
              <Button onClick={onSave} variant="primary" width="fit-content">
                {isNewAlert ? t('create_alert') : t('update_alert')}
                {(isCreating || isUpdating) && <Loader margin={0} size={13} />}
              </Button>
            </StyledSmallButtonContainer>
          </>
        )}
      </StyledContainer>
    </PageLayout>
  );
};

export default CreateOrEditAlertTagForm;
