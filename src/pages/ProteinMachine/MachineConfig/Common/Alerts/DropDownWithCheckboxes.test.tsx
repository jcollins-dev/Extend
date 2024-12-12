import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

import { DropdownWithCheckboxes } from './DropdownWithCheckboxes';
import { default as theme } from 'themes';
import { AlertStateType } from 'types/machine-health/alerts';
import { DropDownItem } from './FormElementsTypes';

const testPlaceholder = 'test placeholder';

describe('Dropdown With Checkboxes', () => {
  const machineStates = Object.values(AlertStateType).map((value) => ({
    value,
    label: value
  })) as unknown as DropDownItem[];

  const dropdownValues: DropDownItem[] = [];

  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <DropdownWithCheckboxes
          ariaLabel="test"
          options={machineStates}
          handleMultiSelect={jest.fn()}
          value={dropdownValues}
          placeholder={testPlaceholder}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should load 1 "combobox" element and it should have the placeholder text', () => {
    const testComponent = (
      <ThemeProvider theme={theme}>
        <DropdownWithCheckboxes
          ariaLabel="test"
          options={machineStates}
          handleMultiSelect={jest.fn()}
          value={dropdownValues}
          placeholder={testPlaceholder}
        />
      </ThemeProvider>
    );
    render(testComponent);
    expect(screen.getAllByRole('combobox').length).toBe(1);
    expect(screen.getByText(testPlaceholder)).toBeInTheDocument();
  });
});
