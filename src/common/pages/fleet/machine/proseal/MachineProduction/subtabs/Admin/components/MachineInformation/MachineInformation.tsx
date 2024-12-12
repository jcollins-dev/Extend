import React, { useState } from 'react';
//import { useMachineInfo } from '../../../hooks/useMachineInfo';
import { AdminSection } from './MachineInformation.elements';
import { GlobalForm } from 'common/components/GlobalForm';
import { ChevronDown } from 'icons/IconChevronDown';

export const MachineInformation = (): JSX.Element => {
  //API here
  //const { data } = useMachineInfo();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const formFields = [
    {
      name: 'customer',
      label: 'Customer',
      isDisabled: !isEdit
    },
    {
      name: 'serialNumber',
      label: 'Serial Number',
      value: '123456789',
      isDisabled: !isEdit
    },
    {
      name: 'portalDataBaseName',
      label: 'Portal Database Name',
      value: 'SN-324-ADF234',
      isDisabled: !isEdit
    },
    {
      name: 'proVisionStorageContainer',
      label: 'ProVision Storage Container Name',
      isDisabled: !isEdit
    },
    {
      name: 'databaseSchema',
      label: 'Database Schema',
      isDisabled: !isEdit
    },
    {
      name: 'eWONName',
      label: 'eWON Name',
      isDisabled: !isEdit
    },
    {
      name: 'deviceSerialNumber',
      label: 'Device Serial Number',
      isDisabled: !isEdit
    },
    {
      name: 'displayName',
      label: 'Display Name',
      isDisabled: !isEdit
    },
    {
      name: 'subsciptionEndDate',
      label: 'Subscription End Date',
      isDisabled: !isEdit
    },
    {
      name: 'machineTimeZone',
      label: 'Machine Time Zone',
      isDisabled: !isEdit
    }
  ];

  const args = {
    title: '',
    formFields: formFields,
    handle: {
      cancel: () => setIsEdit(false),
      submit: () => console.log('form submitted') //api call here to update
    }
  };

  return (
    <AdminSection className="admin_section">
      <div className="admin_title_section">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className={`admin_collapse_button ${isOpen ? 'open' : 'closed'}`}
        >
          <ChevronDown />
        </button>
        <h2>Machine Information</h2>
      </div>
      <small>Modify general machine details. Admin access required.</small>
      <div
        className={`admin_content_section ${isOpen ? 'open' : 'closed'} ${
          isEdit ? 'visible' : 'hidden'
        }`}
      >
        <GlobalForm {...args} />
        <div className={`admin_section--button ${isEdit ? 'hidden' : 'visible'}`}>
          <button className="button" onClick={() => setIsEdit(true)} type="submit">
            Edit
          </button>
        </div>
      </div>
    </AdminSection>
  );
};
