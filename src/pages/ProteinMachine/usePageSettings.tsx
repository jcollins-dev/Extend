import { ConfiguratorBreadCrumbProps } from 'components/Configurator';
import { FleetBreadCrumbsProps } from 'components/StyledUi/FleetBreadCrumbs';
import { RouterTabNavPropsTab } from 'components/StyledUi/RouterTabNav';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
import { useTranslation } from 'react-i18next';

export interface UseFleetMachinePageSettingsReturnProps {
  breadCrumbs: FleetBreadCrumbsProps;
  configuratorBreadcrumb?: ConfiguratorBreadCrumbProps;
  pageTabs?: RouterTabNavPropsTab[];
  configTabs?: RouterTabNavPropsTab[];
  configTabsViews?: Record<string, RouterTabNavPropsTab[]>;
  pageViewTabs?: Record<string, RouterTabNavPropsTab[]>;
  pageSlug?: string;
  pageBasePath?: string;
}

export const usePageSettings = (): UseFleetMachinePageSettingsReturnProps => {
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
          hasError: hasError ? 'error' : undefined,
          slug: pageBasePath
        }
      }
    }
  };

  if (machineId) {
    // setup main tabs located right below the breadcrumbs header
    data.configTabs = [
      {
        label: t('machine_health'),
        // slug not used since we're passing the path
        slug: 'machine-health',
        path: `${pageBasePath}/config/machine-health`
      },
      {
        label: t('machine_performance'),
        // slug not used since we're passing the path
        slug: 'machine-performance',
        path: `${pageBasePath}/config/machine-performance`
      },
      {
        label: t('general'),
        // slug not used since we're passing the path
        slug: 'common',
        path: `${pageBasePath}/config/common`
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
          label: t('product_processing'),
          // slug not used since we're passing the path
          slug: 'product-processing',
          path: `${pageBasePath}/config/machine-health/product-processing`
        },
        {
          label: t('product_movement'),
          // slug not used since we're passing the path
          slug: 'product-movement',
          path: `${pageBasePath}/config/machine-health/product-movement`
        },
        {
          label: t('cleaning'),
          // slug not used since we're passing the path
          slug: 'cleaning',
          path: `${pageBasePath}/config/machine-health/cleaning`
        },
        {
          label: t('alarms'),
          // slug not used since we're passing the path
          slug: 'alarms',
          path: `${pageBasePath}/config/machine-health/alarms`
        }
      ],
      [`machine-performance`]: [
        {
          label: t('current'),
          // slug not used since we're passing the path
          slug: 'current',
          path: `${pageBasePath}/config/machine-performance/current`
        },
        {
          label: t('historic_recipes'),
          // slug not used since we're passing the path
          slug: 'historic-recipes',
          path: `${pageBasePath}/config/machine-performance/historic-recipes`
        }
      ],
      [`common`]: [
        {
          label: t('alerts'),
          // slug not used since we're passing the path
          slug: 'alerts',
          path: `${pageBasePath}/config/common/alerts`
        },
        {
          label: t('alarms_list'),
          // slug not used since we're passing the path
          slug: 'alarms-list',
          path: `${pageBasePath}/config/common/alarms-list`
        },
        {
          label: t('master_tag_list'),
          // slug not used since we're passing the path
          slug: 'master-tag-list',
          path: `${pageBasePath}/config/common/master-tag-list`
        },
        {
          label: t('unit_classes'),
          // slug not used since we're passing the path
          slug: 'unit-classes',
          path: `${pageBasePath}/config/common/unit-classes`
        },
        {
          label: t('information'),
          // slug not used since we're passing the path
          slug: 'information',
          path: `${pageBasePath}/config/common/information`
        }
      ]
    };

    data.pageTabs = [
      {
        label: t('machine_health'),
        // slug not used since we're passing the path
        slug: 'machine-health',
        path: `${pageBasePath}/machine-health/overview`
      },
      {
        label: t('machine_health'),
        // slug not used since we're passing the path
        slug: 'machine-health',
        path: `${pageBasePath}/machine-health/overview`
      },
      {
        label: t('alerts'),
        // slug not used since we're passing the path
        slug: 'alerts',
        path: `${pageBasePath}/alerts`
      }
    ];

    // setup view tabs for each page tab (the second of set of `pill` style tabs)
    data.pageViewTabs = {
      [`alerts`]: [
        {
          label: t('alerts'),
          // slug not used since we're passing the path
          slug: 'all-alerts',
          path: `${pageBasePath}/alerts/manage-alerts`
        },
        {
          label: t('historical_alerts'),
          // slug not used since we're passing the path
          slug: 'historical-alerts',
          path: `${pageBasePath}/alerts/historical-alerts`
        }
      ]
    };
  }

  return data;
};
