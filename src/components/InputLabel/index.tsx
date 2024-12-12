import React from 'react';
import styled from 'styled-components';
import { Typography } from 'components';

interface Props {
  children?: React.ReactNode;
  id?: string;
  mandatory?: boolean;
  color?: string;
}

const MandatoryIndicator = styled.span`
  color: ${({ theme }) => theme.colors.errorRed};
`;

const InputLabel = ({ children, id, mandatory, color }: Props): JSX.Element => (
  <Typography color={color ? color : 'darkGrey'} htmlFor={id} variant="inputlabel">
    {children} {mandatory && <MandatoryIndicator>*</MandatoryIndicator>}
  </Typography>
);

export default InputLabel;
