// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { Button, Modal, Typography } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

// Types
import {ModalSize} from 'types';

//styling
const ModalHeaderContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  width: 100%;
`;

const Title = styled.div`
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0rem;
  line-height: 1.3125rem;
`;

const ModalBody = styled.div`
  padding: 0 1rem 1rem 1.5rem;
`;

const ModalButtonsContainer = styled.div`
  float: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  button {
    margin: 1rem;
  }
`;

interface Props {
  errorCount: number;
  isVisible: boolean;
  onClose: () => void;
}

const MaintenanceSchedule = ({isVisible, onClose, errorCount}: Props): JSX.Element => {
  return (
    <Modal
      visible={isVisible}
      size={ModalSize.XSMALL_AUTO_HEIGHT}
      onClose={onClose}
      title={<ModalHeaderContainer>
        <FontAwesomeIcon icon={faExclamationCircle} />
        <Title>{errorCount} {errorCount === 1 ? 'Error' : 'Errors'} Outstanding</Title>
      </ModalHeaderContainer>}
    >
      <ModalBody>
        <Typography>
          Your progress has been saved. All errors will need to be addressed prior to completing oboarding for this machine.
        </Typography>
        <ModalButtonsContainer>
          <Button
            variant="primary"
            onClick={onClose}
          >
            Continue
          </Button>
        </ModalButtonsContainer>
      </ModalBody>
    </Modal>
  );
};

export default MaintenanceSchedule;
