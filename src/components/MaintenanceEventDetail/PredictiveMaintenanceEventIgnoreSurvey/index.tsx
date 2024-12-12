import React, { ReactElement, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Button, RadioButton, Typography } from 'components';
import {
  MaintenanceEvent,
  DataScienceSurvey,
  PredictiveAlertConfirmation,
  DataScienceSurveyIgnoreReasons,
  DataScienceIssueType
} from 'types/maintenance';
import { ButtonContainer, Footer } from '..';
import { toast } from 'react-toastify';

import { useCreateDataScienceSurveyMutation } from 'api';

interface Props {
  maintenanceEvent: MaintenanceEvent;
  onSubmitClick: () => void;
  onClose: () => void;
}

const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.white};
  flex: 1;
  position: relative;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  margin-top: 1rem;
  margin-left: 1.5rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  box-shadow: ${({ theme }) => theme.colors.borders.border02.shadow};
  border-radius: 0.375rem;
`;

type surveyPropNames =
  | 'issueType'
  | 'details'
  | 'needFollowUp'
  | 'issueConfirmation'
  | 'alertIgnored'
  | 'ignoreReason'
  | 'other';

const PredictiveMaintenanceEventIgnoreSurvey = ({
  maintenanceEvent,
  onSubmitClick,
  onClose
}: Props): ReactElement => {
  const [localDataScienceSurvey, setLocalDataScienceSurvey] = useState<Partial<DataScienceSurvey>>({
    issueType: DataScienceIssueType.IGNORED,
    details: '',
    needFollowUp: false,
    issueConfirmation: PredictiveAlertConfirmation.None
    //alertIgnored: true
  });

  const { t } = useTranslation(['fpns']);

  const handleSurveyChange = (
    value: string | boolean | DataScienceIssueType | DataScienceSurveyIgnoreReasons,
    propName: surveyPropNames
  ) => {
    setLocalDataScienceSurvey({ ...localDataScienceSurvey, [propName]: value });
  };

  const theme = useTheme();
  const [createSurvey] = useCreateDataScienceSurveyMutation();

  const isValid = (): boolean => {
    const valid = Boolean(
      (localDataScienceSurvey.ignoreReason == DataScienceSurveyIgnoreReasons.OTHER &&
        localDataScienceSurvey.other) ||
        (localDataScienceSurvey.ignoreReason &&
          localDataScienceSurvey.ignoreReason != DataScienceSurveyIgnoreReasons.OTHER)
    );
    return valid;
  };

  return (
    <Container>
      <Typography as="h3" mb={2} size="1.125rem" weight="bold">
        {t('why_ignore_alert')}
      </Typography>
      <Typography mb={2} variant="helper">
        <RadioButton
          key={DataScienceSurveyIgnoreReasons.TOO_MANY}
          checked={localDataScienceSurvey.ignoreReason === DataScienceSurveyIgnoreReasons.TOO_MANY}
          label={t('too_many_alert') as string}
          labelWeight={400}
          onChange={() => {
            handleSurveyChange(DataScienceSurveyIgnoreReasons.TOO_MANY, 'ignoreReason');
          }}
        />
      </Typography>
      <Typography mb={2} variant="helper">
        <RadioButton
          key={DataScienceSurveyIgnoreReasons.NOT_USEFUL}
          checked={
            localDataScienceSurvey.ignoreReason === DataScienceSurveyIgnoreReasons.NOT_USEFUL
          }
          label={t('alert_notification_not_useful') as string}
          labelWeight={400}
          onChange={() =>
            handleSurveyChange(DataScienceSurveyIgnoreReasons.NOT_USEFUL, 'ignoreReason')
          }
        />
      </Typography>
      <Typography mb={2} variant="helper">
        <RadioButton
          key={DataScienceSurveyIgnoreReasons.OTHER}
          checked={localDataScienceSurvey.ignoreReason === DataScienceSurveyIgnoreReasons.OTHER}
          label={t('other', { ns: 'common' }) as string}
          labelWeight={400}
          onChange={() => handleSurveyChange(DataScienceSurveyIgnoreReasons.OTHER, 'ignoreReason')}
        />
        {localDataScienceSurvey.ignoreReason == DataScienceSurveyIgnoreReasons.OTHER && (
          <StyledTextarea
            rows={8}
            value={localDataScienceSurvey.other}
            placeholder={t('please_provide_details') as string}
            onChange={(event) => {
              handleSurveyChange(event.target.value as string, 'other');
            }}
          />
        )}
      </Typography>
      <Footer bgColor={theme.colors.white}>
        <ButtonContainer>
          <Button
            variant="primary"
            onClick={() => {
              createSurvey({
                maintenance_event_id: maintenanceEvent.id,
                issueType: DataScienceIssueType.IGNORED,
                ignoreReason: localDataScienceSurvey.ignoreReason,
                other: localDataScienceSurvey.other
              }).then(() => {
                toast.success(t('issue_marked_ignore'), {
                  toastId: 'survey-completed'
                });
                onSubmitClick();
                onClose();
              });
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

export default PredictiveMaintenanceEventIgnoreSurvey;
