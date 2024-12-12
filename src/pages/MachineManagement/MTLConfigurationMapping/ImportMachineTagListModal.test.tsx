// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

// Theme
import theme from 'themes';

// Component
import ImportMachineTagListModal from './ImportMachineTagListModal';

// State
import { default as store } from 'store';

const handleClose = jest.fn();

const ImportMachineTagListModalComponent = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ImportMachineTagListModal visible={true} handleClose={handleClose} machineId="test_id" />
      </ThemeProvider>
    </Provider>
  );
};

describe('<ImportMachineTagListModal />', () => {
  it('Should render', () => {
    render(ImportMachineTagListModalComponent());
  });
});
