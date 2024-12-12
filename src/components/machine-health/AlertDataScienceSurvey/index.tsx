// 3rd party libs
import React, { useCallback, useReducer } from 'react';
import styled, { useTheme } from 'styled-components';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// Components
import { FlyoutHeader, Loader, Typography } from 'components';
import AlertDataScienceSurveyDetail from '../AlertDataScienceSurveyDetail';
import AlertDataScienceSurveyIgnore from '../AlertDataScienceSurveyIgnore';

// Types
import {
  AlertDataScienceSurveyOpenType,
  AlertDataScienceIssueType,
  AlertDataScienceIgnoreReasons
} from 'types/machine-health/alerts';

// Reducer
import { surveyReducer, initialSurveyState } from './surveyReducer';

// API
import { useCreateDataScienceAlertSurveyMutation, useGetDataScienceAlertDetailsQuery } from 'api';

type Props = {
  dataScienceAlertId: string;
  onClose: () => void;
};

// Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  outline: none;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
`;

const AlertDataScienceSurvey = ({ dataScienceAlertId, onClose }: Props): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh', 'common']);

  // API
  const { data, error, isLoading } = useGetDataScienceAlertDetailsQuery(dataScienceAlertId, {
    skip: !dataScienceAlertId
  });

  const [createSurvey] = useCreateDataScienceAlertSurveyMutation();

  // Form State
  const [
    {
      alertSurveyType,
      confirmable,
      selectedIssue,
      selectedIgnoreReason,
      selectedIgnoreReasonDetails,
      selectedDetails
    },
    dispatch
  ] = useReducer(surveyReducer, initialSurveyState);

  // Handlers
  const onBackClick = useCallback(() => dispatch({ type: 'SURVEY_DETAIL_NAVIGATE' }), []);
  const onIgnoreClick = useCallback(() => dispatch({ type: 'SURVEY_IGNORE_NAVIGATE' }), []);
  const onIssueSelect = useCallback(
    (issue: AlertDataScienceIssueType) => dispatch({ type: 'ADD_INSPECTION_ISSUE', issue }),
    []
  );
  const handleIgnoreReasonChange = useCallback(
    (ignoreReason: AlertDataScienceIgnoreReasons) =>
      dispatch({ type: 'ADD_IGNORE_REASON', ignoreReason }),
    []
  );
  const handleIgnoreReasonDetailChange = useCallback(
    (details?: string) => dispatch({ type: 'ADD_IGNORE_REASON_DETAILS', details }),
    []
  );

  const handleDetailChange = useCallback(
    (details?: string) => dispatch({ type: 'ADD_DETAILS', details }),
    []
  );

  // Confirm Issue Selection
  const onIssueSelectConfirm = () => {
    selectedIssue &&
      createSurvey({
        id: dataScienceAlertId,
        alertId: dataScienceAlertId,
        issueType: selectedIssue,
        detail: selectedDetails
      }).then(() => {
        toast.success(t('answer_recorded', { ns: 'common' }), { toastId: 'survey-completed' });
        onClose();
      });
  };

  // Confirm No Issue Selection
  const onNoIssueSelectConfirm = () => {
    createSurvey({
      id: dataScienceAlertId,
      alertId: dataScienceAlertId,
      issueType: AlertDataScienceIssueType.NoIssue,
      detail: selectedDetails
    }).then(() => {
      toast.success(t('answer_recorded', { ns: 'common' }), { toastId: 'survey-completed' });
      onClose();
    });
  };

  const onIgnoreSurveyConfirm = () => {
    createSurvey({
      id: dataScienceAlertId,
      alertId: dataScienceAlertId,

      // Not Selected by the user, but required by the API
      issueType: AlertDataScienceIssueType.Ignored,
      ignoreReason: selectedIgnoreReason,
      other:
        selectedIgnoreReason === AlertDataScienceIgnoreReasons.OTHER && selectedIgnoreReasonDetails
          ? selectedIgnoreReasonDetails
          : ''
    }).then(() => {
      toast.success(t('answer_recorded', { ns: 'common' }), { toastId: 'survey-completed' });
      onClose();
    });
  };

  return (
    <Container tabIndex={0}>
      <FlyoutHeader
        heading={t('alert_detail') as string}
        onClose={
          alertSurveyType === AlertDataScienceSurveyOpenType.IgnoreSurveyType ? undefined : onClose
        }
        onBack={
          alertSurveyType === AlertDataScienceSurveyOpenType.IgnoreSurveyType
            ? onBackClick
            : undefined
        }
        bgColor={theme.colors.lightGrey1}
      />
      <Body>
        {isLoading && <Loader size={40} />}
        {error && (
          <Typography color={theme.colors.darkRed}>{t('could_not_fetch_alert_details')}</Typography>
        )}
        {data && alertSurveyType === AlertDataScienceSurveyOpenType.DetailType && (
          <AlertDataScienceSurveyDetail
            onIssueSelectConfirm={onIssueSelectConfirm}
            onNoIssueSelectConfirm={onNoIssueSelectConfirm}
            onIssueSelect={onIssueSelect}
            onIgnoreClick={onIgnoreClick}
            selectedDetails={selectedDetails}
            onDetailsChange={handleDetailChange}
            confirmable={confirmable}
            selectedIssue={selectedIssue}
            alertDetail={data}
          />
        )}
        {alertSurveyType === AlertDataScienceSurveyOpenType.IgnoreSurveyType && (
          <AlertDataScienceSurveyIgnore
            confirmable={confirmable}
            selectedIgnoreReasonDetail={selectedIgnoreReasonDetails}
            onIgnoredReasonChange={handleIgnoreReasonChange}
            onIgnoredReasonDetailChange={handleIgnoreReasonDetailChange}
            selectedIgnoreReason={selectedIgnoreReason}
            onConfirmClick={onIgnoreSurveyConfirm}
          />
        )}
      </Body>
    </Container>
  );
};
export default AlertDataScienceSurvey;
