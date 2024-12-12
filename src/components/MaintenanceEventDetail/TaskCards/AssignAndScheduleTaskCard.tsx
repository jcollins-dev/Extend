import React from 'react';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { Button, Card, Typography } from 'components';
import theme from 'themes';
import { CTAsStretch } from '.';
import { MaintenanceEvent, MaintenanceTaskType } from 'types/maintenance';
import { useUpdateMaintenanceEventsMutation } from 'api';
import { formatDate, markTaskCompleteOrIncompleteByType } from 'helpers';

interface AssignAndScheduleTaskCardProps {
  maintenanceEvent: MaintenanceEvent;
  onClick: CallableFunction;
  machineDescription?: string | undefined;
}

const AssignAndScheduleTaskCard = ({
  maintenanceEvent,
  onClick,
  machineDescription
}: AssignAndScheduleTaskCardProps): JSX.Element => {
  const [updateMaintenanceEvent] = useUpdateMaintenanceEventsMutation();
  const { t } = useTranslation(['fpns']);
  return (
    <Card borderColor={theme.colors.lightGrey3}>
      <Card.Header bgColor={theme.colors.mediumBlue4} icon={<FontAwesomeIcon icon={faUser} />}>
        <Typography mb={0} size="0.8125rem" weight="medium">
          {t('assign_and_schedule')}
        </Typography>
      </Card.Header>
      <Card.Body>
        <Typography size="0.75rem">
          {t('estimated_labor')}:
          {maintenanceEvent?.estimatedCompletionTime
            ? maintenanceEvent.estimatedCompletionTime
            : t('no_time_estimate_available')}
        </Typography>
        {maintenanceEvent.scheduled && maintenanceEvent.owner && (
          <>
            <Typography size="0.75rem">
              Assigned to:&nbsp;
              {maintenanceEvent?.owner && maintenanceEvent?.owner !== 'SYSTEM' ? (
                <b>{maintenanceEvent.owner}</b>
              ) : (
                t('not_yet_assigned')
              )}
            </Typography>
            <Typography size="0.75rem">
              Scheduled for:&nbsp;
              {maintenanceEvent?.scheduled ? (
                <b>{formatDate(maintenanceEvent.scheduled, 'short')}</b>
              ) : (
                t('not_yet_scheduled')
              )}
            </Typography>
          </>
        )}
        <CTAsStretch>
          <Button
            variant="default"
            size="small"
            width="auto"
            onClick={() => {
              updateMaintenanceEvent([
                {
                  ...markTaskCompleteOrIncompleteByType(
                    MaintenanceTaskType.AssignAndSchedule,
                    maintenanceEvent,
                    false
                  ),
                  owner: 'SYSTEM',
                  scheduled: undefined
                }
              ]).then(() => {
                toast.success(t('successfully_unassigned', { item: machineDescription }), {
                  toastId: 'assigned'
                });
              });
            }}
            disabled={!(maintenanceEvent.owner && maintenanceEvent.scheduled)}
          >
            {t('clear_assignment')}
          </Button>
          <Button arrow variant="primary" size="small" onClick={() => onClick()} width="auto">
            {t('assign_and_schedule')}
          </Button>
        </CTAsStretch>
      </Card.Body>
    </Card>
  );
};

export default AssignAndScheduleTaskCard;
