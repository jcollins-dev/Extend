import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import CleaningStepsDurationTable from '.';
import { CleaningStepGroup } from 'types/protein';

describe('CleaningStepsDurationsTable', () => {
  it('Renders with correct data', () => {
    const testData: CleaningStepGroup[] = [
      {
        name: 'Step-1',
        parentName: 'p',
        averageDuration: 1000,
        minDuration: 5000,
        maxDuration: 15000
      },
      {
        name: 'Step-2',
        parentName: 'p',
        averageDuration: 1000 * 60 * 10,
        minDuration: 1000 * 60 * 5,
        maxDuration: 1000 * 60 * 15
      }
    ] as CleaningStepGroup[];

    render(
      <ThemeProvider theme={theme}>
        <CleaningStepsDurationTable data={testData} />
      </ThemeProvider>
    );

    const rows = screen.getAllByRole('row');

    // Rows include the header, so is one more than expected
    expect(rows.length).toBe(2);

    // First row of data
    expect(rows[1].childNodes[0].textContent).toBe('p');
    expect(rows[1].childNodes[1].textContent).toBe('00:10:01');
    expect(rows[1].childNodes[2].textContent).toBe('—');
    expect(rows[1].childNodes[3].textContent).toBe('—');
  });
});
