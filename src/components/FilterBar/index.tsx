import React, { ReactElement } from 'react';
import styled, { useTheme } from 'styled-components';
import { Typography } from 'components';

interface Props {
  heading?: string;
  subheading?: string;
  children?: React.ReactNode;
  icon?: ReactElement;
  // Custom header
  component?: JSX.Element;
  borderColor?: string;
  handleHide?: () => void;
}

const Content = styled.div`
  display: flex;
  margin: 0 1rem;
  flex: 1;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
`;

const Container = styled.div<Props>`
  border: 0.0625rem solid ${(props) => props.borderColor || props.theme.colors.lightGrey3};
  border-radius: 0.5rem;
  display: flex;
  padding: 0.625rem;
`;

const IconContainer = styled.div`
  align-content: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  margin-left: 0.9375rem;
  margin-right: 0.3125rem;
`;
const OpenContainer = styled.div`
  display: flex;
  align-items: center;
`;

const HideButton = styled.div`
  color: ${({ theme }) => theme.colors.mediumBlue};
  display: flex;
  align-content: center;
  justify-content: center;
  margin-left: 1rem;
  cursor: pointer;
`;

const FilterBar = ({ heading, children, component, icon, handleHide }: Props): JSX.Element => {
  const theme = useTheme();
  return (
    <>
      {component ? (
        <Container>{component}</Container>
      ) : (
        <>
          <Container>
            {heading && (
              <OpenContainer>
                <IconContainer>{icon}</IconContainer>
                <Typography variant="stepheading" color={theme.colors.darkGrey}>
                  {heading}
                </Typography>
                {handleHide && (
                  <HideButton onClick={() => handleHide()}>
                    <Typography variant="stepheading">Hide</Typography>
                  </HideButton>
                )}
              </OpenContainer>
            )}
            <Content>{children}</Content>
          </Container>
        </>
      )}
    </>
  );
};
export default FilterBar;
