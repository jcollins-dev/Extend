// 3rd party libs
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Typography } from 'components';
import theme from 'themes';

interface LineProps {
  hasText: boolean;
  thickness?: string | number;
}

interface Props {
  title?: string;
  color?: string;
  thickness?: string | number;
}

// Styling
const StyledDiv = styled.div<LineProps>`
  display: flex;
  align-items: center;
  text-align: center;

  ::after,
  ::before {
    content: '';
    border: ${props => props.thickness || '0.0625rem'} solid ${theme.colors.mediumGrey2};
    flex: 1;
  }

  ${(props) => props.hasText ? `
    :not(:empty)::before {
      margin-right: 0.5rem;
    }
    :not(:empty)::after {
      margin-left: 0.5rem;
    }
  ` : ''}
`;

const Divider = ({ title, thickness, color = theme.colors.mediumGrey2 }: Props): ReactElement => {
  return (
    <StyledDiv hasText={Boolean(title)} thickness={thickness}>
      <Typography size={20} color={color} weight="bold" mb={0}>
        {title}
      </Typography>
    </StyledDiv>
  );
};

export default Divider;
