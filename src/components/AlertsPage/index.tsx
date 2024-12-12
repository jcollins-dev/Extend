import React, { ReactNode } from 'react';
import { RouterTabNavPropsTab, SitePageView, SitePageViewProps } from 'components/StyledUi';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { UseFleetMachinePageSettingsReturnProps } from 'pages/FleetMachineDetail/hooks';

// Trying to build this page in a way that it would be used across different BUs to show alerts

// <AlertsPage /> - is what renders on Alerts tab when viewing a machine

// <AlertsPage /> should be wrapped in a provider that passes all the configs,
// or just pass necessary configs through the props

interface AlertsPageProps extends UseFleetMachinePageSettingsReturnProps {
  pageBasePath?: string;
  pageViewSlug: string;
  children?: ReactNode | ReactNode[];
  hideDatePicker?: boolean;
  pageViewTabs?: Record<string, RouterTabNavPropsTab[]>;
}

export const AlertsPage = (props: AlertsPageProps): JSX.Element => {
  const match = useRouteMatch();

  const { hideDatePicker, pageViewTabs, children, pageViewSlug } = props;

  const settings = {
    hideDatePicker,
    pageViewTabs: pageViewTabs?.[pageViewSlug],
    children,
    pageViewSlug
  };

  return (
    <FleetMachinePageView {...settings}>
      <Switch>
        <Route exact path={`${match.path}/`}>
          <Redirect to={`${match.url}/all-alerts`} />
        </Route>
        <Route path={`${match.path}/all-alerts`}>
          <p>All Alerts</p>
        </Route>
        <Route path={`${match.path}/historical-alerts`}>
          <p>Historical Alerts</p>
        </Route>
      </Switch>
    </FleetMachinePageView>
  );
};

const FleetMachinePageView = ({
  children,
  pageViewSlug,
  ...rest
}: SitePageViewProps): JSX.Element => {
  return (
    <SitePageView {...rest} {...{ pageViewSlug }}>
      {children}
    </SitePageView>
  );
};
