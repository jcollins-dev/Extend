import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import MtlOptionPopupCard from './MtlOptionPopupCard';

describe('< MtlOptionPopupCard />', () => {
  const mockFunc = jest.fn();
  it('Renders', () => {
    render(
      <ThemeProvider theme={theme}>
        <MtlOptionPopupCard
          visible={true}
          mtlId="test-id"
          handleClose={mockFunc}
          handleOption={mockFunc}
        />
      </ThemeProvider>
    );
  });
});
