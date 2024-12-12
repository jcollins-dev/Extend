// 3rd party libs
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styled, { useTheme } from 'styled-components';
import validator from 'validate.js';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty, lowerCase, sortBy } from 'lodash';
import { PAGE_LENGTH } from 'constants/search';
import Select from 'react-select';

import {
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGetUserManagementQuery,
  useSaveUsersMutation
} from 'api';

// Components
import { Button, Card, Divider, Loader, Typography, WarningPrompt } from 'components';
import { UserManagementModalFooter } from 'pages/UserManagement/components';
import UserForm from './UserForm';

// Types
import { Id } from 'types';
import { User, UserFormElement, UserManagementTableType } from 'types/user-management';

import userConstraints from './UserValidatorConfig';

interface Props {
  userId?: Id;
  onClose: () => void;
  setIsChanged: (isChanged: boolean) => void;
  onCloseVerifyData: () => void;
  isActiveUserPromptMode?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding: 0 0.5rem;
`;
const FormContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
`;
const StyledCard = styled(Card)`
  overflow: visible;
`;
const MandatoryIndicator = styled.span`
  color: ${({ theme }) => theme.colors.darkRed};
`;
const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 0.125rem solid ${(props) => props.theme.colors.lightGrey4};
  padding: 1rem;
`;
const newUser: User = {
  firstName: '',
  lastName: '',
  email: '',
  emailAlert: false,
  textAlert: false,
  phone: ''
};

const validateUsers = (users: User[]) => {
  // Check Individual User states
  return users.map((user) => {
    const validationResult = validator.validate(user, userConstraints);
    if (validationResult) {
      return Object.keys(validationResult).reduce((result, key) => {
        return {
          ...result,
          [key]: validationResult[key][0]
        };
      }, {});
    }
    return {};
  });
};

const isAnyInvalid = (userFormElements: UserFormElement[]) => {
  return userFormElements.some((userFormElement) =>
    Object.keys(userFormElement.validationState).some((key) => userFormElement.validationState[key])
  );
};

const hasRequiredFields = (userFormElements: UserFormElement[]) => {
  let hasRequiredFields = true;
  userFormElements.some((userFormElement) => {
    if (
      isEmpty(userFormElement.user.email) ||
      isEmpty(userFormElement.user.firstName) ||
      isEmpty(userFormElement.user.lastName) ||
      isEmpty(userFormElement.user.phone)
    )
      hasRequiredFields = false;
  });
  return hasRequiredFields;
};

const AddEditUser = ({
  userId,
  onClose,
  setIsChanged,
  onCloseVerifyData,
  isActiveUserPromptMode
}: Props): ReactElement => {
  const theme = useTheme();
  const [userFormElements, setUserFormElements] = useState<UserFormElement[]>([
    { user: newUser, validationState: {}, id: uuidv4() }
  ]);
  const [groupId, setGroupId] = useState<Id>('');
  const [groupLabel, setGroupLabel] = useState('');
  const [isViewConfirmDelete, setIsViewConfirmDelete] = useState(false);

  const {
    data: userData,
    isFetching: isFetchingUser,
    error: userError
  } = useGetUserByIdQuery(userId || '', {
    skip: !userId
  });
  const {
    data: groups,
    isFetching: isFetchingGroups,
    error: groupsError
  } = useGetUserManagementQuery({
    type: lowerCase(UserManagementTableType.GROUP),
    limit: PAGE_LENGTH.XLARGE
  });

  const [saveUsers, { isLoading: isSaving }] = useSaveUsersMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    if (userData) {
      setUserFormElements([{ user: userData as User, validationState: {}, id: userData.id }]);
      setGroupId((userData as User).groupId as string);
      setGroupLabel((userData as User).groupName as string);
    }
  }, [userData]);

  const onUserUpdate = (updatedUserFormElement: UserFormElement, updateIndex: number) => {
    setUserFormElements((userFormElements) =>
      userFormElements.map((userFormElement, index) =>
        updateIndex === index ? updatedUserFormElement : userFormElement
      )
    );
    setIsChanged(true);
  };

  const addNewUser = useCallback(() => {
    setUserFormElements((userFormElements) => [
      ...userFormElements,
      { user: newUser, validationState: {}, id: uuidv4() }
    ]);
  }, []);

  const deleteAdditionalUser = (id: string) => {
    setUserFormElements((userFormElements) => userFormElements.filter((row) => row.id !== id));
  };

  const onSave = useCallback(async () => {
    const users = userFormElements.map((userFormElement) => {
      return {
        ...userFormElement.user,
        firstName: userFormElement.user.firstName?.trim(),
        lastName: userFormElement.user.lastName?.trim(),
        groupId
      };
    });
    const validationStates = validateUsers(users);
    if (!isAnyInvalid(userFormElements)) {
      // All validation is passed
      try {
        await saveUsers(users)
          .unwrap()
          .then(() => {
            toast.success(
              userId
                ? 'User has been successfully updated.'
                : `New ${users.length > 1 ? 'users' : 'user'} have been successfully created.`,
              {
                position: 'bottom-right'
              }
            );
          })
          .catch((error) => {
            toast.error(`Access denied`);
            console.log(error?.data?.detail);
          });
        onClose();
      } catch (error) {
        console.error(error);
        toast.error(
          `An error has occurred trying to save ${users.length > 1 ? 'these users' : 'this user'}.`
        );
      }
    } else {
      // Validation error found; update respective form's validations states
      setUserFormElements(
        users.map((user, index) => ({
          user,
          validationState: validationStates[index],
          id: userFormElements[index].id
        }))
      );
    }
  }, [userFormElements, groupId, userId, onClose]);

  const onDelete = useCallback(async () => {
    try {
      await deleteUser({ userId: userId as string }).unwrap();
      toast.success('User has been removed.', {
        position: 'bottom-right'
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(`An error has occurred trying to delete this user.`);
    }
    onClose();
  }, [userId, onClose]);

  const isSaveEnabled = useMemo(() => {
    return (
      Boolean(groupId) && !isAnyInvalid(userFormElements) && hasRequiredFields(userFormElements)
    );
  }, [groupId, userFormElements]);

  if (isFetchingUser || isFetchingGroups || isSaving || isDeleting)
    return (
      <Container>
        <Loader />
      </Container>
    );

  if (userError || groupsError)
    return (
      <Container>
        <Typography color="negativeRed">An error occurred trying to load this user</Typography>
      </Container>
    );

  const groupOptions = groups?.items
    ? groups?.items?.map((group) => ({
        label: group.name,
        value: group.id
      }))
    : [];

  const sortedOptions = sortBy(groupOptions, [
    (p) => {
      return lowerCase(p.label);
    }
  ]);

  const handleChange = (selectedOption: { label: string; value: string } | null) => {
    if (selectedOption) {
      setGroupId(selectedOption.value);
      setGroupLabel(selectedOption.label);
    }
  };
  return (
    <Container>
      <WarningPrompt
        helperText={`Are you sure you want to delete this user? This action cannot be undone!`}
        isConfirmPrompt
        isVisible={isViewConfirmDelete}
        onCancelCallback={() => setIsViewConfirmDelete(false)}
        onConfirmCallback={() => onDelete()}
        title={`Remove User ${userFormElements?.[0]?.user?.firstName ?? ''} ${
          userFormElements?.[0]?.user?.lastName ?? ''
        }`}
      />
      <FormContainer>
        {userFormElements.map((userFormElement, index) => (
          <React.Fragment key={userFormElement.id}>
            {index !== 0 && <Divider color={theme.colors.lightGrey1} />}
            <UserForm
              userNumber={index + 1}
              id={userFormElement.id}
              userData={userFormElement}
              onUserUpdate={(updatedUserFormElement) => onUserUpdate(updatedUserFormElement, index)}
              onDeleteAdditionalUser={() => deleteAdditionalUser(userFormElement.id)}
            />
          </React.Fragment>
        ))}
        {!userId && (
          <Button variant="primary" onClick={addNewUser} disabled={isActiveUserPromptMode}>
            Add additional User
          </Button>
        )}
        <StyledCard borderColor={theme.colors.mediumGrey1}>
          <Card.Header bgColor={theme.colors.lightGrey3}>
            <Typography color="darkGrey" weight="medium" size="1rem" as="span" mb={0}>
              Groups <MandatoryIndicator>*</MandatoryIndicator>
            </Typography>
          </Card.Header>
          <Card.Body pl={0} pr={0} pt={0} pb={0}>
            <SelectContainer>
              <Select
                options={sortedOptions}
                placeholder=""
                value={{ value: groupId, label: groupLabel }}
                onChange={handleChange}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    width: '362px'
                  })
                }}
              />
            </SelectContainer>
          </Card.Body>
        </StyledCard>
      </FormContainer>
      <UserManagementModalFooter
        onSave={onSave}
        onClose={onCloseVerifyData}
        onDelete={userId ? () => setIsViewConfirmDelete(true) : undefined}
        isSaveValid={isSaveEnabled}
        isActiveUserPromptMode={isActiveUserPromptMode as boolean}
      />
    </Container>
  );
};

export default AddEditUser;
