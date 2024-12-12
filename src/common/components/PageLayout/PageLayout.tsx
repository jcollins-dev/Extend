import React, { ReactNode } from 'react';
import { PageLayoutContainer, baseClass } from './PageLayout.elements';
import { PageLayoutHeader } from './PageLayoutHeader';
import { TabsNav, TabsNavProps } from '../Tabs';

export interface PageLayoutProps {
  pageTabs?: TabsNavProps;
  Footer?: ReactNode | ReactNode[];
  children: ReactNode | ReactNode[];
}

export const PageLayout = ({ pageTabs, children, Footer }: PageLayoutProps): JSX.Element => {
  // set the grid template rows default to auto because they all have a page header
  let gridRows = `auto`;
  // adds the tabs nav row
  if (pageTabs) gridRows += ` auto`;
  // adds the main row as full remaining height
  if (pageTabs) gridRows += ` 1fr`;
  // adds the footer row
  if (Footer) gridRows += ` auto`;

  console.log({ pageTabs });
  return (
    <PageLayoutContainer className={baseClass} {...{ gridRows }}>
      <header className={`${baseClass}__header`}>
        <PageLayoutHeader />
      </header>

      {pageTabs && <TabsNav className={`${baseClass}__tab-nav`} {...pageTabs} />}

      <main className={`${baseClass}__main`}>{children}</main>

      {Footer && <footer className={`${baseClass}__footer`}>{Footer}</footer>}
    </PageLayoutContainer>
  );
};
