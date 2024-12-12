// 3rd party libs
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

// API
import { useCreateMachineConfigJSONFileMutation } from 'api';

// Components
import { Button, Modal, Typography } from 'components';

// Types
import { ModalSize } from 'types';
import { DataRenderer } from 'components/machine-health';
import { JBTRoutes } from 'constants/routes';

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
  machineId: string;
  onClose: () => void;
}

const ConfigFileModal = ({ open, machineId, onClose }: Props): JSX.Element => {
  const [createJSON, { isLoading: isConfigLoading }] = useCreateMachineConfigJSONFileMutation();
  const [visible, setIsVisible] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setIsVisible(open);
  }, [open]);

  const downloadFile = (json: JSON) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(json))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'config.json';

    link.click();
  };

  const createConfigFile = (pushToGateway: boolean) => {
    createJSON({ pushToGateway, machineId })
      .unwrap()
      .then((json) => {
        if (pushToGateway) {
          toast.success(`File pushed to gateway.`, {
            toastId: 'json-created'
          });
        } else {
          downloadFile(json);
        }

        // Adding a timeout to give data a moment to propagate before redirect
        setTimeout(() => {
          setIsVisible(false);
          history.push(JBTRoutes.onboardingPage.replace(':machineId', machineId));
        }, 330);
      })
      .catch((error) => {
        console.warn('Error: ', error);
        toast('⚠️ There was a problem creating the file.');
      });
  };

  return (
    <Modal visible={visible} onClose={onClose} size={ModalSize.XSMALL}>
      <DataRenderer isLoading={isConfigLoading}>
        <Container>
          <Typography variant="h4" mb={0}>
            <FontAwesomeIcon icon={faInfoCircle} /> Machine Tag List Saved
          </Typography>
          <Typography variant="stepheading">
            The configuration file can be pushed or manually uploaded to the file gateway
          </Typography>
          <ButtonContainer>
            <Button
              width="auto"
              variant="link"
              size="small"
              onClick={() => {
                createConfigFile(false);
              }}
            >
              Download Config file <FontAwesomeIcon icon={faDownload} />
            </Button>
            <Button
              width="auto"
              variant="primary"
              size="small"
              onClick={() => {
                createConfigFile(true);
              }}
            >
              Push to Gateway
            </Button>
          </ButtonContainer>
        </Container>
      </DataRenderer>
    </Modal>
  );
};

export default ConfigFileModal;
