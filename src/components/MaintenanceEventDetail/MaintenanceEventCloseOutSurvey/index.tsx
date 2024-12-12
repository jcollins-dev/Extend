import React, { ReactElement, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { noop } from 'lodash';
import { useTranslation } from 'react-i18next';

// Components
import { BaseSelect, Button, Checkbox, Indicator, Input, Typography } from 'components';
import { ButtonContainer, DayPickerContainer, Footer, Table } from '..';

// Types
import { ChangeEvent } from 'types';
import {
  MaintenanceEvent,
  MaintenanceEventStatus,
  MaintenanceFrequencyType,
  MaintenanceTaskType
} from 'types/maintenance';
import { markTaskCompleteOrIncompleteByType, pmFormatDate, standardFormatDate } from 'helpers';
import { useGetMachinesCurrentRunMetricQuery, useUpdateMaintenanceEventsMutation } from 'api';
import { toast } from 'react-toastify';
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import { AnalyticsCategories, MaintenanceAnalyticEventActions } from 'constants/analytics';
import { generateAnalyticsEvent } from 'helpers/analytics';
import { skipToken } from '@reduxjs/toolkit/dist/query';

interface MaintenanceEventCloseOutSurveyProps {
  maintenanceEvent: MaintenanceEvent;
  surveyCompletedAsPlanned: boolean;
  onSubmitClick: (event?: MaintenanceEvent) => void;
  machineDescription: string | undefined;
}

type propNames =
  | 'owner'
  | 'completion'
  | 'completionCycleCount'
  | 'duration'
  | 'comments'
  | 'followUpNeeded';

const cycleCountOptions = [
  '5 min',
  '10 min',
  '15 min',
  '30 min',
  '45 min',
  '60 min',
  '90 min',
  '90+ min'
];

// Styling
const Container = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.lightGrey1};
  flex: 1;
  position: relative;
`;

const InputGroup = styled.div`
  margin-top: 2rem;
  margin-bottom: 0.75rem;
`;

const Label = styled.label`
  display: block;
  color: #5d6a86;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1rem;
  margin-bottom: 0.25rem;
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
  margin-left: 1rem;
`;

function isCloseOutSurveyValid(event: MaintenanceEvent): boolean {
  // events with day-based frequency type only need a completion date, cycle based events need both
  // a completion date and cycle count

  //TODO: How to handle for SIP and Run Hours?
  if (event.frequencyType === MaintenanceFrequencyType.Cycles && !event.completionCycleCount) {
    return false;
  }
  return Boolean(event.completion && event.owner && event.duration);
}

const MaintenanceEventCloseOutSurvey = ({
  maintenanceEvent,
  surveyCompletedAsPlanned,
  onSubmitClick,
  machineDescription
}: MaintenanceEventCloseOutSurveyProps): ReactElement => {
  const theme = useTheme();
  const { t } = useTranslation(['fpns']);
  const [updateMaintenanceEvent] = useUpdateMaintenanceEventsMutation();
  const indicatorColor = surveyCompletedAsPlanned
    ? theme.colors.onTrackGreen
    : theme.colors.negativeRed;
  const indicatorText = surveyCompletedAsPlanned
    ? t('completed_as_planned')
    : t('not_completed_as_planned');
  const [localMaintenanceEvent, setLocalMaintenanceEvent] =
    useStateWithCallbackLazy<MaintenanceEvent>(maintenanceEvent);
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);
  const [closedRunMetric, setClosedRunMetric] = useState<string>();

  const { data: machineCurrentRunMetric, isFetching } = useGetMachinesCurrentRunMetricQuery(
    maintenanceEvent.machineId
      ? {
          machineUuids: [maintenanceEvent.machineId]
        }
      : skipToken
  );

  useEffect(() => {
    setClosedRunMetric(
      machineCurrentRunMetric?.length == 1 &&
        machineCurrentRunMetric[0].runMetricValue &&
        machineCurrentRunMetric[0].runMetricLabel
        ? `${
            machineCurrentRunMetric[0].runMetricValue
          } ${machineCurrentRunMetric[0].runMetricLabel.replaceAll('_', ' ')}`
        : ''
    );
  }, [machineCurrentRunMetric]);

  const copyPMInfo = (
    baseEvent: MaintenanceEvent,
    propName: string,
    value: string | number | Date | boolean | MaintenanceEventStatus
  ) => {
    const updatedEvent = { ...baseEvent, [propName]: value } as MaintenanceEvent;
    setLocalMaintenanceEvent(updatedEvent, noop);
  };

  const handleChange = (value: string | Date | number | boolean, propName: propNames) => {
    copyPMInfo(localMaintenanceEvent, propName, value);
  };

  const handleDayChange = (selectedDay: Date) => {
    copyPMInfo(localMaintenanceEvent, 'completion', standardFormatDate(selectedDay));
  };

  useEffect(() => {
    // has to be done this way to make sure that state changes were consumed by React before submission
    if (isCloseOutSurveyValid(localMaintenanceEvent) && shouldSubmit) {
      const sendEvent = { ...localMaintenanceEvent, ['status']: MaintenanceEventStatus.Completed };
      updateMaintenanceEvent([sendEvent]).then(() => {
        toast.success(`${machineDescription} marked resolved!`, {
          toastId: 'marked-resolved'
        });
        generateAnalyticsEvent({
          category: AnalyticsCategories.MAINTENANCE,
          action: MaintenanceAnalyticEventActions.MAINTENANCE_EVENT_COMPLETED,
          label: maintenanceEvent?.id
        });
        onSubmitClick(sendEvent);
      });
      setShouldSubmit(false);
    }
  });

  return (
    <Container>
      <Typography as="h3" mb={2} size="1.125rem" weight="bold">
        {localMaintenanceEvent.description}
      </Typography>
      <Indicator style={{ marginLeft: 0 }} color={indicatorColor}>
        {indicatorText}
      </Indicator>
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
                value={localMaintenanceEvent.owner}
                onChange={(event: ChangeEvent) => {
                  handleChange(event.target.value as string, 'owner');
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <Typography as="span" size="0.75rem">
                {t('completion_date')}:
              </Typography>
            </td>
            <td>
              <DayPickerContainer>
                <DayPickerInput
                  value={localMaintenanceEvent.completion as Date}
                  formatDate={pmFormatDate}
                  placeholder={t('select_completion_date') as string}
                  onDayChange={handleDayChange}
                  dayPickerProps={{
                    disabledDays: {
                      after: new Date()
                    }
                  }}
                  inputProps={{
                    title: t('select_completion_date') as string,
                    readonly: 'readonly'
                  }}
                />
              </DayPickerContainer>
            </td>
          </tr>
          {localMaintenanceEvent.frequencyType === MaintenanceFrequencyType.Cycles && (
            <tr>
              <td>
                <Typography as="span" size="0.75rem">
                  {t('completion_cycle_count')}:
                </Typography>
              </td>
              <td>
                <Input
                  type="number"
                  id="completionCycleCount"
                  variant="white-dark"
                  value={localMaintenanceEvent.cycleCount}
                  onChange={(event: ChangeEvent) => {
                    handleChange(Number.parseInt(event.target.value), 'completionCycleCount');
                  }}
                />
              </td>
            </tr>
          )}
          <tr>
            <td>
              <Typography as="span" size="0.75rem">
                {t('duration')}:
              </Typography>
            </td>
            <td>
              <BaseSelect
                variant={'white'}
                value={localMaintenanceEvent.duration as string}
                handleChange={(event): void => {
                  handleChange(event.target.value, 'duration');
                }}
                options={cycleCountOptions}
                placeholder={
                  localMaintenanceEvent.duration || (t('select_dot', { ns: 'common' }) as string)
                }
                id="duration"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: '0 0 6rem' }}>
              <InputGroup>
                <Label>
                  {surveyCompletedAsPlanned ? t('leave_comments_optional') : t('leave_comments')}
                </Label>
                <StyledTextarea
                  rows={8}
                  value={localMaintenanceEvent.comments}
                  placeholder={!surveyCompletedAsPlanned ? (t('what_went_wrong') as string) : ''}
                  onChange={(event) => {
                    handleChange(event.target.value as string, 'comments');
                  }}
                />
              </InputGroup>
            </td>
          </tr>
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
              handleChange(!localMaintenanceEvent.followUpNeeded, 'followUpNeeded');
            }}
          />
        </FollowUpContainer>
        <ButtonContainer>
          <Button
            variant="primary"
            onClick={() => {
              setLocalMaintenanceEvent(
                {
                  ...markTaskCompleteOrIncompleteByType(
                    MaintenanceTaskType.Complete,
                    localMaintenanceEvent
                  ),
                  closedRunMetric,
                  completedAsPlanned: surveyCompletedAsPlanned
                },
                () => {
                  // ensure all state updates are finished before submission
                  setShouldSubmit(true);
                }
              );
            }}
            disabled={!isCloseOutSurveyValid(localMaintenanceEvent) && !isFetching}
          >
            {t('submit_and_mark_complete')}
          </Button>
        </ButtonContainer>
      </Footer>
    </Container>
  );
};

export default MaintenanceEventCloseOutSurvey;
