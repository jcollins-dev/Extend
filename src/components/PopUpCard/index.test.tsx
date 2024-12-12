import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import PopUpCard from '.';

describe('Pop Up Component', () => {
  const mock = jest.fn();
  it('Should Render', () => {
      render( 
        <ThemeProvider theme={theme}>
          <PopUpCard show={true} setShowFunction={mock}/>
        </ThemeProvider>
      );
  });
});