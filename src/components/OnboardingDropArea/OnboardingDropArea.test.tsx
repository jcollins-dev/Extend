import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

// Theme
import theme from 'themes';
import OnboardingDropArea from './OnboardingDropArea';

describe('OnboardingDropArea', () => {
  it('It should mount with no file', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <OnboardingDropArea
          file={null}
          onFileChange={() => {
            /*pass*/
          }} 
          acceptedTypes={{
            'application/pdf': ['.pdf'],
            'application/zip': ['.zip']
          }} 
          icon={faFilePdf}        
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
  it('It should mount with a file', () => {
    const div = document.createElement('div');
    const file = new File(['foo'], 'foo.pdf', {
      type: 'application/pdf'
    });
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <OnboardingDropArea
          file={file}
          onFileChange={() => {
            /*pass*/
          }}
          acceptedTypes={{
            'application/pdf': ['.pdf'],
            'application/zip': ['.zip']
          }} 
          icon={faFilePdf} 
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
