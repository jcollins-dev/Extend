import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';

import {
  AlertDescription,
  AlertImportance,
  AlertLocation,
  AlertName,
  BooleanColor,
  isNumeric,
  MachineState,
  Occurrences,
  OrangeAlert,
  RedAlert,
  TagDropdown,
  TargetSetpointBooleanDrowpdown,
  TriggerFormat,
  TriggerRuleDateRange,
  TriggerRuleDropdown,
  TriggerUpperLowerAlert
} from './FormElements';

describe('isNumeric', () => {
  it('It returns true for numeric values', () => {
    expect(isNumeric(23)).toBeTruthy();
  });

  it('It returns false for non-numeric values', () => {
    expect(isNumeric('abc')).toBeFalsy();
  });
});

describe('Alert Alert Name', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <AlertName displayValue="test" handeUpdateValue={jest.fn()} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('AlertDescription', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <AlertDescription displayValue="test" handeUpdateValue={jest.fn()} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('TriggerRuleDropdown', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TriggerRuleDropdown value="test" handeUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('TriggerRuleDateRange', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TriggerRuleDateRange value="test" handeUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('TagDropdown', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TagDropdown
          currentValue={{ id: '1', friendlyName: 'Test Tag Friendly Name' }}
          handeUpdateValue={jest.fn()}
          hasClass={'test'}
          tagList={[]}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('TargetSetpointBooleanDrowpdown', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TargetSetpointBooleanDrowpdown
          value={'test'}
          handeUpdateValue={jest.fn()}
          hasClass={'test'}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('TriggerFormat', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TriggerFormat value={'test'} handeUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('BooleanColor', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <BooleanColor value={'test'} handeUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('TriggerUpperLowerAlert', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TriggerUpperLowerAlert
          uRedValue={10}
          lRedValue={8}
          uOrangeValue={5}
          lOrangeValue={3}
          handleUpdateValue={jest.fn()}
          hasClass={'test'}
        />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('OrangeAlert', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <OrangeAlert uValue={1} handleUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('RedAlert', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <RedAlert uValue={1} handleUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('MachineState', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <MachineState machineValue={[]} handeUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('AlertImportance', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <AlertImportance value={'test'} handeUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('AlertLocation', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <AlertLocation alertValue={[]} handeUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('Occurrences', () => {
  it('It renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <Occurrences value={2} handeUpdateValue={jest.fn()} hasClass={'test'} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
