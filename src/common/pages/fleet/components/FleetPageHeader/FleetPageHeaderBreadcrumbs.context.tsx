import React, { createContext, useState, ReactNode } from 'react';

export const FleetPageHeaderBreadcrumbsContext =
  createContext<FleetPageHeaderBreadcrumbsContextReturnProps>([
    {},
    (props: Record<string, unknown>) => console.log('Fleet Bread Crumbs Not Set', { props })
  ]);

export type FleetPageHeaderBreadcrumbsContextReturnProps = [
  Record<string, unknown> | undefined,
  (props: Record<string, unknown>) => void
];

export const FleetPageHeaderBreadcrumbsProvider = ({
  children
}: {
  children: ReactNode | ReactNode[];
}): JSX.Element => {
  const [breadcrumbs, setBreadcrumbs] = useState<Record<string, unknown> | undefined>(undefined); // [string, string][

  const setFleetPageBreadcrumbs = (props: Record<string, unknown>) => setBreadcrumbs(props);

  return (
    <FleetPageHeaderBreadcrumbsContext.Provider value={[breadcrumbs, setFleetPageBreadcrumbs]}>
      {children}
    </FleetPageHeaderBreadcrumbsContext.Provider>
  );
};

/*
const breadCrumbSettings = {
    paths: {
      customer: {
        label: accountData?.companyName,
        isLoading: !accountData
      },
      site: {
        label: accountData?.siteName,
        slug: !accountData?.plantId ? undefined : `/fleet/site/${accountData.plantId}`,
        isLoading: !accountData
      },
      line: {
        label: accountData?.lineName,
        isLoading: !accountData,
        slug: !machineData?.lineId ? undefined : `/fleet/line/${machineData.lineId}`
      },
      machine: {
        label: accountData?.description,
        isLoading: !accountData,
        slug: !machineId ? undefined : `/fleet/machine/${machineId}/machine-health/overview`
      }
    },
    machineStatus: {
      machineStatus: accountData?.connectionStatus?.watchdog,
      dataStatus: accountData?.connectionStatus?.gateway,
      lastConnected: accountData?.connectionStatus?.lastKnownConnected,
      isLoading: !accountData,
      productionState: accountData?.currProdState,
      watchDog: accountData?.connectionStatus?.watchdog,
      businessUnit: 'protein',
      isDisconnected: isDisconnected
    },
    handleEdit: () => history.push(configRouteMap[activeTab].replace(':machineId', machineId))
  };
  */
