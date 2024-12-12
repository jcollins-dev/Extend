import { render, screen } from '@testing-library/react';

import BarSeriesCard from './BarSeriesCard';
import React from 'react';
import ReactDOM from 'react-dom';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BarSeriesCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Should have correct title', () => {
  render(<BarSeriesCard title="Test Element" />);
  expect(screen.getByText('Test Element'));
});
