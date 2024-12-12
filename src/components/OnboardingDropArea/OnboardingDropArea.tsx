import React, { useCallback } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { faFile, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { DefaultTheme, useTheme } from 'styled-components';
import { Loader, Typography } from 'components';

interface DropAreaProps {
  isDragAccept: boolean;
  theme: DefaultTheme;
}

const DropArea = styled.div<DropAreaProps>`
  width: 100%;
  border: dashed;
  border-width: 0.0625rem;
  border-radius: 0.5rem;
  padding: 0.5rem;

  background-color: ${(props) => (props.isDragAccept ? 'rgba(200, 120, 204, 0.1)' : 'transparent')};
  border-color: ${(props) =>
    props.isDragAccept ? 'rgba(200, 120, 204, 0.5)' : props.theme.colors.mediumGrey2};
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
  background: none;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.colors.mediumBlue};
  cursor: pointer;
`;

const FileArea = styled.div`
  display: flex;
  width: 100%;
  margin-top: 0.625rem;
  background-color: ${({ theme }) => theme.colors.lightGrey2};
  padding: 0.5rem;
  text-align: left;
  flex-direction: row;
  column-gap: 0.625rem;
`;

const Spacer = styled.div`
  flex-grow: 1;
  height: 100%;
`;

const ProcessingContainer = styled.div`
  width: 100%;
  height: auto;
`;

const LoaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;

  div {
    width: 2.5rem;
    height: 2.5rem;
    margin: 0;
    margin-bottom: 0.75rem;
  }

  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const ProcessingLabel = styled.div`
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.125rem;
  margin-bottom: 0;
`;

interface OnboardingDropAreaProps {
  acceptedTypes: Accept;
  file?: File;
  onFileChange: (file?: File) => void;
  icon: IconDefinition;
  isUploading?: boolean;
}

export default function OnboardingDropArea({
  acceptedTypes,
  file,
  onFileChange,
  icon,
  isUploading
}: OnboardingDropAreaProps): JSX.Element {
  const theme = useTheme();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileChange(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, open, isDragAccept } = useDropzone({
    onDrop: onDrop,
    noClick: true,
    accept: acceptedTypes,
    maxFiles: 1
  });

  return (
    <VContainer>
      {isUploading ? (
        <ProcessingContainer>
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
          <ProcessingLabel>Processing...</ProcessingLabel>
        </ProcessingContainer>
      ) : file ? (
        <FileArea>
          <FontAwesomeIcon color={theme.colors.darkGrey} icon={faFile} />
          <Typography as="span" variant="stepheading">
            {file.name}
          </Typography>
          <Spacer />
          <Typography variant="stepheading">
            <InlineLink onClick={() => onFileChange(undefined)}>Remove</InlineLink>
          </Typography>
        </FileArea>
      ) : (
        <DropArea {...getRootProps()} isDragAccept={isDragAccept} theme={theme}>
          <input {...getInputProps()} />
          <VContainer>
            <CloudIcon>
              <FontAwesomeIcon color={theme.colors.darkGrey} icon={icon} size="lg" />
            </CloudIcon>
            <Typography variant="body1">
              <InlineLink onClick={open}>Click to upload</InlineLink> or drag and drop
            </Typography>
          </VContainer>
        </DropArea>
      )}
    </VContainer>
  );
}
