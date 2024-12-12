import React, { useState } from 'react';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import Button from 'components/Button';
import Card from 'components/Card';
import Typography from 'components/Typography/Typography';
import theme from 'themes';
import { MaintenanceEvent, MaintenanceEventStatus, MaintenanceTaskType } from 'types/maintenance';
import { CTAsStretch, Table } from '.';
import { formatDate, markTaskCompleteOrIncompleteByType } from 'helpers';
import { useUpdateMaintenanceEventsMutation } from 'api';

interface CloseOutSurveyCardProps {
  event: MaintenanceEvent;
  surveyClickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
  refresh?: CallableFunction;
}

function getSurveyTitle(
  event: MaintenanceEvent,
  editClicked: boolean,
  t: TFunction<'fpns'[], undefined>
): string {
  if (event.status == MaintenanceEventStatus.NotComplete || editClicked) {
    return t('mark_complete', { ns: 'fpns' });
  } else if (event.status == MaintenanceEventStatus.Completed && event.completedAsPlanned) {
    return t('completed_as_planned', { ns: 'fpns' });
  }
  return t('not_completed_as_planned', { ns: 'fpns' });
}

function getSurveyHeaderColor(event: MaintenanceEvent) {
  if (event.status == MaintenanceEventStatus.Completed && event.completedAsPlanned) {
    return theme.colors.onTrackGreen5;
  } else if (event.status == MaintenanceEventStatus.Completed && !event.completedAsPlanned) {
    return theme.colors.negativeRed4;
  }
  return theme.colors.mediumBlue4;
}

const CloseOutSurveyCard = ({
  event,
  surveyClickHandler
}: CloseOutSurveyCardProps): JSX.Element => {
  const { t } = useTranslation(['fpns']);
  const [editClicked, setEditClicked] = useState<boolean>(false);
  const pmSurveyTitle = getSurveyTitle(event, editClicked, t);
  const [headerColor, setHeaderColor] = useState<string>(getSurveyHeaderColor(event));
  const [updateMaintenanceEvent] = useUpdateMaintenanceEventsMutation();
  return (
    <Card borderColor={theme.colors.lightGrey3}>
      <Card.Header bgColor={headerColor} icon={<FontAwesomeIcon icon={faWrench} />}>
        <Typography mb={0} size="0.8125rem" weight="medium">
          {pmSurveyTitle}
        </Typography>
      </Card.Header>
      <Card.Body>
        {event.status === MaintenanceEventStatus.Completed && event.completion && (
          <Table mb="1rem">
            <tbody>
              <tr>
                <td>
                  <Typography as="span" size="0.75rem">
                    Completed on:
                  </Typography>
                </td>
                <td>
                  <Typography as="span" size="0.75rem">
                    {event.completion
                      ? formatDate(event.completion, 'short')
                      : t('scheduled_date_unavailable')}
                  </Typography>
                </td>
              </tr>
              {event.closedRunMetric && (
                <tr>
                  <td>
                    <Typography as="span" size="0.75rem">
                      {t('run_metric')}:
                    </Typography>
                  </td>
                  <td>
                    <Typography as="span" size="0.75rem">
                      {event.closedRunMetric}
                    </Typography>
                  </td>
                </tr>
              )}
              {event.status == MaintenanceEventStatus.Completed &&
                event.comments &&
                event.comments.length > 0 && (
                  <tr>
                    <td>
                      <Typography as="span" size="0.75rem">
                        {t('comments')}:
                      </Typography>
                    </td>
                    <td>
                      <Typography as="span" size="0.75rem">
                        {event.comments ? event.comments : t('comments_unavailable')}
                      </Typography>
                    </td>
                  </tr>
                )}
            </tbody>
          </Table>
        )}
        {(event.status == MaintenanceEventStatus.NotComplete || editClicked) && (
          <>
            <Typography weight="medium" size="0.8125rem">
              {t('is_completed_as_planned')}
            </Typography>
            <CTAsStretch>
              <Button
                onClick={surveyClickHandler}
                bgColor={theme.colors.atRiskYellow3}
                size="small"
              >
                {t('no', { ns: 'common' })}
              </Button>
              <Button
                onClick={surveyClickHandler}
                bgColor={theme.colors.onTrackGreen3}
                size="small"
              >
                {t('yes', { ns: 'common' })}
              </Button>
            </CTAsStretch>
          </>
        )}
        {event.status == MaintenanceEventStatus.Completed && !editClicked && (
          <CTAsStretch>
            <Button
              onClick={() => {
                setEditClicked(true);
                setHeaderColor(theme.colors.mediumBlue4);
                updateMaintenanceEvent([
                  {
                    ...markTaskCompleteOrIncompleteByType(
                      MaintenanceTaskType.Complete,
                      event,
                      false
                    ),
                    status: MaintenanceEventStatus.NotComplete,
                    completedAsPlanned: undefined,
                    followUpNeeded: undefined,
                    completion: undefined,
                    completionCycleCount: undefined
                  }
                ]).then(() => {
                  toast.success(t('mark_resolved', { item: event.description }), {
                    toastId: 'marked-resolved'
                  });
                });
              }}
              size="small"
            >
              {t('mark_as_incomplete')}
            </Button>
          </CTAsStretch>
        )}
      </Card.Body>
    </Card>
  );
};

export default CloseOutSurveyCard;
