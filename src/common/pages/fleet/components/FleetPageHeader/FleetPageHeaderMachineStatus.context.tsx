import React, { createContext, useState, ReactNode } from 'react';

export const FleetPageHeaderMachineStatusContext =
  createContext<FleetPageHeaderMachineStatusContextReturnProps>([
    {},
    (props: Record<string, unknown>) => console.log('Fleet Bread Crumbs Not Set', { props })
  ]);

export type FleetPageHeaderMachineStatusContextReturnProps = [
  Record<string, unknown> | undefined,
  (props: Record<string, unknown>) => void
];

export const FleetPageHeaderMachineStatusProvider = ({
  children
}: {
  children: ReactNode | ReactNode[];
}): JSX.Element => {
  const [machineStatus, setMachineStatus] = useState<Record<string, unknown> | undefined>(
    undefined
  ); // [string, string][

  const setFleetPageBreadcrumbs = (props: Record<string, unknown>) => setMachineStatus(props);

  return (
    <FleetPageHeaderMachineStatusContext.Provider value={[machineStatus, setFleetPageBreadcrumbs]}>
      {children}
    </FleetPageHeaderMachineStatusContext.Provider>
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
