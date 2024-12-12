import { Button, RadioButton, Typography } from 'components';
import { SalesforceMachine } from 'types/salesforce';
import styled from 'styled-components';
import React, { useState } from 'react';

const ButtonBar = styled.div`
  display: flex;
  direction: row;
  justify-content: space-between;
  padding-left: 0.1875rem;
  padding-right: 0.1875rem;
  margin-top: 4.375rem;
`;

const MachineOptionsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  width: 100%;
  margin-top: 1.5rem;
`;

const MachineOptionsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: 0.625rem;
`;

const MachineOption = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  width: 30%;
  overflow-wrap: break-word;
`;

interface MachinesProps {
  machines: SalesforceMachine[];
  onBack: () => void;
  onNext: (machineId: string) => void;
}

export function MachineOptionSelector({ machines, onBack, onNext }: MachinesProps): JSX.Element {
  const [machineId, setMachineId] = useState<string | null>(null);

  function onRadioChange(machineId: string) {
    setMachineId(machineId);
  }

  const rows: JSX.Element[][] = [];
  let currRow = 0;
  for (let i = 0; i < machines.length; i++) {
    if (i % 3 === 0) {
      rows.push([]);
      currRow = i / 3;
    }
    rows[currRow].push(
      <MachineOption key={machines[i].machineId}>
        <RadioButton
          checked={machineId == machines[i].machineId}
          onChange={onRadioChange.bind(null, machines[i].machineId)}
          label={machines[i].machineName}
        />
      </MachineOption>
    );
  }

  function onClickNext() {
    if (machineId !== null) {
      onNext(machineId);
    }
  }

  return (
    <>
      <Typography variant="h2">Select Machine</Typography>
      <MachineOptionsTable>
        {rows.map((row) => (
          <MachineOptionsRow key={row[0].key}>{row}</MachineOptionsRow>
        ))}
      </MachineOptionsTable>
      <ButtonBar>
        <Button width="5.25rem" onClick={onBack}>
          Back
        </Button>
        <Button disabled={machineId === null} width="5.25rem" onClick={onClickNext}>
          Next
        </Button>
      </ButtonBar>
    </>
  );
}
