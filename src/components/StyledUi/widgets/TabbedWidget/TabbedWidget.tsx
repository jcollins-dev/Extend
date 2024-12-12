import React, { ReactNode } from 'react';

import {
  UseStyledTabsProps,
  useStyledTabs
} from 'components/StyledUi/StyledTabs/hooks/useStyledTabs';
import { WidgetUi } from 'components';

import {
  TabbedWidgetMain,
  TabbedWidgetSubHeader,
  TabbedWidgetProps
} from 'components/StyledUi/widgets/TabbedWidget';

interface Props extends TabbedWidgetProps, UseStyledTabsProps {
  children?: ReactNode | ReactNode[];
}

export const TabbedWidget = ({ ga, title, className, tabs, ...rest }: Props): JSX.Element => {
  const [Nav, Tabs] = useStyledTabs({ tabs });

  // setup widget ui
  const widgetUiSettings = {
    ...rest,
    ga,
    title,
    // add class modifiers for page-grid--[grid-area] and widget-ui--[title]
    SubHeader: <TabbedWidgetSubHeader>{Nav}</TabbedWidgetSubHeader>,
    className: `widget-ui--tabbed-widget${className ? ` ${className}` : ``}`,
    Main: <TabbedWidgetMain className="widget-ui-main">{Tabs}</TabbedWidgetMain>
  };

  return <WidgetUi {...widgetUiSettings} />;
};
