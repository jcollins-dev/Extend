// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import { Wizard } from 'react-use-wizard';

// Constants
import { JBTRoutes } from 'constants/routes';

// Theme
import theme from 'themes';

// State management
import { default as store } from 'store';
import { Button } from 'components';

// Component
import { AddBubbles } from '.';

const RenderComponent = () => {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[JBTRoutes.machineManagementHierarchy]}>
        <ThemeProvider theme={theme}>
          <Wizard>
            <AddBubbles machine={undefined} />
          </Wizard>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('<AddBubbles />', () => {
  it('Should render', () => {
    render(RenderComponent());
  });
  it('Should show a continue button', () => {
    render(RenderComponent());
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('Should respond to click', async () => {
    const uploadAndNavigate = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <Button onClick={uploadAndNavigate}>Continue</Button>
      </ThemeProvider>
    );
    await waitFor(() => {
      screen.getByText('Continue').click();
      expect(uploadAndNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
