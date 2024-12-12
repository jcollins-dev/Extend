// 3rd party libs
import React, { useState, useEffect } from 'react';
// import _ from 'lodash';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { MapCard, Switch, Typography } from 'components';
import { SiteTable } from 'components/site';
import DSISite from 'pages/DSI/DSISite';
import { FleetBreadCrumbs } from 'components/StyledUi/FleetBreadCrumbs';

import { useFleetNavigation, FleetNavigationEntityType } from 'providers';

// Types
import { SiteRouteQueryParams, SiteTableType } from 'types/protein';
import { BusinessUnit } from 'types/dsi';

// Routes
import { useGetPlantByIdQuery } from 'api';

// Helpers
import { mapBusinessUnit } from 'helpers/machine';
import { NAV_ITEMS_TO_ID } from 'constants/nav';

// Styling
const Container = styled.div`
  margin: 3rem 3.125rem 0;
  position: relative;

  .bread-crumbs {
    margin-bottom: 2em;
  }
`;

const SwitchLabel = styled(Typography)<{ active?: boolean }>(({ theme, active }) => ({
  color: theme.colors.darkGrey,
  fontSize: '0.875rem',
  fontWeight: active ? 'bold' : 'normal'
}));

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 1rem 0;
  gap: 1rem;
`;

const Table = styled.div`
  padding-bottom: 1rem;
`;

const Site = (): JSX.Element => {
  const { plantId } = useParams<SiteRouteQueryParams>();

  const navContext = useFleetNavigation();

  useEffect(() => {
    plantId &&
      navContext.updateEntityIfNeeded({ type: FleetNavigationEntityType.PLANT, id: plantId });
    navContext.updateNavIdIfNeeded(NAV_ITEMS_TO_ID.fleet);
  }, [plantId, navContext]);

  const { t } = useTranslation(['mh']);
  const [tableType, setTableType] = useState<SiteTableType>('MACHINE');
  const changeView = () => setTableType(tableType == 'MACHINE' ? 'LINE' : 'MACHINE');
  const { data: accountData } = useGetPlantByIdQuery(plantId);

  const businessUnits =
    accountData && accountData.machines.map((m) => mapBusinessUnit(m.businessUnit));

  const isDSI = businessUnits && businessUnits.includes(BusinessUnit.DSI);
  const [isShowEntireFleet, setIsShowEntireFleet] = useState(false);

  const breadCrumbSettings = {
    paths: {
      customer: {
        label: accountData?.customer,
        isLoading: !accountData
      },
      site: {
        label: accountData?.siteName || accountData?.name,
        isLoading: !accountData
      }
    }
  };

  return (
    <>
      <Container>
        <FleetBreadCrumbs {...breadCrumbSettings} />
        <MapCard plantId={plantId} />
        {!isDSI && (
          <SwitchContainer>
            <SwitchLabel as="span" active={tableType == 'LINE'}>
              {t('line')}
            </SwitchLabel>
            <Switch checked={tableType == 'MACHINE'} onChange={changeView} />
            <SwitchLabel as="span" active={tableType == 'MACHINE'}>
              {t('machine')}
            </SwitchLabel>
          </SwitchContainer>
        )}
        {isDSI && (
          <DSISite
            plantId={plantId}
            type={tableType}
            showEntireFleet={setIsShowEntireFleet}
            isShowEntireFleet={isShowEntireFleet}
          />
        )}
        {(!isDSI || isShowEntireFleet) && (
          <Table>
            <SiteTable
              plantId={plantId}
              type={tableType}
              businessUnit={isDSI ? BusinessUnit.DSI : undefined}
            />
          </Table>
        )}
      </Container>
    </>
  );
};

export default Site;
