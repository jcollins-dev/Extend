import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18nForTests';

import store from 'store';
import { within, fireEvent } from '@testing-library/dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import IssuesTable from '.';
import { mockAlarmsTableData, testAlertsData } from 'constants/testdata/protein';

describe('IssuesTable', () => {
  it('Renders with correct data', () => {
    render(
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <IssuesTable alarmsData={mockAlarmsTableData} alertsData={testAlertsData} />
        </I18nextProvider>
      </ThemeProvider>
    );
    const rows = screen.getAllByRole('row');

    // It renders 8 rows (header row, 5 alarm rows, 2 alert rows)
    expect(rows.length).toBe(8);

    // Data within first row - alert
    expect(within(rows[1]).getByText('12:01:00 AM')).toBeInTheDocument();
    expect(within(rows[1]).getByText('04/19/2022')).toBeInTheDocument();
    expect(within(rows[1]).getByText('Alert 2 description')).toBeInTheDocument();

    // Data within second row - alert
    expect(within(rows[2]).getByText('12:00:00 AM')).toBeInTheDocument();
    expect(within(rows[2]).getByText('04/19/2022')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Alert 1 description')).toBeInTheDocument();

    // Data within 3rd row - alarm
    expect(within(rows[3]).getByText('1:00:00 PM')).toBeInTheDocument();
    expect(within(rows[3]).getByText('01/01/2022')).toBeInTheDocument();
    expect(within(rows[3]).getByText('Alarm name 3')).toBeInTheDocument();

    // Data within 4th row - alarm
    expect(within(rows[4]).getByText('12:00:00 PM')).toBeInTheDocument();
    expect(within(rows[4]).getByText('01/01/2022')).toBeInTheDocument();
    expect(within(rows[4]).getByText('Alarm name 2')).toBeInTheDocument();
  });

  it('Non-complete alert responds to click and displays flyout', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
              <IssuesTable alarmsData={mockAlarmsTableData} alertsData={testAlertsData} />
            </I18nextProvider>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    const rows = screen.getAllByRole('row');

    fireEvent.click(within(rows[1]).getByRole('button'));
    expect(await screen.findByText('Alert Detail')).toBeTruthy();
  });
});
