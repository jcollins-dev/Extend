import React from 'react';
import { render } from '@testing-library/react';
import { BreadCrumbs } from './BreadCrumbs';

describe('BreadCrumbs', () => {
  it('renders without items', () => {
    const { container } = render(<BreadCrumbs />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with items', () => {
    const items = [
      {
        label: `customer`,
        slug: `/fleet`
      }
    ];

    const { container } = render(<BreadCrumbs items={items} />);
    expect(container.textContent).toContain('customer');
  });

  it('renders with children', () => {
    const { container } = render(
      <BreadCrumbs>
        <span>Some content</span>
      </BreadCrumbs>
    );
    expect(container.textContent).toContain('Some content');
  });
});
