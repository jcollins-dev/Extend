import React from 'react';

import { default as FromTemplateIcon } from '../icons/FromTemplate.svg';
import { default as CustomAlertIcon } from '../icons/customAlert.svg';
import { default as CopyFromMachineIcon } from '../icons/copyFromMachine.svg';

interface AlertActionButtonProps {
  img: string;
  altText?: string;
  text?: string;
  onClick?: () => void;
  index?: number;
}

const Button = ({ img, altText, text, onClick, index }: AlertActionButtonProps): JSX.Element => {
  return (
    <button key={index} className="button action" onClick={onClick}>
      <img src={img} alt={altText} />
      {text}
    </button>
  );
};

export const ActionButtons = (): JSX.Element => {
  const buttons = [
    {
      img: FromTemplateIcon,
      altText: 'copy from template',
      text: 'Copy from Template',
      onClick: () => console.log('on click copy template')
    },
    {
      img: CustomAlertIcon,
      altText: 'create a custom alert',
      text: 'Create a custom Alert',
      onClick: () => console.log('on click create a custom alert')
    },
    {
      img: CopyFromMachineIcon,
      altText: 'copy from machine',
      text: 'Copy from Machine',
      onClick: () => console.log('on click copy from machine')
    }
  ];

  const renderButtons = buttons.map((button, index) => <Button {...button} key={index} />);

  return <section className="button_container">{renderButtons}</section>;
};
