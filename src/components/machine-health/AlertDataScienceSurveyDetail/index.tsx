import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import AlertDetailCard from '../AlertDetailCard';
import AlertRecommendedActionCard from '../AlertRecommendedActionCard';
import AlertInspectionResultCard from '../AlertInspectionResultCard';

// Types
import { AlertDetail, AlertDataScienceIssueType } from 'types/machine-health/alerts';

const NavigationLink = styled.a`
  color: ${({ theme }) => theme.colors.text.darkgray};
  font-size: 0.8125rem;
  text-decoration: underline;
  cursor: pointer;
`;

interface AlertDataScienceSurveyDetailProps {
  alertDetail: AlertDetail;
  confirmable: boolean;
  selectedIssue?: AlertDataScienceIssueType;
  selectedDetails?: string;

  onIgnoreClick: () => void;
  onIssueSelect: (issue: AlertDataScienceIssueType) => void;
  onIssueSelectConfirm: () => void;
  onNoIssueSelectConfirm: () => void;
  onDetailsChange: (details: string) => void;
}

const AlertDataScienceSurveyDetail = ({
  onIgnoreClick,
  confirmable,
  selectedIssue,
  onIssueSelect,
  onIssueSelectConfirm,
  onNoIssueSelectConfirm,
  alertDetail,
  selectedDetails,
  onDetailsChange
}: AlertDataScienceSurveyDetailProps): JSX.Element => {
  const { description, subcomponent, criticality, id, detailedInstructions, alertType } =
    alertDetail;
  const { t } = useTranslation(['mh']);
  return (
    <>
      {alertDetail && (
        <AlertDetailCard
          isLoading={false}
          description={description}
          subcomponent={subcomponent}
          alertId={id}
          importance={criticality}
          alertType={alertType}
        />
      )}
      <AlertRecommendedActionCard detailedInstructions={detailedInstructions} />
      <AlertInspectionResultCard
        selectedIssue={selectedIssue}
        onIssueSelect={onIssueSelect}
        onIssueSelectConfirm={onIssueSelectConfirm}
        onNoIssueSelectConfirm={onNoIssueSelectConfirm}
        confirmable={confirmable}
        selectedDetails={selectedDetails}
        onDetailsChange={onDetailsChange}
      />
      <NavigationLink onClick={onIgnoreClick}>{t('ignore_this_alert')}</NavigationLink>
    </>
  );
};

export default AlertDataScienceSurveyDetail;
