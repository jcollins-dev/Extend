import React from 'react';
import { FleetDashboardPageContainer } from './FleetDashboardPage.elements';
import { ProsealDashboardPage } from './proseal/ProsealDashboardPage';

// this is for demo only
// will be removed once routing is in place
const demoBu = {
  proseal: true
};

export const FleetDashboardPage = (): JSX.Element => {
  return (
    <FleetDashboardPageContainer>
      {demoBu.proseal ? <ProsealDashboardPage /> : <section>404</section>}
    </FleetDashboardPageContainer>
  );
};
