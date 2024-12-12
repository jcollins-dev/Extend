// 3rd party libs
import React, { ReactElement } from 'react';
import { Button } from 'components';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin: 1rem 0;
  padding: 0 1rem;
`;

interface Props {
  onSave: () => void;
  onClose: () => void;
  onDelete?: () => void;
  isSaveValid: boolean;
  isActiveUserPromptMode: boolean;
}

const UserManagementModalFooter = ({
  onSave,
  onClose,
  onDelete,
  isSaveValid,
  isActiveUserPromptMode
}: Props): ReactElement => {
  return (
    <ButtonContainer>
      {onDelete && (
        <Button variant="danger" onClick={onDelete} disabled={isActiveUserPromptMode}>
          Delete
        </Button>
      )}
      <Button variant="secondary" onClick={onClose} disabled={isActiveUserPromptMode}>
        Cancel
      </Button>
      <Button disabled={!isSaveValid || isActiveUserPromptMode} variant="primary" onClick={onSave}>
        Save Changes
      </Button>
    </ButtonContainer>
  );
};

export default UserManagementModalFooter;
