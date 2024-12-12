import React, { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import Card from 'components/Card';
import theme from 'themes';

interface Props {
  children: ReactNode;
  height?: string;
}

// Styling
const StyledCard = styled(Card)`
  display: flex;
  height: ${(props: Props) => (props.height ? props.height : 'auto')};
  height: ${(props: Props) => (props.height ? props.height : 'auto')};
  border-color: ${theme.colors.mediumGrey1};
  h4,
  p {
    line-height: 1.125rem;
  }
`;
const KPISmallCard = (props: Props): ReactElement => {
  return <StyledCard {...props}>{props.children}</StyledCard>;
};

export default KPISmallCard;
