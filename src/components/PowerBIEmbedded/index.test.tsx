// 3rd party libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';

// Components
import PowerBIEmbedded from '.';

import { default as store } from 'store';

describe('PowerBIEmbedded component', () => {
  const testAccessToken = '123456';
  // const testReportId = 'k1a2v3';
  // const testWorkspaceId = 'c0l9a8';
  const testWorkspaces = {
    value: [
      {
        id: 'f089354e-8366-4e18-aea3-4cb4a3a50b48',
        isReadOnly: false,
        isOnDedicatedCapacity: false,
        name: 'veggie group'
      },
      {
        id: '3d9b93c6-7b6d-4801-a491-1738910904fd',
        isReadOnly: false,
        isOnDedicatedCapacity: false,
        name: 'meat group'
      },
      {
        id: 'a2f89923-421a-464e-bf4c-25eab39bb09f',
        isReadOnly: false,
        isOnDedicatedCapacity: false,
        name: 'omni group',
        dataflowStorageId: 'd692ae06-708c-485e-9987-06ff0fbdbb1f'
      }
    ]
  };

  beforeEach(() => {
    fetchMock.doMock();
    fetchMock.resetMocks();
    fetchMock.mockResponse(async (req) => {
      if (req.url.includes('api.powerbi.com') && req.url.includes('GenerateToken')) {
        return Promise.resolve(JSON.stringify({ ok: true, token: testAccessToken }));
      } else if (req.url.includes('api.powerbi.com') && req.url.includes('/groups')) {
        return Promise.resolve(JSON.stringify({ ...testWorkspaces }));
      }
      return Promise.reject(new Error('bad URL'));
    });
  });

  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PowerBIEmbedded />
        </ThemeProvider>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
