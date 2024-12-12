import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import CycleProductionChart, { groupIntoBars } from '.';
import { PressurizeCycle } from 'types/protein';

describe('Cycle Production Chart', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <CycleProductionChart
              title="Cycle Production Chart"
              count="0"
              totalTitle="Total"
              data={[]}
              dateRange={{ from: new Date(), to: new Date() }}
              timeZone="America/Los_Angeles"
              barValueType="count"
              getColorById={jest.fn()}
              onBarClick={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('groupIntoBars', () => {
  it('it renders', () => {
    const data: PressurizeCycle[] = [];
    const barValueType = 'count';
    const getColorById = () => 'red';
    const timeZone = 'America/Los_Angeles';
    const selectedId = false;
    const result = groupIntoBars(data, barValueType, getColorById, timeZone, selectedId);
    expect(result).toEqual([]);
  });
});
