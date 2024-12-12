// 3rd Party Libs
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneDeep } from 'lodash';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Components
import { DashboardWidget } from 'components';
import {
  BooleanColor,
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
import { AlertConfigTriggerRule, AlertConfigType } from 'types/machine-health/alerts';
import {
  AlertValidationConfig,
  StyledInputContainerProps,
  CONDITION_VALIDATION_OBJECT
} from './FormElementsTypes';
import { AlertsTableDropdownItem } from 'types/machine-health/widget-table';

// Styled
const StyledConditionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-width: 1px;
  border-style: solid;
  border-radius: 0.625rem;
  border-color: #d1d6db;
`;
const StyledContentContainer = styled.div<{ isExpanded?: boolean }>`
  overflow: ${({ isExpanded }) => (isExpanded ? 'visible' : 'hidden')};
  ${({ isExpanded }) => (isExpanded ? `max-height: 100%` : `max-height: 0px;`)}
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
const Header = styled.div<{ isExpanded?: boolean }>`
  align-items: center;
  display: flex;
  font-weight: bold;
  justify-content: space-between;
  cursor: pointer;

  svg {
    transition: all 0.3s ease-in-out;
  }

  & :hover {
    color: ${({ theme }) => theme.colors.mediumBlue};
    transition: all 0.3s ease-in-out;
  }
`;
const TitleWrapper = styled.div<{ isExpanded?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  & > * {
    margin-right: 0.5rem;
  }
`;
const RotateIconWrapper = styled.div<{ isExpanded?: boolean }>`
  transition: transform 0.3s ease-in-out;
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)')};
`;

export interface Props {
  conditionToEdit: AlertConfigTriggerRule | null;
  idx: number;
  tagList: AlertsTableDropdownItem[];
  deletable: boolean;
  deleteCondition: () => void;
  validationAlertData: AlertValidationConfig;
  handleUpdateValue: (
    type: string,
    value: string | AlertConfigType | AlertsTableDropdownItem
  ) => void;
  handleUpdateAlertsValues: (valueType: string, value: number | undefined) => void;
  setValidationAlertData: React.Dispatch<React.SetStateAction<AlertValidationConfig>>;
}

/**
 * This component holds all of the form fields and logic for creating or editing an alert
 * configuration condition.
 * @param conditionToEdit Alert configuration condition to view/edit
 * @param idx index number of condition in configurations conditions array
 * @param tagList list of tags to show in dropdowns
 * @param deletable flag to indicate whether this condition can be deleted
 * @param deleteCondition method to call for deleting a condition
 * @param validationAlertData alert configuration validation object
 * @param handleUpdateValue method to update condition properties
 * @param handleUpdateAlertsValues method to update numeric values for comparison
 * @param setValidationAlertData method to call on condition validation
 */

const CreateOrEditAlertTagConditionForm = ({
  conditionToEdit,
  idx,
  tagList,
  deletable,
  deleteCondition,
  validationAlertData,
  handleUpdateValue,
  handleUpdateAlertsValues,
  setValidationAlertData
}: Props): JSX.Element => {
  const { t } = useTranslation(['mh', 'common']);

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [currentConditionData, setCurrentConditionData] = useState<AlertConfigTriggerRule | null>(
    conditionToEdit
  );
  const [dataSourceValue, setDataSourceValue] = useState<AlertsTableDropdownItem | undefined>(
    conditionToEdit?.dataSource as AlertsTableDropdownItem
  );
  const [triggerRule, setTriggerRule] = useState<string | undefined>(conditionToEdit?.triggerRule);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const resetConditionValidationState = () => {
    const validationObject = cloneDeep(CONDITION_VALIDATION_OBJECT);
    setValidationAlertData((validationData: AlertValidationConfig) => {
      const updatedValidationData = cloneDeep(validationData);
      updatedValidationData.conditions[idx] = validationObject;
      return updatedValidationData;
    });
  };

  useEffect(() => {
    setCurrentConditionData(conditionToEdit);
    setDataSourceValue(conditionToEdit?.dataSource);
    setTriggerRule(conditionToEdit?.triggerRule);
  }, [conditionToEdit]);

  useEffect(() => {
    resetConditionValidationState();
    triggerRuleMain();
  }, [triggerRule]);

  const rulesBoolean = (
    <>
      <TriggerRuleDropdown
        hasClass={!validationAlertData.conditions[idx]?.triggerRule ? 'error' : undefined}
        handeUpdateValue={handleUpdateValue}
        value={
          currentConditionData?.triggerRule
            ? currentConditionData?.triggerRule
            : AlertConfigType.SetPoint
        }
      />

      <TargetSetpointBooleanDrowpdown
        hasClass={!validationAlertData.conditions[idx]?.targetBoolean ? 'error' : undefined}
        handeUpdateValue={handleUpdateValue}
        value={currentConditionData?.targetBoolean ? currentConditionData?.targetBoolean : ''}
      />
    </>
  );

  const rulesDeviation = (
    <>
      <TriggerRuleDropdown
        hasClass={!validationAlertData.conditions[idx]?.triggerRule ? 'error' : undefined}
        handeUpdateValue={handleUpdateValue}
        value={
          currentConditionData?.triggerRule
            ? currentConditionData?.triggerRule
            : AlertConfigType.SetPoint
        }
      />

      <TriggerRuleDateRange
        hasClass={
          !validationAlertData.conditions[idx]?.timeframeOfMeanCalculation ? 'error' : undefined
        }
        handeUpdateValue={handleUpdateValue}
        value={
          currentConditionData?.timeframeOfMeanCalculation
            ? currentConditionData?.timeframeOfMeanCalculation
            : ''
        }
      />
    </>
  );

  const rulesThreshold = (
    <>
      <TriggerRuleDropdown
        hasClass={!validationAlertData.conditions[idx]?.triggerRule ? 'error' : undefined}
        handeUpdateValue={handleUpdateValue}
        value={
          currentConditionData?.triggerRule
            ? currentConditionData?.triggerRule
            : AlertConfigType.SetPoint
        }
      />
    </>
  );

  const rulesSetpoint = (
    <>
      <TriggerRuleDropdown
        hasClass={!validationAlertData.conditions[idx]?.triggerRule ? 'error' : undefined}
        handeUpdateValue={handleUpdateValue}
        value={
          currentConditionData?.triggerRule
            ? currentConditionData?.triggerRule
            : AlertConfigType.SetPoint
        }
      />

      <TriggerFormat
        hasClass={!validationAlertData.conditions[idx]?.triggerValueFormat ? 'error' : undefined}
        handeUpdateValue={handleUpdateValue}
        value={currentConditionData?.triggerValueFormat}
      />

      <TagDropdown
        hasClass={!validationAlertData.conditions[idx]?.targetSetpoint ? 'error' : undefined}
        handeUpdateValue={handleUpdateValue}
        currentValue={
          currentConditionData?.targetSetpoint
            ? (currentConditionData?.targetSetpoint as AlertsTableDropdownItem)
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

  return (
    <StyledConditionContainer>
      <Header>
        <TitleWrapper>
          <RotateIconWrapper isExpanded={isExpanded}>
            <FontAwesomeIcon icon={faCaretDown} onClick={toggleExpanded} size="lg" />
          </RotateIconWrapper>
          <div onClick={toggleExpanded}>
            {t('condition')} {idx + 1}
          </div>
        </TitleWrapper>
        {deletable && <FontAwesomeIcon icon={faTrashCan} onClick={deleteCondition} />}
      </Header>
      <StyledContentContainer isExpanded={isExpanded}>
        <StyledFormContainer>
          <StyledFormSection>
            {/* <Typography variant="h4">{t('data_source')}</Typography> */}
            <TagDropdown
              hasClass={!validationAlertData.conditions[idx]?.dataSource ? 'error' : undefined}
              handeUpdateValue={handleUpdateValue}
              currentValue={dataSourceValue as AlertsTableDropdownItem}
              tagList={tagList}
              dropdownType="dataSource"
              label={`Tag ${t('data_source')}`}
              // label="tag"
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
                      (!validationAlertData.conditions[idx]?.orangeAlertRangeUpper
                        ? 'upper_orange'
                        : '') +
                      '_' +
                      (!validationAlertData.conditions[idx]?.orangeAlertRangeLower
                        ? 'lower_orange'
                        : '') +
                      (!validationAlertData.conditions[idx]?.redAlertRangeUpper
                        ? 'upper_red'
                        : '') +
                      '_' +
                      (!validationAlertData.conditions[idx]?.redAlertRangeLower ? 'lower_red' : '')
                    }
                    handleUpdateValue={handleUpdateAlertsValues}
                    uRedValue={
                      conditionToEdit?.redAlertRangeUpper && conditionToEdit?.redAlertRangeUpper
                    }
                    lRedValue={
                      conditionToEdit?.redAlertRangeLower && conditionToEdit?.redAlertRangeLower
                    }
                    uOrangeValue={
                      conditionToEdit?.orangeAlertRangeUpper &&
                      conditionToEdit?.orangeAlertRangeUpper
                    }
                    lOrangeValue={
                      conditionToEdit?.orangeAlertRangeLower &&
                      conditionToEdit?.orangeAlertRangeLower
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
                    !validationAlertData.conditions[idx]?.orangeAlertDeviationFromMean
                      ? 'deviation'
                      : ''
                  }
                  handleUpdateValue={handleUpdateAlertsValues}
                  value={conditionToEdit?.orangeAlertDeviationFromMean}
                  isDeviation
                />
              </StyledFormSection>

              <StyledFormSection>
                <RedAlert
                  hasClass={
                    !validationAlertData.conditions[idx]?.redAlertDeviationFromMean
                      ? 'deviation'
                      : ''
                  }
                  handleUpdateValue={handleUpdateAlertsValues}
                  value={conditionToEdit?.redAlertDeviationFromMean}
                  isDeviation
                />
              </StyledFormSection>
            </>
          )}

          {triggerRule === AlertConfigType.Boolean && (
            <StyledFormSection>
              <BooleanColor
                hasClass={
                  !validationAlertData.conditions[idx]?.booleanAlertColor ? 'error' : undefined
                }
                handeUpdateValue={handleUpdateValue}
                value={conditionToEdit?.booleanAlertColor}
              />
            </StyledFormSection>
          )}
        </StyledFormContainer>
      </StyledContentContainer>
    </StyledConditionContainer>
  );
};

export default CreateOrEditAlertTagConditionForm;
