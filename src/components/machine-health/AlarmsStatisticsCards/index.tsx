// 3rd party libs
import React, { useMemo } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

// Components
import { Card, Typography } from 'components';

// Types
import { Alarm, AlarmType } from 'types/machine-health/alarms';

// Helpers
import { formatDuration } from 'helpers';

// Theme
import theme from 'themes';

const StyledCard = styled(Card)`
  background: ${({ theme }) => theme.colors.lightGrey1};
  padding-top: 1rem;
  padding-bottom: 1rem;

  display: flex;
  gap: 0 1rem;

  > * {
    flex: 1;
  }
`;

const StatisticContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface ChipProps {
  alarmType: AlarmType;
}

const Chip = styled.span<ChipProps>`
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 0.15rem;
  background: ${({ alarmType }) => theme.colors.alarmStatusColors[alarmType]};
`;

const ChipContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.3rem;
  gap: 0.25rem;
`;

interface Props {
  data?: Alarm[];
  alarmCount?: number;
  isFiltered: boolean;
  countChips: AlarmType[];
  statisticsChips: AlarmType[];
}

interface DataGroup {
  alarmTotalDuration: string;
  alarmAverageDuration: string;
}

export const computeTotalDuration = (durations: moment.Duration[]): number => {
  return durations
    .reduce((prev, curr) => moment.duration(curr).add(prev), moment.duration(0))
    .asMilliseconds();
};

export const computeAverageDuration = (durations: moment.Duration[]): number => {
  return computeTotalDuration(durations) / durations.length;
};

export const computeAlarmStatistics = (data?: Alarm[]): DataGroup => {
  // Short circuit if there is no data
  if (!data || data.length === 0) {
    return { alarmAverageDuration: '-', alarmTotalDuration: '-' };
  }

  // Compute duration of each alarm
  const durations = data.map((alarm) => {
    const startTime = moment(alarm.startTimestamp);
    const endTime = moment(alarm.endTimestamp);
    return moment.duration(endTime.diff(startTime));
  });

  // Compute total and average duration statistics
  const totalDuration = computeTotalDuration(durations);
  const avgDuration = computeAverageDuration(durations);

  // Format statistics to appropriate durations format
  const formattedSum = formatDuration(totalDuration, 'days hrs mins secs');
  const formattedAverage = formatDuration(avgDuration, 'days hrs mins secs');

  return {
    alarmTotalDuration: formattedSum,
    alarmAverageDuration: formattedAverage
  };
};

const AlarmsStatisticsCards = ({
  data,
  alarmCount,
  isFiltered,
  countChips,
  statisticsChips
}: Props): JSX.Element => {
  const { alarmTotalDuration, alarmAverageDuration } = useMemo(
    () => computeAlarmStatistics(data),
    [data, isFiltered, alarmCount]
  );
  const { t } = useTranslation(['mh']);
  const { totalDurationLabel, avgDurationLabel, alarmCountLabel } = useMemo(() => {
    return {
      totalDurationLabel: isFiltered ? t('total_duration') : t('total_duration_excluding_warnings'),
      avgDurationLabel: isFiltered ? t('avg_duration') : t('avg_duration_excluding_warnings'),
      alarmCountLabel: isFiltered ? t('total_count') : t('total_count_including_warnings')
    };
  }, [isFiltered]);

  return (
    <StyledCard>
      <StatisticContainer>
        <ChipContainer>
          {countChips.map((alarmType) => (
            <Chip key={alarmType} alarmType={alarmType} />
          ))}
        </ChipContainer>
        <Typography weight="bold" as="h3" color={'darkGrey'} size="1.25rem" mb={0}>
          {alarmCount}
        </Typography>
        <Typography weight="medium" color={'mediumGrey2'} as="h3" size="1rem" mb={0}>
          {alarmCountLabel}
        </Typography>
      </StatisticContainer>

      <StatisticContainer>
        <ChipContainer>
          {statisticsChips.map((alarmType) => (
            <Chip key={alarmType} alarmType={alarmType} />
          ))}
        </ChipContainer>
        <Typography weight="bold" as="h3" color={'darkGrey'} size="1.25rem" mb={0}>
          {alarmTotalDuration}
        </Typography>
        <Typography weight="medium" color={'mediumGrey2'} as="h3" size="1rem" mb={0}>
          {totalDurationLabel}
        </Typography>
      </StatisticContainer>
      <StatisticContainer>
        <ChipContainer>
          {statisticsChips.map((alarmType) => (
            <Chip key={alarmType} alarmType={alarmType} />
          ))}
        </ChipContainer>
        <Typography weight="bold" as="h3" color={'darkGrey'} size="1.25rem" mb={0}>
          {alarmAverageDuration}
        </Typography>
        <Typography weight="medium" color={'mediumGrey2'} as="h3" size="1rem" mb={0}>
          {avgDurationLabel}
        </Typography>
      </StatisticContainer>
    </StyledCard>
  );
};

export default AlarmsStatisticsCards;
