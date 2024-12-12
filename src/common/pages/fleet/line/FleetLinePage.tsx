import React from 'react';
import { FleetLinePageContainer } from './FleetLinePage.elements';
import { ProsealLinePage } from './proseal/ProsealLinePage';

// this is for demo only
// will be removed once routing is in place
const demoBu = {
  proseal: true
};

export const FleetLinePage = (): JSX.Element => {
  return (
    <FleetLinePageContainer>
      {demoBu.proseal ? <ProsealLinePage /> : <section>404</section>}
    </FleetLinePageContainer>
  );
};
