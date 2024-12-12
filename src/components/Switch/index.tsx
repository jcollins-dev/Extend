// 3rd party libs
import React from 'react';
import { useTheme } from 'styled-components';
import SwitchComponent, { ReactSwitchProps } from 'react-switch';

const Switch = (props: ReactSwitchProps): JSX.Element => {
  const theme = useTheme();
  return (
    <SwitchComponent
      offColor={props.offColor || theme.colors.lightGrey2}
      onColor={theme.colors.mediumBlue3}
      offHandleColor={props.offHandleColor || theme.colors.white}
      onHandleColor={theme.colors.mediumBlue}
      boxShadow="0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2)"
      uncheckedIcon={false}
      checkedIcon={false}
      width={props.width || 32}
      height={props.height || 12}
      handleDiameter={props.handleDiameter || 20}
      {...props}
    />
  );
};

export default Switch;
