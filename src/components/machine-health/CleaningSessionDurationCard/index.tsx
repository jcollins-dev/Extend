// 3rd party libs
import React from 'react';
import { useTranslation } from 'react-i18next';

// Components
import TwoValueCard from 'components/KPICard/TwoValueCard';
import { DashboardWidget } from 'components';

// Types
import { CleaningSession, CleaningSessionsKpi } from 'types/protein';

// Helpers
import { formatDuration, getDurationBetweenTimestamps } from 'helpers';

interface Props {
  selectedSession?: CleaningSession;
  setSessionSelectorVisible?: (visible: boolean) => void;
  cleaningSessionKpiData?: CleaningSessionsKpi;
  isLoading?: boolean;
}

const CleaningSessionDurationCard = ({
  selectedSession,
  setSessionSelectorVisible,
  cleaningSessionKpiData,
  isLoading
}: Props): JSX.Element | null => {
  const { t } = useTranslation(['mh']);

  const handleOnClick = () => setSessionSelectorVisible && setSessionSelectorVisible(true);

  const widgetSettings = {
    title: t('cleaning_session_duration'),
    hasFlyOut: handleOnClick,
    isLoading: isLoading
  };

  return (
    <DashboardWidget {...widgetSettings}>
      <TwoValueCard
        value1={{
          value: selectedSession
            ? getDurationBetweenTimestamps(
                selectedSession.startTimestamp,
                selectedSession?.endTimestamp,
                'hours:mins'
              )
            : '-',
          unit: 'hours:mins'
        }}
        value2={{
          value: cleaningSessionKpiData
            ? formatDuration(cleaningSessionKpiData.avgDuration, 'hours:mins')
            : '-',
          unit: 'Avg/session'
        }}
      />
    </DashboardWidget>
  );
};

export default CleaningSessionDurationCard;
