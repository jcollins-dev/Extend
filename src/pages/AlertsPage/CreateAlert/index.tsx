// 3rd party libs
import React, { useEffect, useMemo, useState } from 'react';
import { Switch, DateRangeProvider, TooltipWrapper, Loader, WarningPrompt } from 'components';
import { Button } from 'components/Button';
import Slider from './Slider';
import AlertSetup from '../Step3/AlertSetup';
import { AlertSimulation } from '../Step3/AlertSimulation';
import AlertLogic from './AlertLogic';
import { DropdownSubOptions } from '../Step3/DropdownSubOptions';
import { useTranslation } from 'react-i18next';
import {
  DropDownItem,
  GroupedOption
} from 'pages/ProteinMachine/MachineConfig/Common/Alerts/FormElementsTypes';
import { useTimeZone } from 'providers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Asterisk from '../Step3/Asterisk ';
import {
  Footer,
  FooterButtonContainer,
  FormContainer,
  FormItem,
  FormParent,
  FormSecondRowItem,
  LabelContainer,
  PageContainer,
  StyledInputField,
  StyledTextarea,
  WarningIconContainer
} from './index.elements';
import {
  useGetAlertByIdQuery,
  useGetAlertEnumsQuery,
  useGetMachineTagListBasedOnIdQuery,
  useSaveAlertMutation,
  useUpdateAlertByIdMutation
} from 'api';
import { useTheme } from 'styled-components';
import { isEmpty, isNumber } from 'lodash';
import { isOnlyAlphaNumeric } from 'helpers';
import {
  ALERT_STATE,
  AlertEnumTypes,
  TAlertData,
  TReminder,
  TTrigger,
  queryBuilderDesireRule
} from 'types/machine-health/alerts';
import { toast } from 'react-toastify';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
import { useHistory, useParams } from 'react-router-dom';
import ToolTipIcon from '../assets/info_logo.svg';
import { LogicGroup2 } from 'components/AlertQueryBuilder';

type PRIORITY = AlertEnumTypes['alertPriority'][number];
type SLIDING_WINDOW_UNITS = AlertEnumTypes['slidingWindowUnits'][number];
type ALERT_FREQUENCY_UNITS = AlertEnumTypes['alertFrequencyUnits'][number];
type REMINDER_UNITS = AlertEnumTypes['reminderUnits'][number];
type TRIGGER_TYPE = AlertEnumTypes['triggerType'][number];
type TRIGGER_UNITS = AlertEnumTypes['triggerUnits'][number];

type ValidationErrors = {
  name?: string | null;
  message?: string | null;
};

type THandleType =
  | string
  | number
  | boolean
  | REMINDER_UNITS
  | ALERT_FREQUENCY_UNITS
  | SLIDING_WINDOW_UNITS;

type TParams = {
  alertId: string;
  machineId: string;
};

const CreateAlertPage = (): JSX.Element => {
  const { timeZone } = useTimeZone();
  const { t } = useTranslation(['mh']);
  const theme = useTheme();
  const history = useHistory();
  const params: TParams = useParams();
  const { machineId } = useFleetMachineAccountData();
  const MACHINE_ID = machineId;

  const [validationState, setValidationState] = useState<ValidationErrors>({
    name: null,
    message: null
  });

  const [saveAlert] = useSaveAlertMutation();
  const [selectSubComponent, setSelectSubComponent] = useState('');
  const [alertDestination, setAlertDestination] = useState<DropDownItem[]>([]);
  const [isTriggerEnabled, setIsTriggerEnabled] = useState(false);
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [isViewConfirmCancel, setIsViewConfirmCancel] = useState(false);

  const {
    data: AlertDataById,
    isFetching: isAlertDataFetching,
    isError
  } = useGetAlertByIdQuery(params.alertId ? { alertId: params.alertId } : skipToken);

  const [updateAlertById] = useUpdateAlertByIdMutation();

  const [reminderValues, setReminderValues] = useState<TReminder>({
    value: undefined,
    units: undefined,
    stop_after: undefined,
    alertId: undefined,
    id: undefined
  });

  const [triggerValues, setTriggerValues] = useState<TTrigger>({
    type: 'MATCHES',
    value: undefined,
    units: undefined,
    alertId: undefined,
    id: undefined
  });

  const [alertData, setAlertData] = useState<TAlertData>({
    name: undefined,
    description: undefined,
    message: undefined,
    state: 'ENABLED',
    priority: 'MEDIUM',
    slidingWindowValue: undefined,
    slidingWindowUnits: undefined,
    frequencyValue: undefined,
    frequencyUnits: undefined,
    rootLogicGroup: undefined,
    machineId: undefined,
    id: undefined
  });

  const [queryData, setQueryData] = useState<LogicGroup2 | undefined>(undefined);

  const { data: MasterTagList, isFetching: isMasterTagListFetching } =
    useGetMachineTagListBasedOnIdQuery(
      MACHINE_ID
        ? {
            id: MACHINE_ID
          }
        : skipToken
    );

  const { data: EnumsTypes, isFetching: isAlertTypeFetching } = useGetAlertEnumsQuery();

  const MasterTagDropdownList = useMemo(() => {
    if (!isMasterTagListFetching) {
      if (MasterTagList && MasterTagList.length > 0) {
        return MasterTagList.map((e) => ({
          label: e.name,
          value: e.id,
          isFixed: true
        }));
      } else {
        return [
          { label: t('no_tag_template_found'), value: t('no_tag_template_found'), isFixed: true }
        ];
      }
    }

    return [];
  }, [MasterTagList, isMasterTagListFetching]);

  const AlertUnitTypes = useMemo(() => {
    if (!isAlertTypeFetching) {
      if (EnumsTypes) {
        return EnumsTypes;
      } else {
        return {} as AlertEnumTypes;
      }
    }

    return {} as AlertEnumTypes;
  }, [EnumsTypes, isAlertTypeFetching]);

  const onHandleChange = (key: string, value: THandleType) => {
    let priorityValue: PRIORITY;
    switch (key) {
      case 'priority':
        switch (value) {
          case 1:
            priorityValue = 'HIGH';
            break;
          case 2:
            priorityValue = 'MEDIUM';
            break;
          case 3:
            priorityValue = 'LOW';
            break;
          default:
            priorityValue = 'MEDIUM';
        }
        setAlertData({ ...alertData, [key]: priorityValue });
        break;
      case 'state':
        switch (value as boolean) {
          case true:
            setAlertData({ ...alertData, [key]: 'ENABLED' });
            break;
          default:
            setAlertData({ ...alertData, [key]: 'DISABLED' });
        }
        break;
      case 'description':
        if (value === '') {
          setAlertData({ ...alertData, [key]: undefined });
        } else {
          setAlertData({ ...alertData, [key]: value.toString() });
        }
        break;
      default:
        setAlertData({ ...alertData, [key]: value });
    }
  };

  const onReminderHandleChange = (key: string, value: string | number) => {
    switch (key) {
      case 'units':
        setReminderValues({ ...reminderValues, [key]: value as REMINDER_UNITS });
        break;
      default:
        if (value === '') {
          setReminderValues({ ...reminderValues, [key]: 1 });
        } else {
          setReminderValues({ ...reminderValues, [key]: Number(value) });
        }
    }
  };

  const onTriggerHandleChange = (key: string, value: string | number) => {
    switch (key) {
      case 'type':
        setTriggerValues({
          ...triggerValues,
          [key]: value as TRIGGER_TYPE,
          ['value']: 1,
          ['units']: undefined
        });
        break;
      case 'units':
        setTriggerValues({ ...triggerValues, [key]: value as TRIGGER_UNITS });
        break;
      default:
        if (value === '') {
          setTriggerValues({ ...triggerValues, [key]: 1 });
        } else {
          setTriggerValues({ ...triggerValues, [key]: Number(value) });
        }
    }
  };

  const onRadioAndTriggerHandleChange = (key: string) => {
    switch (key) {
      case 'trigger':
        setIsTriggerEnabled((value) => !value);
        break;
      default:
        setIsReminderEnabled((value) => !value);
    }
  };

  const onBlurHandle = (key: string) => {
    const validationErrors: ValidationErrors = {};
    switch (key) {
      case 'name':
        if (isEmpty(alertData.name && (alertData.name.trim() as string))) {
          validationErrors.name = t('alert_name_is_required');
        } else if (
          typeof alertData.name !== undefined &&
          alertData.name &&
          !isOnlyAlphaNumeric(alertData.name)
        ) {
          validationErrors.name = t('alert_name_is_invalid');
        } else {
          validationErrors.name = null;
        }
        setValidationState((prev) => {
          const newValues = { ...prev, ...validationErrors };
          return newValues;
        });
        break;
      case 'message':
        if (isEmpty(alertData.message)) {
          validationErrors.message = t('alert_message_is_required');
        } else {
          validationErrors.message = null;
        }
        setValidationState((prev) => {
          const newValues = { ...prev, ...validationErrors };
          return newValues;
        });
        break;
    }
  };

  const reportOptions = [
    {
      label: t('alert_destination_weekly_report') as string,
      value: 'weekly_performance_report'
    },
    {
      label: t('alert_destination_performance_report') as string,
      value: 'performace_trend_report'
    }
  ];

  const dashboardOptions = [
    { value: 'product_processing', label: t('product_processing') as string, color: '#00B8D9' },
    { value: 'product_movement', label: t('product_movement') as string, color: '#0052CC' },
    { value: 'cleaning', label: t('cleaning') as string, color: '#5243AA' },
    {
      value: 'predictive_maintenance',
      label: t('alert_destination_predictive_maintenace') as string,
      color: '#FF5630'
    }
  ];

  const groupedOptions: GroupedOption[] = [
    {
      label: t('alert_destination_dashboard') as string,
      options: dashboardOptions
    },
    {
      label: t('alert_destination_report') as string,
      options: reportOptions
    }
  ];

  const onNotificationsUserGroupsChange = (selectedValue: DropDownItem[]) => {
    setAlertDestination(selectedValue);
  };

  const goToAlertsView = async () => {
    if (params.alertId) {
      try {
        await updateAlertById(alertData).unwrap();
        toast.success(`Alert updated successfully`);
        setTimeout(() => {
          history.push(`/fleet/machine/${machineId}/alerts/manage-alerts`);
        }, 1000);
      } catch (error) {
        toast.error('Failed to Update!!');
        console.error(error);
      }
    } else {
      if (typeof machineId === 'undefined') {
        return toast.warn(`machineId is missing`);
      }
      try {
        await saveAlert({ data: alertData, machineId: MACHINE_ID }).unwrap();
        toast.success(`Alert added successfully`);
        setTimeout(() => {
          history.push(`/fleet/machine/${machineId}/alerts/manage-alerts`);
        }, 1000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const ErrorMessage = error.data.detail;
        if (ErrorMessage) {
          toast.error(ErrorMessage);
          console.error(error);
        } else {
          toast.error('Failed to Save an Alert!!');
          console.error(error);
        }
      }
    }
  };

  const getAlertQueryData = (data: queryBuilderDesireRule) => {
    setAlertData({ ...alertData, rootLogicGroup: data });
  };

  const onHandleCancel = () => {
    setIsViewConfirmCancel(false);
    history.goBack();
  };

  // to check if Alert logic is valid
  const isInvalidAlertLogic = () => {
    if (alertData.rootLogicGroup) {
      for (const group of alertData.rootLogicGroup.logic_groups) {
        for (const statement of group.logic_statements) {
          if (
            statement?.tag_id === '' ||
            statement.comparison_operator === '=' ||
            statement.comparison_operator === '' ||
            statement.logic_statement_values[0]?.value === '' ||
            statement.logic_statement_values[1]?.value === '' ||
            (statement.comparison_operator === 'BETWEEN' &&
              statement.logic_statement_values.length !== 2) ||
            (statement.comparison_operator === 'NOT_BETWEEN' &&
              statement.logic_statement_values.length !== 2) ||
            (statement.logic_statement_values[0]?.tag_id === undefined &&
              statement.logic_statement_values[0]?.business_unit_id) ||
            (statement.logic_statement_values[1]?.tag_id === undefined &&
              statement.logic_statement_values[1]?.business_unit_id)
          ) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };

  const fieldValidation = (): boolean => {
    const require =
      isEmpty(alertData.name && (alertData.name.trim() as string)) ||
      (alertData.name && !isOnlyAlphaNumeric(alertData.name)) ||
      isEmpty(alertData.message) ||
      !isNumber(alertData.frequencyValue) ||
      isEmpty(alertData.frequencyUnits) ||
      !isNumber(alertData.slidingWindowValue) ||
      isEmpty(alertData.slidingWindowUnits) ||
      isInvalidAlertLogic();

    if ('reminder' in alertData && 'trigger' in alertData) {
      if (alertData.trigger?.type === 'MATCHES') {
        return (
          !isNumber(alertData.trigger?.value) ||
          require ||
          reminderValues.value === undefined ||
          reminderValues.units === undefined ||
          reminderValues.stop_after === undefined
        );
      }
      if (alertData.trigger?.type === 'DURATION') {
        return (
          alertData.trigger?.value === undefined ||
          alertData.trigger?.units === undefined ||
          require ||
          reminderValues.value === undefined ||
          reminderValues.units === undefined ||
          reminderValues.stop_after === undefined
        );
      }

      return (
        reminderValues.value === undefined ||
        reminderValues.units === undefined ||
        reminderValues.stop_after === undefined ||
        require
      );
    }

    if ('reminder' in alertData) {
      return (
        reminderValues.value === undefined ||
        reminderValues.units === undefined ||
        reminderValues.stop_after === undefined ||
        require
      );
    }

    if ('trigger' in alertData) {
      if (alertData.trigger?.type === 'MATCHES') {
        return !isNumber(alertData.trigger?.value) || require;
      }
      if (alertData.trigger?.type === 'DURATION') {
        return (
          alertData.trigger?.value === undefined ||
          alertData.trigger?.units === undefined ||
          require
        );
      }
    }
    return require;
  };

  useEffect(() => {
    if (!isAlertDataFetching && !isError && params.alertId) {
      if (AlertDataById) {
        setAlertData({
          ...alertData,
          ['name']: AlertDataById.name,
          ['message']: AlertDataById.message,
          ['machineId']: AlertDataById.machineId as string,
          ['id']: AlertDataById.id as string,
          ['description']: AlertDataById.description ? AlertDataById.description : undefined,
          ['state']: AlertDataById.state as ALERT_STATE,
          ['priority']: AlertDataById.priority as PRIORITY,
          ['frequencyValue']: AlertDataById.frequencyValue as number,
          ['frequencyUnits']: AlertDataById.frequencyUnits as ALERT_FREQUENCY_UNITS,
          ['slidingWindowValue']: AlertDataById.slidingWindowValue as number,
          ['slidingWindowUnits']: AlertDataById.slidingWindowUnits as SLIDING_WINDOW_UNITS
        });
        setQueryData(AlertDataById.rootLogicGroup as LogicGroup2);

        if (AlertDataById.reminder !== null) {
          setIsReminderEnabled(true);
          setReminderValues({
            ...reminderValues,
            ['stop_after']: AlertDataById.reminder.stopAfter as number,
            ['value']: AlertDataById.reminder.value as number,
            ['units']: AlertDataById.reminder.units as REMINDER_UNITS,
            ['alertId']: AlertDataById.reminder.alertId as string,
            ['id']: AlertDataById.reminder.id as string
          });
          setAlertData({
            ...alertData,
            ['name']: AlertDataById.name,
            ['message']: AlertDataById.message,
            ['machineId']: AlertDataById.machineId as string,
            ['id']: AlertDataById.id as string,
            ['description']: AlertDataById.description ? AlertDataById.description : undefined,
            ['state']: AlertDataById.state as ALERT_STATE,
            ['priority']: AlertDataById.priority as PRIORITY,
            ['frequencyValue']: AlertDataById.frequencyValue as number,
            ['frequencyUnits']: AlertDataById.frequencyUnits as ALERT_FREQUENCY_UNITS,
            ['slidingWindowValue']: AlertDataById.slidingWindowValue as number,
            ['slidingWindowUnits']: AlertDataById.slidingWindowUnits as SLIDING_WINDOW_UNITS,
            ['reminder']: {
              ['stop_after']: AlertDataById.reminder.stopAfter as number,
              ['value']: AlertDataById.reminder.value as number,
              ['units']: AlertDataById.reminder.units as REMINDER_UNITS,
              ['alertId']: AlertDataById.reminder.alertId as string,
              ['id']: AlertDataById.reminder.id as string
            }
          });
        }

        if (AlertDataById.trigger !== null) {
          setIsTriggerEnabled(true);
          setTriggerValues({
            ...triggerValues,
            ['type']: AlertDataById.trigger.type as TRIGGER_TYPE,
            ['value']: AlertDataById.trigger.value as number,
            ['units']: AlertDataById.trigger.units as TRIGGER_UNITS,
            ['alertId']: AlertDataById.trigger.alertId as string,
            ['id']: AlertDataById.trigger.id as string
          });
          setAlertData({
            ...alertData,
            ['name']: AlertDataById.name,
            ['message']: AlertDataById.message,
            ['machineId']: AlertDataById.machineId as string,
            ['id']: AlertDataById.id as string,
            ['description']: AlertDataById.description ? AlertDataById.description : undefined,
            ['state']: AlertDataById.state as ALERT_STATE,
            ['priority']: AlertDataById.priority as PRIORITY,
            ['frequencyValue']: AlertDataById.frequencyValue as number,
            ['frequencyUnits']: AlertDataById.frequencyUnits as ALERT_FREQUENCY_UNITS,
            ['slidingWindowValue']: AlertDataById.slidingWindowValue as number,
            ['slidingWindowUnits']: AlertDataById.slidingWindowUnits as SLIDING_WINDOW_UNITS,
            ['trigger']: {
              ['type']: AlertDataById.trigger.type as TRIGGER_TYPE,
              ['value']: AlertDataById.trigger.value as number,
              ['units']: AlertDataById.trigger.units as TRIGGER_UNITS,
              ['alertId']: AlertDataById.trigger.alertId as string,
              ['id']: AlertDataById.trigger.id as string
            }
          });
        }
      }
    }
  }, [isAlertDataFetching, params.alertId]);

  useEffect(() => {
    if (isTriggerEnabled) {
      setAlertData({ ...alertData, trigger: { ...triggerValues } });
    } else {
      setAlertData((prevAlertData) => {
        const updatedAlertData = { ...prevAlertData };
        delete updatedAlertData.trigger; // Remove the 'trigger' key
        return updatedAlertData;
      });
    }
  }, [triggerValues.type, triggerValues.units, triggerValues.value, isTriggerEnabled]);

  useEffect(() => {
    if (isReminderEnabled) {
      setAlertData({ ...alertData, reminder: { ...reminderValues } });
    } else {
      setAlertData((prevAlertData) => {
        const updatedAlertData = { ...prevAlertData };
        delete updatedAlertData.reminder; // Remove the 'reminder' key
        return updatedAlertData;
      });
    }
  }, [isReminderEnabled, reminderValues.value, reminderValues.units, reminderValues.stop_after]);

  if (isAlertDataFetching) {
    return <Loader />;
  }

  return (
    <PageContainer>
      <FormParent>
        <FormContainer>
          <FormItem>
            <LabelContainer>
              <p className="label">
                {t('alert_name2') as string} <Asterisk />
              </p>
              <TooltipWrapper Tooltip={t('alert_name_tooltip_message') as string}>
                <img
                  style={{ margin: '0rem 1rem', cursor: 'pointer' }}
                  src={ToolTipIcon}
                  alt="Icon"
                />
              </TooltipWrapper>
            </LabelContainer>
            <StyledInputField
              value={alertData.name}
              type="text"
              placeholder={t('choose_name_for_alert') as string}
              onChange={(e) => onHandleChange('name', e.target.value)}
              onBlur={() => onBlurHandle('name')}
            />
            {validationState?.name ? (
              <WarningIconContainer>
                <TooltipWrapper Tooltip={validationState?.name}>
                  <FontAwesomeIcon
                    fontSize="0.75rem"
                    color={theme.colors.negativeRed}
                    icon={faExclamationCircle}
                  />
                </TooltipWrapper>
              </WarningIconContainer>
            ) : null}
          </FormItem>
          <FormItem>
            <p className="label">{t('alert_description2') as string}</p>
            <StyledTextarea
              rows={8}
              value={alertData.description}
              placeholder={t('provide_alert_description') as string}
              onChange={(e) => onHandleChange('description', e.target.value)}
            />
          </FormItem>
          <FormItem>
            <p className="label">{t('tag_templates') as string}</p>
            {MasterTagDropdownList.length > 0 ? (
              <DropdownSubOptions
                ariaLabel={t('choose_a_destination') as string}
                options={MasterTagDropdownList}
                value={MasterTagDropdownList}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handleMultiSelect={() => {}}
                placeholder={t('choose_a_destination') as string}
                disabled
              />
            ) : (
              <Loader size={50} />
            )}
          </FormItem>
          <FormItem>
            <p className="label">{t('alert_destination') as string}</p>
            <DropdownSubOptions
              ariaLabel={t('choose_a_destination') as string}
              options={reportOptions}
              optionsWithHeaders={groupedOptions}
              handleMultiSelect={onNotificationsUserGroupsChange}
              value={alertDestination}
              placeholder={t('choose_a_destination') as string}
              disabled
            />
          </FormItem>
        </FormContainer>
        <FormContainer>
          <FormSecondRowItem>
            <p className="label">
              {t('alert_message') as string} <Asterisk />
            </p>
            <StyledTextarea
              rows={3}
              value={alertData.message}
              placeholder={t('text_to_display_in_ui') as string}
              onChange={(e) => onHandleChange('message', e.target.value)}
              onBlur={() => onBlurHandle('message')}
            />
            {validationState?.message ? (
              <WarningIconContainer>
                <TooltipWrapper Tooltip={validationState.message}>
                  <FontAwesomeIcon
                    fontSize="0.75rem"
                    color={theme.colors.negativeRed}
                    icon={faExclamationCircle}
                  />
                </TooltipWrapper>
              </WarningIconContainer>
            ) : null}
          </FormSecondRowItem>
          <FormSecondRowItem>
            <p className="label">
              {t('alert_priority') as string} <Asterisk />
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontWeight: 'bold' }} htmlFor="">
                {t('high') as string}
              </label>
              <label style={{ fontWeight: 'bold' }} htmlFor="">
                {t('medium') as string}
              </label>
              <label style={{ fontWeight: 'bold' }} htmlFor="">
                {t('low') as string}
              </label>
            </div>
            <Slider
              min={1}
              max={3}
              defaultValue={alertData.priority}
              onChange={(e) => onHandleChange('priority', e)}
            />
          </FormSecondRowItem>
          <FormSecondRowItem>
            <p className="label">
              {t('alert_enable') as string} <Asterisk />
            </p>
            <Switch
              checked={alertData.state === 'ENABLED'}
              onChange={(e: boolean) => {
                onHandleChange('state', e);
              }}
              offColor={theme.colors.mediumGrey2}
            />
          </FormSecondRowItem>
          {alertDestination.map((obj) => obj.value).includes('predictive_maintenance') ? (
            <FormSecondRowItem>
              <p className="label">
                {t('select_sub_component_title')} <Asterisk />
              </p>
              <StyledInputField
                value={selectSubComponent}
                type="text"
                placeholder={t('select_sub_component_placeholder') as string}
                onChange={(e: { target: { value: string } }) => {
                  setSelectSubComponent(e.target.value);
                }}
              />
            </FormSecondRowItem>
          ) : null}
        </FormContainer>

        <AlertLogic onQueryDataChange={getAlertQueryData} queryData={queryData} />

        <AlertSetup
          AlertUnitTypes={AlertUnitTypes}
          isAlertTypeFetching={isAlertTypeFetching}
          alertData={alertData}
          onHandleChange={onHandleChange}
          isTriggerEnabled={isTriggerEnabled}
          setIsReminderEnabled={setIsReminderEnabled}
          isReminderEnabled={isReminderEnabled}
          onReminderHandleChange={onReminderHandleChange}
          reminderValues={reminderValues}
          onTriggerHandleChange={onTriggerHandleChange}
          triggerValues={triggerValues}
          onRadioAndTriggerHandleChange={onRadioAndTriggerHandleChange}
        />

        <DateRangeProvider timeZone={timeZone} subtractDaysCount={14}>
          <AlertSimulation />
        </DateRangeProvider>

        <Footer>
          <FooterButtonContainer>
            <Button onClick={() => setIsViewConfirmCancel(true)}>{t('cancel')}</Button>
            <Button disabled={fieldValidation()} onClick={goToAlertsView}>
              {t('save')}
            </Button>
          </FooterButtonContainer>
        </Footer>
      </FormParent>
      <WarningPrompt
        helperText={'Are you sure you wish to exit without saving changes ?'}
        isConfirmPrompt
        isVisible={isViewConfirmCancel}
        onCancelCallback={() => setIsViewConfirmCancel(false)}
        onConfirmCallback={onHandleCancel}
        title={'Unsaved Changes'}
      />
    </PageContainer>
  );
};

export default CreateAlertPage;
