import { SidebarNav, SidenavItem } from 'components';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import { default as store } from 'store';
import { NavFlyoutType, SidenavItemProps } from 'types';
import TestRenderer from 'react-test-renderer';
import { ThemeProvider } from 'styled-components';
import { default as theme } from 'themes';
import i18n from 'i18nForTests';

const testItems1: SidenavItemProps[] = [
  {
    id: 1,
    label: NavFlyoutType.Fleet,
    link: '/',
    isLast: true
  }
];

const testElement1 = (
  <Router>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <SidebarNav items={testItems1} />
      </Provider>
    </ThemeProvider>
  </Router>
);

const testRenderer1 = TestRenderer.create(testElement1);
const testInstance1 = testRenderer1.root;

const testItems2: SidenavItemProps[] = [
  {
    id: 1,
    label: NavFlyoutType.Fleet,
    link: '/1'
  },
  {
    id: 2,
    label: NavFlyoutType.Parts,
    link: '/2',
    isLast: true
  }
];

const testElement2 = (
  <Router>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <SidebarNav items={testItems2} />
        </I18nextProvider>
      </Provider>
    </ThemeProvider>
  </Router>
);

const testRenderer2 = TestRenderer.create(testElement2);
const testInstance2 = testRenderer2.root;

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(testElement1, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('It should contain <SidenavItem> element with `test item` label', () => {
  // The test example given and the always present "settings" item
  expect(testInstance1.findAllByType(SidenavItem).length).toBe(1);
  expect(testInstance1.findAllByType(SidenavItem)[0].props.label).toBe(NavFlyoutType.Fleet);
});

it('It should have two <SidenavItem> children', () => {
  // The two example ones given and the always present "settings" item
  expect(testInstance2.findAllByType(SidenavItem).length).toBe(2);
});
