import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import ChangeOverStepDurationsBarChart from '.';

describe('Change Over Step Durations Bar Chart', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ChangeOverStepDurationsBarChart
              data={[]}
              groupedData={[]}
              selectedSteps={[]}
              onSelectSteps={jest.fn()}
              getColorById={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
