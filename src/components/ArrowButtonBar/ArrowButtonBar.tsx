import styled from 'styled-components';
import React, { ReactElement } from 'react';

interface ArrowProps {
  index: number;
  activeStep: number;
}

interface ButtonBarProps {
  barTopMargin?: string;
}
const ButtonBarContainer = styled.div<ButtonBarProps>`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin-top: ${(props) => (props.barTopMargin ? props.barTopMargin : '-1.1875rem')};
  padding-left: 2.375rem;
  padding-right: 1.625rem;
`;

const ArrowContainer = styled.div`
  width: 100%;
  height: 2.375rem;
  position: relative;
  flex-grow: 1;
  margin-right: 0.8rem;

  &:last-child {
    margin-right: 0rem;
  }
`;

const Arrow = styled.div<ArrowProps>`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.25rem 1.5rem;
  color: ${(props) =>
    props.index === props.activeStep
      ? props.theme.colors.mediumBlue
      : props.index < props.activeStep
      ? props.theme.colors.darkGrey
      : props.theme.colors.lightGrey5};
  background-color: ${(props) => props.theme.colors.white};
  border: ${(props) =>
    props.index === props.activeStep
      ? props.theme.colors.borders.cartNav.borderActive
      : props.index < props.activeStep
      ? props.theme.colors.borders.cartNav.borderVisited
      : props.theme.colors.borders.cartNav.borderDefault};
  box-shadow: ${(props) => props.theme.colors.borders.cartNav.shadow};
  border-radius: 0.25rem;

  cursor: ${(props) => (props.index < props.activeStep ? 'pointer' : 'auto')};
`;

const FirstArrowBg = styled(Arrow)`
  position: absolute;
  background-color: ${(props) =>
    props.index === props.activeStep
      ? props.theme.colors.mediumBlue
      : props.index < props.activeStep
      ? props.theme.colors.darkGrey
      : props.theme.colors.lightGrey5};
  clip-path: polygon(97.25% 0%, 100% 50%, 97.25% 100%, 0% 100%, 0% 50%, 0% 0%);
`;

const FirstArrow = styled(Arrow)`
  clip-path: polygon(97% 0%, 99.75% 50%, 97% 99.75%, 0% 99.75%, 0% 50%, 0% 0%);
`;

const MiddleArrowBg = styled(Arrow)`
  position: absolute;
  background-color: ${(props) =>
    props.index === props.activeStep
      ? props.theme.colors.mediumBlue
      : props.index < props.activeStep
      ? props.theme.colors.darkGrey
      : props.theme.colors.lightGrey5};
  clip-path: polygon(97.25% 0%, 100% 50%, 97.25% 100%, -0.3% 100%, 3% 50%, -0.3% -0.3%);
`;

const MiddleArrow = styled(Arrow)`
  clip-path: polygon(97% 0%, 99.75% 50%, 97% 99.75%, 0% 100%, 3.25% 50%, 0% 0%);
`;

const LastArrowBg = styled(Arrow)`
  position: absolute;
  background-color: ${(props) =>
    props.index === props.activeStep
      ? props.theme.colors.mediumBlue
      : props.index < props.activeStep
      ? props.theme.colors.darkGrey
      : props.theme.colors.lightGrey5};
  clip-path: polygon(100% 0%, 100% 50%, 100% 100%, -0.3% 100%, 3% 50%, -0.3% -0.3%);
`;

const LastArrow = styled(Arrow)`
  clip-path: polygon(100% 0%, 100% 50%, 100% 100%, 0% 100%, 3.25% 50%, 0% 0%);
`;

type ButtonProps = {
  index: number;
  activeStep: number;
  children?: React.ReactNode;
  handlePress: (index: number) => void;
};

function First({ children, index, activeStep, handlePress }: ButtonProps) {
  return (
    <ArrowContainer>
      <FirstArrowBg index={index} activeStep={activeStep} />
      <FirstArrow index={index} activeStep={activeStep} onClick={() => handlePress(index)}>
        {children}
      </FirstArrow>
    </ArrowContainer>
  );
}

function Mid({ children, index, activeStep, handlePress }: ButtonProps) {
  return (
    <ArrowContainer key={index}>
      <MiddleArrowBg index={index} activeStep={activeStep} />
      <MiddleArrow index={index} activeStep={activeStep} onClick={() => handlePress(index)}>
        {children}
      </MiddleArrow>
    </ArrowContainer>
  );
}

function Last({ children, index, activeStep, handlePress }: ButtonProps) {
  return (
    <ArrowContainer key={index}>
      <LastArrowBg index={index} activeStep={activeStep} />
      <LastArrow index={index} activeStep={activeStep} onClick={() => handlePress(index)}>
        {children}
      </LastArrow>
    </ArrowContainer>
  );
}

interface ArrButtonBarProps {
  numButtons: number;
  activeButton: number;
  handlePress: (index: number) => void;
  buttonContents: (index: number) => React.ReactNode;
  barTopMargin?: string;
}

export function ArrowButtonBar(props: ArrButtonBarProps): ReactElement {
  const allButtons: React.ReactNode[] = [];
  for (let i = 0; i < props.numButtons; i++) {
    if (i === 0) {
      allButtons.push(
        <First key={i} index={i} activeStep={props.activeButton} handlePress={props.handlePress}>
          {props.buttonContents(i)}
        </First>
      );
    } else if (i === props.numButtons - 1) {
      allButtons.push(
        <Last key={i} index={i} activeStep={props.activeButton} handlePress={props.handlePress}>
          {props.buttonContents(i)}
        </Last>
      );
    } else {
      allButtons.push(
        <Mid key={i} index={i} activeStep={props.activeButton} handlePress={props.handlePress}>
          {props.buttonContents(i)}
        </Mid>
      );
    }
  }

  return <ButtonBarContainer barTopMargin={props.barTopMargin}>{allButtons}</ButtonBarContainer>;
}
