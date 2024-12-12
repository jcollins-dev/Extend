// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

// Theme
import theme from 'themes';

// Component
import MachinesMasterModal from './MachinesMasterModal';

// State
import { default as store } from 'store';

const handleClose = jest.fn();

const BubbleModalComponent = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MachinesMasterModal visible={true} handleClose={handleClose} />
      </ThemeProvider>
    </Provider>
  );
};

describe('<MachinesMasterModal />', () => {
  it('Should render', () => {
    render(BubbleModalComponent());
  });
});
