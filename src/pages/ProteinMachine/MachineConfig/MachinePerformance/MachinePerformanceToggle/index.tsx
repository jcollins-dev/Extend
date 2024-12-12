// 3rd party libs
import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { toast } from 'react-toastify';

// Components
import { Button, Loader, Modal, Pill, Switch as ToggleSwitch, Typography } from 'components';

// API
import { useUpdateMachineConfiguratorDataMutation } from 'api';

// Providers
import { useLanguage } from 'providers';

// Types
import { ModalSize } from 'types';
import { WidgetTableDataItem } from 'types/machine-health';

const StyledToggleContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StyledModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 3rem 1.5rem;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledSpan = styled.span`
  font-weight: ${({ theme }) => theme.typography.components.cardHeader.weight};
`;

interface Props {
  hasMachinePerformanceToggle: boolean;
  isMachinePerformanceActive: boolean;
  machinePerformanceWidget: WidgetTableDataItem | undefined;
  machineId: string;
}

const MachinePerformanceToggle = ({
  hasMachinePerformanceToggle,
  isMachinePerformanceActive,
  machinePerformanceWidget,
  machineId
}: Props): JSX.Element => {
  const theme = useTheme();
  const { languageId } = useLanguage();
  const [updateMachinePerformanceData, { isLoading, error }] =
    useUpdateMachineConfiguratorDataMutation();

  const [isActive, setIsActive] = useState(isMachinePerformanceActive);
  const [isMachinePerformanceToggleModalOpen, setIsMachinePerformanceToggleModalOpen] =
    useState(false);

  useEffect(() => {
    setIsActive(isMachinePerformanceActive);
  }, [isMachinePerformanceActive]);

  const saveMachinePerformanceInfo = async () => {
    setIsMachinePerformanceToggleModalOpen(false);

    if (!machinePerformanceWidget) {
      return toast.error(`Failed to update Machine Performance`);
    }

    // Reconstruct data to send to server
    const updatedMachinePerformance = {
      ...machinePerformanceWidget,
      active: isActive
    };

    await updateMachinePerformanceData({
      machineId,
      widget: updatedMachinePerformance,
      languageId: languageId
    })
      .unwrap()
      .then(() => {
        toast.success(`Machine Performance updated successfully`);
      })
      .catch((error) => {
        toast.error(`Failed to update Machine Performance`);
        console.error(error?.data?.detail);
      });
  };

  return (
    <>
      {isLoading && <Loader size={40} margin={0} />}
      {hasMachinePerformanceToggle && !error && !isLoading && (
        <StyledToggleContainer>
          <Pill onClick={() => setIsMachinePerformanceToggleModalOpen(true)} selected={false}>
            Machine Performance:{' '}
            <StyledSpan>{`${isMachinePerformanceActive ? 'Enabled' : 'Disabled'}`}</StyledSpan>
          </Pill>

          <Modal
            title="Toggle Machine Performance"
            visible={isMachinePerformanceToggleModalOpen}
            size={ModalSize.XSMALL_AUTO_HEIGHT}
            showCloseButton
            onClose={() => setIsMachinePerformanceToggleModalOpen(false)}
          >
            <StyledModalContentWrapper>
              <Typography color={theme.colors.darkGrey2} variant="body2" mb={0}>
                Use this toggle to enable or disable the Machine Performance tab for this machine.
              </Typography>
              <ToggleSwitch
                checked={isActive}
                handleDiameter={22}
                height={14}
                onChange={() => setIsActive((prev) => !prev)}
                width={40}
                offColor={theme.colors.mediumGrey2}
                offHandleColor={theme.colors.mediumGrey3}
              />
              <StyledButtonContainer>
                <Button
                  onClick={() => saveMachinePerformanceInfo()}
                  variant="primary"
                  width="5.25rem"
                >
                  Save
                </Button>
              </StyledButtonContainer>
            </StyledModalContentWrapper>
          </Modal>
        </StyledToggleContainer>
      )}
    </>
  );
};

export default MachinePerformanceToggle;
