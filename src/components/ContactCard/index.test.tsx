import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

// Theme
import theme from 'themes';

import ContactCard from '.';
import ContactInfo from './ContactInfo';

describe('ContactCard', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <ContactCard>
          <ContactInfo value="test"/>
        </ContactCard>
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});