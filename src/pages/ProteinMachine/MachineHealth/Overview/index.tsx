// 3rd party libs
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import {
  MachineUtilization,
  CleaningKpi,
  ProductionMetrics,
  MachineKpi,
  ExtendedMachineKpi,
  MachineActiveIssues,
  MachineIndicatorsGraph
} from 'components/machine-health';
import { DateRangeProvider, Flyout } from 'components';

import { useTimeZone } from 'providers';

import { SUB_ROUTES } from '..';

// Split the overview page into 2 containers <Kpis /> and <IndicatorsHistory />
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.375rem 3.25rem;
`;

// Contains <MachineKpi /> and <MachineMetrics />
const Kpis = styled.div`
  display: flex;
`;

const MachineKpiContainer = styled.div`
  flex: 0 0 33.33%;
`;

// Contains 2 <Metrics />
const MachineMetrics = styled.div`
  flex: 0 0 66.66%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-left: 1rem;
`;

// Contains 2 <Cards />
const Metrics = styled.div`
  height: 15.938rem;
  display: flex;
  gap: 1rem;
  & > div {
    flex: 1;
  }
`;

const IndicatorsHistory = styled.div`
  margin: 1rem 0;
`;

const Overview = (): JSX.Element => {
  const history = useHistory();
  const { timeZone } = useTimeZone();
  const [flyout, setFlyout] = useState(false);
  const { t } = useTranslation(['mh']);

  const graph = useMemo(() => {
    return <MachineIndicatorsGraph />;
  }, []);

  return (
    <>
      <Container>
        <Kpis>
          <MachineKpiContainer>
            <MachineKpi onClick={() => setFlyout(true)} />
          </MachineKpiContainer>
          <MachineMetrics>
            <Metrics>
              <ProductionMetrics />
              <MachineActiveIssues
                linksToPath={`${SUB_ROUTES.alarms}`}
                tooltipContent={t('go_to_alarms') as string}
              />
            </Metrics>
            <Metrics>
              <DateRangeProvider subtractDaysCount={1} timeZone={timeZone}>
                <MachineUtilization />
              </DateRangeProvider>
              <CleaningKpi
                onClick={() => history.push(`${SUB_ROUTES.cleaning}`)}
                linksToPath={`${SUB_ROUTES.cleaning}`}
                tooltipContent={t('go_to_cleaning') as string}
              />
            </Metrics>
          </MachineMetrics>
        </Kpis>
        <IndicatorsHistory>{graph}</IndicatorsHistory>
      </Container>
      <Flyout noFocusTrap width="28.125rem" visible={flyout} onClose={() => setFlyout(false)}>
        <ExtendedMachineKpi close={() => setFlyout(false)} />
      </Flyout>
    </>
  );
};

export default Overview;
