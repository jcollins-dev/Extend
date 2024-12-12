// 3rd party libs
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Components
import { Button, Modal, Typography } from 'components';

// Types
import { ModalSize } from 'types';

//styling
const Container = styled.div`
  padding: 0 1.5rem 1.25rem;
  width: 100%;
`;

const ButtonContainer = styled.div`
  align-item: center;
  display: flex;
  gap: 0.2rem;
  justify-content: center;
  padding-top: 2.25rem;
`;

interface Props {
  open: boolean;
  cancelHandler: () => void;
  continueHandler: () => void;
  closeHandler: () => void;
}

const UnsavedChangesModal = ({
  open,
  cancelHandler,
  continueHandler,
  closeHandler
}: Props): ReactElement => {
  const [visible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(open);
  }, [open]);

  return (
    <Modal visible={visible} onClose={closeHandler} size={ModalSize.XSMALL}>
      <Container>
        <Typography variant="h4" mb={0}>
          <FontAwesomeIcon icon={faInfoCircle} /> Review Machine Tag Template List
        </Typography>
        <Typography variant="stepheading">
          Are you sure you wish to exit without saving changes?
        </Typography>
        <ButtonContainer>
          <Button width="auto" variant="link" size="small" onClick={cancelHandler}>
            Cancel
          </Button>
          <Button width="auto" variant="primary" size="small" onClick={continueHandler}>
            Continue
          </Button>
        </ButtonContainer>
      </Container>
    </Modal>
  );
};

export default UnsavedChangesModal;
