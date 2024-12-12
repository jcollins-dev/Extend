import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Dropdown, CustomContentRenderer } from './Dropdown';
import { WidgetType } from 'types/protein';

describe('Widget Table Dropdown', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <Dropdown options={[]} />
      </ThemeProvider>
    );
  });
});

describe('Widget CustomContentRenderer', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <CustomContentRenderer
          item={{
            disabled: false,
            id: 'test',
            name: 'test',
            label: 'test',
            type: WidgetType.MatrixWidget
          }}
        />
      </ThemeProvider>
    );
  });
});
