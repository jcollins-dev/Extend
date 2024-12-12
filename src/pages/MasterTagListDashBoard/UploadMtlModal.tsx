// 3rd party
import React, { ReactElement, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { toast } from 'react-toastify';

// API
import { useGetMasterTagListTemplateQuery, useValidateMasterTagListImportMutation } from 'api';

// Icons
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';

// Types
import { DigitalEdgeType } from 'types';
import {
  MtlAttrDsdmWithError,
  MtlAttrKdmWithError,
  MtlAttrMqttWithError
} from 'types/machine-management';
import { APIError } from 'types/errors';

// Components
import { Button, Modal, OnboardingDropArea } from 'components';
import { useTranslation } from 'react-i18next';

const UploadMtlContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 1.5rem;
`;

const UploadMtlHeading = styled.div`
  font-size: 1rem;
  line-height: 1.1875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray900};
  margin-bottom: 0.8125rem;
`;

const UploadMtlMessageContainer = styled.div`
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.125rem;
  margin-bottom: 0.8125rem;
  color: ${({ theme }) => theme.colors.darkGrey};

  a {
    color: ${({ theme }) => theme.colors.mediumBlue};
  }
`;

const UploadMtlMessageLastContainer = styled(UploadMtlMessageContainer)`
  margin-bottom: 1.25rem;
`;

const UploadContainer = styled.div`
  margin-bottom: 2rem;
`;

const ActionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Action = styled.div`
  width: calc(50% - 0.625rem);
  height: 2.5rem;
`;

interface UploadMtlModalProps {
  visible: boolean;
  edgeType?: DigitalEdgeType;
  handleClose: () => void;
  handleImportSuccess: (
    mtlData: MtlAttrDsdmWithError[] | MtlAttrKdmWithError[] | MtlAttrMqttWithError[]
  ) => void;
}

const UploadMtlModal = ({
  visible,
  edgeType,
  handleClose,
  handleImportSuccess
}: UploadMtlModalProps): ReactElement => {
  const theme = useTheme();
  const { t } = useTranslation(['mh']);
  const [file, setFile] = useState<File>();
  const { data: masterTagListTemplateUrl } = useGetMasterTagListTemplateQuery(
    edgeType ? edgeType : skipToken
  );
  const [validateMtlUpload, { isLoading: validatingUpload }] =
    useValidateMasterTagListImportMutation();

  // In case the digital edge type is unset by the parent
  const templateUrl = edgeType && masterTagListTemplateUrl ? masterTagListTemplateUrl : undefined;

  const handleCloseIntercept = () => {
    setFile(undefined);
    handleClose();
  };

  const handleUpload = async () => {
    try {
      if (file && edgeType) {
        const validatedRows = await validateMtlUpload({
          digitalEdgeType: edgeType,
          file: file,
          skipHeader: true
        }).unwrap();

        if (validatedRows) {
          handleImportSuccess(validatedRows);
        } else {
          toast.warning(
            'Unable to validate the uploaded Tag Template List. Please try again later.'
          );
        }

        handleCloseIntercept();
      } else {
        toast.warning(
          'No Tag Template List provided. Please select or drag-and-drop a file to upload.'
        );
      }
    } catch (error: unknown) {
      const validationError: APIError = error as APIError;
      toast.error(
        `Tag Template list import failed${
          validationError.data && validationError.data.detail
            ? `: ${validationError.data.detail}`
            : '.'
        }`
      );
      console.error(error);
    }
  };

  return (
    <Modal
      visible={visible}
      size="xsmall_auto_height"
      widthOverride="30rem"
      showCloseButton={true}
      onClose={handleClose}
    >
      <UploadMtlContainer>
        <UploadMtlHeading>{t('upload_tag_template_list')}</UploadMtlHeading>
        <UploadMtlMessageContainer>
          First, download a <a href={templateUrl || ''}>XLS demo template file</a> and fill it out
          completely. Instructions are contained in the first sheet of the XLS template file.
        </UploadMtlMessageContainer>
        <UploadMtlMessageLastContainer>
          Once you have successfully completed the template, drag the file to the dropzone below and
          click upload. After the upload finishes, the tags will be presented for you to review.
        </UploadMtlMessageLastContainer>
        <UploadContainer>
          <OnboardingDropArea
            file={file}
            icon={faFileExcel}
            acceptedTypes={{
              'application/vnd.ms-excel': ['.xls', '.xlsx', '.xlsm']
            }}
            onFileChange={(file) => setFile(file)}
            isUploading={validatingUpload}
          />
        </UploadContainer>
        <ActionsContainer>
          <Action>
            <Button bgColor={theme.colors.primaryBlue4} onClick={handleCloseIntercept}>
              Cancel
            </Button>
          </Action>
          <Action>
            <Button
              variant="primary"
              disabled={!file}
              bgColor={theme.colors.mediumBlue}
              onClick={handleUpload}
            >
              Upload
            </Button>
          </Action>
        </ActionsContainer>
      </UploadMtlContainer>
    </Modal>
  );
};

export default UploadMtlModal;
