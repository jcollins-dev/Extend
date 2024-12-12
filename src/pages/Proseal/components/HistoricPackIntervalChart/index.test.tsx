import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import HistoricPackInterval from '.';
import moment from 'moment';
import { BaseTagType } from 'types/protein';

describe('Historic Pack Interval', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <HistoricPackInterval
              startTime={moment(new Date())}
              endTime={moment(new Date())}
              packs={{
                id: '123',
                type: BaseTagType.Tag,
                values: [
                  {
                    value: 1,
                    timestamp: '2015-03-25T12:00:00Z'
                  }
                ]
              }}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
