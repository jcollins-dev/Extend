import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

import BaseSelect from './BaseSelect';
import { default as theme } from 'themes';

const testOptions = ['option1', 'option2'];
const testPlaceholder = 'test placeholder';

describe('BaseSelect', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <BaseSelect
          value={''}
          options={testOptions}
          handleChange={jest.fn()}
          placeholder={testPlaceholder}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should load 3 <option> elements and the first should have the placeholder text', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <BaseSelect
          value={''}
          options={testOptions}
          handleChange={jest.fn()}
          placeholder={testPlaceholder}
        />
      </ThemeProvider>
    );
    render(testComponent);
    expect(screen.getAllByRole('option').length).toBe(3);
    expect(screen.getByText(testPlaceholder)).toBeInTheDocument();
  });

  it('It can use different values for option label and value', () => {
    const options = [
      {
        label: 'label 1',
        value: '1'
      },
      {
        label: 'label 2',
        value: '2'
      }
    ];

    const testComponent = (
      <ThemeProvider theme={theme}>
        <BaseSelect value={'1'} options={options} handleChange={jest.fn()} />
      </ThemeProvider>
    );
    render(testComponent);
    expect(screen.getAllByRole('option').length).toBe(2);
    expect(screen.getByText('label 1')).toBeInTheDocument();
  });
});
