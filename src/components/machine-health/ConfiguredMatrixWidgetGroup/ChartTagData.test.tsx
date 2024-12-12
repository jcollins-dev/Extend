import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import ChartTagData from './ChartTagData';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';

describe('Chart Tag Data', () => {
  it('Renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <ChartTagData
              currentTagValue={undefined}
              startTime={new Date()}
              endTime={new Date()}
              setLoading={jest.fn()}
              setError={jest.fn()}
              setTagData={jest.fn()}
              setStatesData={jest.fn()}
              tagId="test"
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
