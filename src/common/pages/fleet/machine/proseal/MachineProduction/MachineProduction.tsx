import React, { useMemo } from 'react';
import { ViewContainer, adminClass, baseClass } from './MachineProduction.elements';
import { FeedFactor, MachineOverview, LiveGraph, DailyRateMetrics, Downtime } from './components';
import { UseDowntimeDataProvider } from '../hooks/useDowntimeData';
import { useRouter } from 'common/hooks/useRouter';
import { fleetPagePath } from 'common/pages/fleet/FleetPage';
import { MachineInformationAdmin } from './subtabs/Admin';

export const MachineProduction = (): JSX.Element => {
  const { subView } = useRouter(fleetPagePath);

  const view = subView;

  const SubtabView = useMemo(() => {
    switch (view) {
      case 'overview':
        return <Overview />;
      case 'admin':
        return <Admin />;
      default:
        return <></>;
    }
  }, [view]);

  return <>{SubtabView}</>;
};

const Overview = () => {
  return (
    <ViewContainer className={baseClass}>
      <MachineOverview />
      <FeedFactor />

      {
        // these get grouped together because they share some of the same data so they can pull from
        // source data and not have to make multiple calls
        <UseDowntimeDataProvider>
          <Downtime />
          <LiveGraph />
        </UseDowntimeDataProvider>
      }

      <DailyRateMetrics />
    </ViewContainer>
  );
};

const Admin = () => {
  return (
    <ViewContainer className={adminClass}>
      <MachineInformationAdmin />
    </ViewContainer>
  );
};
