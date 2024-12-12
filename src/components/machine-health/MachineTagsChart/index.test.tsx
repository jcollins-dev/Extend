import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MachineTagsChart from '.';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';

describe('MachineTagsChart', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MachineTagsChart
              tags={[]}
              rightAxisTags={[]}
              filterDataParams={[]}
              isBooleanChart={false}
              interpolation="linear"
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
