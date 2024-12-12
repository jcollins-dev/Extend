import React, { ReactNode } from 'react';
import { UiPageLayout } from '../';
import { PageDateRangeProvider } from 'components/StyledUi/DateRange';
import { PageLayoutProps } from './PageLayout.types';

const { PageContainer } = UiPageLayout;

interface Props extends UiPageLayout.UiProps, PageLayoutProps {
  children: ReactNode | ReactNode[];
}
export const PageLayout = ({ children, pageName, subtractDaysCount }: Props): JSX.Element => {
  return (
    <PageDateRangeProvider {...{ subtractDaysCount }}>
      <PageContainer {...{ pageType: 'dashboard', pageName }}>{children}</PageContainer>
    </PageDateRangeProvider>
  );
};
