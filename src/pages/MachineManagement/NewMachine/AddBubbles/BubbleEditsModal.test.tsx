// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

// Theme
import theme from 'themes';

// State management
import { default as store } from 'store';

// Component
import BubbleEditsModal from './BubbleEditsModal';

const handleClose = jest.fn();

const BubbleModalComponent = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BubbleEditsModal visible={true} handleClose={handleClose} />
      </ThemeProvider>
    </Provider>
  );
};

describe('<BubbleEditsModal />', () => {
  it('Should render', () => {
    render(BubbleModalComponent());
  });
});
