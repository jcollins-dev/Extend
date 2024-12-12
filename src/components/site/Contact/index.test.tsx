import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Contact from '.';

describe('Contact', () => {
  it('it renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <Contact />
      </ThemeProvider>
    );
  });
});
