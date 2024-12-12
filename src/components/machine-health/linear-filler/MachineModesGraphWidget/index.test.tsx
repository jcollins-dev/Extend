import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import theme from 'themes';
import store from 'store';
import MachineModesGraphWidget from '.';

describe('MachineModesGraphWidget', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <MachineModesGraphWidget
              data={[
                {
                  id: 1,
                  label: 'Target Status',
                  parentProperty: '1',
                  data: [
                    {
                      stateCode: 1,
                      stateName: 'Maintenance',
                      startTimestamp: '2022-04-18T01:00:00+00:00',
                      endTimestamp: '2022-04-18T01:30:00+00:00'
                    },
                    {
                      stateCode: 1,
                      stateName: 'Maintenance',
                      startTimestamp: '2022-04-18T01:30:00+00:00',
                      endTimestamp: '2022-04-18T02:30:00+00:00'
                    },
                    {
                      stateCode: 2,
                      stateName: 'Cleaning',
                      startTimestamp: '2022-04-18T02:30:00+00:00',
                      endTimestamp: '2022-04-18T03:00:00+00:00'
                    },
                    {
                      stateCode: 3,
                      stateName: 'Sterilization',
                      startTimestamp: '2022-04-18T03:00:00+00:00',
                      endTimestamp: '2022-04-18T03:30:00+00:00'
                    },
                    {
                      stateCode: 4,
                      stateName: 'Production',
                      startTimestamp: '2022-04-18T03:30:00+00:00',
                      endTimestamp: '2022-04-18T04:30:00+00:00'
                    },
                    {
                      stateCode: 5,
                      stateName: 'Idle',
                      startTimestamp: '2022-04-18T04:30:00+00:00',
                      endTimestamp: '2022-04-18T05:30:00+00:00'
                    }
                  ]
                }
              ]}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
