import React from 'react';
import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import AlarmsTable from '.';
import { mockAlarmsTableData } from 'constants/testdata/protein';
import { ColumnConfgurationProps, formatDataForTable } from './utils';
import { Alarm, DSIAlarm } from 'types/machine-health/alarms';

describe('AlarmsTable', () => {
  it('Renders with correct data', () => {
    const formattedData = formatDataForTable(mockAlarmsTableData);
    const data = formattedData.dataArray as unknown as Array<Alarm | DSIAlarm>;
    const dataCol = formattedData.columnsArray as unknown as ColumnConfgurationProps;

    render(
      <ThemeProvider theme={theme}>
        <AlarmsTable data={data} tableColumnConfiguration={dataCol} />
      </ThemeProvider>
    );
  });
});
