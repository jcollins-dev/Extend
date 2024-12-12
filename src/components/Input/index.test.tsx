import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';
import Input from '.';

describe('Input', () => {
  it('Should render correctly', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Input defaultValue="TEST" />
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveAttribute('value', 'TEST');
  });
});
