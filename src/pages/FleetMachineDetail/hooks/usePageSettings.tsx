import { FleetBreadCrumbsProps } from 'components/StyledUi/FleetBreadCrumbs';
import { RouterTabNavPropsTab } from 'components/StyledUi/RouterTabNav';
import { useFleetMachineAccountData } from './useFleetMachineAcountData';

export interface UseFleetMachinePageSettingsReturnProps {
  breadCrumbs: FleetBreadCrumbsProps;
  pageTabs?: RouterTabNavPropsTab[];
  pageViewTabs?: Record<string, RouterTabNavPropsTab[]>;
  pageSlug?: string;
  pageBasePath?: string;
}

export const usePageSettings = (): UseFleetMachinePageSettingsReturnProps => {
  const { accountData, machineId, isLoading, hasError } = useFleetMachineAccountData();

  const pageBasePath = `/fleet/machine/${machineId}`;

  const data: UseFleetMachinePageSettingsReturnProps = {
    pageBasePath,
    // setup breadcrumbs at the top of the page
    breadCrumbs: {
      paths: {
        customer: {
          label: accountData?.companyName,
          isLoading,
          hasError: hasError ? 'error' : undefined
        },
        site: {
          label: accountData?.siteName,
          isLoading,
          hasError: hasError ? 'error' : undefined
        },
        line: {
          label: accountData?.lineName,
          isLoading,
          hasError: hasError ? 'error' : undefined
        },
        machine: {
          label: accountData?.description,
          isLoading,
          hasError: hasError ? 'error' : undefined
        }
      }
    }
  };

  if (machineId) {
    // setup main tabs located right below the breadcrumbs header
    data.pageTabs = [
      {
        label: 'Machine Production',
        // slug not used since we're passing the path
        slug: 'machine-production',
        path: `${pageBasePath}/machine-production/machine-table`
      },
      {
        label: 'Machine Health',
        // slug not used since we're passing the path
        slug: 'machine-health',
        path: `${pageBasePath}/machine-health/alarms/all-alarms`
      }
    ];

    if (process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true') {
      data.pageTabs.push({
        label: 'Alerts',
        // slug not used since we're passing the path
        slug: 'alerts',
        path: `${pageBasePath}/alerts/manage-alerts`
      });
    }

    // setup view tabs for each page tab (the second of set of `pill` style tabs)
    data.pageViewTabs = {
      [`machine-health`]: [
        {
          label: 'Alarms',
          // slug not used since we're passing the path
          slug: 'alarms',
          path: `${pageBasePath}/machine-health/alarms`
        },
        {
          label: 'Pressurization Performance',
          // slug not used since we're passing the path
          slug: 'pressurize-performance',
          path: `${pageBasePath}/machine-health/pressurize-performance`
        }
        /*,
        {
          label: 'Intensifier Performance',
          // slug not used since we're passing the path
          slug: 'intensifier-performance',
          path: `${pageBasePath}/machine-health/intensifier-performance`
        }
        */
      ]
    };
    /* if (!isLoading && !curCustomer?.isPascal)
      data.pageViewTabs[`machine-health`].push({
        path: `${pageBasePath}/machine-health/sub-components`,
        label: `Sub Components`,
        slug: `sub-components`
      });
    */
  }

  return data;
};
