import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import CleaningStateChart from '.';
import { testCleaningStatesResponse } from 'constants/testdata/protein';

describe('CleaningStateChart', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <CleaningStateChart data={testCleaningStatesResponse} />
      </ThemeProvider>
    );
  });
});
