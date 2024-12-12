import React, { useContext, useEffect, useMemo } from 'react';
import { MachineProduction } from './MachineProduction';
import {
  FleetPageHeaderBreadcrumbsContext,
  FleetPageHeaderMachineStatusContext
} from '../../components';
import { useRouter } from 'common/hooks/useRouter';
import { fleetPagePath } from '../../FleetPage';

const prosealMachineBreadcrumbs = {
  paths: {
    customer: {
      label: 'Proseal Customer'
    },
    site: {
      label: 'Site 1'
      //slug: !accountData?.plantId ? undefined : `/fleet/site/${accountData.plantId}`,
      //isLoading: !accountData
    },
    line: {
      label: 'Line 5'
      //isLoading: !accountData,
      //slug: !machineData?.lineId ? undefined : `/fleet/line/${machineData.lineId}`
    },
    machine: {
      label: 'GC70'
      //isLoading: !accountData,
      //slug: !machineId ? undefined : `/fleet/machine/${machineId}/machine-health/overview`
    }
  }
};

export const prosealMachineStatus = {
  machineStatus: 'running',
  dataStatus: 'connected',
  lastConnected: new Date(),
  productionState: 'running',
  serialNumber: '1120404',
  orderNumber: '67890',
  timeZone: 'Europe/Amsterdamn'
};

export const prosealMachinePageTabs = {
  pageTabs: {
    tabs: [
      {
        label: 'Machine Production',
        slug: 'machine-production',
        // this normally gets set automatically
        isCurrent: true,
        handle: {
          click: (): void => alert('routing is disabled for demo')
        }
      },
      {
        label: 'Machine Performance',
        slug: 'machine-performance',
        isDisabled: true,
        handle: {
          click: (): void => alert('routing is disabled for demo')
        }
      },
      {
        label: 'Alerts',
        slug: 'alerts',
        isDisabled: true,
        handle: {
          click: (): void => alert('routing is disabled for demo')
        }
      }
    ]
  }
};

export const ProsealMachinePage = (): JSX.Element => {
  const setBreadcrumbs = useContext(FleetPageHeaderBreadcrumbsContext)[1];
  const setMachineStatus = useContext(FleetPageHeaderMachineStatusContext)[1];

  const { mainView } = useRouter(fleetPagePath);

  useEffect(() => {
    if (prosealMachineBreadcrumbs) {
      setBreadcrumbs(prosealMachineBreadcrumbs);
    }

    if (prosealMachineStatus) {
      setMachineStatus(prosealMachineStatus);
    }
  }, []);

  const view = mainView;
  const MainTab = useMemo(() => {
    switch (view) {
      case 'machine-production':
        return <MachineProduction />;
      default:
        return <></>;
    }
  }, [view]);

  return <>{MainTab}</>;
};
