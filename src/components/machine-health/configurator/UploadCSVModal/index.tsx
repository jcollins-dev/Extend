// Third Party
import React, { ReactNode, useState } from 'react';
import styled from 'styled-components';

// Components
import { Button, Typography, Modal, FileDropArea } from 'components';

// Types
import { ModalSize } from 'types';

const UploadCSVModalContainer = styled.div`
  padding: 1.3125rem;
`;

const UploadCSVModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 0.625rem;
  margin-top: 1.5625rem;
`;

interface UploadCSVModalProps {
  cancelLabel: string;
  description: ReactNode;
  setVisible: (v: boolean) => void;
  title: string;
  uploadCallback: (currentFile: File | null) => void;
  uploadLabel: string;
  visible: boolean;
}

const UploadCSVModal = ({
  cancelLabel,
  description,
  setVisible,
  title,
  uploadCallback,
  uploadLabel,
  visible
}: UploadCSVModalProps): JSX.Element => {
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  return (
    <Modal size={ModalSize.SMALL} visible={visible} onClose={() => setVisible(false)}>
      <UploadCSVModalContainer>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="h4">{description}</Typography>
        <FileDropArea file={currentFile} onFileChange={setCurrentFile} />
        <UploadCSVModalFooter>
          <Button onClick={() => setVisible(false)}>{cancelLabel}</Button>
          <Button
            variant="primary"
            onClick={() => uploadCallback(currentFile)}
            disabled={currentFile === null}
          >
            {uploadLabel}
          </Button>
        </UploadCSVModalFooter>
      </UploadCSVModalContainer>
    </Modal>
  );
};

export default UploadCSVModal;
