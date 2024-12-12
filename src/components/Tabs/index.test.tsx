import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';
import Tabs from './';

describe('Tabs', () => {
  it('Should render correctly and select a tab on click', () => {
    const mockFn = jest.fn();

    const items = [
      {
        label: 'label-1',
        panel: 'id-1'
      },
      {
        label: 'label-2',
        panel: 'id-2'
      },
      {
        label: 'label-3',
        panel: 'id-3'
      }
    ];
    render(
      <ThemeProvider theme={theme}>
        <Tabs currentTabPanel={items[0].panel} setTabPanel={mockFn} items={items} />
      </ThemeProvider>
    );

    // There are 3 tabs
    expect(screen.getAllByRole('tab')).toHaveLength(3);

    // Labels are correct
    expect(screen.getByText(items[0].label)).toBeInTheDocument();
    expect(screen.getByText(items[1].label)).toBeInTheDocument();
    expect(screen.getByText(items[2].label)).toBeInTheDocument();

    // First one is active
    expect(screen.getAllByRole('tab')[0]).toHaveStyle({
      'background-color': theme.colors.mediumBlue
    });

    // Click second tab
    fireEvent.click(screen.getByText(items[1].label));

    // Callback was called
    expect(mockFn).toHaveBeenCalledWith(items[1].panel);
  });
});
