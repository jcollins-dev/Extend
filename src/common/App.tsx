import React from 'react';
import { SiteLayout } from './components/SiteLayout';
import { FleetPage } from './pages/fleet/FleetPage';

export const AppV2 = (): JSX.Element => {
  return (
    <SiteLayout>
      <FleetPage />
    </SiteLayout>
  );
};
