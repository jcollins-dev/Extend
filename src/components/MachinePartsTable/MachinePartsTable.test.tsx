import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import TestRenderer from 'react-test-renderer';
import { Route, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// Statemanagement
import { default as store } from 'store';

import { MachinePartsTable, SearchInput } from 'components';
import { default as theme } from 'themes';
import { JBTRoutes } from 'constants/routes';
import NewBaseTable from '../../components/NewBaseTable/NewBaseTable';

describe('BaseSelect', () => {
  const testElement = (
    <Provider store={store}>
      <MemoryRouter initialEntries={[JBTRoutes.partsMachine.replace(':machineId', '1')]}>
        <ThemeProvider theme={theme}>
          <Route path={JBTRoutes.partsMachine}>
            <MachinePartsTable data={[]} machineId="1" />
          </Route>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );

  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(testElement, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should load one <BaseSelect> components, one <SearchInput> component, and one <BaseTable> component', () => {
    const testRenderer = TestRenderer.create(testElement);
    const testInstance = testRenderer.root;

    expect(testInstance.findAllByType(NewBaseTable).length).toBe(1);
  });
});
