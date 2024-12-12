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
import { ReviewPartNumber } from './ReviewPartNumber';
import { Button } from 'components';
const machineId = '26f7dff2-246d-48b6-be55-a98ea138189b';

const RenderComponent = () => {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[JBTRoutes.machineManagementHierarchy]}>
        <ThemeProvider theme={theme}>
          <Wizard>
            <ReviewPartNumber machineId={machineId} />
          </Wizard>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('<ReviewPartNumber />', () => {
  it('Should render', () => {
    render(RenderComponent());
  });
  it('should have continue button', () => {
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
