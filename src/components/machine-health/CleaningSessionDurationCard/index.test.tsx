import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import CleaningSessionDurationCard from '.';

describe('CleaningSessionDurationCard', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <CleaningSessionDurationCard />
      </ThemeProvider>
    );
  });
});
