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
import ScatterChart from './';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ScatterChart
          data={[
            { x: 1, y: 0, label: 'Start bottle sorter changeover' },
            { x: 2, y: 0, label: 'Start bottle sorter changeover' },
            { x: 3, y: 0, label: 'Start bottle sorter changeover' },
            { x: 4, y: 0, label: 'Start bottle sorter changeover' },
            { x: 5, y: 0, label: 'Start bottle sorter changeover' }
          ]}
        />
      </ThemeProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
