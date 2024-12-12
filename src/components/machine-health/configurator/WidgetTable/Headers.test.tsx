import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Header } from './Headers';

describe('Widget Table Header', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <Header title="test" />
      </ThemeProvider>
    );
  });
});
