// 3rd party libraries
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

// Theme
import theme from 'themes';

// State management
import { default as store } from 'store';

// Component
import { DiagramView } from './DiagramView';

// Types
import { Part } from 'types/parts';

const DiagramComponent = () => {
  const testParts: Part[] = [];
  const testChildParts: Part[] = [];
  const mockFunc = jest.fn();

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <DiagramView
          parts={testParts}
          childParts={testChildParts}
          handleBubbleChange={mockFunc}
          deselectBubbleAndPart={mockFunc}
          updateDiagramHistory={mockFunc}
          diagramHistory={[]}
          getCurrentSlide={mockFunc}
        />
      </ThemeProvider>
    </Provider>
  );
};

describe('<DiagramView />', () => {
  it('Should render', () => {
    render(DiagramComponent());
  });
});
