import React, { ReactElement } from 'react';

import { default as PlusIcon } from '../icons/plus.svg';
import { default as PencilIcon } from '../icons/pencil.svg';
import { default as DuplicateIcon } from '../icons/duplicate.svg';
import { default as DeleteIcon } from '../icons/delete.svg';
import { DropdownMenu } from './Dropdown';

interface MenuProps {
  className?: string;
  items: {
    image: string;
    text: string;
    onClick?: () => void; // onClick would handle what happens when menu item is clicked
    dropdown?: ReactElement;
  }[];
}

export const Menu = ({ items, className }: MenuProps): JSX.Element => {
  const menu = items.map((item, index) => {
    const { image, text, onClick, dropdown } = item;
    return (
      <>
        {dropdown ? (
          <>
            <li key={index} data-disabled="false">
              <img src={image} alt={text} />
              {text}
              <button className="button dropmenu" onClick={onClick}>
                <img src={image} />
              </button>
            </li>
            {dropdown}
          </>
        ) : (
          <li key={index} data-disabled="false">
            <button className="button" onClick={onClick}>
              <img src={image} alt={text} />
              {text}
            </button>
          </li>
        )}
      </>
    );
  });
  return <ul className={className}>{menu}</ul>;
};

export const MenuAlerts = (): JSX.Element => {
  const [openNewAlertBtn, setOpenNewAlertBtn] = React.useState(false);

  const handleOpen = () => {
    setOpenNewAlertBtn(!openNewAlertBtn);
  };

  const options = [
    {
      image: PlusIcon,
      text: 'New Alert',
      onClick: handleOpen,
      dropdown: <DropdownMenu />
    },
    {
      image: PencilIcon,
      text: 'Edit'
    },
    {
      image: DuplicateIcon,
      text: 'Duplicate'
    },
    {
      image: DeleteIcon,
      text: 'Delete'
    }
  ];

  return <Menu items={options} className="menu" />;
};

export const MenuAlertTemplates = (): JSX.Element => {
  const options = [
    {
      image: PlusIcon,
      text: 'New Alert Template'
    },
    {
      image: PencilIcon,
      text: 'Edit'
    },
    {
      image: DuplicateIcon,
      text: 'Duplicate'
    },
    {
      image: DeleteIcon,
      text: 'Delete'
    }
  ];

  return <Menu items={options} className="menu" />;
};
