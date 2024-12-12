// 3rd party libs
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { find } from 'lodash';

// Components
import ImageUploadModal from './ImageUploadModal';
import { Column, DashboardWidget, PageHeader, Row, DateRangeProvider } from 'components';
import { LineDurationChart, LineTable } from 'components/line';
import { LineCardWidget } from 'components/StyledUi/LineCardWidget/LineCardWidget';
import MachineVisionContainer from './MachineVisionContainer';

import { useFleetNavigation, FleetNavigationEntityType } from 'providers';

// Routes
import { JBTRoutes } from 'constants/routes';

// Types
import { LineRouteQueryParams, MachineUtilization } from 'types/protein';
import { ResourceType } from 'types';
import { PermissionScopeName } from 'types/user-management';

// Api
import { useGetLineViewAssetsQuery, useGetLineInfoQuery, useGetPlantByIdQuery } from 'api';

// Hooks
import { usePermissions } from 'hooks';

// Helpers
import { mapBusinessUnitId } from 'helpers/machine';
import { NAV_ITEMS_TO_ID } from 'constants/nav';

// Styling
const Container = styled.div`
  width: 100%;
  position: relative;
  padding: 1.5rem 3.125rem 0 3.125rem;
  margin-top: 1rem;

  .bread-crumbs {
    margin-bottom: 2em;
  }

  .line-status-col {
    header {
      height: 5em !important;
    }
  }
`;

const StyledLineImage = styled.img`
  padding: 1rem;
`;

const LineCardContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;

  .ui-dashboard-widget {
    width: 32%;
    flex-grow: 1;
    min-width: 300px;
  }
`;

const defualtImageSrc = '/assets/placeholder/machines/place-holder.jpg';

const Line = (): JSX.Element => {
  const { lineId } = useParams<LineRouteQueryParams>();

  const navContext = useFleetNavigation();

  useEffect(() => {
    lineId && navContext.updateEntityIfNeeded({ type: FleetNavigationEntityType.LINE, id: lineId });
    navContext.updateNavIdIfNeeded(NAV_ITEMS_TO_ID.fleet);
  }, [lineId, navContext]);

  const history = useHistory();
  const { data } = useGetLineInfoQuery({ lineId });
  const { name, plantId } = data || { name: '', plantId: '' };
  const { data: accountData } = useGetPlantByIdQuery(plantId);
  const permission = usePermissions();
  const scopePermission = find(
    permission?.scopes,
    (scopeItem) => scopeItem.name === PermissionScopeName.FLEET
  );
  const [isVisualOverviewModalOpen, setIsVisualOverviewModalOpen] = useState(false);

  const [utilizationByMachine, setUtilizationByMachine] = useState<
    { id: string; utilization: MachineUtilization }[]
  >([]);

  const {
    data: lineAssets,
    isLoading: isImageLoading,
    error: imageError
  } = useGetLineViewAssetsQuery({
    assetType: ResourceType.LineImage,
    lineId
  });

  const handleClick = (id: string) => {
    history.push(`${JBTRoutes.machineHealthOverview.replace(':machineId', id)}`);
  };
  const handleEditTagsClick = () => {
    return null;
  };

  const machines = accountData?.machines.filter((item) => item.lineId === lineId);

  const breadCrumbSettings = {
    paths: {
      customer: {
        label: accountData?.customer,
        isLoading: !accountData
      },
      site: {
        label: accountData?.siteName,
        isLoading: !accountData,
        slug: `/fleet/site/${plantId}`
      },
      line: {
        label: data?.name,
        isLoading: !data,
        slug: `/fleet/line/${lineId}`
      }
    }
  };

  return (
    <>
      <Container className="line-container">
        <PageHeader heading={''} breadCrumbSettings={breadCrumbSettings} />
        {process.env.REACT_APP_LINE_VIEW_FEATURE === 'true' && (
          <DateRangeProvider subtractDaysCount={1} timeZone={data?.timezone}>
            <LineCardContainer>
              {machines?.map((el, i) => {
                const settings = {
                  businessUnitId: mapBusinessUnitId(el.businessUnit) || 3,
                  machineId: el.id,
                  name: el.description,
                  handleClick,
                  handleEditTagsClick,
                  headerIcon: {
                    label: ''
                  },
                  setUtilizationByMachine
                };
                return <LineCardWidget key={i} {...settings} />;
              })}
            </LineCardContainer>
          </DateRangeProvider>
        )}

        {/* Machine Vision  */}
        <MachineVisionContainer />

        {/* Line Status bar chart */}
        {process.env.REACT_APP_LINE_VIEW_FEATURE === 'true' && (
          <Row>
            <Column className="line-status-col">
              <DateRangeProvider timeZone={data?.timezone}>
                <LineDurationChart lineId={lineId} lineName={name || 'Line'} />
              </DateRangeProvider>
            </Column>
          </Row>
        )}

        {/* Machine table */}
        <Row>
          <Column>
            <LineTable utilizationByMachine={utilizationByMachine} />
          </Column>
        </Row>

        {/* Visual Overview */}
        {process.env.REACT_APP_LINE_VIEW_FEATURE === 'true' && (
          <Row>
            <Column>
              <DashboardWidget
                hasError={imageError && 'Failed to load image'}
                isAdminWidget={scopePermission?.write || permission.isAdmin}
                isLoading={isImageLoading}
                onAdminButtonClickCallback={() => setIsVisualOverviewModalOpen(true)}
                title="Visual Overview"
              >
                <StyledLineImage
                  src={lineAssets?.[lineAssets.length - 1]?.url || defualtImageSrc}
                  alt="Machine line layout"
                />
              </DashboardWidget>
            </Column>
          </Row>
        )}
      </Container>

      {process.env.REACT_APP_LINE_VIEW_FEATURE === 'true' && (
        <ImageUploadModal
          isOpen={isVisualOverviewModalOpen}
          lineId={lineId}
          onCloseCallback={() => setIsVisualOverviewModalOpen(false)}
        />
      )}
    </>
  );
};

export default Line;

/*breadcrumbs={[
    {
      label: accountData ? accountData.customer : 'Retrieving Customer',
      link: JBTRoutes.fleet
    },
    {
      label: accountData
        ? process.env.REACT_APP_SIDENAV_ENABLE_ORG_LEVEL === 'true'
          ? accountData.siteName
          : accountData.name
        : 'Retrieving Site',
      link: JBTRoutes.site.replace(':plantId', plantId)
    },
    {
      label: name
    }
  ]}*/
