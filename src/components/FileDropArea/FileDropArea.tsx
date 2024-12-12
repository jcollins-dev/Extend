import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { faCloudArrowUp, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { useTheme } from 'styled-components';
import { Typography } from 'components';

interface DropAreaProps {
  isDragAccept: boolean;
}

const DropArea = styled.div<DropAreaProps>`
  width: 100%;
  border: solid;
  border-width: 0.0625rem;
  border-radius: 0.5rem;
  padding: 0.5rem;

  background-color: ${(props) => (props.isDragAccept ? 'rgba(200, 120, 204, 0.1)' : 'transparent')};
  border-color: ${(props) => (props.isDragAccept ? 'rgba(200, 120, 204, 0.5)' : '#a3a3a3')};
`;

const VContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CloudIcon = styled.div`
  margin-bottom: 0.625rem;
  margin-top: 0.5rem;
`;

const InlineLink = styled.button`
  background: none !important;
  border: none;
  padding: 0 !important;
  color: ${({ theme }) => theme.colors.mediumBlue};
  cursor: pointer;
`;

const FileArea = styled.div`
  display: flex;
  width: 100%;
  margin-top: 0.625rem;
  background-color: #e5e5e5;
  padding: 0.5rem;
  text-align: left;
  flex-direction: row;
  column-gap: 0.625rem;
`;

const Spacer = styled.div`
  flex-grow: 1;
  height: 100%;
`;

interface FileDropAreaProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileDropArea({ file, onFileChange }: FileDropAreaProps): JSX.Element {
  const theme = useTheme();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileChange(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, open, isDragAccept } = useDropzone({
    onDrop: onDrop,
    noClick: true,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <VContainer>
      {file ? (
        <FileArea>
          <FontAwesomeIcon color={theme.colors.darkGrey} icon={faFile} />
          <Typography as="span" variant="stepheading">
            {file.name}
          </Typography>
          <Spacer />
          <Typography variant="stepheading">
            <InlineLink onClick={() => onFileChange(null)}>Remove</InlineLink>
          </Typography>
        </FileArea>
      ) : (
        <DropArea {...getRootProps()} isDragAccept={isDragAccept}>
          <input {...getInputProps()} />
          <VContainer>
            <CloudIcon>
              <FontAwesomeIcon color={theme.colors.darkGrey} icon={faCloudArrowUp} size="lg" />
            </CloudIcon>
            <Typography variant="body1">
              <InlineLink onClick={open}>Click to upload</InlineLink> or drag and drop
            </Typography>
            <Typography variant="body1">CSV</Typography>
          </VContainer>
        </DropArea>
      )}
    </VContainer>
  );
}
