import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'store';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Plant } from 'types';
import PlantNameCollapse from './PlantNameCollapse';

const plants: Plant[] = [
  {
    id: '1',
    orgId: 'org-1',
    name: 'Proseal Demo Plant',
    machines: [],
    addressLine1: '300 N LaSalle',
    city: 'Chicago',
    state: 'ILLINOIS',
    zipCode: '60654',
    customer: 'Proseal Demo Organization',
    latitude: 0.5,
    longitude: 0.5,
    siteName: 'Chicago',
    countryCode: 'US',
    countryName: 'United States'
  },
  {
    id: '2',
    orgId: 'org-2',
    name: 'Proseal Demo Plant',
    machines: [],
    addressLine1: '123 Hardwood Dr',
    city: 'Dallas',
    state: 'TEXAS',
    zipCode: '75234',
    customer: 'Proseal Demo Organization',
    latitude: 0.5,
    longitude: 0.5,
    siteName: 'Dallas',
    countryCode: 'US',
    countryName: 'United States'
  }
];

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <PlantNameCollapse plants={plants} isLoading={false} />
      </ThemeProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
