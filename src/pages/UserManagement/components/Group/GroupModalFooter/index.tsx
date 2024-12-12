// 3rd party libs
import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

// Components
import { Button, WarningPrompt } from 'components';

import { GroupItem } from 'types/user-management';
import { Id } from 'types';
import { useAddEditGroupUserManagementMutation, useDeleteGroupUserManagementMutation } from 'api';
import { isValidGroup } from 'pages/UserManagement/components/Group/AddEditGroup/Scope/ScopeUtils';

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin: 1rem 0;
  padding: 0 1rem;
`;

interface Props {
  tableItemId?: Id;
  onClose: () => void;
  onCloseVerifyData: () => void;
  groupInfo?: GroupItem;
  isActiveUserPromptMode: boolean;
}

const GroupModalFooter = ({
  tableItemId,
  onClose,
  onCloseVerifyData,
  groupInfo,
  isActiveUserPromptMode
}: Props): ReactElement => {
  const [isViewConfirmDelete, setIsViewConfirmDelete] = useState(false);

  const [deletedGroup, { isLoading: isLoadingDeleteGroup }] =
    useDeleteGroupUserManagementMutation();
  const [saveGroup, { isLoading: isLoadingSaveGroup }] = useAddEditGroupUserManagementMutation();

  const onGroupDelete = useCallback(async () => {
    if (tableItemId) {
      deletedGroup({ groupId: tableItemId })
        .unwrap()
        .then(() => {
          toast.success('Group has been removed.', {
            position: 'bottom-right'
          });
          onClose();
        })
        .catch((err) => {
          console.error('Failed to delete', err);
          const { data } = err;
          toast(`⚠️ ${data && data.detail}` ?? '⚠️ There was a problem deleting the group.');
        });
      setIsViewConfirmDelete(false);
    }
  }, [tableItemId, onClose]);

  const onGroupSave = useCallback(async () => {
    if (isEmpty(groupInfo) || (!isEmpty(groupInfo) && !isValidGroup(groupInfo))) {
      toast.warning('Organizations, Lines and machines can not be empty.');
    } else if (groupInfo) {
      // if Edit, add id to request body
      saveGroup(groupInfo)
        .unwrap()
        .then(() => {
          toast.success(`The group has been ${tableItemId ? 'updated.' : 'created.'}`, {
            position: 'bottom-right'
          });
          onClose();
        })
        .catch((err) => {
          console.error('Failed to save', err);
          const { data } = err;
          toast(`⚠️ ${data && data.detail}` ?? '⚠️ There was a problem saving the group.');
        });
    }
  }, [groupInfo, tableItemId, onClose]);

  const allPermissionsFalse = groupInfo?.permissions?.every(
    (permission) => !permission.read && !permission.write
  );

  // Name, permission and at least 1 scope are required.
  const isDisabledSave = useMemo(
    () =>
      isLoadingDeleteGroup ||
      isLoadingSaveGroup ||
      isEmpty(groupInfo) ||
      isEmpty(groupInfo.name) ||
      isEmpty(groupInfo.permissions) ||
      allPermissionsFalse ||
      (!isEmpty(groupInfo) && !isValidGroup(groupInfo)) ||
      (isEmpty(groupInfo.organizations) && !groupInfo.allOrganizations),
    [groupInfo]
  );

  return (
    <>
      <WarningPrompt
        helperText={`Are you sure you want to delete this group? This action cannot be undone!`}
        isConfirmPrompt
        isVisible={isViewConfirmDelete}
        onCancelCallback={() => setIsViewConfirmDelete(false)}
        onConfirmCallback={() => onGroupDelete()}
        title={`Remove "${groupInfo?.name}"`}
      />
      <ButtonContainer>
        {tableItemId && (
          <Button
            disabled={isLoadingSaveGroup || isLoadingDeleteGroup || isActiveUserPromptMode}
            variant="danger"
            onClick={() => setIsViewConfirmDelete(true)}
          >
            Delete
          </Button>
        )}
        <Button variant="secondary" onClick={onCloseVerifyData} disabled={isActiveUserPromptMode}>
          Cancel
        </Button>
        <Button
          disabled={isDisabledSave || isActiveUserPromptMode}
          variant="primary"
          onClick={onGroupSave}
        >
          Save Changes
        </Button>
      </ButtonContainer>
    </>
  );
};

export default GroupModalFooter;
