import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Card from '.';

describe('Card', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <Card />
      </ThemeProvider>
    );
  });

  it('Renders with specific border color', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Card borderColor="#ff0000" />
      </ThemeProvider>
    );
    expect(container.firstChild).toHaveStyle('border-color: #ff0000');
  });

  it('Renders with specific heading and background color', () => {
    render(
      <ThemeProvider theme={theme}>
        <Card>
          <Card.Header bgColor="#ff0000">test-heading</Card.Header>
        </Card>
      </ThemeProvider>
    );

    const heading = screen.getByText('test-heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveStyle('background-color: #ff0000');
  });

  it('Renders with a header icon', () => {
    const testIcon = <div>test-icon</div>;
    render(
      <ThemeProvider theme={theme}>
        <Card>
          <Card.Header icon={testIcon}>test-heading</Card.Header>
        </Card>
      </ThemeProvider>
    );
    expect(screen.getByText('test-icon')).toBeInTheDocument();
  });

  it('Renders with body content', () => {
    render(
      <ThemeProvider theme={theme}>
        <Card>
          <Card.Body>test-body</Card.Body>
        </Card>
      </ThemeProvider>
    );
    expect(screen.getByText('test-body')).toBeInTheDocument();
  });
});
