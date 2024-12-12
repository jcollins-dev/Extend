import React, { useState } from 'react';

import { StepContainer } from './index.elements';
import { NotificationsToggle } from './ToggleSwitch';
import TriggerAlert from './TriggerAlert';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Loader } from 'components';
import { SlidingWindow } from './SlidingWindow';
import { FrequencyDropdown } from './FrequencyDropdown';
import Reminder from './Reminder';
import { AlertEnumTypes, TAlertData, TReminder, TTrigger } from 'types/machine-health/alerts';

type TAlertSetup = {
  AlertUnitTypes: AlertEnumTypes;
  isAlertTypeFetching: boolean;
  alertData: TAlertData;
  onHandleChange: (key: string, value: string | number | boolean) => void;
  isTriggerEnabled: boolean;
  setIsReminderEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isReminderEnabled: boolean;
  onReminderHandleChange: (key: string, value: string | number) => void;
  reminderValues: TReminder;
  onTriggerHandleChange: (key: string, value: string | number) => void;
  triggerValues: TTrigger;
  onRadioAndTriggerHandleChange: (key: string) => void;
};

const AlertSetup = ({
  AlertUnitTypes,
  isAlertTypeFetching,
  alertData,
  onHandleChange,
  isTriggerEnabled,
  setIsReminderEnabled,
  isReminderEnabled,
  onReminderHandleChange,
  reminderValues,
  onTriggerHandleChange,
  triggerValues,
  onRadioAndTriggerHandleChange
}: TAlertSetup): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const [isOpen, setIsOpen] = useState(true);
  const alertFrequencyUnits = AlertUnitTypes.alertFrequencyUnits;
  const alertReminderUnits = AlertUnitTypes.reminderUnits;
  const alertTriggerTypes = AlertUnitTypes.triggerType;

  return (
    <StepContainer>
      <div className="header">
        <button type="button" className="chevron" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} color={'#303E47'} />
        </button>
        <h2>{t('alert_set_up')}</h2>
      </div>
      {isAlertTypeFetching ? (
        <Loader />
      ) : (
        <div className={`wrapper ${isOpen ? 'open' : 'closed'}`}>
          <div
            className="row"
            style={{
              minHeight: '17rem'
            }}
          >
            <div className="column">
              <FrequencyDropdown
                alertFrequencyUnits={alertFrequencyUnits}
                alertData={alertData}
                onDropdownChange={onHandleChange}
              />
              <div
                style={{
                  marginTop: '2rem'
                }}
              >
                <Reminder
                  alertReminderUnits={alertReminderUnits}
                  reminderValues={reminderValues}
                  onDropdownChange={onReminderHandleChange}
                  isReminderEnabled={isReminderEnabled}
                  setIsReminderEnabled={setIsReminderEnabled}
                />
              </div>
            </div>
            <div className="column">
              <SlidingWindow
                alertFrequencyUnits={alertFrequencyUnits}
                alertData={alertData}
                onDropdownChange={onHandleChange}
              />
            </div>
            <div>
              <TriggerAlert
                label={t('alert_trigger_based_on') as string}
                alertFrequencyUnits={alertFrequencyUnits}
                alertTriggerTypes={alertTriggerTypes}
                onDropdownChange={onTriggerHandleChange}
                isTriggerEnabled={isTriggerEnabled}
                triggerValues={triggerValues}
                onRadioAndTriggerHandleChange={onRadioAndTriggerHandleChange}
              />
            </div>
            <div className="column fixed-width">
              <NotificationsToggle />
            </div>
          </div>
        </div>
      )}
    </StepContainer>
  );
};

export default AlertSetup;
