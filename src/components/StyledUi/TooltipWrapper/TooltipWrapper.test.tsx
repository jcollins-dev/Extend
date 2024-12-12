import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import { TooltipWrapper } from './TooltipWrapper';
import { default as theme } from 'themes';

describe('TooltipWrapper', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <TooltipWrapper Tooltip={<></>}>
              <p>test</p>
            </TooltipWrapper>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
