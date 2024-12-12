import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer, { act } from 'react-test-renderer';

import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { NavFlyoutType, SidenavItemProps } from 'types';
import SidenavItem from './SidenavItem';
import { default as theme } from 'themes';
import i18n from 'i18nForTests';
import { I18nextProvider } from 'react-i18next';

const item: SidenavItemProps = {
  id: 1,
  label: NavFlyoutType.Fleet,
  link: '/'
};

const testElement = (
  <Router>
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <SidenavItem id={item.id} label={item.label} link={item.link} />
      </I18nextProvider>
    </ThemeProvider>
  </Router>
);

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(testElement, div);
  ReactDOM.unmountComponentAtNode(div);
});
