// 3rd party
import React, { ReactElement, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { toast } from 'react-toastify';

// API
import { useGetMachineTagListTemplateQuery, useImportMachineTagListExcelMutation } from 'api';

// Icons
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';

// Types
import { DigitalEdgeType } from 'types';
import { MachineTagListAttributeDSDM, MachineTagListAttributeKDM } from 'types/machine-management';

// Components
import { Button, Modal, OnboardingDropArea } from 'components';

const ImportMachineTagListContainer = styled.div`
  width: 100%;
  height: auto;
  padding: 1.5rem;
`;

const ImportMachineTagListHeading = styled.div`
  font-size: 1rem;
  line-height: 1.1875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.gray900};
  margin-bottom: 0.8125rem;
`;

const ImportMachineTagListMessageContainer = styled.div`
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.125rem;
  margin-bottom: 0.8125rem;
  color: ${({ theme }) => theme.colors.darkGrey};

  a {
    color: ${({ theme }) => theme.colors.mediumBlue};
  }
`;

const ImportMachineTagListMessageLastContainer = styled(ImportMachineTagListMessageContainer)`
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

interface ImportMachineTagListModalProps {
  visible: boolean;
  edgeType?: DigitalEdgeType;
  machineId: string;
  data?: MachineTagListAttributeKDM | MachineTagListAttributeDSDM;
  handleClose: () => void;
  handleSuccessfulImport: () => void;
}

const ImportMachineTagListModal = ({
  visible,
  edgeType,
  machineId,
  data,
  handleClose,
  handleSuccessfulImport
}: ImportMachineTagListModalProps): ReactElement => {
  const theme = useTheme();
  const [file, setFile] = useState<File>();
  const toastId = useRef<React.ReactText>("")
  const { data: machineTagListTemplateUrl } = useGetMachineTagListTemplateQuery(
    edgeType ? edgeType : skipToken
  );
  const [importMachineTagList, { isLoading: importingMachineTagList }] =
    useImportMachineTagListExcelMutation();

  // In case the digital edge type is unset by the parent
  const templateUrl = edgeType && machineTagListTemplateUrl ? machineTagListTemplateUrl : undefined;

  const handleCloseIntercept = () => {
    setFile(undefined);
    handleClose();
  };

  const handleUpload = async () => {
    try {
      toastId.current = toast.loading(`Machine tag list upload in progress...`)
      if (file && edgeType) {
        importMachineTagList({
          machineId: machineId,
          file: file as File,
          digitalEdgeType: edgeType,
          ...data
        })
          .unwrap()
          .then(() => {
            toast.update(toastId.current, {
              render: `Tag list is imported successfully.`,
              type: "success",
              isLoading: false,
              closeButton: true,
              autoClose: 5000,
            })
            handleSuccessfulImport();
          })
          .catch((error) => {
            toast.update(toastId.current, {
              render: `Failed to upload the machine tag list${
                error?.data?.detail ? `: ${error.data.detail}` : ''
              }`,
              type: "error",
              isLoading: false,
              closeButton: true,
              autoClose: 5000,
            })
            console.error(error?.data?.detail || error);
          });

        handleCloseIntercept();
      } else {
        toast.update(toastId.current, {
          render: "'No Machine Tag List provided. Please select or drag-and-drop a file to upload.'",
          type: "warning",
          isLoading: false,
          closeButton: true,
          autoClose: 5000,
        })
      }
    } catch (error: unknown) {
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
      <ImportMachineTagListContainer>
        <ImportMachineTagListHeading>Upload Machine Tag List</ImportMachineTagListHeading>
        <ImportMachineTagListMessageContainer>
          First, download a <a href={templateUrl || ''}>XLS demo template file</a> and fill it out
          completely. Instructions are contained in the first sheet of the XLS template file.
        </ImportMachineTagListMessageContainer>
        <ImportMachineTagListMessageLastContainer>
          Once you have successfully completed the template, drag the file to the dropzone below and
          click upload. After the upload finishes, the tags will be presented for you to review.
        </ImportMachineTagListMessageLastContainer>
        <UploadContainer>
          <OnboardingDropArea
            file={file}
            icon={faFileExcel}
            acceptedTypes={{
              'application/vnd.ms-excel': ['.xls', '.xlsx', '.xlsm']
            }}
            onFileChange={(file) => setFile(file)}
            isUploading={importingMachineTagList}
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
      </ImportMachineTagListContainer>
    </Modal>
  );
};

export default ImportMachineTagListModal;
