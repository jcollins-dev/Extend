// 3rd party libs
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Breadcrumbs,
  OnboardingDropArea,
  Typography,
  Loader,
  Input,
  SearchInput
} from 'components';
import theme, { themeColors } from 'themes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoltLightning,
  faCalendarCheck,
  faClipboardList,
  faDiagramProject,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'components/Button';
import { useHistory, useParams } from 'react-router';
import { JBTRoutes } from 'constants/routes';
import { faFilePdf, faFileExcel, faClock } from '@fortawesome/free-regular-svg-icons';
import { toast } from 'react-toastify';
import {
  useGetKeepwareFileQuery,
  useGetOnboardingMachineByIdQuery,
  useGetProvisionGatewaysQuery,
  useGetSalesforceMachineByIdQuery,
  useLazyGetMaintenanceExcelTemplateQuery,
  useUpdateProvisionGatewayMutation,
  useUploadDiagramMutation,
  useValidateUploadMaintenanceScheduleExcelMutation
} from 'api';
import saveAs from 'file-saver';
import { useTranslation } from 'react-i18next';

// Styling
const PageContainer = styled.div`
  height: 100%;
  > * {
    flex: 1;
  }
`;

const Pillar = styled.div<{ disabled: boolean }>`
  height: 45rem;
  position: relative;
  border: 1px solid ${theme.colors.lightGrey3};
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: start;
  justify-content: center;
  ${({ disabled }) => (disabled ? 'pointer-events: none; opacity: 0.3;' : '')}

  .container-buttons {
    .container-inner {
      padding: 0.45rem 1rem;
      border-radius: 5px;

      .button {
        &.link {
          background: none;
          border: 0;
          margin: 0 auto;
          display: block;
          cursor: pointer;
          color: ${themeColors.mediumBlue};
        }

        &.disabled {
          color: ${themeColors.mediumGrey2};
          cursor: default;
        }
      }
    }
  }
`;

const Container = styled.div<{ disabled: boolean }>`
  overflow: auto;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 50px;
  gap: 20px;
  > * {
    box-shadow: 0 0.5rem 0.5rem rgba(0, 0, 0, 0.1);
    flex: 1;
  }
  ${({ disabled }) => (disabled ? 'pointer-events: none; opacity: 0.3;' : '')}
`;

const HeaderContainer = styled.header`
  padding-bottom: 1.25rem;
`;

const PillarContent = styled.div<{ background: string }>`
  width: 100%;
  overflow: auto;
  height: 60rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: start;
  justify-content: center;
  position: relative;
  background: ${({ background }) => (background ? background : 'white')};
  > * {
    flex: 1;
  }
`;

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 3rem;
  bottom: 10%;
  max-height: 20%;
`;

const TitleContainer = styled.div`
  margin-top: 15%;
  margin-bottom: 15%;
  min-height: 20%;
  max-height: 30%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  > * {
    flex: 1;
    margin-bottom: 20%;
  }
`;
const MessageBox = styled.div`
  position: absolute;
  top: 49%;
  width: 68%;
  padding-left: 0.625rem;
  padding-right: 0.625rem;
`;
const IconBox = styled.div`
  position: relative;
  left: 46%;
  width: 1.25rem;
  margin-bottom: 0.313rem;
  margin-top: 0.625rem;
`;
const ButtonContainer = styled.div`
  width: 75%;
  justify-content: center;
  > * {
    margin-bottom: 10%;
  }
`;

const DownloadButtonContainer = styled.div`
  margin-bottom: 5rem;
`;

const Footer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0 -0.125rem 0.3125rem rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 24px;
  gap: 10px;
  max-height: 60px;
  flex-shrink: 0;
`;

const FooterButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
    margin-left: 1rem;
  }
`;

const CloseButton = styled.span<{ color?: string }>`
  cursor: pointer;
  font-size: 25px;
  font-weight: bold;
  color: ${({ color }) => color || 'black'};
  position: absolute;
  top: 5px;
  right: 10px;
`;

const ProvisionGatewayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  gap: 0.9375rem;
  width: 80%;
  max-height: 20.375rem;
  max-width: 80%;
`;

const InputContainer = styled.div`
  width: 75%;
  justify-content: center;
`;

const StyledSearchWrapper = styled.div`
  height: 2.5rem;
  width: 100%;
`;
const MacListContainer = styled.div`
  border: 1px solid ${theme.colors.lightGrey3};
  border-radius: 0.25rem;
  overflow: auto;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  > * {
    flex: 1;
  }
`;
const Mac = styled.div<{ selected?: boolean }>`
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  text-align: center;
  border-bottom: 0.0625rem solid ${theme.colors.lightGrey6};
  background-color: ${({ selected }) =>
    selected ? theme.colors.lightGrey6 : theme.colors.lightGrey1};
  padding: 0.75rem;
  width: 100%;
  text-decoration: none;
  font-size: 1.125rem;
  color: black;
  display: block;
`;

const Modal = styled.div<{ enabled?: boolean }>`
  ${({ enabled }) => (enabled ? '' : 'display: none;')}
  position: fixed; /* Stay in place */
  z-index: 100; /* Sit on top */
  width: 90%; /* Full width */
  height: 45rem;
  top: 30%;
`;

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  margin: auto;
  padding: 5rem;
  border: 1px solid ${(props) => props.theme.colors.lightGrey6};
  width: 40%;
`;

const OnboardingPage = (): JSX.Element => {
  const history = useHistory();
  const { t } = useTranslation(['fpns']);
  const { machineId } = useParams<{ machineId: string }>();

  const { data: machine, isLoading: machineIsLoading } = useGetOnboardingMachineByIdQuery({
    machineId
  });
  const {
    data: salesforceMachine,
    isLoading: salesforceMachineIsLoading,
    refetch: refetchSalesforceMachine
  } = useGetSalesforceMachineByIdQuery({
    machineId
  });

  const { data: keepwareFile } = useGetKeepwareFileQuery({
    machineId
  });

  const toastId = useRef<React.ReactText>('');

  useEffect(() => {
    const intervalReference = setInterval(() => {
      refetchSalesforceMachine();
    }, 60000); // Check SF machine sync status every minute
    return () => clearInterval(intervalReference);
  }, []);

  useEffect(() => {
    return () => {
      toast.dismiss(toastId.current);
    };
  }, []);

  useEffect(() => {
    if (salesforceMachineIsLoading) {
      toast.dismiss(toastId.current);
      toastId.current = toast.loading(`Checking if the machine is sync`);
    } else {
      toast.dismiss(toastId.current);
    }
  }, [salesforceMachineIsLoading]);

  const goTo = (machineId: string) => {
    window.location.replace(JBTRoutes.machineManagementHierarchy.replace(':machineId', machineId));
  };
  const goToMtl = (machineId: string) => {
    window.location.replace(
      JBTRoutes.machineManagementMtlConfigurationMapping.replace(':machineId', machineId)
    );
  };

  // To land on the machine review and publish page
  const goToReviewAndPublish = (machineId: string) => {
    window.location.replace(JBTRoutes.machineReviewAndPublish.replace(':machineId', machineId));
  };

  const goToMachineManagementView = () => {
    window.location.replace(JBTRoutes.machineManagement);
  };

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [diagramsStatus, setDiagramsStatus] = useState<string>('Not Started');
  const [maintenanceScheduleStatus, setMaintenanceScheduleStatus] = useState<string>('Not Started');
  const [tagListStatus, setTagListStatus] = useState<string>('Not Started');
  const [updateDiagram] = useUploadDiagramMutation();

  useEffect(() => {
    if (machine) {
      const status_diagrams = machine.diagrams;

      // Upload Diagram
      if (status_diagrams !== 'None') {
        switch (status_diagrams) {
          case 'Done':
            setDiagramsStatus('Done');
            setUploadDiagramButtonText('Edit');
            break;
          case 'InProgress':
            setDiagramsStatus('In Progress...');
            setUploadDiagramButtonText('Continue');
            setDiagramUploadSuccessful(true);
            break;
          case 'Uploading':
            setDiagramsStatus('Uploading...');
            setUploadDiagramButtonText('Continue');
            setEnableDiagramButtonContinue(false);
            break;
          default:
            break;
        }
      }
      const status_maintenance_schedule = machine.maintenanceSchedule;
      // Maintenance Schedule
      if (status_maintenance_schedule !== 'None') {
        switch (status_maintenance_schedule) {
          case 'Done':
            setMaintenanceScheduleStatus('Done');
            setUploadScheduleButtonText('Edit');
            break;
          case 'InProgress':
            setMaintenanceScheduleStatus('In Progress...');
            setUploadScheduleButtonText('Edit');
            break;
          default:
            break;
        }
      }

      const status_tag_list = machine.tagList;

      if (status_tag_list !== 'None') {
        switch (status_tag_list) {
          case 'InProgress':
            setTagListStatus('In Progress');
            setTagListButtonText('Continue');
            break;
          case 'Done':
            setTagListStatus('Done');
            setTagListButtonText('Edit');
            break;
          case 'Incomplete':
            setTagListStatus('Incomplete');
            setTagListButtonText('Edit');
            break;
          case 'Uploading':
            setTagListStatus('Uploading...');
            setTagListButtonText('Edit');
            break;
          default:
            break;
        }
      }
      if (machine.maintenanceSchedule !== 'None') {
        setUploadScheduleButtonText('Edit');
      }

      const status_provision_gateway = machine.provisionGateway;
      // Maintenance Schedule
      if (status_provision_gateway !== 'None') {
        setProvisionGatewayStatus('Done');
        setProvisionGatewayButtonText('Edit');
        setSelectedProvisionGateway(machine.macId || '');
      }
    }
  }, [machine]);

  const handleCloseStep = () => {
    setCurrentStep(0);

    if (machine?.diagrams !== 'None') {
      setUploadDiagramButtonText('Continue');
    } else {
      setUploadDiagramButtonText('Get Started');
    }

    if (machine?.maintenanceSchedule !== 'None') {
      setUploadScheduleButtonText('Edit');
    } else {
      setUploadScheduleButtonText('Get Started');
    }

    if (machine?.provisionGateway !== 'None') {
      setProvisionGatewayButtonText('Edit');
    } else {
      setProvisionGatewayButtonText('Get Started');
    }
    setDiagramFile(undefined);
    setScheduleFile(undefined);
  };

  // Related to Diagram Upload step
  const [diagramFile, setDiagramFile] = useState<File>();
  const [diagramUploadSuccessful, setDiagramUploadSuccessful] = useState<boolean>(false);
  const [uploadDiagramButtonText, setUploadDiagramButtonText] = useState<string>('Get Started');
  const [additonalUploadMsg, setAdditionalUploadMsg] = useState<boolean>(false);
  const [enableDiagramButtonContinue, setEnableDiagramButtonContinue] = useState(true);
  const setDiagramButtonBehavior = () => {
    if (currentStep === 0 && !diagramUploadSuccessful) {
      // get started and begin diagram upload step
      setCurrentStep(1);
      setUploadDiagramButtonText('Upload');
    }
    if (currentStep === 0 && diagramUploadSuccessful) {
      goTo(machineId);
    }
    if (uploadDiagramButtonText === 'Upload' && diagramsStatus == 'Done') {
      setAdditionalUploadMsg(true);
    }
    if (currentStep === 1 && diagramFile !== null) handleDiagramUpload(diagramFile); // diagram upload
  };
  const handleDiagramUpload = async (currentFile?: File) => {
    if (!currentFile) {
      console.error('Trying to upload null file');
      return;
    }
    if (!machineIsLoading && diagramFile) {
      updateDiagram({
        machineId: machineId,
        file: diagramFile as File,
        salesforceMachineId: machine?.salesforceMachineId || '',
        businessUnit: parseInt(machine?.businessUnitId || '0')
      })
        .unwrap()
        .then(() => {
          toast.success(
            `Diagram upload in progress. Uploads typically take 30 min - 3 hours. Check back then!`
          );
          setDiagramUploadSuccessful(true);
          setDiagramsStatus('Uploading...');
          setUploadDiagramButtonText('Continue');
          setEnableDiagramButtonContinue(false);
          setCurrentStep(0);
        })
        .catch((error) => {
          toast.error(
            `Failed to upload the diagram for the current machine${
              error?.data?.detail ? `: ${error.data.detail}` : ''
            }`
          );
          console.error(error?.data?.detail || error);
        });
    }
  };

  // Related to Maintenance Schedule step
  const [scheduleFile, setScheduleFile] = useState<File>();
  const [uploadScheduleButtonText, setUploadScheduleButtonText] = useState<string>('Get Started');
  const [maintenanceExcelTemplate] = useLazyGetMaintenanceExcelTemplateQuery();
  const [validateUploadMaintenanceSchedule] = useValidateUploadMaintenanceScheduleExcelMutation();
  const setMaintenanceScheduleButtonBehavior = () => {
    if (currentStep === 0) {
      // get started and begin schedule upload step
      setCurrentStep(2);
      setUploadScheduleButtonText('Upload');
    }
    if (currentStep === 2 && scheduleFile !== null) handleScheduleUpload(scheduleFile); // schedule upload
  };

  function downloadExcel() {
    maintenanceExcelTemplate()
      .unwrap()
      .then((result) => {
        saveAs(result, `maintenance_schedule_template.xlsx`);
      })
      .catch((error) => {
        toast.error('Error occurred while downloading excel');
        console.error(error);
      });
  }
  const handleScheduleUpload = async (currentFile?: File) => {
    if (!currentFile) {
      console.error('Trying to upload null file');
      return;
    }
    if (!machineIsLoading && scheduleFile) {
      try {
        const validatedRows = await validateUploadMaintenanceSchedule({
          file: scheduleFile as File,
          skipHeader: true,
          machineId
        }).unwrap();
        history.push({
          pathname: JBTRoutes.onboardingMaintenanceSchedulePage.replace(':machineId', machineId),
          state: {
            validatedRows
          }
        });
      } catch (error) {
        toast.error(`Failed to upload the Maintenance schedule for the current machine`);
        console.error(error);
      }
    }
  };

  // Related to Provision Gateway step
  const [provisionGatewayButtonText, setProvisionGatewayButtonText] =
    useState<string>('Get Started');
  const [provisionGatewayStatus, setProvisionGatewayStatus] = useState<string>('Not Started');
  const [selectedProvisionGateway, setSelectedProvisionGateway] = useState<string>('');
  const [filteredProvisionGateways, setFilteredProvisionGateways] = useState<string[]>([]);
  const { data: provisionGateways, isLoading: provisionGatewaysIsLoading } =
    useGetProvisionGatewaysQuery();
  const [updateProvisionGateway] = useUpdateProvisionGatewayMutation();

  const setProvisionGatewayButtonBehavior = () => {
    if (currentStep === 0) {
      setCurrentStep(3);
      setProvisionGatewayButtonText('Save');
    }
    if (currentStep === 3 && selectedProvisionGateway !== '')
      saveProvisionGateway(selectedProvisionGateway);
  };

  function saveProvisionGateway(pg: string) {
    updateProvisionGateway({
      machineId: machineId,
      macId: pg
    })
      .unwrap()
      .then(() => {
        toast.success(`Provision gateway set successfully!`);
        setDiagramUploadSuccessful(true);
        setProvisionGatewayStatus('Done');
        setProvisionGatewayButtonText('Edit');
        setCurrentStep(0);
      })
      .catch((error) => {
        toast.error(
          `Failed to set provision gateway for the current machine${
            error?.data?.detail ? `: ${error.data.detail}` : ''
          }`
        );
        console.error(error?.data?.detail || error);
      });
  }

  useEffect(() => {
    if (!provisionGatewaysIsLoading) setFilteredProvisionGateways(provisionGateways || []);
  }, [provisionGateways]);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!provisionGatewaysIsLoading) {
      setFilteredProvisionGateways(
        provisionGateways?.filter((e) =>
          e.toLowerCase().includes(event.target.value.toLowerCase())
        ) || []
      );
    }
  };

  // Related to Tag List step
  const [tagListButtonText, setTagListButtonText] = useState<string>('Get Started');
  const setTagListButtonBehavior = () => {
    goToMtl(machineId);
  };

  //Related to Review & Publish Button enable-disable
  const [currentReviewButtonStatus, setReviewButtonStatus] = useState<boolean>(true);
  useEffect(() => {
    if (diagramsStatus == 'Done' || maintenanceScheduleStatus == 'Done') {
      setReviewButtonStatus(false);
    } else {
      setReviewButtonStatus(true);
    }
  });

  // Review and Publish Button Behavior
  const setReviewAndPublishButtonBehavior = () => {
    goToReviewAndPublish(machineId);
  };

  const downloadFileJSON = (data: string, filename: string) => {
    if (!data) return;
    saveAs(
      new Blob([JSON.stringify(data)], { type: 'text/json;charset=utf-8', endings: 'native' }),
      `${filename}.json`
    );
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <Breadcrumbs
          items={[
            {
              label: 'Machine Management',
              link: JBTRoutes.machineManagement
            },
            {
              label: machine?.description || 'Retrieving machine...',
              link: JBTRoutes.onboardingPage.replace(':machineId', machineId)
            }
          ]}
        />
      </HeaderContainer>
      <Modal enabled={!salesforceMachine && !salesforceMachineIsLoading}>
        <ModalContent>
          <Loader></Loader>
          <Typography style={{ textAlign: 'center' }}>
            Your machine is being set up. This process will take 10-15 minutes and then you can
            begin onboarding your machine !
          </Typography>
        </ModalContent>
      </Modal>
      <Container disabled={!salesforceMachine || salesforceMachineIsLoading}>
        <Pillar disabled={currentStep !== 1 && currentStep !== 0}>
          <PillarContent background="linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(0,0,255,0.1993391106442577) 0%, rgba(255,255,255,0) 35%);">
            <CloseButton
              color={theme.colors.black}
              hidden={currentStep !== 1}
              onClick={() => handleCloseStep()}
            >
              &times;
            </CloseButton>
            <TitleContainer>
              <StyledIcon color={theme.colors.darkGrey} icon={faDiagramProject} />
              <Typography
                style={{ maxWidth: '10rem', textAlign: 'center', marginTop: '1rem' }}
                color="darkGrey"
                variant="h3"
                as="span"
              >
                Upload Diagrams
              </Typography>
            </TitleContainer>
            <Typography hidden={currentStep === 1} variant="h4">
              {machineIsLoading ? <Loader margin="auto" /> : diagramsStatus}
            </Typography>
            {additonalUploadMsg && (
              <MessageBox>
                <IconBox>
                  <FontAwesomeIcon icon={faClock} color={theme.colors.darkGrey} />
                </IconBox>
                <Typography style={{ maxWidth: '20rem', textAlign: 'center' }}>
                  {t('package_update_message')}
                </Typography>
              </MessageBox>
            )}
            <Typography style={{ maxWidth: '20rem', textAlign: 'center' }}>
              Upload the diagrams and BOM&apos;s for this machine to setup the &quot;Parts&quot; tab
              in OmniBlu
            </Typography>
            <div hidden={currentStep !== 1}>
              <OnboardingDropArea
                acceptedTypes={{
                  'application/pdf': ['.pdf'],
                  'application/zip': ['.zip']
                }}
                file={diagramFile}
                onFileChange={setDiagramFile}
                icon={faFilePdf}
              />
            </div>
          </PillarContent>
          <ButtonContainer>
            <Button
              borderRadius="3rem"
              variant="hover-blue"
              bgColor={
                uploadDiagramButtonText === 'Upload'
                  ? theme.colors.darkBlue2
                  : theme.colors.primaryBlue5
              }
              color={theme.colors.lightGrey3}
              onClick={() => {
                setDiagramButtonBehavior();
              }}
              disabled={(diagramFile === null && currentStep === 1) || !enableDiagramButtonContinue}
            >
              {uploadDiagramButtonText}
            </Button>
          </ButtonContainer>
        </Pillar>
        <Pillar disabled={currentStep !== 2 && currentStep !== 0}>
          <PillarContent background="linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(255,0,181,0.1993391106442577) 0%, rgba(255,255,255,0) 35%);">
            <CloseButton
              color={theme.colors.black}
              hidden={currentStep !== 2}
              onClick={() => handleCloseStep()}
            >
              &times;
            </CloseButton>
            <TitleContainer>
              <StyledIcon color={theme.colors.darkGrey} icon={faCalendarCheck} />
              <Typography
                style={{ maxWidth: '10rem', textAlign: 'center', marginTop: '1rem' }}
                color="darkGrey"
                variant="h3"
                as="span"
              >
                Upload Maintenance Schedule
              </Typography>
            </TitleContainer>
            <Typography hidden={currentStep === 2} variant="h4">
              {machineIsLoading ? <Loader margin="auto" /> : maintenanceScheduleStatus}
            </Typography>
            <Typography
              hidden={currentStep === 2}
              style={{ maxWidth: '20rem', textAlign: 'center' }}
            >
              Upload the maintenance schedule for this machine to setup the &quot;Maintenance
              Manager&quot; tab in OmniBlu
            </Typography>
            <div hidden={currentStep !== 2}>
              <Typography style={{ maxWidth: '20rem', textAlign: 'center' }}>
                1. Download Blank Template
              </Typography>
              <DownloadButtonContainer>
                <Button
                  variant="constant"
                  bgColor={theme.colors.darkPurple}
                  color={theme.colors.lightGrey3}
                  onClick={() => {
                    downloadExcel();
                  }}
                >
                  Download Now
                </Button>
              </DownloadButtonContainer>
              <Typography style={{ maxWidth: '20rem', textAlign: 'center' }}>
                2. Upload Completed Template
              </Typography>
              <OnboardingDropArea
                acceptedTypes={{
                  'application/vnd.ms-excel': ['.xls', '.xlsx', '.xlsm']
                }}
                file={scheduleFile}
                onFileChange={setScheduleFile}
                icon={faFileExcel}
              />
            </div>
          </PillarContent>
          <ButtonContainer>
            <Button
              borderRadius="3rem"
              variant={uploadScheduleButtonText === 'Upload' ? 'upload' : 'hover-blue'}
              bgColor={
                uploadScheduleButtonText === 'Upload'
                  ? theme.colors.darkBlue2
                  : theme.colors.primaryBlue5
              }
              color={theme.colors.lightGrey3}
              onClick={() => {
                setMaintenanceScheduleButtonBehavior();
              }}
              disabled={scheduleFile === null && currentStep === 2}
            >
              {uploadScheduleButtonText}
            </Button>
          </ButtonContainer>
        </Pillar>
        <Pillar disabled={currentStep !== 3 && currentStep !== 0}>
          <PillarContent background="linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(255,169,0,0.1993391106442577) 0%, rgba(255,255,255,0) 35%);">
            <CloseButton
              color={theme.colors.black}
              hidden={currentStep !== 3}
              onClick={() => handleCloseStep()}
            >
              &times;
            </CloseButton>
            <TitleContainer>
              <StyledIcon color={theme.colors.darkGrey} icon={faBoltLightning} />
              <Typography
                style={{ maxWidth: '10rem', textAlign: 'center', marginTop: '1rem' }}
                color="darkGrey"
                variant="h3"
                as="span"
              >
                Select Gateway
              </Typography>
            </TitleContainer>
            {currentStep !== 3 ? (
              <>
                <Typography variant="h4">
                  {machineIsLoading && provisionGatewaysIsLoading ? (
                    <Loader margin="auto" />
                  ) : (
                    provisionGatewayStatus
                  )}
                </Typography>
                {!machineIsLoading && selectedProvisionGateway ? (
                  <InputContainer>
                    <Typography style={{ maxWidth: '20rem', textAlign: 'center' }}>
                      Mac ID or a UUID
                    </Typography>
                    <Input variant={'disabled'} value={selectedProvisionGateway} />
                  </InputContainer>
                ) : (
                  <Typography style={{ maxWidth: '20rem', textAlign: 'center' }}>
                    Enter in the MAC address/Gateway ID in order to register the machine on Azure
                    loT Hub
                  </Typography>
                )}
              </>
            ) : (
              <ProvisionGatewayContainer>
                <Typography style={{ maxWidth: '20rem', textAlign: 'center' }}>
                  Select a MAC ID
                </Typography>
                <StyledSearchWrapper>
                  <SearchInput
                    borderRadius="0.625rem"
                    placeholder="Search"
                    onChange={handleSearchChange}
                  />
                </StyledSearchWrapper>
                <MacListContainer>
                  {filteredProvisionGateways?.map((pg) => (
                    <Mac
                      selected={pg === selectedProvisionGateway}
                      key={pg}
                      onClick={() => setSelectedProvisionGateway(pg)}
                    >
                      <Typography color="darkGrey" weight="medium" size="1rem" as="span" mb={0}>
                        {pg}
                      </Typography>
                    </Mac>
                  ))}
                </MacListContainer>
              </ProvisionGatewayContainer>
            )}
          </PillarContent>
          <ButtonContainer>
            <Button
              borderRadius="3rem"
              variant="hover-blue"
              bgColor={theme.colors.primaryBlue5}
              color={theme.colors.lightGrey3}
              onClick={setProvisionGatewayButtonBehavior}
            >
              {provisionGatewayButtonText}
            </Button>
          </ButtonContainer>
        </Pillar>

        <Pillar disabled={currentStep !== 4 && currentStep !== 0}>
          <PillarContent background="linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(0,255,40,0.1993391106442577) 0%, rgba(255,255,255,0) 35%);">
            <CloseButton
              color={theme.colors.black}
              hidden={currentStep !== 4}
              onClick={() => handleCloseStep()}
            >
              &times;
            </CloseButton>
            <TitleContainer>
              <StyledIcon color={theme.colors.darkGrey} icon={faClipboardList} />
              <Typography
                style={{ maxWidth: '10rem', textAlign: 'center', marginTop: '1rem' }}
                color="darkGrey"
                variant="h3"
                as="span"
              >
                Configure & Map Tags
              </Typography>
            </TitleContainer>
            <Typography variant="h4">
              {machineIsLoading ? <Loader margin="auto" /> : tagListStatus}
            </Typography>
            {keepwareFile && (
              <div className="container-buttons">
                <div className="container-inner">
                  <button
                    className={`button link ${keepwareFile ? '' : 'disabled'}`}
                    disabled={keepwareFile ? false : true}
                    onClick={() =>
                      downloadFileJSON(keepwareFile as unknown as string, 'gatewayconfig')
                    }
                  >
                    gatewayconfig.json <FontAwesomeIcon icon={faDownload} />
                  </button>
                </div>
              </div>
            )}
          </PillarContent>
          <ButtonContainer>
            <Button
              borderRadius="3rem"
              variant="hover-blue"
              bgColor={theme.colors.primaryBlue5}
              color={theme.colors.lightGrey3}
              onClick={setTagListButtonBehavior}
            >
              {tagListButtonText}
            </Button>
          </ButtonContainer>
        </Pillar>
      </Container>
      <Footer>
        <FooterButtonContainer>
          <Button onClick={goToMachineManagementView}>Exit</Button>
          <Button disabled={currentReviewButtonStatus} onClick={setReviewAndPublishButtonBehavior}>
            Review & Publish
          </Button>
        </FooterButtonContainer>
      </Footer>
    </PageContainer>
  );
};

export default OnboardingPage;
