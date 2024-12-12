import React from 'react';
import { FleetPageHeaderContainer } from './FleetPageHeader.elements';
import { useRouter } from 'common/hooks/useRouter';
import { fleetPagePath } from '../../FleetPage';

import { FleetMachineStatusBar } from './';
import { FleetBreadCrumbs, FleetBreadCrumbsPathsProps } from 'components';
import { MachineConnectionIcon } from '../../../../components/MachineConnectionIcon';
import { useCustomerInfo } from '../../hooks/useCustomerInfo';
import { useCustomerSite } from '../../hooks/useCustomerSite';
import { useCustomerLine } from '../../hooks/useCustomerLine';
import { useCustomerMachine } from '../../hooks/useCustomerMachine';

export const FleetPageHeader = (): JSX.Element => {
  //const [breadcrumbs] = useContext(FleetPageHeaderBreadcrumbsContext);

  const { sitePage, customerId, siteId, lineId } = useRouter(fleetPagePath);

  const customer = useCustomerInfo();
  const site = useCustomerSite();
  const line = useCustomerLine();
  const machine = useCustomerMachine();

  // this is for demo, remove this once routing is in place
  // to get view, use URL path to see if machine view is active
  let paths: FleetBreadCrumbsPathsProps | undefined = undefined;

  if (customer?.name)
    paths = { customer: { label: customer.name, path: `/${sitePage}/${customerId}/dashboard` } };
  if (site?.name)
    paths = {
      ...paths,
      site: { label: site.name, path: `/${sitePage}/${customerId}/site/${siteId}` }
    };
  if (line?.name)
    paths = {
      ...paths,
      line: { label: line.name, path: `/${sitePage}/${customerId}/site/${siteId}/line/${lineId}` }
    };
  if (machine?.name) paths = { ...paths, machine: { label: machine.name } };

  return (
    <FleetPageHeaderContainer className="fleet-page-header">
      {paths && (
        <div className="fleet-page-header__bread-crumbs">
          <FleetBreadCrumbs {...{ paths }} />
          {machine?.connectionStatus && <MachineConnectionIcon status={machine.connectionStatus} />}
        </div>
      )}
      {machine && <FleetMachineStatusBar />}
    </FleetPageHeaderContainer>
  );
};
