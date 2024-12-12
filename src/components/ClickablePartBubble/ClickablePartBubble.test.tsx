import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import ClickablePartBubble from './ClickablePartBubble';
import { Bubble } from 'types';

describe('ClickablePartBubble', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <BrowserRouter>
        <ClickablePartBubble id="test-bubble" index={0} x={0} y={0} radius={20} color="#DE591C" />
      </BrowserRouter>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should have one <a>, two <circle>, and one <text>', () => {
    const testBubble: Bubble = {
      index: 37,
      x: 130,
      y: 1177,
      id: 'test-37',
      radius: 20
    };
    const testColor = '#DE591C';

    const { container } = render(
      <BrowserRouter>
        <svg xmlns="http://www.w3.org/2000/svg">
          <ClickablePartBubble {...testBubble} color={testColor} />
        </svg>
      </BrowserRouter>
    );

    expect(screen.getAllByRole('link').length).toBe(1);

    expect(container.querySelectorAll('circle').length).toBe(2);

    expect(container.querySelectorAll('text').length).toBe(1);
  });
});
