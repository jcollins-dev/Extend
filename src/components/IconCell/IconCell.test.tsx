import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from '../../themes';
import Typography from '../Typography/Typography'
import IconCell from './IconCell';

it('It should mount', () => {
  const icon = 'create';
  const text = 'dummy text';
  const subText = 'dummy subText';
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <IconCell
        icon={icon}
        text={text} subText={<Typography mb={0}>{subText}</Typography>}
      />
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});