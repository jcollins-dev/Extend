// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

// Theme
import theme from 'themes';

// Component
import { PartsList } from './PartsList';

// Types
import { PartNode } from 'types/machine-management';

const heading = 'Parts Without Bubbles';

const ThreePartComponent = () => {
  const parts: PartNode[] = [];

  return (
    <ThemeProvider theme={theme}>
      <PartsList parts={parts} heading={heading} />
    </ThemeProvider>
  );
};

describe('<PartsList />', () => {
  it('Should render', () => {
    render(ThreePartComponent());
  });
  it('Should show a header', () => {
    render(ThreePartComponent());
    expect(screen.getByText(heading)).toBeInTheDocument();
  });
});
