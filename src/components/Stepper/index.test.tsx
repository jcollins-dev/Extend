import React from 'react';
import { ThemeProvider } from 'styled-components';
import { default as theme } from '../../themes';
import { fireEvent, render, screen } from '@testing-library/react';
import Step from './Step';
import Stepper from '.';
import { tutorialPlaceholderStepsData } from 'constants/machineConfig';

const renderStepper = (mockCancel?: jest.Mock) => {
  return render(
    <ThemeProvider theme={theme}>
      <Stepper
        onCancelCallback={() => mockCancel?.(false)}
        steps={tutorialPlaceholderStepsData.map(({ description, header, imgSrc }, index) => (
          <Step description={description} header={header} imgSrc={imgSrc} key={index} />
        ))}
      />
    </ThemeProvider>
  );
};

describe('Stpper', () => {
  it('Should render a step indicator for each step', () => {
    renderStepper();
    const stepIndicators = screen.getAllByTestId('step-indicator', { exact: false });
    expect(stepIndicators).toHaveLength(tutorialPlaceholderStepsData.length);
  });

  it('Should render a Skip and a Next button on mount', () => {
    renderStepper();

    const skipButton = screen.getByRole('button', { name: /skip/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(skipButton).toBeVisible();
    expect(nextButton).toBeVisible();
  });

  it('Should call the cancel callback function when Skip is clicked', () => {
    const mockCancel = jest.fn();
    renderStepper(mockCancel);

    const skipButton = screen.getByRole('button', { name: /skip/i });
    fireEvent.click(skipButton);

    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('Should show the appropriate content each time the Next button is clicked', () => {
    renderStepper();

    tutorialPlaceholderStepsData.forEach((step, index) => {
      const header = screen.getByText(step.header);
      const description = screen.getByText(step.description);

      expect(header).toBeVisible();
      expect(description).toBeVisible();

      if (index !== tutorialPlaceholderStepsData.length - 1) {
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      }
    });
  });

  it('Should show a Finish button after all steps are viewed, clicking it should call the cancel callback function', () => {
    const mockCancel = jest.fn();
    renderStepper(mockCancel);

    tutorialPlaceholderStepsData.forEach((_, index) => {
      if (index !== tutorialPlaceholderStepsData.length - 1) {
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      }
    });

    const finishButton = screen.getByRole('button', { name: /finish/i });
    expect(finishButton).toBeVisible();

    fireEvent.click(finishButton);
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  it('Should show the appropriate content each time the Back button is clicked', () => {
    renderStepper();

    // Navigate to the last step
    tutorialPlaceholderStepsData.forEach((_, index) => {
      if (index !== tutorialPlaceholderStepsData.length - 1) {
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);
      }
    });

    // Navigate backwards through the steps, checking for the correct content
    tutorialPlaceholderStepsData.reverse().forEach((step, index) => {
      const header = screen.getByText(step.header);
      const description = screen.getByText(step.description);

      expect(header).toBeVisible();
      expect(description).toBeVisible();

      if (index !== tutorialPlaceholderStepsData.length - 1) {
        const nextButton = screen.getByRole('button', { name: /back/i });
        fireEvent.click(nextButton);
      }
    });
  });
});
