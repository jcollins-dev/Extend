import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { testPMData } from 'constants/testdata';
import { PMTable } from 'components';
import { default as theme } from 'themes';

describe('PMTable', () => {
  it('It should mount', () => {
    const filteredData = testPMData.filter((d) => d.type === 'date');

    const div = document.createElement('div');
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <PMTable data={filteredData} />
      </ThemeProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
