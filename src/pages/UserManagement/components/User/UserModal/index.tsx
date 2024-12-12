// 3rd party libs
import React, { ReactElement, useMemo, useState } from 'react';
import { UserManagementTableType } from 'types/user-management';
import styled, { useTheme } from 'styled-components';

// Components
import { AddEditUser } from 'pages/UserManagement/components';
import { Button, Flyout, FlyoutHeader, Modal, Typography } from 'components';
import AlertIcon from 'components/WarningPrompt/AlertIcon';

// Types
import { Id, ModalSize } from 'types';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.white};
  height: 100%;
`;
const StyledModalHeaderContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  width: 100%;
`;
const StyledButtonRow = styled.div`
  align-item: center;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding-top: 1.25rem;
`;
const StyledTitle = styled.div`
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0rem;
  line-height: 1.3125rem;
`;
const StyledContentContainer = styled.div`
  padding: 0 1.5rem 1.25rem;
  width: 100%;
`;

// Types
interface Props {
  tableType: UserManagementTableType;
  tableItemId?: Id;
  open: boolean;
  setIsOpenModal: (isOpenModal: boolean) => void;
}

const UserManagementModal = ({
  tableType,
  tableItemId,
  open,
  setIsOpenModal
}: Props): ReactElement => {
  const theme = useTheme();
  const [isChanged, setIsChanged] = useState(false);
  const [isViewConfirmCancel, setIsViewConfirmCancel] = useState(false);

  const onClose = () => {
    setIsChanged(false);
    setIsOpenModal(false);
  };

  const onCloseVerifyData = () => {
    if (isChanged) {
      setIsViewConfirmCancel(true);
    } else {
      setIsChanged(false);
      setIsOpenModal(false);
    }
  };

  const flyoutTitle = useMemo(() => {
    const tableTypeName = tableType === UserManagementTableType.USER ? 'User' : 'Group';
    return tableItemId ? `Edit ${tableTypeName}` : `Add ${tableTypeName}`;
  }, [tableType, tableItemId]);

  const helperText = `Are you sure you want to go back to users? You have unsaved changes.`;
  const title = 'Unsaved Changes';
  return (
    <>
      <Modal
        title={
          <StyledModalHeaderContainer>
            <AlertIcon />
            <StyledTitle>{title}</StyledTitle>
          </StyledModalHeaderContainer>
        }
        allowContentScroll
        onClose={onCloseVerifyData}
        showCloseButton={false}
        size={ModalSize.XSMALL}
        visible={isViewConfirmCancel}
      >
        <StyledContentContainer>
          <Typography color={theme.colors.mediumGrey3} variant="stepheading">
            {helperText}
          </Typography>
          <StyledButtonRow>
            <Button
              onClick={() => {
                setIsViewConfirmCancel(false);
              }}
              width="auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsOpenModal(false);
                setIsViewConfirmCancel(false);
              }}
              variant="danger"
              width="auto"
            >
              Yes
            </Button>
          </StyledButtonRow>
        </StyledContentContainer>
      </Modal>
      <Flyout width="28.125rem" visible={open} onClose={onCloseVerifyData}>
        <FlyoutHeader
          heading={flyoutTitle}
          onClose={onCloseVerifyData}
          bgColor={theme.colors.lightGrey2}
        />
        <Container tabIndex={0}>
          <AddEditUser
            userId={tableItemId}
            onClose={onClose}
            setIsChanged={setIsChanged}
            onCloseVerifyData={onCloseVerifyData}
            isActiveUserPromptMode={isViewConfirmCancel}
          />
        </Container>
      </Flyout>
    </>
  );
};

export default UserManagementModal;
