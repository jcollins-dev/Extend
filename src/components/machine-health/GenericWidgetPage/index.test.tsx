import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import GenericWidgetPage from '.';
import { MachineHealthSubTabs } from 'types/protein';

describe('GenericWidgePage', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <GenericWidgetPage
              pageTemplateId={MachineHealthSubTabs.PMOverview}
              startTime={new Date()}
              endTime={new Date()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
