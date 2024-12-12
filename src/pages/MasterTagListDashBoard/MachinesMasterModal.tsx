// 3rd party
import React, { ReactElement, useMemo, useState } from 'react';
import styled from 'styled-components';
import theme from 'themes';

// Components
import { Modal, Pagination, Indicator } from 'components';
import MachineManagementTable from 'components/MachineManagementTable';

// API
import { useGetMachinesByMasterTagListIdQuery } from 'api';
import { skipToken } from '@reduxjs/toolkit/dist/query';

// Types
import { ModalSize } from 'types';
import { MachineProgressType } from 'types/machine-management';

import { PAGE_LENGTH } from 'constants/search';

interface MachineMasterModalProps {
  visible: boolean;
  masterTagListId?: string;
  masterTagListName?: string;
  handleClose: () => void;
}

const ITEMS_PER_PAGE = PAGE_LENGTH.SMALL;

// Styling

const TableContainer = styled.div`
  padding: 2rem 1rem 1rem 2rem;
`;

const StyledIndicator = styled(Indicator)`
  display: inline;
  margin: 0;
`;

const NoMachines = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5rem;
`;

const MachinesMasterModal = ({
  visible,
  masterTagListId,
  masterTagListName,
  handleClose
}: MachineMasterModalProps): ReactElement => {
  console.log(masterTagListName);

  const { data: onboardingMachines, isLoading: onboardingMachinesLoading } =
    useGetMachinesByMasterTagListIdQuery(
      masterTagListId ? { masterTagListId: masterTagListId } : skipToken
    );

  const rows = useMemo(() => {
    if (onboardingMachines === undefined) {
      return [];
    }
    return onboardingMachines;
  }, [onboardingMachines]);

  const machineInProgress = rows.filter((machine) => {
    if (
      machine.diagrams != MachineProgressType.DONE ||
      machine.maintenanceSchedule != MachineProgressType.DONE ||
      machine.provisionGateway != MachineProgressType.DONE ||
      machine.tagList != MachineProgressType.DONE
    )
      return machine;
  });

  const machineOnboarded = rows.filter((machine) => {
    if (
      machine.diagrams === MachineProgressType.DONE &&
      machine.maintenanceSchedule === MachineProgressType.DONE &&
      machine.provisionGateway === MachineProgressType.DONE &&
      machine.tagList === MachineProgressType.DONE
    )
      return machine;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastPost = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - ITEMS_PER_PAGE;
  const machines = machineOnboarded.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <Modal
      visible={visible}
      size={ModalSize.SMALL_AUTO_HEIGHT}
      widthOverride="80rem"
      showCloseButton={true}
      onClose={handleClose}
      title={`Machines using ${masterTagListName}`}
    >
      {!onboardingMachinesLoading &&
        (machineInProgress.length != 0 ?? machineOnboarded.length != 0) && (
          <>
            <TableContainer>
              <StyledIndicator color={theme.colors.atRiskYellow}>
                In Progress ({machineInProgress.length})
              </StyledIndicator>
              <MachineManagementTable
                data={machineInProgress}
                isDataLoading={onboardingMachinesLoading}
                headerBgColor={theme.colors.machineManagementColors.lightOrange}
              />
            </TableContainer>
            <TableContainer>
              <StyledIndicator color={theme.colors.onTrackGreen}>
                Complete ({machineOnboarded.length})
              </StyledIndicator>
              <MachineManagementTable
                data={machines}
                isDataLoading={onboardingMachinesLoading}
                headerBgColor={theme.colors.machineManagementColors.lightGreen}
              />
              <Pagination
                onPageChange={(page) => setCurrentPage(page)}
                itemsPerPage={ITEMS_PER_PAGE}
                numItems={machineOnboarded.length}
                currentPage={currentPage}
              />
            </TableContainer>
          </>
        )}
      {!onboardingMachinesLoading &&
        (machineInProgress.length == 0 ?? machineOnboarded.length == 0) && (
          <NoMachines>
            <span>No machines are using {masterTagListName}</span>
          </NoMachines>
        )}
    </Modal>
  );
};

export default MachinesMasterModal;
