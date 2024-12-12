// 3rd Party Libraries
import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Button } from 'components';

// Styled Components
const StyledStepperWrapper = styled.div`
  padding: 2rem;
`;

const StyledIndicatorRow = styled.div`
  align-items: center;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StyledButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
`;

const StyledStepIndicator = styled.div<{ isActive: boolean; isViewed: boolean }>`
  background-color: ${({ theme, isActive, isViewed }) => {
    if (isActive) {
      return theme.colors.buttons.primary.fill;
    } else if (isViewed) {
      return theme.colors.greyBlue3;
    }
    return theme.colors.lightGrey4;
  }};
  border-radius: 50%;
  height: 0.5rem;
  width: 0.5rem;
`;

interface StepperProps {
  backText?: string;
  finishText?: string;
  nextText?: string;
  onCancelCallback?: () => void;
  skipText?: string;
  steps: React.ReactElement[];
}

const Stepper = ({
  backText,
  finishText,
  nextText,
  onCancelCallback,
  skipText,
  steps
}: StepperProps): JSX.Element => {
  const [currentStep, setCurrentStep] = useState(0);
  const lastStep = steps.length - 1;

  return (
    <StyledStepperWrapper>
      {steps.map((step, index) => React.cloneElement(step, { isVisible: index === currentStep }))}
      <StyledIndicatorRow>
        {steps.map((_, index) => (
          <StyledStepIndicator
            isActive={index === currentStep}
            isViewed={index < currentStep}
            key={uuidv4()}
            data-testid={`step-indicator-${index}`}
          />
        ))}
      </StyledIndicatorRow>
      <StyledButtonRow>
        <Button
          onClick={() =>
            currentStep === 0 ? onCancelCallback?.() : setCurrentStep((prev) => prev - 1)
          }
          variant="secondary"
        >
          {currentStep === 0 ? skipText || 'Skip' : backText || 'Back'}
        </Button>
        <Button
          onClick={() =>
            currentStep === lastStep ? onCancelCallback?.() : setCurrentStep((prev) => prev + 1)
          }
          variant="primary"
        >
          {currentStep === lastStep ? finishText || 'Finish' : nextText || 'Next'}
        </Button>
      </StyledButtonRow>
    </StyledStepperWrapper>
  );
};

export default Stepper;
