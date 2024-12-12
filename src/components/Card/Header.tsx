// 3rd party libs
import React from 'react';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
  bgColor?: string;
  icon?: React.ReactNode;
}

const Container = styled.header<Props>`
  padding: 1.125rem;
  display: flex;
  align-items: center;
  background-color: ${({ bgColor }) => bgColor};
`;

const IconContainer = styled.div`
  margin-right: 0.5rem;
  flex: 0;
  /* Apply a default size to fa icons */
  font-size: 0.8125rem;
`;

const Header = ({ children, bgColor, icon }: Props): JSX.Element => (
  <>
    {children && (
      <Container bgColor={bgColor}>
        {icon && <IconContainer>{icon}</IconContainer>}
        {children}
      </Container>
    )}
  </>
);

export default Header;
