import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import VersionRow from './MachineTagRow';

describe('< VersionRow />', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <VersionRow />
      </ThemeProvider>
    );
  });
});
