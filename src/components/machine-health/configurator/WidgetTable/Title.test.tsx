import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Title from './Title';

describe('Widget Table modal', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <Title
          id="test"
          name="test"
          isEditingName={false}
          setEditRow={jest.fn()}
          setIsEditingName={jest.fn()}
        />
      </ThemeProvider>
    );
  });
});
