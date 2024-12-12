// 3rd party
import React, { ReactElement, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

// Components
import { Button, Modal, Typography } from 'components';

interface UserPromptProps {
  visible: boolean;
  message: string;
  subMessage?: string;
  promptIcon?: IconDefinition;
  promptIconColor?: string;
  primaryActionLabel: string;
  primaryActionColor?: string;
  primaryActionBorderColor?: string;
  secondaryActionLabel: string;
  secondaryActionColor?: string;
  secondaryActionBorderColor?: string;
  handleCancel: () => void;
  handlePrimaryAction: () => void;
  handleSecondaryAction: () => void;
  timeoutAction?: 'primary-action' | 'secondary-action' | 'cancel';
}

const UserPromptContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.8125rem 2.5rem;
`;

const UserPromptMessageContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 2rem;
  align-items: center;
`;

const UserPromptMessageIcon = styled.div`
  font-size: 1.125rem;
  color: ${(props) => props.theme.colors.buttonPrimary};
  margin-right: 0.875rem;
`;

const UserPromptActions = styled.div`
  display: flex;
  justify-content: center;
`;

const UserPromptMessageContent = styled.div`
  & > * {
    margin-bottom: 0.5rem;
    padding-bottom: 0;
  }
`;

interface UserPromptAction {
  isPrimary?: boolean;
}

const UserPromptAction = styled.div<UserPromptAction>`
  width: ${(props) => (props.isPrimary ? '9.6875rem' : '6.4375rem')};
  height: 2.5rem;

  &:first-child {
    margin-right: 0.625rem;
  }
`;

const initialTimeout = parseInt(process.env.REACT_APP_LOGOUT_PROMPT_TIMEOUT_SECONDS || '60');

const UserPrompt = ({
  visible,
  message,
  subMessage,
  promptIcon,
  promptIconColor,
  primaryActionLabel,
  primaryActionColor,
  primaryActionBorderColor,
  secondaryActionLabel,
  secondaryActionColor,
  secondaryActionBorderColor,
  handleCancel,
  handlePrimaryAction,
  handleSecondaryAction,
  timeoutAction
}: UserPromptProps): ReactElement => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialTimeout);
  const theme = useTheme();
  // Use effect to handle the timeout countdown and action
  useEffect(() => {
    let secondInterval: NodeJS.Timeout;
    if (visible) {
      if (secondsLeft <= 0) {
        switch (timeoutAction) {
          case 'primary-action':
            handlePrimaryAction();
            return;
          case 'secondary-action':
            handleSecondaryAction();
            return;
          case 'cancel':
            handleCancel();
            return;
          default:
            return;
        }
      } else {
        // Set an interval to take a second off of the counter
        secondInterval = setInterval(() => {
          setSecondsLeft(secondsLeft - 1);
        }, 1000);
      }
    } // Clear intervals when the component is removed from the DOM
    return () => {
      if (secondInterval) {
        clearInterval(secondInterval);
      }
    };
  }, [visible, secondsLeft]);

  return (
    <Modal visible={visible} size="xsmall" showCloseButton={false} onClose={() => handleCancel}>
      <UserPromptContainer>
        <UserPromptMessageContainer>
          <UserPromptMessageIcon>
            <FontAwesomeIcon icon={promptIcon as IconDefinition} color={promptIconColor} />
          </UserPromptMessageIcon>
          <UserPromptMessageContent>
            <Typography variant="stepheading" color="greyfont">
              {message}
            </Typography>
            <Typography variant="stepheading" color={theme.colors.mediumGrey2}>
              {subMessage}{' '}
              {timeoutAction ? (
                <b>
                  <span style={{ color: theme.colors.darkGrey }}>{`${secondsLeft} seconds`}</span>
                </b>
              ) : (
                ''
              )}
            </Typography>
            <Typography variant="stepheading" as="span" color="greyfont"></Typography>
          </UserPromptMessageContent>
        </UserPromptMessageContainer>
        <UserPromptActions>
          <UserPromptAction>
            <Button
              variant="primary"
              bgColor={secondaryActionColor}
              borderColor={secondaryActionBorderColor}
              onClick={handleSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          </UserPromptAction>
          <UserPromptAction isPrimary>
            <Button
              variant="primary"
              bgColor={primaryActionColor}
              borderColor={primaryActionBorderColor}
              onClick={handlePrimaryAction}
            >
              {primaryActionLabel}
            </Button>
          </UserPromptAction>
        </UserPromptActions>
      </UserPromptContainer>
    </Modal>
  );
};

UserPrompt.defaultProps = {
  primaryActionColor: '#0A70FF',
  primaryActionBorderColor: '#0A70FF',
  secondaryActionColor: '#86A7B9',
  secondaryActionBorderColor: '#86A7B9',
  promptIcon: faSignOutAlt,
  promptIconColor: '#2F446C'
};

export default UserPrompt;
