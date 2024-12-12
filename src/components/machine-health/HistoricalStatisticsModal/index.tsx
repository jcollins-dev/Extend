// 3rd party libs
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

// Components
import { Button, Modal, Typography } from 'components';

// Types
import { ModalSize } from 'types';

// Styling
const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.2rem 2rem 2rem;
`;

const StyledRow = styled.div<{ justify?: string; padding?: string }>`
  align-items: center;
  display: flex;
  justify-content: ${({ justify }) => justify || 'auto'};
  padding: ${({ padding }) => padding || '0'};
`;

const StyledWarningRow = styled(StyledRow)<{ type: 'info' | 'error' }>`
  background-color: ${({ theme, type }) =>
    type === 'info' ? theme.colors.atRiskYellow4 : theme.colors.negativeRed4};
  border-radius: 0.5rem;
  border: 0.0625rem solid
    ${({ theme, type }) =>
      type === 'info' ? theme.colors.atRiskYellow3 : theme.colors.negativeRed3};
  padding: 1rem;
  width: fit-content;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const StyledTypographyWrapper = styled.div`
  padding-left: 1rem;
`;

interface Props {
  isOpen: boolean;
  messages: {
    message: string;
    type: 'error' | 'info';
  }[];
  onCloseCallback: () => void;
  onDownloadCallback: () => void;
}

const HistoricalStatisticsModal = ({
  isOpen,
  messages,
  onCloseCallback,
  onDownloadCallback
}: Props): JSX.Element => {
  const theme = useTheme();

  const hasErrors = messages.some(({ type }) => type === 'error');
  const { t } = useTranslation(['mh', 'common']);

  return (
    <Modal
      hasDropdowns
      maxWidth="32rem"
      onClose={onCloseCallback}
      showCloseButton
      size={ModalSize.SMALL_AUTO_HEIGHT}
      title=""
      visible={isOpen}
    >
      <StyledContainer>
        <Typography variant="h3">{t('download_historical_statistics')}</Typography>

        {/* Warning */}
        {messages.map(({ message, type }) => {
          const color = type === 'info' ? theme.colors.atRiskYellow : theme.colors.negativeRed;
          return (
            <StyledWarningRow key={message} type={type}>
              <FontAwesomeIcon icon={faInfoCircle} color={color} />
              <StyledTypographyWrapper>
                <Typography color={color} mb={0} variant="body2">
                  {message}
                </Typography>
              </StyledTypographyWrapper>
            </StyledWarningRow>
          );
        })}

        {/* Buttons */}
        <StyledRow justify="flex-end">
          <StyledButtonContainer>
            <Button onClick={onCloseCallback} width="fit-content">
              {t('cancel', { ns: 'common' })}
            </Button>
            {!hasErrors && (
              <Button onClick={() => onDownloadCallback()} variant="primary" width="fit-content">
                {t('download', { ns: 'common' })}
              </Button>
            )}
          </StyledButtonContainer>
        </StyledRow>
      </StyledContainer>
    </Modal>
  );
};

export default HistoricalStatisticsModal;
