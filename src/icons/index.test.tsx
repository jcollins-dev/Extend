import React from 'react';
import ReactDOM from 'react-dom';
import { queryByAttribute, render } from '@testing-library/react';

import {
  BillOfMaterialsIcon,
  EngineIcon,
  PartsIcon,
  UpgradeIcon,
  UserGuideIcon,
  VisionIcon,
  FilterIcon
} from 'icons';

describe('Dynamic icons', () => {
  // Custom query to retrieve ids from the SVGs
  const getById = queryByAttribute.bind(null, 'id');

  const allIcons = [
    BillOfMaterialsIcon,
    EngineIcon,
    PartsIcon,
    UpgradeIcon,
    UserGuideIcon,
    VisionIcon,
    FilterIcon
  ];
  const noneColor = 'none';

  it('It should mount each icon', () => {
    const div = document.createElement('div');

    allIcons.forEach((icon) => {
      ReactDOM.render(icon(), div);
    });

    ReactDOM.unmountComponentAtNode(div);
  });

  it('It should render icons with default fill of black', () => {
    const container = (
      <div>
        {allIcons.map((icon, i) => (
          <div key={i}>{icon()}</div>
        ))}
      </div>
    );

    const testColor = '#000000';

    const dom = render(container);
    expect(getById(dom.container, 'BOMRectangle')).toBeInTheDocument();
    expect(getById(dom.container, 'BOMRectangle')?.getAttribute('fill')).toBe(testColor);

    expect(getById(dom.container, 'EnginePath')).toBeInTheDocument();
    expect(getById(dom.container, 'EnginePath')?.getAttribute('fill')).toBe(noneColor);

    expect(getById(dom.container, 'PartsMask')).toBeInTheDocument();
    expect(getById(dom.container, 'PartsMask')?.getAttribute('fill')).toBe(noneColor);

    expect(getById(dom.container, 'UpgradeMask')).toBeInTheDocument();
    expect(getById(dom.container, 'UpgradeMask')?.getAttribute('fill')).toBe(testColor);

    expect(getById(dom.container, 'UserGuideRectangle')).toBeInTheDocument();
    expect(getById(dom.container, 'UserGuideRectangle')?.getAttribute('fill')).toBe(testColor);

    expect(getById(dom.container, 'VisionPath')).toBeInTheDocument();
    expect(getById(dom.container, 'VisionPath')?.getAttribute('fill')).toBe(testColor);
  });

  it('It should render icons with the given color as the fill value', () => {
    const testColor = '#DE591C';
    const container = (
      <div>
        {allIcons.map((icon, i) => (
          <div key={i}>{icon(testColor)}</div>
        ))}
      </div>
    );

    const dom = render(container);
    expect(getById(dom.container, 'BOMRectangle')).toBeInTheDocument();
    expect(getById(dom.container, 'BOMRectangle')?.getAttribute('fill')).toBe(testColor);

    expect(getById(dom.container, 'EnginePath')).toBeInTheDocument();
    expect(getById(dom.container, 'EnginePath')?.getAttribute('fill')).toBe(noneColor);

    expect(getById(dom.container, 'PartsMask')).toBeInTheDocument();
    expect(getById(dom.container, 'PartsMask')?.getAttribute('fill')).toBe(noneColor);

    expect(getById(dom.container, 'UpgradeMask')).toBeInTheDocument();
    expect(getById(dom.container, 'UpgradeMask')?.getAttribute('fill')).toBe(testColor);

    expect(getById(dom.container, 'UserGuideRectangle')).toBeInTheDocument();
    expect(getById(dom.container, 'UserGuideRectangle')?.getAttribute('fill')).toBe(testColor);

    expect(getById(dom.container, 'VisionPath')).toBeInTheDocument();
    expect(getById(dom.container, 'VisionPath')?.getAttribute('fill')).toBe(testColor);
  });
});
