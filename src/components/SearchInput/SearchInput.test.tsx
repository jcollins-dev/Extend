import React, { ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

import SearchInput from './SearchInput';
import { default as theme } from 'themes';

const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {};

describe('SearchInput', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <SearchInput onChange={handleSearchChange} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should render a <input> and have a have the proper placeholder', () => {
    const testPlaceholder = 'Test placeholder';
    const testComponent = (
      <ThemeProvider theme={theme}>
        <SearchInput onChange={handleSearchChange} placeholder={testPlaceholder} />
      </ThemeProvider>
    );
    render(testComponent);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(testPlaceholder)).toBeInTheDocument();
  });
});
