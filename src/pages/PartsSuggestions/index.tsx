import React, { ReactElement } from 'react';
import { testPMData } from 'constants/testdata';
import styled from 'styled-components';
import { PMTable } from 'components';

// Currently only using this table to show PMs that are triggered by date
const filteredData = testPMData.filter((d) => d.type === 'date');

/* Styling */
const Root = styled.div`
  width: 100%;
  padding: 1.75rem 1.5rem;
`;

const PartsSuggestions = (): ReactElement => (
  <Root>
    <PMTable data={filteredData} />
  </Root>
);

export default PartsSuggestions;
