import React, { useState } from 'react';
import { StepContainer } from './index.elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useDateRange } from 'components';
import { DateRangeProps, DateButtonWithDropdown } from 'components/StyledUi/DateRange';
import { DATA_DATE_LIMIT_DAYS } from 'constants/machineConfig';
import BellImg from '../assets/bell.png';
import Background from '../assets/background.png';
import { useTranslation } from 'react-i18next';

export const AlertSimulation = (): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const [isOpen, setIsOpen] = useState(true);
  const { dateRange, setDateRange } = useDateRange();
  const hasGoBackDateLimit = DATA_DATE_LIMIT_DAYS;
  const handleDateRange = (range: DateRangeProps) => {
    setDateRange(range);
  };
  //here should be an api call that would give us total alerts, right now it is hard coded

  return (
    <StepContainer>
      <div className="header">
        <button type="button" className="chevron" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} color={'#303E47'} />
        </button>
        <h2>{t('alert_simulation')}</h2>
      </div>
      <div className={`wrapper ${isOpen ? 'open' : 'closed'}`}>
        <div className="row">
          <DateButtonWithDropdown
            {...{ dateRange, setDateRange: handleDateRange, hasGoBackDateLimit }}
          />
        </div>
        <div className="row">
          <div className="card">
            <p className="header">{t('potential_alerts')}</p>
            <div className="alertCount" style={{ backgroundImage: `url(${Background})` }}>
              <img src={BellImg} alt="Alert simulation count" />
            </div>
            <p className="counter">80 {t('alerts')}</p>
          </div>
        </div>
      </div>
    </StepContainer>
  );
};
