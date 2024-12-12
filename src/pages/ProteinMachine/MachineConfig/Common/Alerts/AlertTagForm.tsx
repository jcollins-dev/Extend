// 3rd Party Libs
import React, { useState, useMemo, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

// Components
import { Button, Typography, Loader, DashboardWidget, PageLayout } from 'components';
import {
  AlertDescription,
  AlertImportance,
  AlertLocation,
  AlertName,
  BooleanColor,
  MachineState,
  Occurrences,
  OrangeAlert,
  RedAlert,
  TagDropdown,
  TargetSetpointBooleanDrowpdown,
  TriggerFormat,
  TriggerRuleDateRange,
  TriggerRuleDropdown,
  TriggerUpperLowerAlert,
  WidgetMain
} from './FormElements';

// Types
import {
  AlertConfig,
  AlertConfigAlertLocation,
  AlertConfigType,
  AlertCriticality
} from 'types/machine-health/alerts';
import {
  AlertValidationConfig,
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
  padding: 1rem;

  button {
    width: 100%;
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

interface Props {
  alertToEdit: AlertConfig | null;
  onClose: () => void;
}

type AlertLevel = keyof typeof AlertCriticality;
type AlertLocation = keyof typeof AlertConfigAlertLocation;

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
  const [validationAlertData, setValidationAlertData] =
    useState<AlertValidationConfig>(VALIDATION_OBJECT);
  const [dataSourceValue, setDataSourceValue] = useState<AlertsTableDropdownItem | undefined>(
    alertToEdit?.conditions?.[0]?.dataSource as AlertsTableDropdownItem
  );
  const [triggerRule, setTriggerRule] = useState<string | undefined>(
    alertToEdit?.conditions?.[0]?.triggerRule
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

  const resetValidationState = () => {
    const validationObject = JSON.parse(JSON.stringify(VALIDATION_OBJECT));
    setValidationAlertData(validationObject);
  };

  useEffect(() => {
    resetValidationState();
    triggerRuleMain();
  }, [triggerRule]);

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
      setValidationAlertData(validationResponse.validationObject);
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
      case 'triggerRule':
        if (typeof value === 'string') setTriggerRule(value);
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], triggerRule: value }]
        });
        break;
      case 'dataSource':
        setDataSourceValue(value as AlertsTableDropdownItem);
        if (value && currentAlertData) {
          const copyOfTheState = Object.assign(currentAlertData);
          setCurrentAlertData({
            ...copyOfTheState,
            conditions: [{ ...copyOfTheState.conditions[0], dataSource: value }]
          });
        }
        break;
      case 'targetSetpoint':
        if (typeof value === 'string' || typeof value === 'number') return copyOfTheState;
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], targetSetpoint: value }]
        });
        break;
      case 'triggerValueFormat':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], triggerValueFormat: value }]
        });
        break;
      case 'targetBoolean':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], targetBoolean: value }]
        });
        break;
      case 'booleanAlertColor':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], booleanAlertColor: value }]
        });
        break;
      default:
        return currentAlertData;
    }
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

  const handleUpdateOccurrence = (valueType: string, value: number) => {
    if (!currentAlertData) return;
    const copyOfTheState = Object.assign(currentAlertData);

    if (valueType === 'minimumOccurrences') {
      setCurrentAlertData({ ...copyOfTheState, minimumOccurrences: value });
    }
  };

  const handleUpdateAlertsValues = (valueType: string, value: number | undefined) => {
    if (!currentAlertData) return;

    const copyOfTheState = Object.assign(currentAlertData);

    switch (valueType) {
      case 'orangeAlertRangeUpper':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], orangeAlertRangeUpper: value }]
        });
        break;
      case 'orangeAlertRangeLower':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], orangeAlertRangeLower: value }]
        });
        break;
      case 'orangeAlertDeviationFromMean':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], orangeAlertDeviationFromMean: value }]
        });
        break;
      case 'redAlertRangeUpper':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], redAlertRangeUpper: value }]
        });
        break;
      case 'redAlertRangeLower':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], redAlertRangeLower: value }]
        });
        break;
      case 'redAlertDeviationFromMean':
        setCurrentAlertData({
          ...copyOfTheState,
          conditions: [{ ...copyOfTheState.conditions[0], redAlertDeviationFromMean: value }]
        });
        break;
      default:
        return copyOfTheState;
    }
  };

  const rulesBoolean = (
    <>
      <TriggerRuleDropdown
        hasClass={!validationAlertData.conditions[0].triggerRule ? 'error' : undefined}
        handeUpdateValue={handeUpdateValue}
        value={
          currentAlertData?.conditions?.[0]?.triggerRule
            ? currentAlertData?.conditions?.[0]?.triggerRule
            : AlertConfigType.SetPoint
        }
      />

      <TargetSetpointBooleanDrowpdown
        hasClass={!validationAlertData.conditions[0].targetBoolean ? 'error' : undefined}
        handeUpdateValue={handeUpdateValue}
        value={
          currentAlertData?.conditions?.[0]?.targetBoolean
            ? currentAlertData?.conditions?.[0]?.targetBoolean
            : ''
        }
      />
    </>
  );

  const rulesDeviation = (
    <>
      <TriggerRuleDropdown
        hasClass={!validationAlertData.conditions[0].triggerRule ? 'error' : undefined}
        handeUpdateValue={handeUpdateValue}
        value={
          currentAlertData?.conditions?.[0]?.triggerRule
            ? currentAlertData?.conditions?.[0]?.triggerRule
            : AlertConfigType.SetPoint
        }
      />

      <TriggerRuleDateRange
        hasClass={
          !validationAlertData.conditions[0].timeframeOfMeanCalculation ? 'error' : undefined
        }
        handeUpdateValue={handeUpdateValue}
        value={
          currentAlertData?.conditions?.[0]?.timeframeOfMeanCalculation
            ? currentAlertData?.conditions?.[0]?.timeframeOfMeanCalculation
            : ''
        }
      />
    </>
  );

  const rulesThreshold = (
    <>
      <TriggerRuleDropdown
        hasClass={!validationAlertData.conditions[0].triggerRule ? 'error' : undefined}
        handeUpdateValue={handeUpdateValue}
        value={
          currentAlertData?.conditions?.[0]?.triggerRule
            ? currentAlertData?.conditions?.[0]?.triggerRule
            : AlertConfigType.SetPoint
        }
      />
    </>
  );

  const rulesSetpoint = (
    <>
      <TriggerRuleDropdown
        hasClass={!validationAlertData.conditions[0].triggerRule ? 'error' : undefined}
        handeUpdateValue={handeUpdateValue}
        value={
          currentAlertData?.conditions?.[0]?.triggerRule
            ? currentAlertData?.conditions?.[0]?.triggerRule
            : AlertConfigType.SetPoint
        }
      />

      <TriggerFormat
        hasClass={!validationAlertData.conditions[0].triggerValueFormat ? 'error' : undefined}
        handeUpdateValue={handeUpdateValue}
        value={currentAlertData?.conditions?.[0]?.triggerValueFormat}
      />

      <TagDropdown
        hasClass={!validationAlertData.conditions[0].targetSetpoint ? 'error' : undefined}
        handeUpdateValue={handeUpdateValue}
        currentValue={
          currentAlertData?.conditions?.[0]?.targetSetpoint
            ? (currentAlertData?.conditions?.[0]?.targetSetpoint as AlertsTableDropdownItem)
            : null
        }
        tagList={tagList}
        dropdownType="targetSetpoint"
        label="target_setpoint"
      />
    </>
  );

  const triggerRuleMain = (): JSX.Element => {
    switch (triggerRule) {
      case AlertConfigType.SetPoint:
        return <StyledFormSection>{rulesSetpoint}</StyledFormSection>;
      case AlertConfigType.Threshold:
        return <StyledFormSection>{rulesThreshold}</StyledFormSection>;
      case AlertConfigType.Boolean:
        return <StyledFormSection>{rulesBoolean}</StyledFormSection>;
      case AlertConfigType.DeviationFromMean:
        return <StyledFormSection>{rulesDeviation}</StyledFormSection>;
      default:
        // Setting set Point as default
        return <StyledFormSection>{rulesSetpoint}</StyledFormSection>;
    }
  };

  const triggerRuleSettings = {
    title: t('trigger_rule'),
    Main: <WidgetMain>{triggerRuleMain()}</WidgetMain>
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
              </StyledFormSection>
              <StyledFormSection>
                <Typography variant="h4">{t('data_source')}</Typography>
                <TagDropdown
                  hasClass={!validationAlertData.conditions[0].dataSource ? 'error' : undefined}
                  handeUpdateValue={handeUpdateValue}
                  currentValue={dataSourceValue as AlertsTableDropdownItem}
                  tagList={tagList}
                  dropdownType="dataSource"
                  label="tag"
                />
              </StyledFormSection>

              <StyledFormSection>
                <DashboardWidget {...triggerRuleSettings} />
              </StyledFormSection>

              {triggerRule !== AlertConfigType.Boolean &&
                triggerRule !== AlertConfigType.DeviationFromMean && (
                  <>
                    <StyledFormSection>
                      <TriggerUpperLowerAlert
                        hasClass={
                          (!validationAlertData.conditions[0].orangeAlertRangeUpper
                            ? 'upper_orange'
                            : '') +
                          '_' +
                          (!validationAlertData.conditions[0].orangeAlertRangeLower
                            ? 'lower_orange'
                            : '') +
                          (!validationAlertData.conditions[0].redAlertRangeUpper
                            ? 'upper_red'
                            : '') +
                          '_' +
                          (!validationAlertData.conditions[0].redAlertRangeLower ? 'lower_red' : '')
                        }
                        handleUpdateValue={handleUpdateAlertsValues}
                        uRedValue={
                          currentAlertData?.conditions?.[0]?.redAlertRangeUpper &&
                          currentAlertData?.conditions?.[0]?.redAlertRangeUpper
                        }
                        lRedValue={
                          currentAlertData?.conditions?.[0]?.redAlertRangeLower &&
                          currentAlertData?.conditions?.[0]?.redAlertRangeLower
                        }
                        uOrangeValue={
                          currentAlertData?.conditions?.[0]?.orangeAlertRangeUpper &&
                          currentAlertData?.conditions?.[0]?.orangeAlertRangeUpper
                        }
                        lOrangeValue={
                          currentAlertData?.conditions?.[0]?.orangeAlertRangeLower &&
                          currentAlertData?.conditions?.[0]?.orangeAlertRangeLower
                        }
                      />
                    </StyledFormSection>
                  </>
                )}

              {triggerRule === AlertConfigType.DeviationFromMean && (
                <>
                  <StyledFormSection>
                    <OrangeAlert
                      hasClass={
                        !validationAlertData.conditions[0].orangeAlertDeviationFromMean
                          ? 'deviation'
                          : ''
                      }
                      handleUpdateValue={handleUpdateAlertsValues}
                      value={currentAlertData?.conditions?.[0]?.orangeAlertDeviationFromMean}
                      isDeviation
                    />
                  </StyledFormSection>

                  <StyledFormSection>
                    <RedAlert
                      hasClass={
                        !validationAlertData.conditions[0].redAlertDeviationFromMean
                          ? 'deviation'
                          : ''
                      }
                      handleUpdateValue={handleUpdateAlertsValues}
                      value={currentAlertData?.conditions?.[0]?.redAlertDeviationFromMean}
                      isDeviation
                    />
                  </StyledFormSection>
                </>
              )}

              {triggerRule === AlertConfigType.Boolean && (
                <StyledFormSection>
                  <BooleanColor
                    hasClass={
                      !validationAlertData.conditions[0].booleanAlertColor ? 'error' : undefined
                    }
                    handeUpdateValue={handeUpdateValue}
                    value={currentAlertData?.conditions?.[0]?.booleanAlertColor}
                  />
                </StyledFormSection>
              )}

              <StyledFormSection className={'occurrences'}>
                <StyledInputContainer hasValidInput={validationAlertData.minimumOccurrences}>
                  <Occurrences
                    handeUpdateValue={handleUpdateOccurrence}
                    value={
                      currentAlertData?.minimumOccurrences && currentAlertData?.minimumOccurrences
                    }
                  />
                </StyledInputContainer>
              </StyledFormSection>

              <StyledFormSection>
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
            </StyledFormContainer>

            <StyledButtonContainer>
              <Button onClick={onSave} variant="primary" width="fit-content">
                {isNewAlert ? t('create_alert') : t('update_alert')}
                {(isCreating || isUpdating) && <Loader margin={0} size={13} />}
              </Button>
            </StyledButtonContainer>
          </>
        )}
      </StyledContainer>
    </PageLayout>
  );
};

export default CreateOrEditAlertTagForm;
