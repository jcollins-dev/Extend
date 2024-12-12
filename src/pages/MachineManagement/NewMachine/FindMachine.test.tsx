// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

// Constants
import { JBTRoutes } from 'constants/routes';

// Theme
import theme from 'themes';

// State management
import { default as store } from 'store';
import FindMachine from './FindMachine';

const RenderComponent = () => {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[JBTRoutes.machineManagementNew]}>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.machineManagementNew}>
            <FindMachine />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('<MachineManagement />', () => {
  test('Should render', () => {
    render(RenderComponent());
  });

  test('should have a section for customers', () => {
    render(RenderComponent());
    expect(screen.getByText(/customer/i)).toBeInTheDocument();
  });

  test('should have a input for searching customers', () => {
    render(RenderComponent());
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  test('should have buttons cancel and continue', () => {
    render(RenderComponent());
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });
});
