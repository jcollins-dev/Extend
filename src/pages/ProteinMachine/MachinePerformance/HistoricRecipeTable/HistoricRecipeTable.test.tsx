import React from 'react';
import ReactDOM from 'react-dom';
//import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import { HistoricRecipeTable } from './HistoricRecipeTable';

const tableProps = {
  outerTableWidth: 1000,
  recipeTag: '',
  label: [],
  machineId: '',
  isAdmin: true,
  handleAdminModalToggle: () => jest.fn(),
  hasError: undefined
};

it('It should mount HistoricRecipeTable', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <HistoricRecipeTable {...tableProps} />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
