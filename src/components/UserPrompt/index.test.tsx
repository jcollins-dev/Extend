import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import UserPrompt from '.';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <UserPrompt
        visible={true}
        message="Prompt message"
        primaryActionLabel="Primary"
        secondaryActionLabel="Secondary"
        handleCancel={jest.fn()}
        handlePrimaryAction={jest.fn()}
        handleSecondaryAction={jest.fn()}
      />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
