import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

// Theme
import theme from 'themes';

import TextInputWithOptions from '.';

describe('<TextInputWithOptions />', () => {
  it('It should mount', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <TextInputWithOptions elementId="test-id" options={[]} placeholder="test-placeholder" />
      </ThemeProvider>
    );
    const div = document.createElement('div');
    ReactDOM.render(testComponent, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Display a text box', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <TextInputWithOptions
          elementId="test-id"
          placeholder="test-placeholder"
          options={['item1', 'item2', 'option3', 'option4']}
        />
      </ThemeProvider>
    );

    render(testComponent);

    expect(screen.getByPlaceholderText('test-placeholder')).toBeInTheDocument();
  });
});
