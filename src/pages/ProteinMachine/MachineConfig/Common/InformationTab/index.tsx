// 3rd party libs
import React, { ReactElement, useEffect, useState } from 'react';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Components
import {
  Button,
  Checkbox,
  Column,
  KPICard,
  Loader,
  Row,
  Typography,
  UploadButton
} from 'components';
import { MachineConnectionStatus, TutorialButton } from 'components/machine-health';

// Themes
import theme from 'themes';

// Api
import {
  useGetAccountInfoQuery,
  useUpdateAccountInfoMutation,
  useUploadMachineImageMutation
} from 'api';
import ButtonBar from 'components/machine-health/configurator/ButtonBar';

// Constants
import { tutorialPlaceholderStepsData } from 'constants/machineConfig';

interface Props {
  setIsDirty: (bottleneck: boolean) => void;
  isDirty?: boolean;
}

// Styling
const Container = styled.div`
  flex-grow: 1;
  width: 100%;
  padding-left: 6rem;
  padding-right: 6rem;
`;
const ContentContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
`;

const StyledIcon = styled(FontAwesomeIcon)`
  float right;
  :hover{
    color: ${theme.colors.field.select.enabled};
    cursor: pointer;
  }
`;

const MachineStatusContainer = styled.div`
  margin-left: 4.6875rem;
`;

const MachineInformationTab = ({ setIsDirty, isDirty }: Props): ReactElement => {
  const { machineId } = useParams<{ machineId: string }>();
  const [updatedAccountInfo] = useUpdateAccountInfoMutation();

  const [uploadFilePost] = useUploadMachineImageMutation();

  const { data: machineInfo, isLoading: isLoadingAccountInfo } = useGetAccountInfoQuery(
    { machineId },
    { pollingInterval: 30000 }
  );
  const [bottleneck, setBottleneck] = useState<boolean>(machineInfo?.bottleneck ?? false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>();

  useEffect(() => {
    if (!isDirty) {
      setBottleneck(machineInfo?.bottleneck ?? false);
    }
  }, [machineInfo]);

  const upload = async () => {
    if (!uploadFile) {
      console.error('Trying to upload null file');
      return;
    }

    uploadFilePost({
      file: uploadFile,
      machineId: machineId
    })
      .unwrap()
      .then(() => {
        toast.success(`Machine image uploaded`);
        return true;
      })
      .catch((error) => {
        toast.error(`Failed uploading machine image`);
        console.error(error?.data?.detail);
        return false;
      });
  };

  const saveInfo = async () => {
    setIsLoadingUpdate(true);

    if (machineInfo) {
      await upload();

      updatedAccountInfo({
        machineId,
        machineInfo: { bottleneck }
      })
        .unwrap()
        .then((response) => {
          if (response) {
            setIsDirty(false);
            toast.success(`Successfully updated!`, { toastId: 'updated' });
            setIsLoadingUpdate(false);
          } else {
            toast('⚠️ There was a problem updating information.');
            setIsLoadingUpdate(false);
          }
        })
        .catch((error) => {
          console.warn('Account info error: ', error);
          toast('⚠️ There was a problem updating information..');
          setIsLoadingUpdate(false);
        });
    }
  };

  useEffect(() => {
    setIsDirty(false);
  }, []);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toast.info('Copied to clipboard.');
    });
  };
  return (
    <>
      {isLoadingAccountInfo ? (
        <Loader />
      ) : (
        <>
          <Container>
            <ButtonBar title="" padding="1.375rem 0">
              <Button width="5.25rem" onClick={() => saveInfo()}>
                Save
              </Button>
              <TutorialButton stepsData={tutorialPlaceholderStepsData} />
            </ButtonBar>
            <Row>
              <Column>
                <KPICard
                  mb="1.25rem"
                  component={
                    <Typography size="1rem" weight="bold" color={theme.colors.darkGrey}>
                      Machine Information
                    </Typography>
                  }
                >
                  <ContentContainer>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Customer Name
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && machineInfo.companyName}
                        </Typography>
                      </Column>
                      <Column size={2} />
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Site Name
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && machineInfo.siteName}
                        </Typography>
                      </Column>
                      <Column size={2} />
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Line Name
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && machineInfo.lineName}
                        </Typography>
                      </Column>
                      <Column size={2} />
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Machine Name
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && machineInfo.description}
                        </Typography>
                      </Column>
                      <Column size={2}>
                        <StyledIcon
                          icon={faCopy}
                          onClick={() => {
                            copyToClipboard((machineInfo && machineInfo.description) ?? '');
                          }}
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Serial Number
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && machineInfo.serialNumber}
                        </Typography>
                      </Column>
                      <Column size={2}>
                        <StyledIcon
                          icon={faCopy}
                          onClick={() => {
                            copyToClipboard((machineInfo && machineInfo.serialNumber) ?? '');
                          }}
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Sales Force Id
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && machineInfo.salesforceId}
                        </Typography>
                      </Column>
                      <Column size={2}>
                        <StyledIcon
                          icon={faCopy}
                          onClick={() => {
                            copyToClipboard((machineInfo && machineInfo.salesforceId) ?? '');
                          }}
                        />
                      </Column>
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Bottle Neck Machine
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Checkbox
                          checked={bottleneck}
                          onChange={() => {
                            const value = !bottleneck;
                            setBottleneck(value);
                            setIsDirty(true);
                          }}
                        />
                      </Column>
                      <Column size={2} />
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Upload Machine image
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <UploadButton
                          onChangeFile={setUploadFile}
                          label="Choose File"
                          maxSize={50000000}
                          errorMessages={{
                            maxSize: 'File size is too large.'
                          }}
                        />
                        {isLoadingUpdate && <Loader size={40} />}
                      </Column>
                      <Column size={2} />
                    </Row>
                  </ContentContainer>
                </KPICard>

                <KPICard
                  mb="1.25rem"
                  component={
                    <Typography size="1rem" weight="bold">
                      Connection Status
                    </Typography>
                  }
                >
                  <ContentContainer>
                    <Row>
                      <Column size={1}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Connection State
                        </Typography>
                      </Column>
                      <MachineStatusContainer>
                        <MachineConnectionStatus machineId={machineId} />
                      </MachineStatusContainer>
                      <Column size={2} />
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Last Connected
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && machineInfo.connectionStatus.lastKnownConnected}
                        </Typography>
                      </Column>
                      <Column size={2} />
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Reporting State
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography
                          size="0.8125rem"
                          weight="bold"
                          color={
                            machineInfo && machineInfo.reportingState === 'bad'
                              ? theme.colors.darkRed
                              : theme.colors.onTrackGreen
                          }
                        >
                          {machineInfo && machineInfo.reportingState}
                        </Typography>
                      </Column>
                      <Column size={2} />
                    </Row>
                  </ContentContainer>
                </KPICard>
                <KPICard
                  mb="1.25rem"
                  component={
                    <Typography size="1rem" weight="bold">
                      Warranty
                    </Typography>
                  }
                >
                  <ContentContainer>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          ProCare
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && machineInfo.procare ? 'Yes' : 'No'}
                        </Typography>
                      </Column>
                      <Column size={2} />
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Warranty Status
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && !machineInfo.warrantyExpired && 'Valid'}
                          {machineInfo &&
                            machineInfo.warrantyExpired &&
                            machineInfo.warrantyExpired}
                        </Typography>
                      </Column>
                      <Column size={2} />
                    </Row>
                    <Row>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          Order Number
                        </Typography>
                      </Column>
                      <Column size={5}>
                        <Typography size="0.8125rem" weight="bold" color={theme.colors.darkGrey}>
                          {machineInfo && machineInfo.order}
                        </Typography>
                      </Column>
                      <Column size={2} />
                    </Row>
                  </ContentContainer>
                </KPICard>
              </Column>
            </Row>
          </Container>
        </>
      )}
    </>
  );
};

export default MachineInformationTab;
