// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

// Theme
import theme from 'themes';

// Component
import UploadMtlModal from './UploadMtlModal';

// State
import { default as store } from 'store';

const handleClose = jest.fn();

const BubbleModalComponent = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <UploadMtlModal
          visible={true}
          handleClose={handleClose}
          handleImportSuccess={handleClose}
        />
      </ThemeProvider>
    </Provider>
  );
};

describe('<UploadMtlModal />', () => {
  it('Should render', () => {
    render(BubbleModalComponent());
  });
});
