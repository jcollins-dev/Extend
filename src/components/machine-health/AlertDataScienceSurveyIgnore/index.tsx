import React from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { Button, RadioButton, Typography } from 'components';
import { ButtonContainer, Footer } from 'components/MaintenanceEventDetail';
import { AlertDataScienceIgnoreReasons } from 'types/machine-health/alerts';

interface AlertDataScienceSurveyIgnoreProps {
  confirmable: boolean;
  selectedIgnoreReason?: AlertDataScienceIgnoreReasons;
  selectedIgnoreReasonDetail?: string;

  onConfirmClick: () => void;
  onIgnoredReasonChange: (reason: AlertDataScienceIgnoreReasons) => void;
  onIgnoredReasonDetailChange: (detail?: string) => void;
}

const Container = styled.div`
  padding: 1rem;
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

const AlertDataScienceSurveyIgnore = ({
  confirmable,
  selectedIgnoreReason,
  selectedIgnoreReasonDetail,
  onConfirmClick,
  onIgnoredReasonChange,
  onIgnoredReasonDetailChange
}: AlertDataScienceSurveyIgnoreProps): JSX.Element => {
  const handleSurveyChange = (value: AlertDataScienceIgnoreReasons) => {
    onIgnoredReasonChange(value);
  };

  const theme = useTheme();
  const { t } = useTranslation(['mh', 'common']);

  return (
    <>
      <Container>
        <Typography as="h3" mb={2} size="1.125rem" weight="bold">
          {t('why_ignore_this_alert')}
        </Typography>
        <Typography mb={2} variant="helper">
          <RadioButton
            key={AlertDataScienceIgnoreReasons.TOO_MANY}
            checked={selectedIgnoreReason === AlertDataScienceIgnoreReasons.TOO_MANY}
            label={t('too_many_alert_notifications') as string}
            labelWeight={400}
            onChange={() => {
              handleSurveyChange(AlertDataScienceIgnoreReasons.TOO_MANY);
            }}
          />
        </Typography>
        <Typography mb={2} variant="helper">
          <RadioButton
            key={AlertDataScienceIgnoreReasons.NOT_USEFUL}
            checked={selectedIgnoreReason === AlertDataScienceIgnoreReasons.NOT_USEFUL}
            label={t('alert_notifications_not_useful') as string}
            labelWeight={400}
            onChange={() => handleSurveyChange(AlertDataScienceIgnoreReasons.NOT_USEFUL)}
          />
        </Typography>
        <Typography mb={2} variant="helper">
          <RadioButton
            key={AlertDataScienceIgnoreReasons.OTHER}
            checked={selectedIgnoreReason === AlertDataScienceIgnoreReasons.OTHER}
            label={t('other', { ns: 'common' }) as string}
            labelWeight={400}
            onChange={() => handleSurveyChange(AlertDataScienceIgnoreReasons.OTHER)}
          />
          {selectedIgnoreReason == AlertDataScienceIgnoreReasons.OTHER && (
            <StyledTextarea
              rows={8}
              value={selectedIgnoreReasonDetail}
              placeholder={t('please_provide_details', { ns: 'common' }) as string}
              onChange={(event) => onIgnoredReasonDetailChange(event.target.value as string)}
            />
          )}
        </Typography>
      </Container>
      <Footer bgColor={theme.colors.white}>
        <ButtonContainer>
          <Button variant="primary" onClick={onConfirmClick} disabled={!confirmable}>
            {t('confirm', { ns: 'common' })}
          </Button>
        </ButtonContainer>
      </Footer>
    </>
  );
};

export default AlertDataScienceSurveyIgnore;
