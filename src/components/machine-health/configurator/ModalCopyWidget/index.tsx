// 3rd Party libraries
import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// Components
import { BaseSelect, Button, Modal, Typography } from 'components';

// Types
import { ModalSize } from 'types';
import { MachineAccountInfoQueryParams } from 'types/protein';

// Api
import { useGetMachineByIdQuery, useGetMachinesQuery } from 'api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.25rem 1.25rem 1.25rem;
  overflow: visible;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1rem;
`;

const CustomButton = styled(Button)`
  width: 48%;
`;

type ModalCopyWidgetProps = {
  cancelText?: string;
  nextText?: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSelectMachine: (value: string) => void;
};

const ModalCopyWidget = ({
  cancelText = 'Cancel',
  nextText = 'Next',
  visible,
  setVisible,
  onSelectMachine
}: ModalCopyWidgetProps): JSX.Element => {
  const { machineId } = useParams<MachineAccountInfoQueryParams>();
  const { data: currentMachine } = useGetMachineByIdQuery(machineId);
  const { data: userMachines } = useGetMachinesQuery({});

  const [selectedMachine, setMachine] = React.useState('');

  const getMachines = () =>
    userMachines
      ?.filter(
        (machine) =>
          machine.businessUnit === currentMachine?.businessUnit && machine.id !== machineId
      )
      .map((a) => ({
        value: a.id,
        label: a.description || a.id
      })) || [];

  const onHandleSelect = (value: (string | Record<string, unknown>)[]) => {
    setMachine(typeof value[0] !== 'string' ? (value[0].value as string) : value[0]);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onNext = () => {
    onSelectMachine(selectedMachine);
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      hasDropdowns
      onClose={onClose}
      size={ModalSize.XSMALL_AUTO_HEIGHT}
      title=""
      visible={visible}
    >
      <Container>
        <Typography variant="h3">Select a Machine</Typography>
        <Typography variant="body1">
          Copy a machine configuration including widgets and layout
        </Typography>
        <BaseSelect
          searchable
          noDataMessage="Loading machines..."
          value={selectedMachine}
          handleChangeSearch={onHandleSelect}
          label="Select a Machine"
          options={getMachines()}
        />
        <ButtonsContainer>
          <CustomButton variant="secondary" onClick={onCancel}>
            {cancelText}
          </CustomButton>
          <CustomButton variant="primary" onClick={onNext}>
            {nextText}
          </CustomButton>
        </ButtonsContainer>
      </Container>
    </Modal>
  );
};

export default ModalCopyWidget;
