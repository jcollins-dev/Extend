import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from 'store';
import EditTagsModal from './EditTagsModal';
import { default as theme } from 'themes';

describe('EditTagsModal', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <EditTagsModal
              businessUnitId={0}
              currentTagData={[]}
              isOpen={true}
              machineId="test"
              onCloseCallback={jest.fn()}
              rawTagData={[]}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
