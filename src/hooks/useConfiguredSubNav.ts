// 3rd party libs
import slugify from 'slugify';
import { useParams } from 'react-router-dom';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { SerializedError } from '@reduxjs/toolkit';

// Types
import {
  DynamicNavigationTabWithSlug,
  TopLevelTabs,
  MachineHealthTabs,
  ProteinMachineRouteQueryParams,
  WidgetClass,
  MachinePerformanceTabs
} from 'types/protein';

// Providers
import { useLanguage } from 'providers';

// Routes
import { proteinMachineHealthSlugs } from 'constants/routes';

// API
import { useGetConfiguredWidgetQuery } from 'api';

interface ReturnType {
  isLoading: boolean;
  error?: FetchBaseQueryError | SerializedError;
  tabs?: DynamicNavigationTabWithSlug[];
  mapLabelsToSlugs: Record<string, string>;
}

/**
 * Queries the API to get configured/dynamic navigation data, within the Machine Health section.
 * We query all levels of navigation at once, to avoid multiple calls in series, to increase performance.
 * Passing a parentSection parameter allows us to look up the navigation within that section.
 */
const useConfiguredSubNav = (
  parentSection?: MachineHealthTabs | MachinePerformanceTabs,
  labels?: TopLevelTabs[],
  slugMap?: Record<string, string>
): ReturnType => {
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { languageId } = useLanguage();

  const { data, isLoading, error } = useGetConfiguredWidgetQuery({
    machineId,
    labels: labels || [TopLevelTabs.MachineHealth],
    widgetClasses: [WidgetClass.Structure],
    showInactive: false,
    languageId: languageId
  });

  const navData = data && data[0];

  // Find the tabs to render from the response, either from the top level, or the second level
  let tabs: DynamicNavigationTabWithSlug[] | undefined;

  if (parentSection) {
    // Second level of Machine Health nav - find the correct parent and retrieve the tabs from within there
    const parent = navData?.members?.find((item) => item.label === parentSection);

    // Decorate the tabs with slugs dynamically generated from the name
    tabs = parent?.members?.map((item) => ({
      ...item,
      slug: slugify(item.name as string, {
        lower: true,
        strict: true
      })
    }));
  } else {
    // Top level nav within Machine Health, so retrieve the tabs from the first level members
    // Decorate with hard-coded slugs, as these sections cannot be renamed
    tabs = navData?.members?.map((item) => ({
      ...item,
      slug: slugMap
        ? slugMap[item.label as MachineHealthTabs]
        : proteinMachineHealthSlugs[item.label as MachineHealthTabs]
    }));
  }

  // Directly lookup a slug from a tab label
  const mapLabelsToSlugs = tabs?.reduce((acc, tab) => {
    return {
      ...acc,
      [tab.label as string]: tab.slug
    };
  }, {});

  return {
    isLoading,
    error,
    tabs,
    mapLabelsToSlugs: mapLabelsToSlugs ?? {}
  };
};

export default useConfiguredSubNav;
