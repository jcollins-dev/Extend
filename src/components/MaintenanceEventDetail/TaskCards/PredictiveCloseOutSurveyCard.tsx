import React, { useState } from 'react';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

import Card from 'components/Card';
import Typography from 'components/Typography/Typography';
import theme from 'themes';
import { DataScienceSurvey, MaintenanceEvent, MaintenanceEventStatus } from 'types/maintenance';
import { Table } from '.';
import { formatDate } from 'helpers';

interface PredictiveCloseOutSurveyCard {
  event: MaintenanceEvent;
  survey?: DataScienceSurvey;
}

function getSurveyTitle(event: MaintenanceEvent, t: TFunction<'fpns'[], undefined>): string {
  if (event.status == MaintenanceEventStatus.NotComplete) {
    return t('mark_complete');
  } else if (event.status == MaintenanceEventStatus.Completed) {
    return t('ds_survey_completed');
  }
  return t('not_completed_as_planned');
}

function getSurveyHeaderColor(event: MaintenanceEvent) {
  if (event.status == MaintenanceEventStatus.Completed) {
    return theme.colors.onTrackGreen5;
  } else if (event.status == MaintenanceEventStatus.NotComplete) {
    return theme.colors.negativeRed4;
  }
  return theme.colors.mediumBlue4;
}

const PredictiveCloseOutSurveyCard = ({
  event,
  survey
}: PredictiveCloseOutSurveyCard): JSX.Element => {
  const { t } = useTranslation(['fpns']);
  const pmSurveyTitle = getSurveyTitle(event, t);
  const [headerColor] = useState<string>(getSurveyHeaderColor(event));
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
                      : 'Scheduled Date Unavailable'}
                  </Typography>
                </td>
              </tr>
              {event.status == MaintenanceEventStatus.Completed && survey && (
                <>
                  <tr>
                    <td>
                      <Typography as="span" size="0.75rem">
                        Issue Type:
                      </Typography>
                    </td>
                    <td>
                      <Typography as="span" size="0.75rem">
                        {survey.issueType ? survey.issueType : 'Issue Type unavailable'}
                      </Typography>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Typography as="span" size="0.75rem">
                        Details:
                      </Typography>
                    </td>
                    <td>
                      <Typography as="span" size="0.75rem">
                        {survey.detail ? survey.detail : 'None'}
                      </Typography>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default PredictiveCloseOutSurveyCard;
