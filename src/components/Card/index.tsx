import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Body from './Body';

interface Props {
  children?: React.ReactNode;
  heading?: React.ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  gridArea?: string;
  // We export the Header & Body components for neatness
  Header?: React.ComponentType;
  Body?: React.ComponentType;
}

const Container = styled.div<Props>`
  overflow: hidden;
  border: 1px solid ${(props) => props.borderColor || props.theme.colors.lightGrey3};
  border-radius: 0.5rem;
  background-color: ${(props) => props.backgroundColor || props.theme.colors.white};
  grid-areas: ${({ gridArea }) => gridArea};
`;

const Card = ({
  children,
  borderColor,
  backgroundColor,
  gridArea,
  ...rest
}: Props): JSX.Element => (
  <Container
    gridArea={gridArea}
    borderColor={borderColor}
    backgroundColor={backgroundColor}
    {...rest}
  >
    {children}
  </Container>
);

Card.Header = Header;
Card.Body = Body;

export default Card;
