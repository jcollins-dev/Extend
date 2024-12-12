import React, { ReactElement, useState } from 'react';
import { faInfoCircle, faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { useTheme } from 'styled-components';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import {
  MaintenanceEvent,
  DataScienceSurvey,
  PredictiveAlertConfirmation,
  DataScienceIssueType,
  DataScienceSurveyIgnoreReasons,
  MaintenanceEventStatus
} from 'types/maintenance';
import { BaseSelect, Button, Card, Checkbox, Typography } from 'components';
import { Table } from '..';

import { useCreateDataScienceSurveyMutation, useUpdateMaintenanceEventsMutation } from 'api';

import { toISO8601 } from 'helpers';

interface Props {
  pmDetails: MaintenanceEvent;
  onSubmitClick: (event?: MaintenanceEvent) => void;
  ignoreAlertClickHandler: () => void;
  onClose: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const InputGroup = styled.div`
  margin-bottom: 0.75rem;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  box-shadow: ${({ theme }) => theme.colors.borders.border02.shadow};
  border-radius: 0.375rem;
`;

const FollowUpContainer = styled.div`
  margin-bottom: 1rem;
`;

const IgnoreAlertContainer = styled.div`
  margin-top: 1rem;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
  }
  & button:last-child {
    margin-left: 1rem;
  }
`;

export const Footer = styled.div<{ flexDirection?: string }>`
  width: 100%;
  border-bottom-left-radius: 0.625rem;
  border-bottom-right-radius: 0.625rem;
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || 'column'};
  justify-content: end;
`;

const StyledCard = styled(Card)`
  margin-bottom: 0.875rem;
`;

const issueTypeOptions = ['Mechanical', 'Sensor', 'No Issue'];

const PredictiveMaintenanceEventCloseOutSurvey = ({
  pmDetails,
  onSubmitClick,
  onClose,
  ignoreAlertClickHandler
}: Props): ReactElement => {
  const theme = useTheme();

  const { t } = useTranslation(['fpns']);
  //Default Values
  const [localDataScienceSurvey, setLocalDataScienceSurvey] = useState<Partial<DataScienceSurvey>>({
    issueType: DataScienceIssueType.NO_ISSUE,
    detail: '',
    needFollowUp: false,
    issueConfirmation: PredictiveAlertConfirmation.None
  });

  const [localMaintenanceEvent, setLocalMaintenanceEvent] = useState<MaintenanceEvent>(pmDetails);

  const [editClicked, setEditClicked] = useState<boolean>(false);

  type surveyPropNames =
    | 'issueType'
    | 'detail'
    | 'needFollowUp'
    | 'issueConfirmation'
    | 'alertIgnored'
    | 'ignore_reason'
    | 'other';

  type eventPropNames =
    | 'completion'
    | 'completionCycleCount'
    | 'duration'
    | 'comments'
    | 'followUpNeeded';

  const handleSurveyChange = (
    value: string | boolean | DataScienceIssueType | DataScienceSurveyIgnoreReasons,
    propName: surveyPropNames
  ) => {
    setLocalDataScienceSurvey({ ...localDataScienceSurvey, [propName]: value });
  };

  const copyPMInfo = (
    baseEvent: MaintenanceEvent,
    propName: string,
    value: string | number | Date | boolean | MaintenanceEventStatus
  ) => {
    const updatedEvent = { ...baseEvent, [propName]: value } as MaintenanceEvent;
    setLocalMaintenanceEvent(updatedEvent);
  };

  const handleEventChange = (value: string | Date | number | boolean, propName: eventPropNames) => {
    copyPMInfo(localMaintenanceEvent, propName, value);
  };

  const editClickHandler = () => {
    setEditClicked(true);
  };

  const isValid = (): boolean => {
    const valid = Boolean(
      localDataScienceSurvey.issueType != DataScienceIssueType.NO_ISSUE &&
        localDataScienceSurvey.detail &&
        localDataScienceSurvey.issueType
    );
    return valid;
  };

  const ignoreAlertHandler = () => {
    ignoreAlertClickHandler();
  };

  const [createSurvey] = useCreateDataScienceSurveyMutation();
  const [updateMaintenanceEvent] = useUpdateMaintenanceEventsMutation();

  const commitEventAndClose = () => {
    updateMaintenanceEvent([
      {
        ...localMaintenanceEvent,
        status: MaintenanceEventStatus.Completed,
        completion: toISO8601(new Date())
      }
    ])
      .then(() => {
        toast.success(`${localMaintenanceEvent.description} updated!`, {
          toastId: 'updated-event'
        });
      })
      .then(() => {
        onSubmitClick(localMaintenanceEvent);
        onClose();
      });
  };

  return (
    <Container>
      {localMaintenanceEvent.status == MaintenanceEventStatus.NotComplete && (
        <StyledCard>
          <Card.Header
            icon={<FontAwesomeIcon icon={faInfoCircle} />}
            bgColor={theme.colors.primaryBlue4}
          >
            <Typography mb={0} size="0.8125rem" weight="medium">
              {t('predictive_event_info')}
            </Typography>
          </Card.Header>
          <Card.Body>
            <Typography mb={0} size="0.8125rem" weight="medium">
              {t('predictive_event_info_description')}
            </Typography>
          </Card.Body>
        </StyledCard>
      )}
      <Card borderColor={theme.colors.lightGrey3}>
        <Card.Header bgColor={theme.colors.negativeRed4} icon={<FontAwesomeIcon icon={faWrench} />}>
          {localMaintenanceEvent.status !== MaintenanceEventStatus.Completed && (
            <Typography mb={0} size="0.8125rem" weight="medium">
              {t('inspection_result')}
              {localMaintenanceEvent.predictiveAlert &&
                localDataScienceSurvey.issueConfirmation &&
                !editClicked && (
                  <span
                    style={{ color: theme.colors.mediumBlue, cursor: 'pointer' }}
                    onClick={editClickHandler}
                  >
                    &nbsp;&nbsp;{t('edit', { ns: 'common' })}
                  </span>
                )}
            </Typography>
          )}
        </Card.Header>
        {localMaintenanceEvent.status != MaintenanceEventStatus.Completed ? (
          <Card.Body>
            {localDataScienceSurvey &&
              localDataScienceSurvey.issueConfirmation != PredictiveAlertConfirmation.None &&
              !editClicked &&
              (localDataScienceSurvey.issueConfirmation === PredictiveAlertConfirmation.NoIssue ? (
                <Typography as="span" size="0.75rem">
                  {t('no_issue_found')}
                </Typography>
              ) : (
                <>
                  <Typography weight="bold" size="0.75rem">
                    {localDataScienceSurvey.issueType}{' '}
                    <Typography as="span" size="0.75rem">
                      {' '}
                      {t('confirmed', { ns: 'common' })}
                    </Typography>
                  </Typography>
                  <Typography size="0.75rem">{localDataScienceSurvey.detail}</Typography>
                </>
              ))}
            {(!localDataScienceSurvey ||
              (localDataScienceSurvey && localDataScienceSurvey?.issueConfirmation) ||
              editClicked) && (
              <>
                <Table mb="1rem">
                  <tbody>
                    <tr>
                      <td>
                        <Typography as="span" size="0.75rem">
                          {t('issue_found')}:
                        </Typography>
                      </td>
                      <td>
                        <BaseSelect
                          variant={'white'}
                          value={localDataScienceSurvey?.issueType as DataScienceIssueType}
                          handleChange={(event): void => {
                            handleSurveyChange(event.target.value, 'issueType');
                          }}
                          options={issueTypeOptions}
                          placeholder={t('select_dot', { ns: 'common' }) as string}
                          id="issueType"
                        />
                      </td>
                    </tr>
                    {localDataScienceSurvey.issueType &&
                      localDataScienceSurvey.issueType != DataScienceIssueType.NO_ISSUE && (
                        <tr>
                          <td colSpan={2}>
                            <InputGroup>
                              <StyledTextarea
                                rows={8}
                                value={localDataScienceSurvey.detail}
                                placeholder={t('please_provide_details') as string}
                                onChange={(event) => {
                                  handleSurveyChange(event.target.value as string, 'detail');
                                }}
                              />
                            </InputGroup>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </Table>
                <Footer>
                  <FollowUpContainer>
                    <Checkbox
                      key={`checkbox-survey-${localMaintenanceEvent.id}`}
                      checked={
                        localMaintenanceEvent.followUpNeeded === undefined
                          ? false
                          : localMaintenanceEvent.followUpNeeded
                      }
                      label={t('create_follow_up_service') as string}
                      labelWeight={500}
                      onChange={() => {
                        handleEventChange(!localMaintenanceEvent.followUpNeeded, 'followUpNeeded');
                      }}
                    />
                  </FollowUpContainer>
                  <ButtonContainer>
                    <Button
                      bgColor={theme.colors.primaryBlue4}
                      onClick={() => {
                        createSurvey({
                          maintenance_event_id: pmDetails.id,
                          issueType: DataScienceIssueType.NO_ISSUE
                        }).then(() => {
                          toast.success(t('false_positive_report'), {
                            toastId: 'survey-completed'
                          });
                          commitEventAndClose();
                        });
                      }}
                    >
                      {t('no_issue')}
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        createSurvey({
                          maintenance_event_id: pmDetails.id,
                          issueType: localDataScienceSurvey.issueType
                            ? localDataScienceSurvey.issueType
                            : DataScienceIssueType.NO_ISSUE,
                          detail: localDataScienceSurvey.detail
                        }).then(() => {
                          toast.success(t('issue_confirmed'), {
                            toastId: 'survey-completed'
                          });
                          commitEventAndClose();
                        });
                      }}
                      disabled={!isValid()}
                    >
                      {t('confirm_issue')}
                    </Button>
                  </ButtonContainer>
                </Footer>
              </>
            )}
          </Card.Body>
        ) : (
          <></>
        )}
      </Card>
      {localMaintenanceEvent.status != MaintenanceEventStatus.Completed && (
        <IgnoreAlertContainer>
          <Typography
            onClick={ignoreAlertHandler}
            mb={0}
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            size="0.8125rem"
            weight="medium"
          >
            {t('ignore_this_alert')}
          </Typography>
        </IgnoreAlertContainer>
      )}
    </Container>
  );
};

export default PredictiveMaintenanceEventCloseOutSurvey;
