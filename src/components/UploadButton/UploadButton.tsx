import React, { ChangeEvent, ReactElement, useRef, useState } from 'react';
import ActionButton from 'components/ActionButton';
import Typography from 'components/Typography/Typography';
import styled from 'styled-components';
import theme from 'themes';

const UploadActionButton = styled(ActionButton)`
  width: 10rem;
`;

const ContainerActionButton = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const FileNameType = styled(Typography)`
  margin-left: 0.5rem;
  font-size: 0.8125rem;
`.withComponent('span');

const UploadInput = styled.input`
  width: 0;
  height: 0;
  position: absolute;
`;

type UploadButtonProps = {
  label?: string;
  maxSize?: number;
  errorMessages?: {
    maxSize?: string;
  };
  supportedExtensions?: string;
  onChangeFile?: (file: File) => void;
};

const UploadButton = ({
  supportedExtensions = '.png,.jpg,.gif',
  errorMessages,
  // TODO: define max size for file
  maxSize = 2000000,
  label = 'Choose File',
  onChangeFile
}: UploadButtonProps): ReactElement => {
  const inputButtonRef = useRef<HTMLInputElement | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onClickUploadButton = () => {
    if (!inputButtonRef.current) return;
    inputButtonRef.current.click();
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);

    if (!event.target.files) return;

    if (event.target.files[0].size > maxSize) {
      setUploadError(errorMessages?.maxSize ?? 'File size is too large.');
      setUploadFile(null);
      if (inputButtonRef && inputButtonRef.current) inputButtonRef.current.value = '';
      return;
    }

    onChangeFile?.(event.target.files[0]);
    setUploadFile(event.target.files[0]);
  };

  return (
    <>
      <ContainerActionButton>
        <UploadInput
          onChange={onChange}
          accept={supportedExtensions}
          ref={inputButtonRef}
          type="file"
        />
        <UploadActionButton onClick={onClickUploadButton}>{label}</UploadActionButton>
        {uploadFile && <FileNameType color={theme.colors.darkGrey}>{uploadFile.name}</FileNameType>}
      </ContainerActionButton>
      {uploadError && (
        <Typography size="0.8125rem" weight="bold" mb={0} color={theme.colors.negativeRed}>
          {uploadError}
        </Typography>
      )}
    </>
  );
};

export default UploadButton;
