import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

// Components
import { Button, Modal, UploadButton } from 'components';

// Types
import { ModalSize, ResourceType } from 'types';

// API
import { useUploadLineViewImageMutation } from 'api';

// Styling
const StyledContainer = styled.div`
  padding: 0rem 3rem 1rem;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface Props {
  isOpen: boolean;
  lineId: string;
  onCloseCallback: () => void;
}

const ImageUploadModal = ({ isOpen, lineId, onCloseCallback }: Props): JSX.Element => {
  const [uploadFile, setUploadFile] = useState<File | null>();

  const [uploadLineViewImage] = useUploadLineViewImageMutation();

  const uploadImage = async () => {
    if (!uploadFile) {
      console.error('No file to upload');
      return;
    }

    try {
      await uploadLineViewImage({
        assetType: ResourceType.LineImage,
        file: uploadFile,
        lineId: lineId
      }).unwrap();

      toast.success(`Line image uploaded successfully`);
    } catch (error) {
      toast.error(`Failed to upload line image`);
      console.error(error);
    } finally {
      onCloseCallback();
    }
  };

  return (
    <Modal
      onClose={onCloseCallback}
      size={ModalSize.XSMALL_AUTO_HEIGHT}
      title="Update Visual Overview"
      visible={isOpen}
    >
      <StyledContainer>
        <UploadButton
          errorMessages={{
            maxSize: 'File size is too large. File should be less than 50MB'
          }}
          label="Choose File"
          maxSize={50000000}
          onChangeFile={setUploadFile}
        />
        <StyledButtonContainer>
          <Button
            disabled={!uploadFile}
            onClick={() => uploadImage()}
            variant="primary"
            width="5.25rem"
          >
            Save
          </Button>
        </StyledButtonContainer>
      </StyledContainer>
    </Modal>
  );
};

export default ImageUploadModal;
