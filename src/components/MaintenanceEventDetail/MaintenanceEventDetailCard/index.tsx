import React from 'react';
import Card from 'components/Card';
import Typography from 'components/Typography/Typography';
import { Loader } from 'components';
import { formatDate, stringOrLoadingText } from 'helpers';
import { MaintenanceEventStatus } from 'types/maintenance';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface MaintenanceEventDetailCardProps {
  description?: string | undefined;
  createdAt?: Date | undefined;
  machineDescription?: string | undefined;
  subComponent?: string | undefined;
  status?: MaintenanceEventStatus | undefined;
  suggestedDue?: Date | undefined;
  isLoading: boolean;
}

export const Table = styled.table<{ mb?: string }>`
  width: 100%;
  margin-bottom: ${({ mb }) => mb || '0'};

  td {
    padding: 0.5rem 0;

    &:first-child {
      width: 33%;
    }
  }
`;

const MaintenanceEventDetailCard = ({
  createdAt,
  machineDescription,
  subComponent,
  status,
  suggestedDue,
  isLoading
}: MaintenanceEventDetailCardProps): JSX.Element => {
  const { t } = useTranslation(['fpns']);
  return (
    <Card>
      <Card.Header>
        <Typography as="h3" mb={0} size="1.125rem" weight="bold">
          {stringOrLoadingText(
            machineDescription,
            isLoading,
            t('machine', { ns: 'common' }) as string
          )}
        </Typography>
      </Card.Header>
      <Card.Body pt={0}>
        {isLoading && <Loader size={40} />}
        {!isLoading && (
          <Table>
            <tbody>
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    {t('created')}:
                  </Typography>
                </td>
                <td>
                  <Typography as="span" size="0.75rem">
                    {createdAt ? formatDate(createdAt, 'short') : t('creation_date_unavailable')}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    {t('sub_component', { ns: 'common' })}:
                  </Typography>
                </td>
                <td>
                  <Typography as="span" size="0.75rem">
                    {stringOrLoadingText(
                      subComponent,
                      isLoading,
                      t('sub_component', { ns: 'common' }) as string
                    )}
                  </Typography>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    {t('status', { ns: 'common' })}:
                  </Typography>
                </td>
                <td>
                  <Typography as="span" size="0.75rem" weight="bold">
                    {status ? t(status) : t('maintenance_event_status_unavailable')}
                  </Typography>{' '}
                  <Typography as="span" size="0.75rem">
                    {suggestedDue != undefined
                      ? formatDate(suggestedDue, 'short')
                      : t('suggested_due_date_unavailable')}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default MaintenanceEventDetailCard;
