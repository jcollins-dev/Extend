import { Typography } from 'components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Asterisk from './Asterisk ';
import { Dropdown } from './Dropdown';
import { AlertEnumTypes, TAlertData } from 'types/machine-health/alerts';

interface ISlidingWindow {
  alertFrequencyUnits: AlertEnumTypes['alertFrequencyUnits'];
  alertData: TAlertData;
  onDropdownChange: (key: string, value: string | number | boolean, place?: string) => void;
}

export const SlidingWindow = ({
  alertFrequencyUnits,
  alertData,
  onDropdownChange
}: ISlidingWindow): JSX.Element => {
  const { t } = useTranslation(['mh']);

  const onDropdownValuesChange = (val: string) => {
    onDropdownChange('slidingWindowUnits', val);
  };

  const onWindowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      onDropdownChange('slidingWindowValue', Number(1));
    } else {
      onDropdownChange('slidingWindowValue', Number(e.target.value));
    }
  };

  return (
    <div className="frequency_container">
      <div className="dropdown-container--label label">
        <Typography variant="inputlabel">
          {t('alert_sliding_window')} <Asterisk />
        </Typography>
      </div>

      <div className="row">
        <input
          type="number"
          min="1"
          max="1000"
          name="slidingWindowValue"
          value={alertData.slidingWindowValue}
          onChange={onWindowChange}
          placeholder="Value"
        ></input>
        <Dropdown
          vals={alertFrequencyUnits}
          onDropdownChange={onDropdownValuesChange}
          value={alertData.slidingWindowUnits}
        />
      </div>
    </div>
  );
};
