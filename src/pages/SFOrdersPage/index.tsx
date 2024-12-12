// 3rd party libraries
import React, { ReactElement } from 'react';

// Helpers
import styled from 'styled-components';

import { NewSFOrdersTable } from 'components';

const SFOrdersContainer = styled.div`
  padding: 1.5rem 3.125rem 0 3.125rem;
  width: 100%;
`;

const SFOrdersPage = (): ReactElement => {
  return (
    <SFOrdersContainer>
      <NewSFOrdersTable />
    </SFOrdersContainer>
  );
};

export default SFOrdersPage;
