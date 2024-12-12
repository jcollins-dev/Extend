// Third Party
import React, { useMemo } from 'react';
import styled from 'styled-components';

// Components
import { Button, Typography, Modal, BaseTable } from 'components';

import { useGetMachineTagUnitClassesQuery } from 'api';

// Types
import { ModalSize } from 'types';

const Container = styled.div`
  padding: 1.3125rem;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 0.625rem;
  margin-top: 1.5625rem;
`;

interface UnitClassesModalProps {
  handleModal: (x: boolean) => void;
  isOpen: boolean;
}

const useModalData = () => {
  const { data } = useGetMachineTagUnitClassesQuery();

  const unitClasses = data?.map(({ id, name }) => ({ id, name })).filter((x) => x);

  const columnConfigs = [
    {
      title: 'Unit Class Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Unit Class ID',
      dataIndex: 'id',
      key: 'id'
    }
  ];
  unitClasses?.sort((a, b) => a.name.localeCompare(b.name));

  return { unitClasses, columnConfigs };
};

export const UnitClassesModal = ({ handleModal, isOpen }: UnitClassesModalProps): JSX.Element => {
  const data = useModalData();

  const { unitClasses, columnConfigs } = useMemo(() => data, []);

  return (
    <Modal size={ModalSize.SMALL} visible={isOpen} onClose={() => handleModal(false)}>
      <Container>
        {unitClasses && (
          <BaseTable
            title="Unit Classes"
            columnConfigs={columnConfigs}
            data={unitClasses}
            renderCustomEmptyText={() => {
              return (
                <Typography
                  color="darkGrey"
                  weight="medium"
                  style={{ marginLeft: '1.25rem', marginTop: '1.5rem' }}
                >
                  No tags available.
                </Typography>
              );
            }}
          />
        )}
        <Footer>
          <Button onClick={() => handleModal(false)}>close</Button>
        </Footer>
      </Container>
    </Modal>
  );
};
