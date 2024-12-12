import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import CleaningStepsChart from '.';
import { testCleaningWaitStatesResponse, testCleaningStepsData } from 'constants/testdata/protein';

describe('CleaningStepsChart', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <CleaningStepsChart
          stepsData={testCleaningStepsData}
          dataIsGrouped={true}
          waitingStatesData={testCleaningWaitStatesResponse}
          getColorById={jest.fn()}
        />
      </ThemeProvider>
    );
  });
});
