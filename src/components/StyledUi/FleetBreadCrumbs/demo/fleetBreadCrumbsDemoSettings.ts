import { FleetBreadCrumbsProps } from '../FleetBreadCrumbs';

export const fleetBreadCrumbsDemoSettings: FleetBreadCrumbsProps = {
  paths: {
    customer: {
      label: `Customer Name`,
      slug: `/fleet/customerId`
    },
    site: {
      label: `Site 1`,
      slug: `/fleet/customerId/site/siteId`
    },
    line: {
      label: `Line 10`,
      slug: `/fleet/customerId/site/siteId/line/lindId`
    },
    machine: {
      label: `Chicken Fryer`,
      slug: `/fleet/customerId/site/siteId/line/lindId/machine/machineId`
    }
  },
  machineStatus: {
    machineStatus: `good`,
    productionState: `running`
  },
  handleEdit: () => alert('edit clicked')
};
