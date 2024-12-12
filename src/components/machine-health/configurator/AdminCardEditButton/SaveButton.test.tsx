import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import { Provider } from 'react-redux';
import store from 'store';
import { MemoryRouter } from 'react-router-dom';
import SaveButton from './SaveButton';

describe('Save Button', () => {
  it('it renders', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <SaveButton saveCallBack={jest.fn()} isDirty={false} />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  });
});
