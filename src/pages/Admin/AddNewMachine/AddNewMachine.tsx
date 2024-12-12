import React, { useState } from 'react';
import { Wizard, useWizard } from 'react-use-wizard';
import { Typography, ArrowButtonBar, PageHeader } from 'components';
import { AccountSearchPanel } from './AccountSearchPanel';
import { ReviewInfoAndSubmit } from './ReviewInfoAndSubmit';
import { ConfirmMachineFamily } from './ConfirmMachineFamily';
import { UploadSpareParts } from './UploadSpareParts';
import { JBTRoutes } from 'constants/routes';
import { SalesforceMachine } from 'types/salesforce';

const stepHeaders = [
  'Search for machine',
  'Confirm machine family',
  'Upload spare parts',
  'Review info and submit'
];

function WizHeader(): JSX.Element {
  const { activeStep, goToStep } = useWizard();

  const handlePress = (index: number) => {
    if (index < activeStep) {
      goToStep(index);
    }
  };

  const buttonContents = (i: number) => {
    return <Typography variant="stepheading">{stepHeaders[i]}</Typography>;
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[
          {
            label: 'Admin',
            link: JBTRoutes.admin
          },
          {
            label: 'Add new machine'
          }
        ]}
        heading=""
      />
      <ArrowButtonBar
        numButtons={stepHeaders.length}
        activeButton={activeStep}
        handlePress={handlePress}
        buttonContents={buttonContents}
      />
    </>
  );
}

export function AddNewMachine(): JSX.Element {
  const [machine, setMachine] = useState<SalesforceMachine | null>(null);

  function machineUpdate(m: SalesforceMachine) {
    setMachine(m);
  }
  return (
    <Wizard header={<WizHeader />}>
      <AccountSearchPanel machineUpdate={machineUpdate} />
      <ConfirmMachineFamily machine={machine} />
      <UploadSpareParts />
      <ReviewInfoAndSubmit />
    </Wizard>
  );
}
