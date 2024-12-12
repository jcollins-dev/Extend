// 3rd party
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Theme
import { themeColors } from 'themes';

// Components
import {
  CustomContentRenderer,
  CustomDropdownRenderer
} from 'components/machine-health/configurator/WidgetTable/Dropdown';
import { Input, BaseSelect, DashboardWidget, RadioButton, Typography } from 'components';

// Helpers
import { getSupportedMachineAlertTriggerRules } from 'helpers/alerts';

// Types
import { WidgetTableDropdownItem } from 'types/machine-health';
import {
  AlertBoolean,
  AlertColor,
  AlertConfigAlertLocation,
  AlertConfigTimeHorizon,
  AlertConfigTimeHorizonLabel,
  AlertConfigType,
  AlertCriticality,
  AlertStateType,
  AlertTriggerValueFormat
} from 'types/machine-health/alerts';
import {
  AlertLevel,
  AlertLocationProps,
  AlertNameProps,
  AlertProps,
  DropDownItem,
  MachineStateProps,
  Props,
  TriggerFormatProps,
  TriggerRuleValue,
  OccurrenceProps,
  TagDropdownProps,
  AlertTriggerProps
} from './FormElementsTypes';
import { AlertsTableDropdownItem, TagsDropdownItems } from 'types/machine-health/widget-table';
import { DropdownWithCheckboxes } from './DropdownWithCheckboxes';

// Styled
export const WidgetMain = styled.div`
  padding-bottom: 1rem;
  padding-top: 0.5rem;

  & > p {
    padding: 0.5rem 1rem 0;
  }
`;

const FormElementContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: inherit;
  padding: 0.375rem 1rem;
  align-items: center;
  min-height: 52px;

  &.lower_validation_error,
  &.upper_validation_error,
  &.deviation_validation_error {
    input {
      border: 0.1rem solid ${({ theme }) => theme.colors.darkRed};
    }
  }

  .ui-date-button-w-dropdown {
    width: 100%;
  }

  &.error {
    select,
    .react-dropdown-select,
    .triggerValue_input input,
    .ui-date-range-btn {
      border: 0.1rem solid ${({ theme }) => theme.colors.darkRed};
    }
  }

  .ui-date-range-btn {
    box-shadow: none;
    border-radius: 0.375rem;
    padding: 0.45rem 0.55rem;
    font-size: 0.75rem;
    width: 100%;
  }
`;

const FormElementWrapper = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;

  &.dropdown_input {
  }

  & > .radio_select {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .triggerValue_input {
    padding-right: 1rem;
  }
  .dropdown_checkboxes {
    width: 100%;
  }
`;

const TextWarning = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.darkRed};
  margin: 0.5rem 0;
`;

const FormLabelWrapper = styled.div`
  font-size: 0.875rem;
  width: 40%;

  label {
    margin-bottom: 0;
  }
`;

export const isNumeric = (num: string | number): boolean =>
  (typeof num === 'number' || (typeof num === 'string' && num.trim() !== '')) &&
  !isNaN(num as number);

export const isPositiveNumeric = (num: string | number): boolean =>
  isNumeric(num) && Math.sign(Number(num)) >= 0;

export const AlertName = ({ displayValue, handeUpdateValue }: AlertNameProps): JSX.Element => {
  const [inputValue, setValue] = useState<string>(displayValue || '');

  useEffect(() => {
    handeUpdateValue('alertName', inputValue);
  }, [inputValue]);

  const handleChange = (e: { target: { value: string } }) => {
    const val = e.target.value as string;
    setValue(val);
  };

  return (
    <FormElementWrapper>
      <Input value={inputValue} onChange={handleChange} />
    </FormElementWrapper>
  );
};

export const AlertDescription = ({
  displayValue,
  handeUpdateValue
}: AlertNameProps): JSX.Element => {
  const [inputValue, setValue] = useState<string>(displayValue || '');

  useEffect(() => {
    handeUpdateValue('alertDescription', inputValue);
  }, [inputValue]);

  const handleChange = (e: { target: { value: string } }) => {
    const val = e.target.value as string;
    setValue(val);
  };

  return (
    <FormElementWrapper>
      <Input value={inputValue} onChange={handleChange} />
    </FormElementWrapper>
  );
};

export const TriggerRuleDropdown = ({ handeUpdateValue, value, hasClass }: Props): JSX.Element => {
  const [dropdownValue, setDropdownValue] = useState<string>(value);
  const { t } = useTranslation(['mh']);

  const triggerRules = getSupportedMachineAlertTriggerRules();
  const dropDownValueRule = dropdownValue as AlertConfigType;
  if (!triggerRules.includes(dropDownValueRule)) {
    triggerRules.push(dropDownValueRule);
  }
  const triggerRulesOptions = triggerRules.map((value) => ({
    value,
    label: t(value)
  }));

  useEffect(() => {
    handeUpdateValue('triggerRule', dropdownValue);
  }, [dropdownValue]);

  return (
    <FormElementContainer className={hasClass}>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t('trigger_rule')}</Typography>
      </FormLabelWrapper>
      <FormElementWrapper>
        <BaseSelect
          contentRenderer={({ id }: Record<string, unknown>) => (
            <CustomContentRenderer item={id as unknown as WidgetTableDropdownItem} />
          )}
          dropdownRenderer={(props, state, methods) => (
            <CustomDropdownRenderer props={props} state={state} methods={methods} />
          )}
          handleChange={(e) => {
            const val = e.target.value as TriggerRuleValue;
            return val && setDropdownValue(val);
          }}
          labelField="id"
          options={triggerRulesOptions as { value: string; label: string }[]}
          optionsKeysFormatted={false}
          placeholder={t('select_trigger_rule') as string}
          searchable={false}
          searchBy="label"
          value={dropdownValue}
          valueField="id"
        />
      </FormElementWrapper>
    </FormElementContainer>
  );
};

export const TriggerRuleDateRange = ({ handeUpdateValue, hasClass, value }: Props): JSX.Element => {
  const [dropdownValue, setDropdownValue] = useState<string>(value);
  const timeframeOfMeanCalculation = Object.values(AlertConfigTimeHorizon).map((timeValue) => ({
    value: timeValue,
    label: AlertConfigTimeHorizonLabel[timeValue]
  }));
  const { t } = useTranslation(['mh']);
  useEffect(() => {
    handeUpdateValue('timeframeOfMeanCalculation', dropdownValue);
  }, [dropdownValue]);

  return (
    <FormElementContainer className={hasClass}>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t('timeframe_mean_calculation')}</Typography>
      </FormLabelWrapper>
      <FormElementWrapper className="dropdown_input">
        <BaseSelect
          contentRenderer={({ id }: Record<string, unknown>) => (
            <CustomContentRenderer item={id as unknown as WidgetTableDropdownItem} />
          )}
          dropdownRenderer={(props, state, methods) => (
            <CustomDropdownRenderer props={props} state={state} methods={methods} />
          )}
          handleChange={(e) => {
            const val = e.target.value as AlertConfigTimeHorizon;
            return val && setDropdownValue(val);
          }}
          labelField="id"
          options={timeframeOfMeanCalculation as { value: string; label: string }[]}
          optionsKeysFormatted={false}
          placeholder={t('select_timeframe') as string}
          searchable={false}
          searchBy="label"
          value={value}
          valueField="id"
        />
      </FormElementWrapper>
    </FormElementContainer>
  );
};

export const TagDropdown = ({
  handeUpdateValue,
  currentValue,
  tagList,
  hasClass,
  dropdownType,
  label
}: TagDropdownProps): JSX.Element => {
  const [dropdownValue, setDropdownValue] = useState<AlertsTableDropdownItem | null>(currentValue);
  const { t } = useTranslation(['mh']);

  useEffect(() => {
    if (!dropdownValue) return;
    handeUpdateValue(dropdownType as string, dropdownValue);
  }, [dropdownValue]);

  return (
    <FormElementContainer className={hasClass}>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t(label as string)}</Typography>
      </FormLabelWrapper>
      <FormElementWrapper>
        <BaseSelect
          contentRenderer={({ id }: Record<string, unknown>) => (
            <CustomContentRenderer item={id as unknown as TagsDropdownItems} />
          )}
          dropdownRenderer={(props, state, methods) => (
            <CustomDropdownRenderer props={props} state={state} methods={methods} />
          )}
          disabledLabel={t('tag_already_assigned') as string}
          handleChangeSearch={(
            value: (AlertsTableDropdownItem | string | Record<string, unknown> | undefined)[]
          ) => {
            // We need to account for the case when value = undefined ...
            // ... which can happen when the user clears the search field
            const updateValue = value[0] as unknown as AlertsTableDropdownItem | undefined;
            return updateValue && setDropdownValue(updateValue);
          }}
          labelField="id"
          options={tagList as { id: string; label: string }[]}
          placeholder={t('select_tag') as string}
          searchable
          searchBy="label" // label is assigned as friendlyName value
          value={{
            label: dropdownValue,
            id: dropdownValue,
            name: dropdownValue
          }}
          valueField="id"
        />
      </FormElementWrapper>
    </FormElementContainer>
  );
};

export const TargetSetpointBooleanDrowpdown = ({
  handeUpdateValue,
  value,
  hasClass
}: Props): JSX.Element => {
  const targetSetpointDropdownValues = [
    { value: AlertBoolean.TRUE, label: 'True' },
    { value: AlertBoolean.FALSE, label: 'False' }
  ];
  const [dropdownValue, setDropdownValue] = useState<string>(value);
  const { t } = useTranslation(['mh']);

  useEffect(() => {
    if (!dropdownValue) return;
    handeUpdateValue('targetBoolean', dropdownValue);
  }, [dropdownValue]);

  return (
    <FormElementContainer className={hasClass}>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t('target_setpoint')}</Typography>
      </FormLabelWrapper>
      <FormElementWrapper>
        <BaseSelect
          contentRenderer={({ id }: Record<string, unknown>) => (
            <CustomContentRenderer item={id as unknown as WidgetTableDropdownItem} />
          )}
          dropdownRenderer={(props, state, methods) => (
            <CustomDropdownRenderer props={props} state={state} methods={methods} />
          )}
          handleChange={(e) => {
            const val = e.target.value as string;
            return val && setDropdownValue(val);
          }}
          labelField="id"
          options={targetSetpointDropdownValues as { value: string; label: string }[]}
          optionsKeysFormatted={false}
          placeholder={t('select_target_setpoint') as string}
          searchable={false}
          searchBy="label"
          value={dropdownValue}
          valueField="id"
        />
      </FormElementWrapper>
    </FormElementContainer>
  );
};

export const TriggerFormat = ({
  handeUpdateValue,
  value,
  hasClass
}: TriggerFormatProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  return (
    <FormElementContainer className={hasClass}>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t('trigger_value_format')}</Typography>
      </FormLabelWrapper>
      <FormElementWrapper>
        <div className="radio_select">
          <RadioButton
            className="triggerValue_input"
            key={'triggerFormat1'}
            checked={value === AlertTriggerValueFormat.ABSOLUTE ? true : false}
            label={t('absolute') as string}
            labelWeight={400}
            onChange={() =>
              handeUpdateValue('triggerValueFormat', AlertTriggerValueFormat.ABSOLUTE)
            }
          />
          <RadioButton
            className="triggerValue_input"
            key={'triggerFormat2'}
            checked={value === AlertTriggerValueFormat.PERCENTAGE ? true : false}
            label={t('percentage') as string}
            labelWeight={400}
            onChange={() =>
              handeUpdateValue('triggerValueFormat', AlertTriggerValueFormat.PERCENTAGE)
            }
          />
        </div>
      </FormElementWrapper>
    </FormElementContainer>
  );
};

export const BooleanColor = ({
  handeUpdateValue,
  value,
  hasClass
}: TriggerFormatProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const Main = (
    <WidgetMain>
      <Typography variant="body2">{t('select_alert_color')}</Typography>
      <FormElementContainer className={hasClass}>
        <FormLabelWrapper>
          <Typography variant="inputlabel">{t('alert_color')}</Typography>
        </FormLabelWrapper>
        <FormElementWrapper>
          <div className="radio_select">
            <RadioButton
              className="triggerValue_input"
              key={'triggerFormat1'}
              checked={value === AlertColor.ORANGE ? true : false}
              label={t('orange', { ns: 'common' }) as string}
              labelWeight={400}
              onChange={() => handeUpdateValue('booleanAlertColor', AlertColor.ORANGE)}
            />
            <RadioButton
              className="triggerValue_input"
              key={'triggerFormat2'}
              checked={value === AlertColor.RED ? true : false}
              label={t('red', { ns: 'common' }) as string}
              labelWeight={400}
              onChange={() => handeUpdateValue('booleanAlertColor', AlertColor.RED)}
            />
          </div>
        </FormElementWrapper>
      </FormElementContainer>
    </WidgetMain>
  );

  return (
    <DashboardWidget
      Main={Main}
      headerBackgroundColor={`${themeColors.atRiskYellow4}`}
      title={t('alert_color') as string}
      titleIndicator={<FontAwesomeIcon color={themeColors.atRiskYellow} icon={faBell} />}
    />
  );
};

export const TriggerUpperLowerAlert = ({
  handleUpdateValue,
  uRedValue,
  lRedValue,
  uOrangeValue,
  lOrangeValue,
  hasClass
}: AlertTriggerProps): JSX.Element => {
  const [upperRedValue, setUpperRedValue] = useState<string>(
    uRedValue != null ? uRedValue.toString() : ''
  );
  const [lowerRedValue, setLowerRedValue] = useState<string>(
    lRedValue != null ? lRedValue.toString() : ''
  );
  const [upperOrangeValue, setUpperOrangeValue] = useState<string>(
    uOrangeValue != null ? uOrangeValue.toString() : ''
  );
  const [lowerOrangeValue, setLowerOrangeValue] = useState<string>(
    lOrangeValue != null ? lOrangeValue.toString() : ''
  );

  const [upperRedValueError, setUpperRedValueError] = useState<string>('');
  const [lowerRedValueError, setLowerRedValueError] = useState<string>('');
  const [upperOrangeValueError, setUpperOrangeValueError] = useState<string>('');
  const [lowerOrangeValueError, setLowerOrangeValueError] = useState<string>('');
  const { t } = useTranslation(['mh']);

  useEffect(() => {
    const updateValue = upperRedValue === '' ? undefined : Number(upperRedValue);
    handleUpdateValue('redAlertRangeUpper', updateValue);
  }, [upperRedValue]);

  useEffect(() => {
    const updateValue = lowerRedValue === '' ? undefined : Number(lowerRedValue);
    handleUpdateValue('redAlertRangeLower', updateValue);
  }, [lowerRedValue]);

  useEffect(() => {
    const updateValue = upperOrangeValue === '' ? undefined : Number(upperOrangeValue);
    handleUpdateValue('orangeAlertRangeUpper', updateValue);
  }, [upperOrangeValue]);

  useEffect(() => {
    const updateValue = lowerOrangeValue === '' ? undefined : Number(lowerOrangeValue);
    handleUpdateValue('orangeAlertRangeLower', updateValue);
  }, [lowerOrangeValue]);

  const handleLowerInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value;
    if (!isNumeric(lowerRedValue) && lowerRedValue === targetValue && lowerRedValue !== '') {
      setLowerRedValueError(t('enter_numeric_value') as string);
      return;
    }
    if (
      !isNumeric(lowerOrangeValue) &&
      lowerOrangeValue === targetValue &&
      lowerOrangeValue !== ''
    ) {
      setLowerOrangeValueError(t('enter_numeric_value') as string);
      return;
    }
    if (
      !isPositiveNumeric(lowerRedValue) &&
      lowerRedValue === targetValue &&
      lowerRedValue !== ''
    ) {
      setLowerRedValueError(t('enter_positive_numeric_value') as string);
      return;
    }
    if (
      !isPositiveNumeric(lowerOrangeValue) &&
      lowerOrangeValue === targetValue &&
      lowerOrangeValue !== ''
    ) {
      setLowerOrangeValueError(t('enter_positive_numeric_value') as string);
      return;
    }
    if (lowerRedValue === '' || upperRedValue === '') {
      setLowerRedValueError('');
      return;
    }
    if (lowerOrangeValue === '' || upperOrangeValue === '') {
      setLowerOrangeValueError('');
      return;
    }
    if (Number(lowerRedValue) <= Number(lowerOrangeValue) && lowerRedValue === targetValue) {
      setLowerRedValueError(
        t('lower_red_value_cannot_be_higher', {
          red: lowerRedValue,
          orange: lowerOrangeValue
        }) as string
      );
    } else {
      setLowerRedValueError('');
    }
    if (Number(lowerRedValue) <= Number(lowerOrangeValue) && lowerOrangeValue === targetValue) {
      setLowerOrangeValueError(
        t('lower_orange_value_cannot_be_lower', {
          red: lowerRedValue,
          orange: lowerOrangeValue
        }) as string
      );
    } else {
      setLowerOrangeValueError('');
    }
  };

  const handleUpperInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value;
    if (!isNumeric(upperRedValue) && upperRedValue === targetValue && upperRedValue !== '') {
      setUpperRedValueError(t('enter_numeric_value') as string);
      return;
    }
    if (
      !isNumeric(upperOrangeValue) &&
      upperOrangeValue === targetValue &&
      upperOrangeValue !== ''
    ) {
      setUpperOrangeValueError(t('enter_numeric_value') as string);
      return;
    }
    if (
      !isPositiveNumeric(upperRedValue) &&
      upperRedValue === targetValue &&
      upperRedValue !== ''
    ) {
      setUpperRedValueError(t('enter_positive_numeric_value') as string);
      return;
    }
    if (
      !isPositiveNumeric(upperOrangeValue) &&
      upperOrangeValue === targetValue &&
      upperOrangeValue !== ''
    ) {
      setUpperOrangeValueError(t('enter_positive_numeric_value') as string);
      return;
    }
    if (upperRedValue === '' || lowerRedValue === '') {
      setUpperRedValueError('');
      return;
    }
    if (upperOrangeValue === '' || lowerOrangeValue === '') {
      setUpperOrangeValueError('');
      return;
    }
    if (Number(upperRedValue) <= Number(upperOrangeValue) && upperRedValue === targetValue) {
      setUpperRedValueError(t('upper_red_value_cannot_be_lower') as string);
    } else {
      setUpperRedValueError('');
    }
    if (Number(upperRedValue) <= Number(upperOrangeValue) && upperOrangeValue === targetValue) {
      setUpperOrangeValueError(t('upper_red_value_cannot_be_lower') as string);
    } else {
      setUpperOrangeValueError('');
    }
  };

  const Main = (
    <WidgetMain>
      <Typography variant="body2">{t('target_value_difference_to_trigger')}</Typography>
      <FormElementContainer
        className={
          hasClass && hasClass.indexOf('upper_red') > -1 ? 'upper_validation_error' : undefined
        }
      >
        <FormLabelWrapper>
          <Typography variant="inputlabel">
            <FontAwesomeIcon color={themeColors.darkRed} icon={faBell} /> &nbsp;
            {t('red_alert')} ({t('upper_trigger_value')})
          </Typography>
        </FormLabelWrapper>
        <FormElementWrapper>
          <Input
            value={upperRedValue}
            onBlur={handleUpperInputBlur}
            onChange={(e: { target: { value: string } }) => setUpperRedValue(e.target.value)}
          />
          {upperRedValueError && <TextWarning>{upperRedValueError}</TextWarning>}
        </FormElementWrapper>
      </FormElementContainer>

      <FormElementContainer
        className={
          hasClass && hasClass.indexOf('upper_orange') > -1 ? 'upper_validation_error' : undefined
        }
      >
        <FormLabelWrapper>
          <Typography variant="inputlabel">
            <FontAwesomeIcon color={themeColors.atRiskYellow} icon={faBell} /> &nbsp;
            {t('orange_alert')} ({t('upper_trigger_value')})
          </Typography>
        </FormLabelWrapper>
        <FormElementWrapper>
          <Input
            value={upperOrangeValue}
            onBlur={handleUpperInputBlur}
            onChange={(e: { target: { value: string } }) => setUpperOrangeValue(e.target.value)}
          />
          {upperOrangeValueError && <TextWarning>{upperOrangeValueError}</TextWarning>}
        </FormElementWrapper>
      </FormElementContainer>

      <FormElementContainer
        className={
          hasClass && hasClass.indexOf('lower_orange') > -1 ? 'upper_validation_error' : undefined
        }
      >
        <FormLabelWrapper>
          <Typography variant="inputlabel">
            <FontAwesomeIcon color={themeColors.atRiskYellow} icon={faBell} /> &nbsp;
            {t('orange_alert')} ({t('lower_trigger_value')})
          </Typography>
        </FormLabelWrapper>
        <FormElementWrapper>
          <Input
            value={lowerOrangeValue}
            onBlur={handleLowerInputBlur}
            onChange={(e: { target: { value: string } }) => setLowerOrangeValue(e.target.value)}
          />
          {lowerOrangeValueError && <TextWarning>{lowerOrangeValueError}</TextWarning>}
        </FormElementWrapper>
      </FormElementContainer>

      <FormElementContainer
        className={
          hasClass && hasClass.indexOf('lower_red') > -1 ? 'lower_validation_error' : undefined
        }
      >
        <FormLabelWrapper>
          <Typography variant="inputlabel">
            <FontAwesomeIcon color={themeColors.darkRed} icon={faBell} /> &nbsp;
            {t('red_alert')} ({t('lower_trigger_value')})
          </Typography>
        </FormLabelWrapper>
        <FormElementWrapper>
          <Input
            value={lowerRedValue}
            onBlur={handleLowerInputBlur}
            onChange={(e: { target: { value: string } }) => setLowerRedValue(e.target.value)}
          />
          {lowerRedValueError && <TextWarning>{lowerRedValueError}</TextWarning>}
        </FormElementWrapper>
      </FormElementContainer>
    </WidgetMain>
  );

  const upperLowerAlertSettings = {
    title: t('alert_values'),
    Main: Main
  };

  return <DashboardWidget {...upperLowerAlertSettings} />;
};

export const OrangeAlert = ({
  handleUpdateValue,
  uValue,
  lValue,
  hasClass,
  value,
  isDeviation = false
}: AlertProps): JSX.Element => {
  const [upperValue, setUpperValue] = useState<string>(uValue != null ? uValue.toString() : '');
  const [lowerValue, setLowerValue] = useState<string>(lValue != null ? lValue.toString() : '');
  const [deviationValue, setDeviationValue] = useState<string>(
    value != null ? value.toString() : ''
  );
  const [upperValueError, setUpperValueError] = useState<string>('');
  const [lowerValueError, setLowerValueError] = useState<string>('');
  const [deviationValueError, setDeviationValueError] = useState<string>('');
  const { t } = useTranslation(['mh']);

  useEffect(() => {
    const updateValue = upperValue === '' ? undefined : Number(upperValue);
    handleUpdateValue('orangeUpperAlert', updateValue);
  }, [upperValue]);

  useEffect(() => {
    const updateValue = lowerValue === '' ? undefined : Number(lowerValue);
    handleUpdateValue('orangeLowerAlert', updateValue);
  }, [lowerValue]);

  useEffect(() => {
    const updateValue = deviationValue === '' ? undefined : Number(deviationValue);
    handleUpdateValue('orangeAlertDeviationFromMean', updateValue);
  }, [deviationValue]);

  const handleLowerInputBlur = () => {
    if (!isNumeric(lowerValue) && lowerValue !== '') {
      setLowerValueError(t('enter_numeric_value') as string);
      return;
    }
    if (lowerValue === '' || upperValue === '') {
      setLowerValueError('');
      return;
    }
    if (Number(lowerValue) >= Number(upperValue)) {
      setLowerValueError(t('lower_value_cannot_be_higher') as string);
    } else {
      setLowerValueError('');
    }
  };

  const handleUpperInputBlur = () => {
    if (!isNumeric(upperValue) && upperValue !== '') {
      setUpperValueError(t('enter_numeric_value') as string);
      return;
    }
    if (upperValue === '' || lowerValue === '') {
      setUpperValueError('');
      return;
    }
    if (Number(lowerValue) >= Number(upperValue)) {
      setUpperValueError(t('upper_value_cannot_be_lower') as string);
    } else {
      setUpperValueError('');
    }
  };

  const handleDeviationInputBlur = () => {
    if (!isNumeric(deviationValue) && deviationValue !== '') {
      setDeviationValueError(t('enter_numeric_value') as string);
      return;
    }

    if (Number(deviationValue) <= 0) {
      setDeviationValueError(t('enter_positive_numeric_value') as string);
    } else {
      setDeviationValueError('');
    }
    if (deviationValue === '') {
      setDeviationValueError('');
      return;
    }
  };

  const Main = (
    <WidgetMain>
      <Typography variant="body2">
        {isDeviation
          ? t('mean_value_difference_to_trigger')
          : t('target_value_difference_to_trigger')}
      </Typography>

      {!isDeviation && (
        <FormElementContainer
          className={
            hasClass && hasClass.indexOf('upper') > -1 ? 'upper_validation_error' : undefined
          }
        >
          <FormLabelWrapper>
            <Typography variant="inputlabel">{t('upper_trigger_value')}</Typography>
          </FormLabelWrapper>
          <FormElementWrapper>
            <Input
              value={upperValue}
              onBlur={handleUpperInputBlur}
              onChange={(e: { target: { value: string } }) => setUpperValue(e.target.value)}
            />
            {upperValueError && <TextWarning>{upperValueError}</TextWarning>}
          </FormElementWrapper>
        </FormElementContainer>
      )}

      {!isDeviation && (
        <FormElementContainer
          className={
            hasClass && hasClass.indexOf('lower') > -1 ? 'lower_validation_error' : undefined
          }
        >
          <FormLabelWrapper>
            <Typography variant="inputlabel">{t('lower_trigger_value')}</Typography>
          </FormLabelWrapper>
          <FormElementWrapper>
            <Input
              value={lowerValue}
              onBlur={handleLowerInputBlur}
              onChange={(e: { target: { value: string } }) => setLowerValue(e.target.value)}
            />
            {lowerValueError && <TextWarning>{lowerValueError}</TextWarning>}
          </FormElementWrapper>
        </FormElementContainer>
      )}

      {isDeviation && (
        <FormElementContainer
          className={
            hasClass && hasClass.indexOf('deviation') > -1
              ? 'deviation_validation_error'
              : undefined
          }
        >
          <FormLabelWrapper>
            <Typography variant="inputlabel">{t('trigger_value_percent')}</Typography>
          </FormLabelWrapper>
          <FormElementWrapper>
            <Input
              value={deviationValue}
              onBlur={handleDeviationInputBlur}
              onChange={(e: { target: { value: string } }) => setDeviationValue(e.target.value)}
            />
            {deviationValueError && <TextWarning>{deviationValueError}</TextWarning>}
          </FormElementWrapper>
        </FormElementContainer>
      )}
    </WidgetMain>
  );

  const orangeAlertSettings = {
    title: t('orange_alert'),
    titleIndicator: <FontAwesomeIcon color={themeColors.atRiskYellow} icon={faBell} />,
    headerBackgroundColor: `${themeColors.atRiskYellow4}`,
    Main: Main
  };

  return <DashboardWidget {...orangeAlertSettings} />;
};

export const RedAlert = ({
  handleUpdateValue,
  uValue,
  lValue,
  hasClass,
  value,
  isDeviation = false
}: AlertProps): JSX.Element => {
  const [upperValue, setUpperValue] = useState<string>(uValue != null ? uValue.toString() : '');
  const [lowerValue, setLowerValue] = useState<string>(lValue != null ? lValue.toString() : '');
  const [deviationValue, setDeviationValue] = useState<string>(
    value != null ? value.toString() : ''
  );
  const [upperValueError, setUpperValueError] = useState<string>('');
  const [lowerValueError, setLowerValueError] = useState<string>('');
  const [deviationValueError, setDeviationValueError] = useState<string>('');
  const { t } = useTranslation(['mh']);

  useEffect(() => {
    const updateValue = upperValue === '' ? undefined : Number(upperValue);
    handleUpdateValue('redUpperAlert', updateValue);
  }, [upperValue]);

  useEffect(() => {
    const updateValue = lowerValue === '' ? undefined : Number(lowerValue);
    handleUpdateValue('redLowerAlert', updateValue);
  }, [lowerValue]);

  useEffect(() => {
    const updateValue = deviationValue === '' ? undefined : Number(deviationValue);
    handleUpdateValue('redAlertDeviationFromMean', updateValue);
  }, [deviationValue]);

  const handleLowerInputBlur = () => {
    if (!isNumeric(lowerValue) && lowerValue !== '') {
      setLowerValueError(t('enter_numeric_value') as string);
      return;
    }
    if (lowerValue === '' || upperValue === '') {
      setLowerValueError('');
      return;
    }
    if (Number(lowerValue) >= Number(upperValue)) {
      setLowerValueError(t('lower_value_cannot_be_higher') as string);
    } else {
      setLowerValueError('');
    }
  };

  const handleUpperInputBlur = () => {
    if (!isNumeric(upperValue) && upperValue !== '') {
      setUpperValueError(t('enter_numeric_value') as string);
      return;
    }
    if (upperValue === '' || lowerValue === '') {
      setUpperValueError('');
      return;
    }
    if (Number(lowerValue) >= Number(upperValue)) {
      setUpperValueError(t('upper_value_cannot_be_lower') as string);
    } else {
      setUpperValueError('');
    }
  };

  const handleDeviationInputBlur = () => {
    if (!isNumeric(deviationValue) && deviationValue !== '') {
      setDeviationValueError(t('enter_numeric_value') as string);
      return;
    }
    if (deviationValue === '') {
      setDeviationValueError('');
      return;
    }
  };

  const Main = (
    <WidgetMain>
      <Typography variant="body2">
        {isDeviation
          ? t('mean_value_difference_to_trigger')
          : t('target_value_difference_to_trigger')}
      </Typography>

      {!isDeviation && (
        <FormElementContainer
          className={
            hasClass && hasClass.indexOf('upper') > -1 ? 'upper_validation_error' : undefined
          }
        >
          <FormLabelWrapper>
            <Typography variant="inputlabel">{t('upper_trigger_value')}</Typography>
          </FormLabelWrapper>
          <FormElementWrapper>
            <Input
              value={upperValue}
              onBlur={handleUpperInputBlur}
              onChange={(e: { target: { value: string } }) => setUpperValue(e.target.value)}
            />
            {upperValueError && <TextWarning>{upperValueError}</TextWarning>}
          </FormElementWrapper>
        </FormElementContainer>
      )}

      {!isDeviation && (
        <FormElementContainer
          className={
            hasClass && hasClass.indexOf('lower') > -1 ? 'lower_validation_error' : undefined
          }
        >
          <FormLabelWrapper>
            <Typography variant="inputlabel">{t('lower_trigger_value')}</Typography>
          </FormLabelWrapper>
          <FormElementWrapper>
            <Input
              onBlur={handleLowerInputBlur}
              value={lowerValue}
              onChange={(e: { target: { value: string } }) => setLowerValue(e.target.value)}
            />
            {lowerValueError && <TextWarning>{lowerValueError}</TextWarning>}
          </FormElementWrapper>
        </FormElementContainer>
      )}

      {isDeviation && (
        <FormElementContainer
          className={
            hasClass && hasClass.indexOf('deviation') > -1
              ? 'deviation_validation_error'
              : undefined
          }
        >
          <FormLabelWrapper>
            <Typography variant="inputlabel">{t('trigger_value_percent')}</Typography>
          </FormLabelWrapper>
          <FormElementWrapper>
            <Input
              onBlur={handleDeviationInputBlur}
              value={deviationValue}
              onChange={(e: { target: { value: string } }) => setDeviationValue(e.target.value)}
            />
            {deviationValueError && <TextWarning>{deviationValueError}</TextWarning>}
          </FormElementWrapper>
        </FormElementContainer>
      )}
    </WidgetMain>
  );

  const settings = {
    title: t('red_alert'),
    titleIndicator: <FontAwesomeIcon color={themeColors.darkRed} icon={faBell} />,
    headerBackgroundColor: `${themeColors.negativeRed4}`,
    Main: Main
  };

  return <DashboardWidget {...settings} />;
};

export const MachineState = ({
  handeUpdateValue,
  machineValue
}: MachineStateProps): JSX.Element => {
  const [dropdownValue, setDropdownValue] = useState<string[]>(machineValue ? machineValue : []);

  const machineStates = Object.values(AlertStateType).map((value) => ({
    value,
    label: value
  })) as unknown as DropDownItem[];
  const dropdownValues = machineStates.filter((item) => dropdownValue.indexOf(item.value) > -1);
  const { t } = useTranslation(['mh']);

  useEffect(() => {
    if (!dropdownValue) return;
    handeUpdateValue('machineState', dropdownValue);
  }, [dropdownValue]);

  const handleMultiSelect = (values: DropDownItem[]) => {
    const keys = values.map((value) => value.value);
    setDropdownValue(keys);
  };

  return (
    <FormElementContainer>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t('machine_states')}:</Typography>
      </FormLabelWrapper>

      <FormElementWrapper>
        <DropdownWithCheckboxes
          ariaLabel={t('select_machine_state') as string}
          options={machineStates}
          handleMultiSelect={handleMultiSelect}
          value={dropdownValues}
          placeholder={t('select_machine_state_dot') as string}
        />
      </FormElementWrapper>
    </FormElementContainer>
  );
};

export const AlertImportance = ({ handeUpdateValue, value }: Props): JSX.Element => {
  const [dropdownValue, setDropdownValue] = useState<string>(value);
  const alertImportance = Object.entries(AlertCriticality).map(([value, label]) => ({
    value: label,
    label: value
  }));
  const { t } = useTranslation(['mh']);

  useEffect(() => {
    handeUpdateValue('importance', dropdownValue);
  }, [dropdownValue]);

  return (
    <FormElementContainer>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t('alert_importance')}:</Typography>
      </FormLabelWrapper>
      <FormElementWrapper className="dropdown_input">
        <BaseSelect
          contentRenderer={({ id }: Record<string, unknown>) => (
            <CustomContentRenderer item={id as unknown as WidgetTableDropdownItem} />
          )}
          dropdownRenderer={(props, state, methods) => (
            <CustomDropdownRenderer props={props} state={state} methods={methods} />
          )}
          handleChange={(e) => {
            const val = e.target.value as AlertLevel;
            return val && setDropdownValue(val);
          }}
          labelField="id"
          options={alertImportance as { value: string; label: string }[]}
          optionsKeysFormatted={false}
          placeholder={t('select_alert_importance_dot') as string}
          searchable={false}
          searchBy="label"
          value={value}
          valueField="id"
        />
      </FormElementWrapper>
    </FormElementContainer>
  );
};

export const AlertLocation = ({
  handeUpdateValue,
  alertValue
}: AlertLocationProps): JSX.Element => {
  const [dropdownValue, setDropdownValue] = useState<string[]>(alertValue ? alertValue : []);
  const alertLocations = Object.entries(AlertConfigAlertLocation).map(([value, label]) => ({
    value: label,
    label: value
  })) as unknown as DropDownItem[];
  const dropdownValues = alertLocations.filter(
    (item) => dropdownValue.indexOf(item.value as string) > -1
  );
  const { t } = useTranslation(['mh']);

  useEffect(() => {
    if (!dropdownValue) return;
    handeUpdateValue('location', dropdownValue);
  }, [dropdownValue]);

  const handleMultiSelect = (value: DropDownItem[]) => {
    const keys = value.map((i) => i.value as string);
    setDropdownValue(keys);
  };

  return (
    <FormElementContainer>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t('alert_location')}:</Typography>
      </FormLabelWrapper>
      <FormElementWrapper>
        <DropdownWithCheckboxes
          ariaLabel={t('select_alert_location') as string}
          options={alertLocations}
          handleMultiSelect={handleMultiSelect}
          value={dropdownValues}
          placeholder={t('select_alert_location_dot') as string}
        />
      </FormElementWrapper>
    </FormElementContainer>
  );
};

export const Occurrences = ({ handeUpdateValue, value }: OccurrenceProps): JSX.Element => {
  const [inputValue, setInputValue] = useState<string>(value ? value.toString() : '');
  const { t } = useTranslation(['mh']);

  useEffect(() => {
    if (!inputValue) return;
    handeUpdateValue('minimumOccurrences', Number(inputValue));
  }, [inputValue]);

  const Main = (
    <FormElementContainer>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t('trigger_after')}: </Typography>
      </FormLabelWrapper>
      <FormElementWrapper>
        <Input
          value={inputValue}
          onChange={(e: { target: { value: string } }) => {
            if (!Number.isNaN(Number(e.target.value))) setInputValue(e.target.value);
          }}
        />
      </FormElementWrapper>
      <FormLabelWrapper>
        <Typography variant="inputlabel">{t('occurrences')}</Typography>
      </FormLabelWrapper>
    </FormElementContainer>
  );

  const occerrencesSettings = {
    title: t('number_of_occurrences'),
    headerBackgroundColor: `${themeColors.atRiskYellow4}`,
    Main: Main
  };

  return <DashboardWidget {...occerrencesSettings} />;
};
