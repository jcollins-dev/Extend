import { faImage } from '@fortawesome/free-regular-svg-icons';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

// Theme
import theme from 'themes';
import OnboardingMultipleFilesDropArea from './OnboardingMultipleFilesDropArea';

describe('OnboardingDropArea', () => {
  it('It should mount with no file', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <OnboardingMultipleFilesDropArea
          files={null}
          onFileChange={() => {
            /*pass*/
          }} 
          acceptedTypes={{
            'application/image': ['.jpeg', '.webp', '.png', '.jpg']
          }} 
          icon={faImage}        
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
  it('It should mount with a file', () => {
    const div = document.createElement('div');
    const file = new File(['foo'], 'foo.jpg', {
      type: 'application/image'
    });
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <OnboardingMultipleFilesDropArea
          files={[]}
          onFileChange={() => {
            /*pass*/
          }}
          acceptedTypes={{
            'application/image': ['.jpeg', '.webp', '.png', '.jpg']
          }} 
          icon={faImage} 
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
