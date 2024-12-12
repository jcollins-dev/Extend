import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MachineHealthHeader from '.';

describe('MachineHealthHeader', () => {
  it('Should display all data correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <MachineHealthHeader
          heading="test-heading"
          alertColor="red"
          alertMessage="test-alert-message"
          charts={<div>charts</div>}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('test-heading')).toBeInTheDocument();
    expect(screen.getByText('test-alert-message')).toBeInTheDocument();
    expect(screen.getByText('test-alert-message')).toHaveStyle({ color: 'red' });
    expect(screen.getByText('charts')).toBeInTheDocument();
  });
});
