// 3rd party libs
import React from 'react';
import { useEffect, useState } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { useParams } from 'react-router';
import theme from 'themes';
import { MachineProgressType } from 'types/machine-management';
import { toast } from 'react-toastify';

// Constants
import { JBTRoutes } from 'constants/routes';

// Components
import { Typography, Button, Indicator, Loader, Breadcrumbs } from 'components';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faDiagramProject } from '@fortawesome/free-solid-svg-icons';

// API
import { useGetOnboardingMachineByIdQuery, useSendReviewAndPublishMachineDataMutation } from 'api';

// Styling
const PageContainer = styled.div`
  background-color: ${(props) => props.theme.colors.lightGrey1};
  height: 100%;
  display: flex;
`;

const Node = styled.div`
  display: inline-block;
  flex-basis: 26rem;
  display: flex;
  vertical-align: middle;
  justify-content: center;
  height: 30rem;
  flex-direction: column;
  padding: 4rem;
`;

const Root = styled.div`
  height: 47rem;
  flex-basis: 64rem;
  margin: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 2.5rem;
  & button {
    padding: 0.75rem 1rem;
  }
`;
const PageDivider = styled.div`
  display: flex;
  height: 40rem;
  border-left: solid ${({ theme }) => theme.colors.lightGrey4};
`;

const StatusContainerElement = styled.div`
  display: flex;
  flex-direction: row;
  height: 13rem;
`;

const StatusContainerParent = styled.div`
  display: flex;
  flex-direction: column;
  height: 2.2rem;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  font-size: 3rem;
  max-height: 2rem;
  color: ${theme.colors.darkGrey};
`;
const StyledIndicator = styled(Indicator)`
  display: inline;
  margin: 0;
`;

const makeIndicator = (data: string, theme: DefaultTheme) => {
  switch (data) {
    case MachineProgressType.NONE:
      return <StyledIndicator color={theme.colors.lightGrey6}>Not Started</StyledIndicator>;
    case MachineProgressType.UPLOADING:
      return <StyledIndicator color={theme.colors.richGold}>Uploading</StyledIndicator>;
    case MachineProgressType.INPROGRESS:
      return <StyledIndicator color={theme.colors.atRiskYellow}>In Progress</StyledIndicator>;
    case MachineProgressType.DONE:
      return <StyledIndicator color={theme.colors.onTrackGreen}>Done</StyledIndicator>;
    default:
      return <div>{data}</div>;
  }
};

const ReviewAndPublishPage = (): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const { data: machine, isLoading: machineIsLoading } = useGetOnboardingMachineByIdQuery({
    machineId
  });

  //onboardingPage
  // To Go Back:
  const goToBack = (machineId: string) => {
    window.location.replace(JBTRoutes.onboardingPage.replace(':machineId', machineId));
  };

  const [diagramsStatus, setDiagramsStatus] = useState<string>('Not Started');
  const [maintenanceScheduleStatus, setMaintenanceScheduleStatus] = useState<string>('Not Started');
  const [sendReviewAndPublish] = useSendReviewAndPublishMachineDataMutation();
  //Related to Review & Publish Button enable-disable
  const [currentReviewButtonStatus, setReviewButtonStatus] = useState<boolean>(true);
  useEffect(() => {
    if (diagramsStatus == 'Done' || maintenanceScheduleStatus == 'Done') {
      setReviewButtonStatus(false);
    } else {
      setReviewButtonStatus(true);
    }
  });

  const uploadReviewAndPublish = async () => {
    try {
      let submitDiagram = false;
      let submitMaintenanceSchedule = false;
      if (diagramsStatus == 'Done') submitDiagram = true;
      if (maintenanceScheduleStatus == 'Done') submitMaintenanceSchedule = true;
      if (submitDiagram || submitMaintenanceSchedule) {
        sendReviewAndPublish({
          status_diagram: submitDiagram,
          status_maintenance_schedule: submitMaintenanceSchedule,
          machine_id: machineId
        })
          .unwrap()
          .then(() => {
            toast.success('Publish Successful', {
              autoClose: 5000,
              onClose: () => goToBack(machineId)
            });
          })
          .catch((error) => {
            toast.error(`Failed to publish${error?.data?.detail ? `: ${error.data.detail}` : ''}`, {
              autoClose: false
            });
          });
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (machine) {
      const status_diagrams = machine.diagrams;

      switch (status_diagrams) {
        case 'None':
          setDiagramsStatus('None');
          break;
        case 'Done':
          setDiagramsStatus('Done');
          break;
        case 'InProgress':
          setDiagramsStatus('In Progress');
          break;
        case 'Uploading':
          setDiagramsStatus('Uploading');
          break;
        default:
          break;
      }
      const status_maintenance_schedule = machine.maintenanceSchedule;
      // Maintenance Schedule

      switch (status_maintenance_schedule) {
        case 'Done':
          setMaintenanceScheduleStatus('Done');
          break;
        case 'InProgress':
          setMaintenanceScheduleStatus('In Progress');
          break;
        case 'None':
          setMaintenanceScheduleStatus('None');
          break;
        default:
          break;
      }
    }
  }, [machine]);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Machine Management', link: JBTRoutes.machineManagement },
          {
            label: machine?.description || 'Retrieving machine...',
            link: JBTRoutes.onboardingPage.replace(':machineId', machineId)
          },
          { label: machine?.description || 'Retrieving machine...' }
        ]}
      />
      <PageContainer>
        <Root>
          <Node>
            <Typography
              style={{
                maxWidth: '30rem',
                marginTop: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'vertical'
              }}
              variant="h2"
            >
              Machine Onboarding Summary
            </Typography>
            <Typography
              style={{
                maxWidth: '20rem',
                marginTop: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'vertical'
              }}
              variant="h5"
            >
              Please review the information that has been onboarded for this machine.
            </Typography>
            <Typography
              style={{
                maxWidth: '20rem',
                marginTop: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'vertical'
              }}
              variant="h5"
            >
              If you would like to make an update &quot;Go Back&quot; to the previous screen.
            </Typography>
            <Typography
              style={{
                maxWidth: '20rem',
                marginTop: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'vertical'
              }}
              variant="h5"
            >
              Pressing &quot;Review & Publish&quot; will make the information loaded here viewable
              to the customer.
            </Typography>
            <ButtonContainer>
              <Button
                style={{ flexBasis: '5rem' }}
                onClick={() => {
                  goToBack(machineId);
                }}
              >
                Go Back
              </Button>
              <Button
                bgColor={theme.colors.mediumBlue}
                color={theme.colors.white}
                style={{ flexBasis: '15rem', marginLeft: '1rem' }}
                disabled={currentReviewButtonStatus}
                onClick={uploadReviewAndPublish}
              >
                Review & Publish
              </Button>
            </ButtonContainer>
          </Node>
          <PageDivider />
          <Node>
            <StatusContainerElement>
              <StyledIcon icon={faDiagramProject} />
              <StatusContainerParent>
                <Typography
                  style={{
                    maxWidth: '15rem',
                    marginLeft: '1rem',
                    marginTop: '0rem',
                    marginBottom: '0rem'
                  }}
                  variant="h4"
                >
                  Diagrams
                </Typography>
                <Typography
                  style={{ maxWidth: '15rem', marginLeft: '1rem', marginTop: '0rem' }}
                  variant="h4"
                >
                  {machineIsLoading ? (
                    <Loader margin="auto" />
                  ) : (
                    makeIndicator(diagramsStatus, theme)
                  )}
                </Typography>
              </StatusContainerParent>
            </StatusContainerElement>
            <StatusContainerElement>
              <StyledIcon icon={faCalendarCheck} />
              <StatusContainerParent>
                <Typography
                  style={{
                    maxWidth: '15rem',
                    marginLeft: '1rem',
                    marginTop: '0rem',
                    marginBottom: '0rem'
                  }}
                  variant="h4"
                >
                  Maintenance Schedule
                </Typography>
                <Typography
                  style={{ maxWidth: '15rem', marginLeft: '1rem', marginTop: '0rem' }}
                  variant="h4"
                >
                  {machineIsLoading ? (
                    <Loader margin="auto" />
                  ) : (
                    makeIndicator(maintenanceScheduleStatus, theme)
                  )}
                </Typography>
              </StatusContainerParent>
            </StatusContainerElement>
          </Node>
        </Root>
      </PageContainer>
    </>
  );
};

export default ReviewAndPublishPage;
