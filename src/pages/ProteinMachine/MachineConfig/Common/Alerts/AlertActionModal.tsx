// 3rd party libs
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { Button, Loader, Modal, Switch, Typography } from 'components';

// Types
import { ModalSize } from 'types';
import { AlertConfig } from 'types/machine-health/alerts';

// Styles
const StyledModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 3rem 1.5rem;
  font-size: 0.875rem;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

interface Props {
  alert: AlertConfig | null;
  helperText?: string;
  isDeleting?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value?: boolean) => void;
  showToggle?: boolean;
  title: string;
}

/**
 * This component is used to enable/disable alerts and delete alerts.
 * It displays a modal with a title, helper text and buttons.
 * @param alert - the alert to be deleted or toggled
 * @param helperText - optional, helper text to be displayed in the modal
 * @param isDeleting - whether the alert is being deleted or not
 * @param isOpen - whether the modal is open or not
 * @param onClose - function to be called when the modal is closed
 * @param onConfirm - function to be called when the modal is confirmed
 * @param showToggle - optional, whether to show a toggle switch or not, also controls the action button text and color
 * @param title - title of the modal
 */

const AlertActionModal = ({
  alert,
  helperText,
  isDeleting,
  isOpen,
  onClose,
  onConfirm,
  showToggle,
  title
}: Props): JSX.Element => {
  const [isActive, setIsActive] = useState(!!alert?.active);
  const { t } = useTranslation(['mh', 'common']);

  useEffect(() => {
    setIsActive(!!alert?.active);
  }, [alert]);

  const theme = useTheme();
  return (
    <Modal
      title={title}
      visible={isOpen}
      size={ModalSize.XSMALL_AUTO_HEIGHT}
      showCloseButton
      onClose={onClose}
    >
      <StyledModalContentWrapper>
        <Typography color={theme.colors.darkGrey2} variant="body2" mb={0}>
          {helperText}
        </Typography>
        {showToggle && (
          <Switch
            checked={isActive}
            handleDiameter={22}
            height={14}
            onChange={() => setIsActive((prev) => !prev)}
            width={40}
            offColor={theme.colors.mediumGrey2}
            offHandleColor={theme.colors.mediumGrey3}
          />
        )}
        <StyledButtonContainer>
          <Button onClick={onClose} width="fit-content">
            {t('cancel', { ns: 'common' })}
          </Button>
          {showToggle && (
            <Button onClick={() => onConfirm(isActive)} variant="primary" width="fit-content">
              {t('save', { ns: 'common' })}
            </Button>
          )}
          {!showToggle && (
            <Button onClick={() => onConfirm()} variant="danger" width="fit-content">
              {isDeleting ? <Loader size={12} margin={0} /> : t('delete', { ns: 'common' })}
            </Button>
          )}
        </StyledButtonContainer>
      </StyledModalContentWrapper>
    </Modal>
  );
};

export default AlertActionModal;
