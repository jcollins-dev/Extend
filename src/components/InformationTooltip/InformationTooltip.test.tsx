import React from 'react';
import ReactDOM from 'react-dom';
import InformationTooltip from './InformationTooltip';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<InformationTooltip placement='top' tooltipText='Tooltip text' />, div);
  ReactDOM.unmountComponentAtNode(div);
});