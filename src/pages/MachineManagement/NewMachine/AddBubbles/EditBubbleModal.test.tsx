// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';

// Theme
import theme from 'themes';

// Component
import EditBubbleModal from './EditBubbleModal';

const handleClose = jest.fn();
const EditBubbleComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <EditBubbleModal visible={false} handleClose={handleClose} handleSubmit={handleClose} />
    </ThemeProvider>
  );
};

describe('<EditBubbleModal />', () => {
  it('Should render', () => {
    render(EditBubbleComponent());
  });
});
