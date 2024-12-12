// 3rd party libs
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useHistory, Prompt } from 'react-router-dom';

// Components
import AlertIcon from './AlertIcon';
import { Button, Modal, Typography } from 'components';

// Types
import { Location } from 'history';
import { ModalSize } from 'types';

// Styled Components
const StyledModalHeaderContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  width: 100%;
`;

const StyledButtonRow = styled.div`
  align-item: center;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 1.25rem;
`;

const StyledTitle = styled.div`
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0rem;
  line-height: 1.3125rem;
`;

const StyledContentContainer = styled.div`
  padding: 0 1.5rem 1.25rem;
  width: 100%;
`;

interface Props {
  helperText: string;
  isConfirmPrompt?: boolean;
  isVisible: boolean;
  onCancelCallback?: () => void;
  onConfirmCallback?: () => void;
  title: string;
}

const WarningPrompt = ({
  helperText,
  isConfirmPrompt,
  isVisible,
  onCancelCallback,
  onConfirmCallback,
  title
}: Props): JSX.Element => {
  const history = useHistory();
  const theme = useTheme();

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);

  useEffect(() => {
    isVisible && setIsConfirmed(false);
  }, [isVisible]);

  const handleBlocked = (nextLocation?: Location) => {
    if (!isConfirmed && isVisible) {
      setIsModalOpen(true);
      nextLocation && setLastLocation(nextLocation);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (isConfirmPrompt && isVisible) {
      handleBlocked();
    }
  }, [isConfirmPrompt, isVisible]);

  const handleConfirm = () => {
    setIsModalOpen(false);
    setIsConfirmed(true);
  };

  useEffect(() => {
    if (isConfirmed) {
      onConfirmCallback?.();
      lastLocation && history.push(lastLocation.pathname);
      setIsConfirmed(false);
    }
  }, [isConfirmed, lastLocation]);

  return (
    <>
      <Prompt message={handleBlocked} when={isVisible} />
      <Modal
        allowContentScroll
        onClose={() => {
          setIsModalOpen(false);
          onCancelCallback?.();
        }}
        showCloseButton={false}
        size={ModalSize.XSMALL}
        title={
          <StyledModalHeaderContainer>
            <AlertIcon />
            <StyledTitle>{title}</StyledTitle>
          </StyledModalHeaderContainer>
        }
        visible={isModalOpen}
      >
        <StyledContentContainer>
          <Typography color={theme.colors.mediumGrey3} variant="stepheading">
            {helperText}
          </Typography>
          <StyledButtonRow>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                onCancelCallback?.();
              }}
              width="auto"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant="danger" width="auto">
              Yes
            </Button>
          </StyledButtonRow>
        </StyledContentContainer>
      </Modal>
    </>
  );
};

export default WarningPrompt;
