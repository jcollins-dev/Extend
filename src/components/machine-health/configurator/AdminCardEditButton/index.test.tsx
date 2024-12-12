import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import AdminCardEditButton from '.';

describe('Admin Card Edit Button', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AdminCardEditButton
              machineId={'someId'}
              widgetId={'someId'}
              isEditAdminPopupOpen={false}
              setIsEditAdminPopupOpen={jest.fn()}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
