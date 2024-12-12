import { RouterTabNavPropsTab } from 'components/StyledUi/RouterTabNav';

export interface UseFleetMachinePageSettingsReturnProps {
  pageTabs?: RouterTabNavPropsTab[];
  pageTabsTemplates?: RouterTabNavPropsTab[];
  pageViewTabs?: Record<string, RouterTabNavPropsTab[]>;
  pageSlug?: string;
  pageBasePath?: string;
  pageBasePathTemplates?: string;
}

export const usePageSettings = (): UseFleetMachinePageSettingsReturnProps => {
  const pageBasePath = `/alert-management`;
  const pageBasePathTemplates = `/alert-template-management`;

  const data: UseFleetMachinePageSettingsReturnProps = {
    pageBasePath,
    pageBasePathTemplates
  };

  // Tabs for Managing Alerts
  data.pageTabs = [
    {
      label: 'Manage Alert',
      // slug not used since we're passing the path
      slug: 'manage-alert',
      path: `${pageBasePath}/manage-alert`
    },
    {
      label: 'Aggregated & Calculated Tags',
      // slug not used since we're passing the path
      slug: 'tags',
      path: `${pageBasePath}/tags`
    }
  ];

  // Tabs for Managing Alert Templates
  data.pageTabsTemplates = [
    {
      label: 'Manage Alert Template',
      // slug not used since we're passing the path
      slug: 'manage-template',
      path: `${pageBasePathTemplates}/manage-template`
    },
    {
      label: 'Tags (Calculated)',
      // slug not used since we're passing the path
      slug: 'tags',
      path: `${pageBasePathTemplates}/tags`
    }
  ];

  return data;
};
