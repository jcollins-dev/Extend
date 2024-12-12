import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import KPICard from '.';
import SingleValueCard from './SingleValueCard';
import TwoValueCard from './TwoValueCard';
import ThreeValueCard from './ThreeValueCard';
import TwoColumnCard from './TwoColumnCard';

describe('KPI Card', () => {
  it('Should render with 1 value', () => {
    render(
      <ThemeProvider theme={theme}>
        <KPICard heading="test-heading">
          <SingleValueCard
            value1={{
              value: 'value-1',
              unit: 'unit-1',
              color: 'red'
            }}
          />
        </KPICard>
      </ThemeProvider>
    );

    expect(screen.getByText('test-heading')).toBeInTheDocument();

    expect(screen.getByText('value-1')).toBeInTheDocument();
    expect(screen.getByText('value-1')).toHaveStyle({ color: 'red' });
    expect(screen.getByText('unit-1')).toBeInTheDocument();
  });

  it('Should render with 2 values', () => {
    render(
      <ThemeProvider theme={theme}>
        <KPICard heading="test-heading">
          <TwoValueCard
            value1={{
              value: 'value-1',
              unit: 'unit-1',
              color: 'red'
            }}
            value2={{
              value: 'value-2',
              unit: 'unit-2'
            }}
          />
        </KPICard>
      </ThemeProvider>
    );

    expect(screen.getByText('test-heading')).toBeInTheDocument();

    expect(screen.getByText('value-1')).toBeInTheDocument();
    expect(screen.getByText('value-1')).toHaveStyle({ color: 'red' });
    expect(screen.getByText('unit-1')).toBeInTheDocument();

    expect(screen.getByText('value-2')).toBeInTheDocument();
    expect(screen.getByText('unit-2')).toBeInTheDocument();
  });

  it('Should render with 3 values', () => {
    render(
      <ThemeProvider theme={theme}>
        <KPICard heading="test-heading">
          <ThreeValueCard
            value1={{
              value: 'value-1',
              unit: 'unit-1',
              color: 'red'
            }}
            value2={{
              value: 'value-2',
              unit: 'unit-2'
            }}
            value3={{
              value: 'value-3',
              unit: 'unit-3'
            }}
          />
        </KPICard>
      </ThemeProvider>
    );

    expect(screen.getByText('test-heading')).toBeInTheDocument();

    expect(screen.getByText('value-1')).toBeInTheDocument();
    expect(screen.getByText('value-1')).toHaveStyle({ color: 'red' });
    expect(screen.getByText('unit-1')).toBeInTheDocument();

    expect(screen.getByText('value-2')).toBeInTheDocument();
    expect(screen.getByText('unit-2')).toBeInTheDocument();

    expect(screen.getByText('value-3')).toBeInTheDocument();
    expect(screen.getByText('unit-3')).toBeInTheDocument();
  });

  it('Should render TwoColumnCard', () => {
    render(
      <ThemeProvider theme={theme}>
        <KPICard heading="test-heading">
          <TwoColumnCard
            values={[
              {
                value: 'value-1',
                unit: 'unit-1',
                key: 'unit-1',
                color: '#FF0000'
              },
              {
                value: 'value-2',
                unit: 'unit-2',
                key: 'unit-2',
                color: '#00FF00'
              },
              {
                value: 'value-3',
                unit: 'unit-3',
                key: 'unit-3',
                color: '#0000FF'
              },
              {
                value: 'value-4',
                unit: 'unit-4',
                key: 'unit-4',
                color: '#00FFFF'
              }
            ]}
          />
        </KPICard>
      </ThemeProvider>
    );

    expect(screen.getByText('value-1')).toBeInTheDocument();
    expect(screen.getByText('value-1')).toHaveStyle({ color: '#FF0000' });
    expect(screen.getByText('unit-1')).toBeInTheDocument();

    expect(screen.getByText('value-2')).toBeInTheDocument();
    expect(screen.getByText('value-2')).toHaveStyle({ color: '#00FF00' });
    expect(screen.getByText('unit-2')).toBeInTheDocument();

    expect(screen.getByText('value-3')).toBeInTheDocument();
    expect(screen.getByText('value-3')).toHaveStyle({ color: '#0000FF' });
    expect(screen.getByText('unit-3')).toBeInTheDocument();

    expect(screen.getByText('value-4')).toBeInTheDocument();
    expect(screen.getByText('value-4')).toHaveStyle({ color: '#00FFFF' });
    expect(screen.getByText('unit-4')).toBeInTheDocument();
  });
});
