import { Typography } from 'components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Asterisk from './Asterisk ';
import { Dropdown } from './Dropdown';
import { AlertEnumTypes, TAlertData } from 'types/machine-health/alerts';

interface IFrequencyDropdown {
  alertFrequencyUnits: AlertEnumTypes['alertFrequencyUnits'];
  alertData: TAlertData;
  onDropdownChange: (key: string, value: string | number | boolean, place?: string) => void;
}

export const FrequencyDropdown = ({
  alertFrequencyUnits,
  alertData,
  onDropdownChange
}: IFrequencyDropdown): JSX.Element => {
  const { t } = useTranslation(['mh']);

  const onDropdownValueChange = (val: string) => {
    onDropdownChange('frequencyUnits', val);
  };

  const onFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      onDropdownChange('frequencyValue', Number(1));
    } else {
      onDropdownChange('frequencyValue', Number(e.target.value));
    }
  };

  return (
    <div className="frequency_container">
      <div className="dropdown-container--label label">
        <Typography variant="inputlabel">
          {t('alert_frequency')} <Asterisk />
        </Typography>
      </div>

      <div
        style={{
          display: 'flex'
        }}
      >
        <input
          type="number"
          min="1"
          max="1000"
          name="frequency"
          onChange={onFrequencyChange}
          value={alertData.frequencyValue}
          placeholder="Value"
        ></input>
        <Dropdown
          vals={alertFrequencyUnits}
          onDropdownChange={onDropdownValueChange}
          value={alertData.frequencyUnits}
        />
      </div>
    </div>
  );
};
