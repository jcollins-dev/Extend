import React from 'react';
import ReactDOM from 'react-dom';
import CustomizedBarChart from './index';

const bars = [
  { x: 'Run', y: 50, color: '#93C5FD' },
  { x: 'Clean', y: 25, color: '#C4B5FD' },
  { x: 'Idle', y: 15, color: '#F0ABFC' },
  { x: 'Stopped', y: 10, color: '#FECDD3' }
];

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <CustomizedBarChart bars={bars} dims={{ width: 200, height: 400 }} domainPadding={[0, 0]} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
