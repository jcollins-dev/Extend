import React from 'react';
import { TabsNav } from '../Tabs';
import { PageLayoutProps } from './PageLayout';

export const PageLayoutTabNav = ({ pageTabs }: PageLayoutProps): JSX.Element => {
  return <TabsNav {...pageTabs} />;
};
