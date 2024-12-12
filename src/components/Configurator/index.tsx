//3rd party
import React, { ReactNode } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Components
import {
  BreadCrumbs,
  BreadCrumbsItemProps,
  FleetBreadCrumbsPathsProps,
  RouterTabNav,
  RouterTabNavProps,
  SitePageViews
} from 'components';

// Elements
import { BreadCrumbsPaddingFixer } from 'components/StyledUi/FleetBreadCrumbs/FleetBreadCrumbs.elements';
import { SitePageContainer } from 'components/StyledUi/PageLayouts/SitePage/SitePage.elements';
import { Configurator } from './Configurator.elements';
import { UseFleetMachinePageSettingsReturnProps } from 'pages/DSI/usePageSettingsDSI';

interface ConfiguratorPageProps {
  children?: ReactNode | ReactNode[];
  data?: UseFleetMachinePageSettingsReturnProps;
}

export const ConfiguratorPage = ({ children, data }: ConfiguratorPageProps): JSX.Element => {
  if (!data) return <p>Configurator is not set up.</p>;

  const baseClass = 'configurator';

  const history = useHistory();
  const { pathname } = useLocation();

  const { configTabs, configTabsViews, configuratorBreadcrumb, machinePerfomanceComponent } = data;

  const pageSlug =
    configTabsViews &&
    (Object.keys(configTabsViews).filter(
      (slug) => pathname.indexOf(slug) > -1
    )?.[0] as unknown as string);

  const pageTabNavSettings = configTabs && {
    pageSlug: pageSlug,
    routerTabs: configTabs,
    className: `${baseClass}__page-nav`
  };

  const breadcrumbSettings = {
    paths: configuratorBreadcrumb?.paths,
    hideBackArrow: false,
    handleBackArrow: () => history.goBack()
  };

  return (
    <Configurator className={baseClass}>
      <ConfiguratorTopContainer {...{ pageTabNavSettings, breadcrumbSettings }} />

      <SitePageContainer className={baseClass}>
        <header className={`${baseClass}__subtabs__header`}>
          {configTabsViews && pageSlug && (
            <RouterTabNav
              {...{
                routerTabs: configTabsViews?.[pageSlug],
                uiStyle: `pills`,
                className: `${baseClass}__subtabs__view-nav`
              }}
            />
          )}
          {machinePerfomanceComponent && machinePerfomanceComponent}
        </header>
        {configTabsViews && <SitePageViews {...pageTabNavSettings} />}
        {children}
      </SitePageContainer>
    </Configurator>
  );
};

interface ConfiguratorTopContainerProps {
  pageTabNavSettings?: RouterTabNavProps;
  breadcrumbSettings?: ConfiguratorBreadCrumbProps;
}

export const ConfiguratorTopContainer = ({
  pageTabNavSettings,
  breadcrumbSettings
}: ConfiguratorTopContainerProps): JSX.Element => {
  const baseClass = 'config_top_container';

  return (
    <>
      <header className={`${baseClass}__header`}>
        {breadcrumbSettings && <ConfiguratorBreadCrumbs {...breadcrumbSettings} />}
      </header>
      <RouterTabNav {...pageTabNavSettings} />
    </>
  );
};

export interface ConfiguratorBreadCrumbProps {
  paths?: FleetBreadCrumbsPathsProps;
  hideBackArrow?: boolean;
  handleBackArrow?: () => void;
  children?: ReactNode | ReactNode[];
}

export const ConfiguratorBreadCrumbs = ({
  paths,
  hideBackArrow,
  children,
  ...rest
}: ConfiguratorBreadCrumbProps): JSX.Element => {
  const pathItems = [];

  const { t } = useTranslation(['mh']);
  const baseClass = 'configurator_breadcrumbs';

  if (!paths) return <></>;

  if (paths.customer)
    pathItems.push({
      ...paths.customer,
      pathLabel: t('retrieving_customer')
    } as BreadCrumbsItemProps);
  if (paths.site)
    pathItems.push({ ...paths.site, pathLabel: t('retrieving_site') } as BreadCrumbsItemProps);
  if (paths.line)
    pathItems.push({ ...paths.line, pathLabel: t('retrieving_line') } as BreadCrumbsItemProps);
  if (paths.machine)
    pathItems.push({
      ...paths.machine,
      pathLabel: t('retrieving_machine')
    } as BreadCrumbsItemProps);

  pathItems.push({ label: t('config'), pathLabel: t('config') });

  const BackArrow = hideBackArrow ? undefined : (
    <a href="/fleet" className={`${baseClass}__btn-back`}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </a>
  );

  const CurrentBreadCrumbs = (
    <BreadCrumbs {...rest} items={pathItems} Before={BackArrow}>
      {children}
    </BreadCrumbs>
  );

  const needsPadding = true;

  // needsPadding is a fix for incorrectly coded pages, this should be removed when site is cleaned up
  if (needsPadding) return <BreadCrumbsPaddingFixer>{CurrentBreadCrumbs}</BreadCrumbsPaddingFixer>;
  else return CurrentBreadCrumbs;
};
