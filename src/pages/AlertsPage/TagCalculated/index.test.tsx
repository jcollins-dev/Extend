import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../../themes/index';
import { Provider } from 'react-redux';
import store from '../../../store/index';
import TagCalculated from '.';
import CreateNewTag from './CreateNewTag';
import TagsTable from './TagsTable';
import Header from './Header';

describe('CreateAlertPage', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <TagCalculated />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('Create New Tag', () => {
  const machineId = '15a49328-30df-4c34-9f97-43c50cf064c2';
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <CreateNewTag machineId={machineId} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('Tags Table', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <TagsTable />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});

describe('Header', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Header setIsNewAlertToggle={jest.fn()} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
