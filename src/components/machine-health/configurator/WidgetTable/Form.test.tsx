import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Form from './Form';

describe('Widget Table Form', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <Form cancelCallback={jest.fn()} id="test" isTitle={false} item="test" />
      </ThemeProvider>
    );
  });
});
