import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18nForTests';

import CleaningStepsTable from '.';
import { testCleaningStepsData } from 'constants/testdata/protein';

describe('CleaningStepsTable', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <CleaningStepsTable data={testCleaningStepsData} />
        </I18nextProvider>
      </ThemeProvider>
    );
    const rows = screen.getAllByRole('row');

    // It renders 3 rows (2 data rows, and the header row)
    expect(rows.length).toBe(3);

    // Within the second row, Defrost data is shown.
    expect(within(rows[1]).getByText('Defrost')).toBeInTheDocument();

    // It has 5 alarms
    expect(within(rows[1]).getByText('5')).toBeInTheDocument();

    // It calculates + displays the correct duration in this row
    expect(within(rows[1]).getByText('00:10:00')).toBeInTheDocument();

    // It calculates + displays the correct average over time in this row. In this case, it is the parent row, so it should display an em-dash.
    expect(within(rows[1]).getByText('—')).toBeInTheDocument();
  });

  it('Expands to show child rows', () => {
    render(
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <CleaningStepsTable data={testCleaningStepsData} />
        </I18nextProvider>
      </ThemeProvider>
    );

    // Click the Defrost button
    fireEvent.click(screen.getByText('Defrost'));

    const rows = screen.getAllByRole('row');

    // It renders 5 rows (2 parent data rows, 2 child rows, and the header row)
    expect(rows.length).toBe(5);

    // Child rows are displayed in the correct place
    expect(within(rows[2]).getByText('Child 1')).toBeInTheDocument();
    expect(within(rows[3]).getByText('Child 2')).toBeInTheDocument();

    // Child 2 is complete
    expect(within(rows[3]).getByText('Completed')).toBeInTheDocument();
  });
});
