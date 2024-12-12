import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';

import { Provider } from 'react-redux';
import { default as store } from 'store';
import TopView from './TopView';
import { TabViews } from './MaintenanceServiceDashboardContents';

describe('TopView', () => {
  it('Renders', () => {
    const mock = jest.fn();
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <TopView
            filter={{}}
            machines={[]}
            secondaryTab={[]}
            setNumResults={mock}
            setSelectedPm={mock}
            primaryTab={TabViews.Planned}
          />
        </ThemeProvider>
      </Provider>
    );
  });
});
