import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import AlertActionModal from './AlertActionModal';
import { default as theme } from 'themes';

describe('Alert Action Modal', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <AlertActionModal
          alert={null}
          helperText="test"
          isDeleting={false}
          isOpen={true}
          onClose={jest.fn()}
          onConfirm={jest.fn()}
          title="test"
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
