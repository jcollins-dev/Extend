// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

// Theme
import { default as theme } from 'themes';

// Store
import { default as store } from 'store';

// Components
import LineChart from './';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LineChart
          data={[
            { x: 200, y: 300 },
            { x: 300, y: 280 },
            { x: 400, y: 240 },
            { x: 500, y: 330 },
            { x: 600, y: 200 }
          ]}
        />
      </ThemeProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
