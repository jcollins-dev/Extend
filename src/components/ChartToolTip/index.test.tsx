import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import ChartToolTip from '.';

describe('ChartToolTip', () => {
  it('Renders with correct children and position', () => {
    const { baseElement } = render(
      <ThemeProvider theme={theme}>
        <ChartToolTip content={<div>test-content</div>} y={500} x={600} />
      </ThemeProvider>
    );

    // Content is visible
    expect(screen.getByText('test-content')).toBeInTheDocument();

    // Renders in a portal at the correct location
    expect(baseElement.lastChild).toHaveStyle({ top: '500px', left: '600px' });
  });
});
