// 3rd party
import React, { ReactElement, useState } from 'react';
import styled from 'styled-components';
import theme from 'themes';
import { useTranslation } from 'react-i18next';

// Types
import { BusinessUnit, ChangeEvent, Machine } from 'types';
import { HelpEmailArgs, HelpEmailRequestType } from 'types/maintenance';
import { BaseSelect, Input, Typography, Button } from 'components';
import Select from 'react-select';

//Helper
import { useAllUserMachines } from 'helpers/machine';

//Constants
import { emailRequestTypeOptions } from 'constants/helpEmail';

// API
import { useCreateHelpEmailMutation } from 'api';
import { toast } from 'react-toastify';
import { useHelp } from 'selectors';
import { useDispatch } from 'react-redux';
import { helpActions } from 'actions';

// Styling
const Root = styled.div`
  display: block;
`;

// Components

type StateManagedSelect = {
  value: string;
  label: string;
};

const InputRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 0rem;
  flex-grow: 1;
  align-items: center;
`;

const InputTitle = styled.div`
  margin-right: 0.25rem;
  margin-top: 0;
  margin-bottom: 0;
  align-items: center;
  padding: 0rem;
  // width: 45%;
  display: flex;
  gap: 5px;
`;

const InputItem = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 0rem;
  align-items: baseline;
  flex-direction: column;
  & > div {
    width: 100%;
  }
`;

const InputFile = styled.div`
  width: 100%;
  display: flex;
  padding-top: 0.4rem;
`;

const Mandatory = styled.div`
  color: ${({ theme }) => theme.colors.darkRed};
  font-weight: 700;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.lightGrey6};
  box-shadow: ${({ theme }) => theme.colors.borders.border02.shadow};
  border-radius: 0.375rem;
  font-size: 90%;
`;

interface Props {
  businessUnits: BusinessUnit[];
}

type emailPropNames = 'requestType' | 'buID' | 'customerEmail' | 'message' | 'image';

const HelpEmailForm = ({ businessUnits }: Props): ReactElement => {
  const machines = useAllUserMachines();
  const helpInfo = useHelp();
  const dispatch = useDispatch();
  const { t } = useTranslation(['common']);

  const defaultHelpEmail: HelpEmailArgs = {
    requestType: HelpEmailRequestType.SelectHelp,
    customerEmail: '',
    buID: businessUnits[0].id,
    message: helpInfo?.helpMessage ? helpInfo.helpMessage : ''
  };
  const i18nEmailRequestTypesOptions = emailRequestTypeOptions.map(
    (option) => (option.label = t(option.label))
  );

  const [localHelpEmail, setLocalHelpEmail] = useState<HelpEmailArgs>(defaultHelpEmail);
  const [selectedMachine, setSelectedMachine] = useState<Machine>();
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<Machine>();
  const [uploadedFile, setUploadedFile] = useState<string>('');

  const handleEmailChange = (
    value: string | number | HelpEmailRequestType | FormData | undefined,
    propName: emailPropNames
  ) => {
    setLocalHelpEmail({ ...localHelpEmail, [propName]: value });
  };

  const options: StateManagedSelect[] = machines
    ? machines.map((m) => ({
        value: m.serialNumber,
        label: m.serialNumber
      }))
    : [{ value: '', label: '' }];

  const [createHelpEmail] = useCreateHelpEmailMutation();
  return (
    <Root>
      <InputRow>
        <InputItem>
          <InputTitle>
            <Typography variant="inputlabel">{t('option')} </Typography>
            <Mandatory>*</Mandatory>
          </InputTitle>

          <BaseSelect
            placeholder={t('select_dot') as string}
            options={i18nEmailRequestTypesOptions}
            variant="white"
            value={localHelpEmail?.requestType as HelpEmailRequestType}
            handleChange={(event) => handleEmailChange(event.target.value, 'requestType')}
          />
        </InputItem>
      </InputRow>
      <InputRow>
        {machines && (
          <InputItem>
            <InputTitle>
              <Typography variant="inputlabel">{t('machine')}</Typography>
              <Mandatory>*</Mandatory>
            </InputTitle>
            <BaseSelect
              placeholder={t('select_dot') as string}
              options={machines ? machines.map((m) => m.description) : ['']}
              variant="white"
              value={selectedMachine ? selectedMachine.description : ''}
              handleChange={(event) => {
                machines.forEach((m) => {
                  if (m.description === event.target.value) {
                    setSelectedMachine(m);
                    if (m.businessUnit) {
                      handleEmailChange(m.businessUnit, 'buID');
                    }
                  }
                });
              }}
            />
          </InputItem>
        )}
      </InputRow>
      <InputRow>
        {machines && (
          <InputItem>
            <InputTitle>
              <Typography variant="inputlabel">{t('machine_serial_number')}</Typography>
            </InputTitle>
            <Select
              options={options}
              value={
                selectedSerialNumber
                  ? {
                      value: selectedSerialNumber.serialNumber,
                      label: selectedSerialNumber.serialNumber
                    }
                  : null
              }
              onChange={(selectedOption) => {
                const targetValue = selectedOption?.value;
                if (typeof targetValue === 'string') {
                  machines.forEach((m) => {
                    if (m.serialNumber === targetValue) {
                      setSelectedSerialNumber(m);
                      if (m.businessUnit) {
                        handleEmailChange(m.businessUnit, 'buID');
                      }
                    }
                  });
                }
              }}
              styles={{
                control: (provided) => ({
                  ...provided,
                  width: '100%'
                })
              }}
            />
          </InputItem>
        )}
      </InputRow>
      <InputRow>
        <InputItem>
          <InputTitle>
            <Typography variant="inputlabel">{t('email')}</Typography>
            <Mandatory>*</Mandatory>
          </InputTitle>
          <Input
            type="email"
            fd
            variant="white"
            placeholder="customer@comp.com"
            value={localHelpEmail?.customerEmail}
            onChange={(event: ChangeEvent) => {
              handleEmailChange(event.target.value, 'customerEmail');
            }}
          />
        </InputItem>
      </InputRow>
      <InputRow>
        <InputItem>
          <InputTitle>
            <Typography variant="inputlabel">Comments</Typography>
            <Mandatory>*</Mandatory>
          </InputTitle>
          <StyledTextarea
            rows={3}
            value={localHelpEmail?.message}
            placeholder={'Please provide details'}
            onChange={(event) => {
              handleEmailChange(event.target.value, 'message');
            }}
          />
        </InputItem>
      </InputRow>

      <InputRow>
        <InputItem>
          <InputTitle>
            <Typography variant="inputlabel">{t('upload_file')}</Typography>
            <Typography variant="inputlabel" color={theme.colors.mediumGrey2}>
              ({t('jpeg_png')})
            </Typography>
          </InputTitle>
          <InputFile>
            <Input
              type="file"
              value={uploadedFile}
              borderVariant="none"
              onChange={(event: ChangeEvent) => {
                if (event.target.files) {
                  setUploadedFile(event.target.value);
                  const formData = new FormData();
                  formData.append('image', event.target.files[0]);
                  handleEmailChange(formData, 'image');
                }
              }}
            />
          </InputFile>
        </InputItem>
      </InputRow>

      <InputRow>
        <Button
          onClick={() => {
            dispatch({ type: helpActions.REMOVE_HELP_MESSAGE });
            if (localHelpEmail.buID == 0 && machines) {
              localHelpEmail.buID == machines[0].businessUnit;
            }
            createHelpEmail({
              requestType: localHelpEmail.requestType,
              customerEmail: localHelpEmail.customerEmail,
              message: localHelpEmail.message,
              buID: localHelpEmail.buID,
              image: localHelpEmail.image,
              machine_name: selectedMachine?.description,
              selected_machine_id: selectedSerialNumber ? selectedSerialNumber.serialNumber : 0
            })
              .unwrap()
              .then(() => {
                toast.success(t('help_email_sent'));
                setLocalHelpEmail(defaultHelpEmail);
                // setSelectedMachine(;
                setUploadedFile('');
              })
              .catch((error) => {
                toast.error(t('could_not_send_email'));
                toast.error(error?.data?.detail);
              });
          }}
        >
          {t('submit')}
        </Button>
      </InputRow>
    </Root>
  );
};

export default HelpEmailForm;
