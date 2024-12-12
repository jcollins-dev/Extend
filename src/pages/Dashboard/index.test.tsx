import React from 'react';
import Dashboard from '.';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

//Theme
import theme from 'themes';

//store
import { default as store } from 'store';

describe('Dashboard Page', () => {
  it('It should mount', () => {
    // const div = document.createElement('div');
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Dashboard />
        </ThemeProvider>
      </Provider>
    );
    // texts are the keys passed to translate function in the component
    expect(screen.getByText('dashboard')).toBeInTheDocument();
    expect(screen.getByText('card_maintenance_manager')).toBeInTheDocument();
    expect(screen.getByText('card_parts_shop')).toBeInTheDocument();
    //expect(screen.getByText('card_machine_management')).toBeInTheDocument();
    //expect(screen.getByText('card_group_user_management')).toBeInTheDocument();
    expect(screen.getByText('card_alerts')).toBeInTheDocument();
    //  ReactDOM.unmountComponentAtNode(div);
  });
});
