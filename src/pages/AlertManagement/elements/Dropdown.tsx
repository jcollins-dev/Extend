import React from 'react';

import { DropdownMenuContainer } from '../index.elements';

import { default as CopyFromMachineIcon } from '../icons/copyFromMachine.svg';
import { default as CustomAlertIcon } from '../icons/customAlert.svg';

export const DropdownMenu = (): JSX.Element => {
  const dropdownMenuItems = [
    {
      img: CopyFromMachineIcon,
      altText: 'Copy Alert from template',
      text: 'Copy Alert from template',
      onClick: () => console.log('on click Copy Alert from template')
    },
    {
      img: CustomAlertIcon,
      altText: 'Create a custom Alert',
      text: 'Create a custom Alert',
      onClick: () => console.log('on click Create a custom Alert')
    }
  ];

  const dropdownItems = dropdownMenuItems.map((item, index) => (
    <li key={index} className="dropdown--item">
      <button>
        <img src={item.img} alt={item.altText} />
        {item.text}
      </button>
    </li>
  ));

  return <DropdownMenuContainer>{dropdownItems}</DropdownMenuContainer>;
};
