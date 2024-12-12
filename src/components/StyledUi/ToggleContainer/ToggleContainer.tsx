import React, { ReactNode, useMemo, useState } from 'react';
import { ToggleContainerContainer } from './ToggleContainer.elements';
import { IcoChevRight } from 'icons';

export interface ToggleContainerProps {
  title: ReactNode | ReactNode[];
  className?: string;
  gridArea?: string;
  closed?: boolean;
  hideIcon?: boolean;
  hasBorder?: boolean;
  HeaderBefore?: ReactNode | ReactNode[];
}

interface Props extends ToggleContainerProps {
  children: ReactNode | ReactNode[];
}

const baseClass = `toggle-container`;
export const ToggleContainer = ({
  children,
  title,
  className,
  closed,
  hideIcon,
  hasBorder,
  HeaderBefore
}: Props): JSX.Element => {
  const [open, setOpen] = useState(closed ? false : true);

  className = `${baseClass} ${baseClass}${open ? `--is-open` : `--is-closed`}${
    className ? ` ${className}` : ``
  }`;

  if (hasBorder) className = `${className} ${baseClass}--has-border`;

  const handleClick = () => setOpen(!open);

  const ret = useMemo(() => children, [children]);

  let Header = (
    <div onClick={() => handleClick()} className="toggle-container__toggler">
      <div className="toggle-container-header__title">{title}</div>
      {!hideIcon && <IcoChevRight />}
    </div>
  );

  if (HeaderBefore)
    Header = (
      <div className="toggle-container-header">
        {HeaderBefore}
        <div onClick={() => handleClick()} className="toggle-container__toggler">
          <div className="toggle-container-header__title">{title}</div>
          {!hideIcon && <IcoChevRight />}
        </div>
      </div>
    );

  return (
    <ToggleContainerContainer {...{ className }}>
      {Header}
      <div className="toggle-container-main">{ret}</div>
    </ToggleContainerContainer>
  );
};
