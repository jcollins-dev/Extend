// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from '@testing-library/react';

// Theme
import theme from 'themes';

// Component
import BubbleHelpModal from './BubbleHelpModal';

const handleClose = jest.fn();

const BubbleModalComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <BubbleHelpModal visible={true} handleClose={handleClose} />
    </ThemeProvider>
  );
};

describe('<BubbleHelpModal />', () => {
  it('Should render', () => {
    render(BubbleModalComponent());
  });
});
