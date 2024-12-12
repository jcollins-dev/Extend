import { FleetBreadCrumbsProps } from 'components/StyledUi/FleetBreadCrumbs';
import { RouterTabNavPropsTab } from 'components/StyledUi/RouterTabNav';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';
import { ConfiguratorBreadCrumbProps } from 'components/Configurator';

export interface UseFleetMachinePageSettingsReturnProps {
  breadCrumbs: FleetBreadCrumbsProps;
  configuratorBreadcrumb?: ConfiguratorBreadCrumbProps;
  pageTabs?: RouterTabNavPropsTab[];
  configTabs?: RouterTabNavPropsTab[];
  configTabsViews?: Record<string, RouterTabNavPropsTab[]>;
  pageViewTabs?: Record<string, RouterTabNavPropsTab[]>;
  pageSlug?: string;
  pageBasePath?: string;
  machinePerfomanceComponent?: ReactElement;
}

export const usePageSettingsDSI = (): UseFleetMachinePageSettingsReturnProps => {
  const { accountData, machineId, isLoading, hasError } = useFleetMachineAccountData();
  const { t } = useTranslation(['mh']);

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
    },
    configuratorBreadcrumb: {
      paths: {
        machine: {
          label: accountData?.description,
          isLoading,
          slug: pageBasePath,
          hasError: hasError ? 'error' : undefined
        }
      }
    }
  };

  if (machineId) {
    // setup main tabs located right below the breadcrumbs header
    data.pageTabs = [
      {
        label: t('machine_health'),
        // slug not used since we're passing the path
        slug: 'machine-health',
        path: `${pageBasePath}/machine-health/overview`
      }
    ];

    if (process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true') {
      data.pageTabs.push({
        label: t('alerts'),
        // slug not used since we're passing the path
        slug: 'alerts',
        path: `${pageBasePath}/alerts`
      });
    }

    // setup view tabs for each page tab (the second of set of `pill` style tabs)
    data.pageViewTabs = {
      [`machine-health`]: [
        {
          label: t('overview'),
          // slug not used since we're passing the path
          slug: 'overview',
          path: `${pageBasePath}/machine-health/overview`
        },
        {
          label: t('production'),
          // slug not used since we're passing the path
          slug: 'production',
          path: `${pageBasePath}/machine-health/production`
        },

        {
          label: t('alarms'),
          // slug not used since we're passing the path
          slug: 'alarms',
          path: `${pageBasePath}/machine-health/alarms`
        },
        {
          label: t('data_analysis'),
          // slug not used since we're passing the path
          slug: 'data-analysis',
          path: `${pageBasePath}/machine-health/data-analysis`,
          tabClass: 'data_analysis'
        }
      ]
    };

    data.configTabs = [
      {
        label: t('machine_health'),
        // slug not used since we're passing the path
        slug: 'machine-health',
        path: `${pageBasePath}/config/machine-health/overview`
      },
      {
        label: t('alerts'),
        // slug not used since we're passing the path
        slug: 'alerts',
        path: `${pageBasePath}/config/alerts`
      }
    ];

    // setup view tabs for each page tab (the second of set of `pill` style tabs)
    data.configTabsViews = {
      [`machine-health`]: [
        {
          label: t('overview'),
          // slug not used since we're passing the path
          slug: 'overview',
          path: `${pageBasePath}/config/machine-health/overview`
        },
        {
          label: t('production'),
          // slug not used since we're passing the path
          slug: 'production',
          path: `${pageBasePath}/config/machine-health/production`
        },
        {
          label: t('alarms'),
          // slug not used since we're passing the path
          slug: 'alarms',
          path: `${pageBasePath}/config/machine-health/alarms`
        },
        {
          label: t('data_analysis'),
          // slug not used since we're passing the path
          slug: 'data-analysis',
          path: `${pageBasePath}/config/machine-health/data-analysis`
        }
      ]
    };
  }

  return data;
};
