import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import AlarmDetail from '.';
import { testAlarms } from 'constants/testdata/protein';

describe('AlarmDetail', () => {
  it('Renders with correct data', () => {
    render(
      <ThemeProvider theme={theme}>
        <AlarmDetail alarms={testAlarms} />
      </ThemeProvider>
    );

    const tables = screen.getAllByRole('table');

    expect(tables.length).toBe(5);

    expect(within(tables[0]).getByText('100')).toBeInTheDocument();
    expect(within(tables[0]).getByText('1/1/2022, 12:00 AM')).toBeInTheDocument();
    expect(within(tables[0]).getByText('01:00:00')).toBeInTheDocument();
    expect(within(tables[0]).getByText('location-1')).toBeInTheDocument();
    expect(within(tables[0]).getByText('description-1')).toBeInTheDocument();

    expect(within(tables[1]).getByText('101')).toBeInTheDocument();
    expect(within(tables[1]).getByText('1/2/2022, 12:00 AM')).toBeInTheDocument();
    expect(within(tables[1]).getByText('01:00:00')).toBeInTheDocument();
    expect(within(tables[1]).getByText('location-2')).toBeInTheDocument();
    expect(within(tables[1]).getByText('description-2')).toBeInTheDocument();
  });
});
