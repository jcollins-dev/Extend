import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import TabNavToggle from '.';

describe('TabNavToggle', () => {
  it('Should render with 3 tabs', () => {
    render(
      <ThemeProvider theme={theme}>
        <TabNavToggle
          items={[
            {
              label: 'Tab 1',
              onClick: jest.fn,
              isTabEnabled: true
            },
            {
              label: 'Tab 2',
              onClick: jest.fn,
              isTabEnabled: true
            },
            {
              label: 'Tab 3',
              onClick: jest.fn,
              isTabEnabled: true
            }
          ]}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('Should respond to click', () => {
    const mock = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <TabNavToggle
          items={[
            {
              label: 'Tab 1',
              onClick: mock,
              isTabEnabled: true
            },
            {
              label: 'Tab 2',
              onClick: jest.fn,
              isTabEnabled: true
            },
            {
              label: 'Tab 3',
              onClick: jest.fn,
              isTabEnabled: true
            }
          ]}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Tab 1'));

    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('Should respond to click', () => {
    const mock = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <TabNavToggle
          items={[
            {
              label: 'Tab 1',
              onClick: mock,
              isTabEnabled: true
            },
            {
              label: 'Tab 2',
              onClick: jest.fn,
              isTabEnabled: true
            },
            {
              label: 'Tab 3',
              onClick: jest.fn,
              isTabEnabled: true
            }
          ]}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Tab 1'));

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
