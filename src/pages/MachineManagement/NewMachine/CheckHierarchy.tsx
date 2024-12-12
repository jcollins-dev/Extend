// 3rd party libs
import React from 'react';
import { useWizard, Wizard } from 'react-use-wizard';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { skipToken } from '@reduxjs/toolkit/dist/query';

// Constants
import { JBTRoutes } from 'constants/routes';

// Components
import { ArrowButtonBar, PageHeader, Typography } from 'components';
import { DataQualityCheck } from './DataQualityCheck';
import { ReviewHierarchy } from './ReviewHierarchy';
import { ReviewPartNumber } from './ReviewPartNumber';
import { AddBubbles } from './AddBubbles';

// API
import { useGetOnboardingMachineByIdQuery } from 'api';

// Types
import { OnboardingMachine } from 'types/machine-management';

// Styling
const PageContainer = styled.div`
  background-color: ${(props) => props.theme.colors.lightGrey1};
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  & > div:first-child {
    height: auto;
    background-color: white;
    flex-grow: 0;
  }
`;

const ArrowBarWrapper = styled.div`
  margin-top: 1rem;
`;

const stepHeaders = [
  'Review Hierarchy',
  'Add Bubbles',
  'Review Part Numbers',
  'Data Quality Check'
];

const CheckHierarchy = (): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  // Retrieve the machine's data in order to have the business unit
  const { data: machine } = useGetOnboardingMachineByIdQuery(
    machineId ? { machineId: machineId } : skipToken
  );
  return (
    <PageContainer>
      <Wizard header={<WizHeader machine={machine} machineId={machineId} />}>
        <ReviewHierarchy machineId={machineId} />
        <AddBubbles machine={machine} />
        <ReviewPartNumber machine={machine} />
        <DataQualityCheck machineId={machineId} />
      </Wizard>
    </PageContainer>
  );
};

function WizHeader({
  machine,
  machineId
}: {
  machine?: OnboardingMachine;
  machineId: string;
}): JSX.Element {
  const { activeStep, goToStep } = useWizard();

  const handlePress = (index: number) => {
    goToStep(index);
  };
  const buttonContents = (i: number) => {
    return <Typography variant="stepheading">{stepHeaders[i]}</Typography>;
  };

  return (
    <HeaderContainer>
      <PageHeader
        heading={machine?.description || 'Retrieving machine...'}
        breadcrumbs={[
          { label: 'Machine Management', link: JBTRoutes.machineManagement },
          {
            label: machine?.description || 'Retrieving machine...',
            link: JBTRoutes.onboardingPage.replace(':machineId', machineId)
          },
          { label: 'Review Diagrams Upload' }
        ]}
      />
      <ArrowBarWrapper>
        <ArrowButtonBar
          numButtons={stepHeaders.length}
          activeButton={activeStep}
          handlePress={handlePress}
          buttonContents={buttonContents}
          barTopMargin="0"
        />
      </ArrowBarWrapper>
    </HeaderContainer>
  );
}

export default CheckHierarchy;
