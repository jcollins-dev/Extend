import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import CreateEditAlertFlyout from './CreateEditAlertFlyout';
import { default as theme } from 'themes';

describe('Create/Edit Alert Flyout', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <CreateEditAlertFlyout alertToEdit={null} isOpen={true} onClose={jest.fn()} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
