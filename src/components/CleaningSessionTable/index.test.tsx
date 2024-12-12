import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import CleaningSessionTable from '.';
import { testCleaningSessionData } from 'constants/testdata/protein';

describe('CleaningSessionTable', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <CleaningSessionTable data={testCleaningSessionData} onSessionClick={() => jest.fn} />
      </ThemeProvider>
    );
  });
});
