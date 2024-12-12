// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { Typography } from 'components';
import { DashboardWidget } from 'components';
import { Indicator } from 'components';

// Api
import { useGetMachineLastCleaningSessionQuery } from 'api';

// Types
import { LastCleaningSession, ProteinMachineRouteQueryParams } from 'types/protein';

// Constants
import breakpoint from 'constants/breakpoints';

// Helpers
import { formatDate, formatDuration } from 'helpers';

// Theme
import theme from 'themes';

// Utils
import { useTimeZone } from 'providers';

type Props = {
  linksToPath?: string;
  onClick?: () => void;
  title?: string;
  tooltipContent?: string;
  hideArrow?: boolean;
};

const CleaningIndicator = styled(Indicator)`
  display: inline-block;
  margin: 0;
  top: -2px;
  position: relative;
`;

const InnerDashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .cleaningValueContainer {
    display: flex;
  }

  .cleaningValue {
    padding: 0.5rem 1rem;
    text-align: center;
    line-height: 1.5;
    font-size: 1.3125rem;

    @media (max-width: ${breakpoint.size.xl}px) {
      font-size: 1rem;
    }
  }

  .cleaningLabel {
    display: block;
    flex: 1;
    text-align: center;
    line-height: 1.6rem;
    font-weight: 400;
    font-size: 0.8125rem;
    color: ${theme.colors.darkGrey2};
  }
`;

const ValueComponent = ({
  label,
  value
}: {
  label: string;
  value: string;
  weight?: number;
  fullWidth?: boolean;
}) => (
  <div className="cleaningValue">
    {value}
    <span className="cleaningLabel">{label}</span>
  </div>
);

const sessionRenderer = (
  session: LastCleaningSession,
  t: TFunction<'mh'[], undefined>,
  timeZone?: string
) => {
  const { status, startTime, duration } = session;
  return (
    <>
      <ValueComponent
        label={t('status', { ns: 'common' })}
        value={status}
        weight={status === 'Completed' ? 700 : 400}
        fullWidth
      />
      <div className="cleaningValueContainer">
        <ValueComponent
          label={t('start_time', { ns: 'common' })}
          value={formatDate(startTime, 'long', timeZone).concat(
            ' ',
            formatDate(startTime, 'hours-minutes', timeZone)
          )}
        />
        <ValueComponent
          label={t('duration_hh_mm')}
          value={formatDuration(duration, 'hours:mins')}
        />
      </div>
    </>
  );
};

const titleIndicator = (data: LastCleaningSession): JSX.Element => {
  const color = !data
    ? 'transparent'
    : data.alarms === 0
    ? theme.colors.onTrackGreen
    : theme.colors.atRiskYellow;

  return <CleaningIndicator color={color} />;
};

const CleaningKpi = ({ linksToPath, tooltipContent }: Props): JSX.Element => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { data, isLoading, error } = useGetMachineLastCleaningSessionQuery({ machineId });
  const { timeZone } = useTimeZone();
  const { t } = useTranslation(['mh']);

  const widgetSettings = {
    title: t('cleaning'),
    SubTitle: t('last_session'),
    titleIndicator: data && titleIndicator(data),
    linksToPath: linksToPath,
    isLoading: isLoading ? true : false,
    hasError: error && 'Failed to load the last cleaning session',
    linksToPathTooltipContent: tooltipContent
  };

  return (
    <DashboardWidget {...widgetSettings}>
      <InnerDashboardContainer>
        {data ? (
          sessionRenderer(data, t, timeZone)
        ) : (
          <Typography>{t('no_sessions_were_found')}</Typography>
        )}
      </InnerDashboardContainer>
    </DashboardWidget>
  );
};

export default CleaningKpi;
