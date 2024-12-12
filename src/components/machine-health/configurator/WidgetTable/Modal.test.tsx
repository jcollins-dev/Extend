import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import Modal from './Modal';
import { WidgetType } from 'types/protein';

describe('Widget Table modal', () => {
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <Modal
          hideFields={{}}
          modalType={WidgetType.MatrixWidget}
          submitCallback={jest.fn()}
          tabId="test"
        />
      </ThemeProvider>
    );
  });
});
