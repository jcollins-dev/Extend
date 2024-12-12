// 3rd Party Libraries
import React from 'react';
import styled, { useTheme } from 'styled-components';

// Components
import { Typography } from 'components';

// Styled Components
const StyledStepImage = styled.img`
  border-radius: 0.5rem;
  object-fit: cover;
  width: 100%;
`;

const StyledStepWrapper = styled.div<{ isVisible: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: ${({ isVisible }) => (isVisible ? '100%' : '0')};
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  overflow: ${({ isVisible }) => (isVisible ? 'auto' : 'hidden')};

  transition: opacity 0.5s ease-in-out;
`;

const StyledDescriptionWrapper = styled.div`
  text-align: center;
`;

interface StepProps {
  description?: string;
  header?: string;
  imgSrc?: string;
  isVisible?: boolean;
}

const Step = ({ description, header, imgSrc, isVisible = true }: StepProps): JSX.Element => {
  const theme = useTheme();

  return (
    <StyledStepWrapper isVisible={isVisible}>
      {imgSrc && <StyledStepImage src={imgSrc} />}
      {header && (
        <Typography mb="0rem" size="1.25rem" weight="bold">
          {header}
        </Typography>
      )}
      {description && (
        <StyledDescriptionWrapper>
          <Typography color={theme.colors.darkGrey2} variant="body2">
            {description}
          </Typography>
        </StyledDescriptionWrapper>
      )}
    </StyledStepWrapper>
  );
};

export default Step;
