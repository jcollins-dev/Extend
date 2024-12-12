// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { DateRangeProps, DateButtonWithDropdown } from 'components/StyledUi/DateRange';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BaseSelect, DateRangePicker, Typography, FlyoutHeader } from 'components';
import CleaningSessionTable from 'components/CleaningSessionTable';

// Types
import { CleaningSession } from 'types/protein';

// Helpers
import { changeTimeZoneToLocal } from 'helpers';

// Themes
import theme from 'themes';
import { DATA_DATE_LIMIT_DAYS } from 'constants/machineConfig';

export interface DateRange {
  from?: Date;
  to?: Date;
}

const getSessionsOptions = (
  t: TFunction<'mh'[], undefined>
): { label: string; value: string }[] => {
  return [
    {
      label: t('sessions_3'),
      value: '3'
    },
    {
      label: t('sessions_5'),
      value: '5'
    },
    {
      label: t('sessions_10'),
      value: '10'
    },
    {
      label: t('sessions_20'),
      value: '20'
    }
  ];
};

interface Props {
  isV2?: boolean;
  close: () => void;
  onSelectSession: (session: CleaningSession) => void;
  session?: CleaningSession;
  onDateRangeChange: (range: DateRange) => void;
  dateRange: DateRange;
  dateRange2?: DateRangeProps;
  setDateRange2?: (range: DateRangeProps) => void;
  onAverageDurationChange: (duration: number) => void;
  averageDuration: number;
  data?: CleaningSession[];
  isLoading?: boolean;
  error?: unknown;
  handleDateOpen?: () => void;
  displayAverageSizeSelector?: boolean;
}

const Filter = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
`;

const ErrorContainer = styled.div`
  padding: 1rem;
`;

const AverageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  > * {
    flex: 1;
  }
`;

const WarningContainer = styled.div`
  width: 93%;
  background: ${theme.colors.atRiskYellow4};
  padding: 0.75rem;
  margin: 0 auto;
  border-radius: 0.375rem;
`;

const WarningMsg = styled.div`
  font-size: 0.875rem;
  text-align: center;
  color: ${theme.colors.negativeRed2};
`;

const SessionSelector = ({
  close,
  onSelectSession,
  session,
  onDateRangeChange,
  averageDuration,
  onAverageDurationChange,
  dateRange,
  dateRange2,
  setDateRange2,
  data,
  isLoading,
  error,
  handleDateOpen,
  isV2,
  displayAverageSizeSelector = true
}: Props): JSX.Element => {
  const { t } = useTranslation(['mh', 'common']);
  const DatePicker = dateRange2 ? (
    <DateButtonWithDropdown
      dateRange={dateRange2}
      setDateRange={setDateRange2 as (range: DateRangeProps) => void}
      hasGoBackDateLimit={DATA_DATE_LIMIT_DAYS}
    />
  ) : (
    <>
      <Typography as="span" mb={0} size="0.9rem" weight="bold">
        {t('filter', { ns: 'common' })}:
      </Typography>
      <DateRangePicker
        onToggle={handleDateOpen}
        maxDate={changeTimeZoneToLocal(moment().toDate())}
        minDate={moment().subtract(6, 'months').toDate()}
        onRangeUpdate={onDateRangeChange}
        range={dateRange}
      />
    </>
  );

  const Inner = (
    <>
      {data && data.length < averageDuration && (
        <WarningContainer>
          <WarningMsg>
            <FontAwesomeIcon icon={faWarning} />
            &nbsp; {t('calculated_with_available_sessions')}
          </WarningMsg>
        </WarningContainer>
      )}
      {error ? (
        <ErrorContainer>
          <Typography color="negativeRed">{t('failed_to_load_cleaning_sessions')}</Typography>
        </ErrorContainer>
      ) : (
        <CleaningSessionTable
          isLoading={isLoading}
          data={data}
          onSessionClick={(session) => {
            onSelectSession(session);
            close();
          }}
          session={session}
        />
      )}
      {displayAverageSizeSelector && (
        <AverageSizeSelector>
          <Typography as="span" mb={0} size="0.8rem" weight="bold">
            {t('avg_calculated_from_the_past')}
          </Typography>
          <BaseSelect
            variant="white"
            value={`${averageDuration}`}
            handleChange={(evt) => {
              const value = parseInt(evt.target.value, 10);
              onAverageDurationChange(value);
            }}
            options={getSessionsOptions(t)}
          />
        </AverageSizeSelector>
      )}
    </>
  );
  return (
    <>
      <FlyoutHeader onClose={() => close()} heading={t('select_single_session') as string} />
      <Filter>{DatePicker}</Filter>
      {isV2 ? <div className="ui-scroll-x">{Inner}</div> : Inner}
    </>
  );
};

export default SessionSelector;
