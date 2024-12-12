// 3rd party libs
import { Button, Input, Typography } from 'components';
import React, { ReactElement, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import 'react-day-picker/lib/style.css';
import { useTranslation } from 'react-i18next';

// Components
import { ChangeEvent } from 'types';
import { MaintenanceEvent, MaintenanceEventTableRow, MaintenanceTaskType } from 'types/maintenance';
import { ButtonContainer, Footer, Table } from '..';
import { formatDuration, markTaskCompleteOrIncompleteByType, toISO8601 } from 'helpers';
import { useUpdateMaintenanceEventsMutation } from 'api';
import { toast } from 'react-toastify';
import { AnalyticsCategories, MaintenanceAnalyticEventActions } from 'constants/analytics';
import { generateAnalyticsEvent } from 'helpers/analytics';

interface AssignAndScheduleEventProps {
  maintenanceEvent: MaintenanceEventTableRow;
  onSubmitClick: () => void;
  machineDescription?: string | undefined;
}

// Styling
const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.white};
  flex: 1;
  position: relative;
`;

const AssignAndScheduleEvent = ({
  maintenanceEvent,
  onSubmitClick,
  machineDescription
}: AssignAndScheduleEventProps): ReactElement => {
  const theme = useTheme();
  const { t } = useTranslation(['fpns']);
  const [localMaintenanceEvent, setLocalMaintenanceEvent] =
    useState<MaintenanceEvent>(maintenanceEvent);
  const [updateMaintenanceEvent] = useUpdateMaintenanceEventsMutation();
  const copyPMInfo = (pm: MaintenanceEvent, propName: string, value: string | Date) => {
    setLocalMaintenanceEvent({ ...pm, [propName]: value } as MaintenanceEvent);
  };
  type propNames = 'owner' | 'scheduledDate';
  const handleChange = (value: string | Date, propName: propNames) => {
    copyPMInfo(localMaintenanceEvent, propName, value);
  };

  const handleDayChange = (day: Date) => {
    copyPMInfo(localMaintenanceEvent, 'scheduled', toISO8601(day));
  };
  const isValid = (): boolean => {
    if (maintenanceEvent === undefined) {
      return false;
    }
    const valid = Boolean(localMaintenanceEvent.owner && localMaintenanceEvent.scheduled);
    return valid;
  };
  return (
    <Container>
      <Typography as="h3" mb={2} size="1.125rem" weight="bold">
        {t('assign_and_schedule')}
      </Typography>
      <Typography size="0.75rem">
        {t('estimated_labor')}:
        {localMaintenanceEvent?.estimatedCompletionTime
          ? `${formatDuration(
              localMaintenanceEvent.estimatedCompletionTime * 1000,
              'hours:mins:secs'
            )} ` + t('mins')
          : t('unavailable')}
      </Typography>
      <Table>
        <tbody>
          <tr>
            <td>
              <Typography as="span" size="0.75rem">
                {t('assigned_to')}:
              </Typography>
            </td>
            <td>
              <Input
                type="string"
                id="assignedTo"
                variant="white-dark"
                value={localMaintenanceEvent?.owner}
                onChange={(event: ChangeEvent) => {
                  if (event.target.value[0] !== ' ')
                    handleChange(event.target.value as string, 'owner');
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <Typography as="span" size="0.75rem">
                {t('scheduled_completion_date')}:
              </Typography>
            </td>
            <td>
              <Input
                type="date"
                max="9999-12-31"
                onChange={(e: ChangeEvent) => {
                  handleDayChange(e.target.value as unknown as Date);
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </td>
          </tr>
        </tbody>
      </Table>
      <Footer style={{ backgroundColor: theme.colors.white }}>
        <ButtonContainer>
          <Button
            variant="primary"
            onClick={() => {
              // todo: error handling
              const updatedEvent = markTaskCompleteOrIncompleteByType(
                MaintenanceTaskType.AssignAndSchedule,
                localMaintenanceEvent
              );
              updateMaintenanceEvent([updatedEvent]).then(() => {
                toast.success(
                  `${machineDescription} ${t('assigned_to_lower')} ${localMaintenanceEvent.owner}!`,
                  { toastId: 'assigned' }
                );
                generateAnalyticsEvent({
                  category: AnalyticsCategories.MAINTENANCE,
                  action: MaintenanceAnalyticEventActions.MAINTENANCE_EVENT_ASSIGNED,
                  label: maintenanceEvent?.id
                });
              });
              onSubmitClick();
            }}
            disabled={!isValid()}
          >
            {t('confirm', { ns: 'common' })}
          </Button>
        </ButtonContainer>
      </Footer>
    </Container>
  );
};

export default AssignAndScheduleEvent;
