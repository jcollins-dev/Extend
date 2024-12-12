// 3rd party libs
import React from 'react';
import { Redirect, Route, Switch, useRouteMatch, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Components
import { PageTabView, useDateRange, DateButtonWithDropdown, DateRangeProvider } from 'components';
import SingleSession from './SingleSession';
import StepsOverTime from './StepsOverTime';
import { ConfiguredSubNav, GenericWidgetPage } from 'components/machine-health';

// Hooks
import { useConfiguredSubNav } from 'hooks';

// Types
import { MachineHealthSubTabs, MachineHealthTabs } from 'types/protein';
import { DATA_DATE_LIMIT_DAYS } from 'constants/machineConfig';

export const Bar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ContentContainer = styled.div`
  margin: 1rem 3.25rem;

  > * {
    margin-bottom: 2rem;
  }
`;

export const ActionItemsContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;
  position: absolute;
  right: 3.25rem;
  top: 1.5625rem;
`;

export const ActionPillsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1.25rem;
`;

const Cleaning = (): JSX.Element => {
  const match = useRouteMatch();
  const { tabs, mapLabelsToSlugs } = useConfiguredSubNav(MachineHealthTabs.Cleaning);

  const { dateRange, setDateRange, timeZone } = useDateRange();

  const currentSlug = useLocation().pathname.split('/').at(-1);
  const hasGoBackDateLimit = DATA_DATE_LIMIT_DAYS;

  const pageTabViewSettings = {
    TabSubNav: (
      <ConfiguredSubNav
        parentSection={MachineHealthTabs.Cleaning}
        baseUrl={match.url}
        showMe={true}
      />
    ),
    HeaderRight: currentSlug !== mapLabelsToSlugs[MachineHealthSubTabs.CLESingleSession] && (
      <DateButtonWithDropdown {...{ dateRange, setDateRange, hasGoBackDateLimit }} />
    )
  };

  return (
    <PageTabView {...pageTabViewSettings}>
      <Switch>
        <Route exact path={`${match.path}/`}>
          {/* Redirect to the first active tab - this may not necessarily be Overview */}
          <Redirect to={`${match.url}/${tabs && tabs[0].slug}`} />
        </Route>

        {/* Single Session */}
        <Route path={`${match.path}/${mapLabelsToSlugs[MachineHealthSubTabs.CLESingleSession]}`}>
          <ContentContainer>
            <DateRangeProvider {...{ timeZone }} subtractDaysCount={1}>
              <SingleSession />
            </DateRangeProvider>
          </ContentContainer>
        </Route>

        {/* Steps over time */}
        <Route path={`${match.path}/${mapLabelsToSlugs[MachineHealthSubTabs.CLEStepsOverTime]}`}>
          <ContentContainer>
            <StepsOverTime />
          </ContentContainer>
        </Route>

        {/* Extra Sensors */}
        <Route path={`${match.path}/${mapLabelsToSlugs[MachineHealthSubTabs.CLEExtraSensors]}`}>
          <GenericWidgetPage pageTemplateId={MachineHealthSubTabs.CLEExtraSensors} {...dateRange} />
        </Route>
      </Switch>
    </PageTabView>
  );
};

export default Cleaning;
