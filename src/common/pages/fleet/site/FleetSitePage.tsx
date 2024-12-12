import React from 'react';
import { FleetSitePageContainer } from './FleetSitePage.elements';
import { ProsealSitePage } from './proseal/ProsealSitePage';

// this is for demo only
// will be removed once routing is in place
const demoBu = {
  proseal: true
};

export const FleetSitePage = (): JSX.Element => {
  return (
    <FleetSitePageContainer>
      {demoBu.proseal ? <ProsealSitePage /> : <section>404</section>}
    </FleetSitePageContainer>
  );
};
