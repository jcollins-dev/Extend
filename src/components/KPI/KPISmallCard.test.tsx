import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'themes';
import KPISmallCard from 'components/KPI/KPISmallCard';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <KPISmallCard>
        <div />
      </KPISmallCard>
    </ThemeProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
