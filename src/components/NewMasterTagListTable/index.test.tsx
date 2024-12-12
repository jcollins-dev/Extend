import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import NewMasterTagListTable from './NewMasterTagListTable';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  WipMasterTagListAttributeDsdm,
  WipMasterTagListAttributeKdm,
  WipMasterTagListAttributeMqtt
} from 'types/machine-management';

describe('Master Tag List Table', () => {
  const queryClient = new QueryClient();
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <NewMasterTagListTable
                rowData={
                  [] as
                    | WipMasterTagListAttributeDsdm[]
                    | WipMasterTagListAttributeKdm[]
                    | WipMasterTagListAttributeMqtt[]
                }
                columnConfigs={[]}
                globalFilter={''}
                setGlobalFilter={() => {
                  return;
                }}
              />
            </QueryClientProvider>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
