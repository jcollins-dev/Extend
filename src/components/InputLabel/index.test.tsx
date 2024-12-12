import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';
import InputLabel from '.';

describe('InputLabel', () => {
  it('Should render correctly with text - non mandatory field', async () => {
    render(
      <ThemeProvider theme={theme}>
        <InputLabel>TEST_LABEL</InputLabel>
      </ThemeProvider>
    );

    expect(screen.getByText('TEST_LABEL')).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('Should render correctly with text - mandatory field', async () => {
    render(
      <ThemeProvider theme={theme}>
        <InputLabel mandatory>TEST_LABEL</InputLabel>
      </ThemeProvider>
    );

    expect(screen.getByText('TEST_LABEL')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
