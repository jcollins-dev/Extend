// 3rd party libs
import React, { ReactElement, useCallback, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useValidateUserEmailAvailableMutation } from 'api';
import { useTranslation } from 'react-i18next';
import validator from 'validate.js';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Card, Checkbox, Divider, Typography, Input, InputLabel } from 'components';

import { ChangeEvent } from 'types';
import { UserFormElement, User, UserValidationState } from 'types/user-management';

import userConstraints from './UserValidatorConfig';
import { CountryIso2, PhoneInput } from 'react-international-phone';
import { onlyLettersAndSpace } from 'helpers';

interface Props {
  userData: UserFormElement;
  onUserUpdate: (userFormElement: UserFormElement) => void;
  onDeleteAdditionalUser: () => void;
  userNumber: number;
  id: string;
}

interface InputContainerProps {
  isRow?: boolean;
  paddingHorizontal?: string | number;
}

const PhoneContainer = styled.div`
  display: flex;
  .react-international-phone-input-container {
    display: flex;
    width: 100%;
    .react-international-phone-country-selector {
      position: relative;
      .react-international-phone-country-selector-button {
        border-radius: 4px;
        margin-right: -1px;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        width: 40px;
        background: transparent;
        border: 1px solid #d8dde3;
      }
    }
    input {
      width: 100%;
      border: 1px solid #d8dde3;
      border-top-right-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }
    .react-international-phone-country-selector-dropdown {
      position: absolute;
      z-index: 1;
      top: var(--react-international-phone-dropdown-left, 44px);
      left: var(--react-international-phone-dropdown-left, 0);
      display: flex;
      width: 300px;
      max-height: 200px;
      flex-direction: column;
      padding: 4px 0;
      margin: 0;
      background-color: white;
      box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.25);
      color: #222;
      list-style: none;
      overflow-y: scroll;
      .react-international-phone-country-selector-dropdown__list-item {
        display: flex;
        min-height: 28px;
        box-sizing: border-box;
        align-items: center;
        padding: 2px 8px;
        img {
          margin-right: 8px;
          width: 24px;
          height: 24px;
        }
      }
    }
  }
`;
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const FormSection = styled.section`
  display: flex;
  flex-direction: row;
  gap: 1rem;

  div[class*='placeholder'],
  select option:first-child {
    color: #5d6a86;
  }

  &.occurrences {
    .ui-widget__main div > div {
      &:first-child {
        width: 24%;
      }
      &:nth-child(2) {
        width: 20%;
        margin: 0 1rem;
      }
      &:last-child {
        width: 56%;
      }
    }
  }

  .ui-widget {
    width: 100%;
  }

  .ui-widget__main > p {
    font-size: 0.875rem;
    padding-left: 1rem;
  }

  .ui-widget__main {
    overflow: visible;
  }

  .ui-date-range-picker {
    max-width: 435px;
  }

  .dropdown_checkboxes {
    font-family: ${({ theme }) => `${theme.typography.family}`};
    font-size: 0.875rem;
  }

  select {
    background: none;
  }
`;
const InputContainer = styled.div<InputContainerProps>`
  display: flex;
  flex-direction: ${(props) => (props.isRow ? 'row' : 'column')};
  gap: 0.25rem;
  justify-content: space-between;
  width: 100%;

  ${(props) =>
    props.paddingHorizontal
      ? `
    padding-left: ${props.paddingHorizontal};
    padding-right: ${props.paddingHorizontal};
  `
      : ''}

  & > div {
    padding-left: 0;
    padding-right: 0;
  }
`;
const StyledInputLabel = styled(InputLabel)`
  align-items: center;
  color: ${({ theme }) => theme.colors.text.mutedgray};
  font-weight: ${({ theme }) => theme.typography.text.helper.weight};
  font-size: 0.875rem;
  display: flex;
`;
const HeaderTitle = styled(Typography)`
  margin-block-start: 0;
  margin-block-end: 0;
  margin-bottom: 0.5rem;
`;
const ErrorText = styled(Typography)`
  color: ${({ theme }) => theme.colors.darkRed};
  min-height: 1rem;
  padding-left: 0.5rem;
`;

const AddEditUser = ({
  userData,
  onUserUpdate,
  userNumber,
  id,
  onDeleteAdditionalUser
}: Props): ReactElement => {
  const theme = useTheme();
  const { t } = useTranslation(['common']);
  const [user, setUser] = useState<User>(userData.user);
  const [validateUserEmail, { isLoading: isValidatingUserEmail }] =
    useValidateUserEmailAvailableMutation();

  const { validationState = {} } = userData;

  const onUserFieldUpdate = useCallback(
    async (field: string, value: string | number | boolean) => {
      const _user = {
        ...user,
        [field]: value
      };
      setUser(_user);

      if (
        validationState[field] ||
        field === 'textAlert' ||
        field === 'emailAlert' ||
        field === 'email'
      ) {
        onUserUpdate({
          user: _user,
          validationState: { ...validationState, [field]: undefined },
          id
        });
      }
    },
    [validationState, user]
  );

  const onEmailBlur = useCallback(async () => {
    const updatedValidationState: UserValidationState = { ...validationState, email: undefined };

    // Check if valid email pattern
    const emailRegex =
      /^(?=[^@]*[A-Za-z])([a-zA-Z0-9])(([a-zA-Z0-9])*([._-])?([a-zA-Z0-9]))*@(([a-zA-Z0-9-])+(\.))+([a-zA-Z]{2,4})+$/i;
    const emailRegexEmojiRes = /^(?!.*[\uD800-\uDFFF]).*$/;
    if (user.email === '') {
      updatedValidationState.email = `${t('email_not_empty')}`;
    } else if (
      !emailRegex.test(user.email as string) ||
      !emailRegexEmojiRes.test(user.email as string)
    ) {
      updatedValidationState.email = `${t('email_not_valid')}`;
    } else {
      // Check if email is available/taken by another user
      try {
        await validateUserEmail({ email: user.email as string, userId: user.id }).unwrap();
      } catch (error) {
        updatedValidationState.email = `${t('email_already_use')}`;
      }
    }

    onUserUpdate({
      user,
      validationState: updatedValidationState,
      id
    });
  }, [user.email, user.id, validationState]);

  const onFieldBlur = useCallback(
    async (field: string) => {
      const updatedValidationState: UserValidationState = {
        ...validationState,
        [field]: undefined
      };
      const validations = validator.validate({ [field]: user[field] }, userConstraints);
      if (validations[field]) {
        updatedValidationState[field] = validations[field][0];
      }

      onUserUpdate({
        user,
        validationState: updatedValidationState,
        id
      });
    },
    [user, validationState]
  );

  return (
    <FormContainer>
      <HeaderTitle variant="h2">
        {userNumber !== 1 && (
          <FontAwesomeIcon
            style={{ cursor: 'pointer' }}
            size="xs"
            icon={faTrash}
            color={theme.colors.negativeRed}
            onClick={() => onDeleteAdditionalUser()}
          />
        )}{' '}
        User {userNumber}
      </HeaderTitle>
      <FormSection>
        <InputContainer>
          <StyledInputLabel mandatory={true}>{t('first_name')}</StyledInputLabel>
          <Input
            value={user.firstName}
            onChange={(event: ChangeEvent) =>
              event.target.value.length <= 35 &&
              onlyLettersAndSpace(event.target.value) &&
              onUserFieldUpdate('firstName', event.target.value as string)
            }
            onBlur={() => onFieldBlur('firstName')}
            placeholder="First Name"
          />
          <ErrorText variant="helper">{validationState.firstName}</ErrorText>
        </InputContainer>
        <InputContainer>
          <StyledInputLabel mandatory={true}>{t('last_name')}</StyledInputLabel>
          <Input
            value={user.lastName}
            onChange={(event: ChangeEvent) =>
              event.target.value.length <= 35 &&
              onlyLettersAndSpace(event.target.value) &&
              onUserFieldUpdate('lastName', event.target.value as string)
            }
            onBlur={() => onFieldBlur('lastName')}
            placeholder="Last Name"
          />
          <ErrorText variant="helper">{validationState.lastName}</ErrorText>
        </InputContainer>
      </FormSection>
      <FormSection>
        <InputContainer>
          <StyledInputLabel mandatory={true}>{t('email_address')}</StyledInputLabel>
          <Input
            value={user.email}
            disabled={isValidatingUserEmail}
            onChange={(event: ChangeEvent) =>
              onUserFieldUpdate('email', event.target.value as string)
            }
            onBlur={onEmailBlur}
            placeholder="xyz@example.com"
          />
          <ErrorText variant="helper">{validationState.email}</ErrorText>
        </InputContainer>
      </FormSection>
      <FormSection>
        <InputContainer>
          <StyledInputLabel mandatory={true}>{t('cell_phone')}</StyledInputLabel>
          <PhoneContainer>
            <PhoneInput
              defaultCountry="us"
              value={user.phone || ''}
              onChange={(phone: string, country: CountryIso2) => {
                const inputValuePhone: string = phone;
                const inputValueCountry: string = country;

                if (inputValuePhone != '' && inputValueCountry != '') {
                  onUserFieldUpdate('phone', phone as string);
                  // onUserFieldUpdate('country', country as string);   // IF COUNTRY CODE IS REQUIRED THEN IMPLEMENT
                }
              }}
            />
          </PhoneContainer>
          <ErrorText variant="helper">
            {user.phone === ' ' ? <p>{validationState.phone}</p> : null}
          </ErrorText>
        </InputContainer>
      </FormSection>
      <Card borderColor={theme.colors.mediumGrey1}>
        <Card.Header bgColor={theme.colors.lightGrey3}>
          <Typography color="darkGrey" weight="medium" size="1rem" as="span" mb={0}>
            {t('notifications')}
          </Typography>
        </Card.Header>
        <Card.Body pl={0} pr={0} pt={0} pb={0}>
          <InputContainer isRow={true} paddingHorizontal="1.125rem">
            <StyledInputLabel as="p">{t('email')}</StyledInputLabel>
            <Checkbox
              id="email-notification-permission-check"
              width={20}
              height={20}
              checked={user.emailAlert}
              onChange={(event: ChangeEvent) =>
                onUserFieldUpdate('emailAlert', event.target.checked as boolean)
              }
            />
          </InputContainer>
          <Divider color={theme.colors.mediumGrey1} thickness="1px" />
          <InputContainer isRow={true} paddingHorizontal="1.125rem">
            <StyledInputLabel as="p">{t('text')}</StyledInputLabel>
            <Checkbox
              id="text-notification-permission-check"
              width={20}
              height={20}
              checked={user.textAlert}
              onChange={(event: ChangeEvent) =>
                onUserFieldUpdate('textAlert', event.target.checked as boolean)
              }
            />
          </InputContainer>
        </Card.Body>
      </Card>
    </FormContainer>
  );
};

export default AddEditUser;
