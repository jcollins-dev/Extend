import React from 'react';
import ReactDOM from 'react-dom';
import CircularProgressBar from './CircularProgressBar';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <CircularProgressBar
      key={1}
      progress={90}
      label="label"
      size={114}
      strokeWidth={15}
      circleOneStroke="#E5E9ED"
      circleTwoStroke="#2ABA74"
    />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
