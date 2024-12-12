import React from 'react';
import ReactDOM from 'react-dom';
import TestRenderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';

import { ClickablePartBubble, SubAssembly } from 'components';
import { Bubble, ResourceType } from 'types';

describe('SubAssembly', () => {
  it('It should mount', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <BrowserRouter>
        <SubAssembly
          width={1000}
          height={1000}
          type={ResourceType.Image}
          id="10001110101"
          url="/assets/placeholder/assemblies/test-assembly-l1.png"
          markers={[]}
          parentId="10001110100"
        />
      </BrowserRouter>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  // Commenting out until we can write tests that wait for the image to resolve
  /*it('It should load three <ClickablePartBubbles> if given three markers', () => {
    const testMarkers: Bubble[] = [
      {
        index: 1,
        x: 256,
        y: 18,
        id: 'test-1',
        radius: 20,
        isSubAssembly: false
      },
      {
        index: 2,
        x: 1110,
        y: 1147,
        id: 'test-2',
        radius: 20,
        isSubAssembly: false
      },
      {
        index: 3,
        x: 130,
        y: 1177,
        id: 'test-3',
        radius: 20,
        isSubAssembly: false
      }
    ];
    const testElement = (
      <BrowserRouter>
        <SubAssembly
          width={1000}
          height={1000}
          type={ResourceType.Image}
          id="10001110101"
          url="/assets/placeholder/assemblies/test-assembly-l1.png"
          markers={testMarkers}
          parentId="10001110100"
        />
      </BrowserRouter>
    );
    const testRenderer = TestRenderer.create(testElement);
    const testInstance = testRenderer.root;

    expect(testInstance.findAllByType(ClickablePartBubble).length).toBe(3);
  });*/
});
