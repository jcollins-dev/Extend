import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

// Theme
import theme from 'themes';
import FileDropArea from './FileDropArea';

describe('FileDropArea', () => {
  it('It should mount with no file', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <FileDropArea
          file={null}
          onFileChange={() => {
            /*pass*/
          }}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
  it('It should mount with a file', () => {
    const div = document.createElement('div');
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    });
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <FileDropArea
          file={file}
          onFileChange={() => {
            /*pass*/
          }}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
