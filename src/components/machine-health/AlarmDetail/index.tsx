// 3rd party libs
import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Components
import { FlyoutHeader, Card, Typography } from 'components';

// Types
import { Alarm } from 'types/machine-health/alarms';
import { Alert } from 'types/machine-health/alerts';

// Helpers
import { getDurationBetweenTimestamps, formatDate } from 'helpers';

// Providers
import { useTimeZone } from 'providers';

interface Props {
  alarms?: Alarm[];
  alerts?: Alert[];
  onClose?: () => void;
}

const Container = styled.div`
  background: ${({ theme }) => theme.colors.lightGrey1};
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

export const Table = styled.table`
  width: 100%;

  td {
    padding: 0.125rem 0;

    &:first-child {
      width: 33%;
    }
  }
`;

interface CleaningSessionDetailCard {
  cardType: 'Alarm' | 'Alert';
  startTimestamp: string;
  description?: string;
  code?: string;
  location?: string;
  endTimestamp?: string;
}

const AlarmDetail = ({ alarms, alerts, onClose }: Props): JSX.Element => {
  const theme = useTheme();
  const { timeZone } = useTimeZone();
  const { t } = useTranslation(['mh', 'common']);

  const formattedData: CleaningSessionDetailCard[] = useMemo(() => {
    const alarmsCards: CleaningSessionDetailCard[] =
      alarms?.map((alarm) => {
        return {
          cardType: 'Alarm',
          startTimestamp: alarm.startTimestamp,
          endTimestamp: alarm.endTimestamp,
          description: alarm.description,
          code: alarm.code,
          location: alarm.location
        };
      }) || [];

    const alertCards: CleaningSessionDetailCard[] =
      alerts?.map((alert) => {
        return {
          cardType: 'Alert',
          startTimestamp: alert.createdAt,
          description: alert.description
        };
      }) || [];

    // Combine Alarms and Alerts rows into one array
    const combinedRows: CleaningSessionDetailCard[] = [...alertCards, ...alarmsCards];

    // Then order rows by startDateTime
    const sortedRows = combinedRows.sort((a, b) => {
      const firstStartTime = new Date(a.startTimestamp);
      const secondStartTime = new Date(b.startTimestamp);

      return firstStartTime.getTime() - secondStartTime.getTime();
    });

    return sortedRows;
  }, [alarms, alerts]);

  const contentData = formattedData?.map((card, idx) => (
    <Card borderColor={theme.colors.atRiskYellow} key={idx}>
      <Card.Header bgColor={theme.colors.atRiskYellow4}>
        <FontAwesomeIcon
          style={{ fontSize: '1.3rem', margin: '0 0.5rem 0 0' }}
          color={card.cardType == 'Alert' ? theme.colors.atRiskYellow : theme.colors.darkRed}
          icon={card.cardType == 'Alert' ? faBell : faTriangleExclamation}
        />
        <Typography mb={0} weight="bold">
          {card.cardType == 'Alert' ? t('data_science_alert') : t('alarm')}
        </Typography>
      </Card.Header>

      <Card.Body>
        <Table>
          <tbody>
            <tr>
              <td>
                <Typography as="span" size="0.75rem">
                  {t('name', { ns: 'common' })}:
                </Typography>
              </td>
              <td>
                <Typography as="span" size="0.75rem">
                  {card.description}
                </Typography>
              </td>
            </tr>
            {card.code && (
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    {t('id', { ns: 'common' })}:
                  </Typography>
                </td>
                <td>
                  <Typography as="span" size="0.75rem">
                    {card.code}
                  </Typography>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <Typography as="span" size="0.75rem">
                  {t('timestamp', { ns: 'common' })}:
                </Typography>
              </td>
              <td>
                <Typography as="span" size="0.75rem">
                  {formatDate(card.startTimestamp, 'numeric-date-time', timeZone)}
                </Typography>
              </td>
            </tr>
            {card.startTimestamp && card.endTimestamp && (
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    {t('duration')}:
                  </Typography>
                </td>
                <td>
                  <Typography as="span" size="0.75rem">
                    {getDurationBetweenTimestamps(card.startTimestamp, card.endTimestamp)}
                  </Typography>
                </td>
              </tr>
            )}
            {card.location && (
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    {t('location', { ns: 'common' })}::
                  </Typography>
                </td>
                <td>
                  <Typography as="span" size="0.75rem">
                    {card.location}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  ));

  const content = formattedData ? contentData : 'No Data';

  return (
    <Container>
      <FlyoutHeader heading={t('alarm_details') as string} onClose={onClose} />
      <Content>{content}</Content>
    </Container>
  );
};

export default AlarmDetail;
