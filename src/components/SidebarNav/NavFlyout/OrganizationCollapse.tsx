import React, { useState, useEffect } from 'react';
import { Organization, Plant } from 'types';
import { Loader } from 'components';
import Collapse, { Panel } from 'rc-collapse';
import styled from 'styled-components';
import { useGetPlantsQuery } from 'api';
import { BuildingIcon } from 'icons';
import NavHeaderNode from './NavHeaderNode';
import { mapBusinessUnit } from 'helpers/machine';
import { useHistory } from 'react-router-dom';
import { JBTRoutes } from 'constants/routes';
import PlantCollapse from 'components/SidebarNav/NavFlyout/PlantCollapse';
import { useFleetNavigation } from 'providers';

export interface OrganizationCollapseArgs {
  organizations: Organization[] | undefined;
  isLoading: boolean;
}

const OrganizationPanel = styled(Panel)`
  margin-bottom: 1.5rem;
  width: 100%;
  display: inline-block;
`;

const OrganizationCollapse = ({
  organizations,
  isLoading
}: OrganizationCollapseArgs): React.ReactElement | null => {
  const history = useHistory();
  const navContext = useFleetNavigation();
  const [activeOrganizationKeys, setActiveOrganizationKeys] = useState<React.Key[]>([]);
  const { data: plants, isFetching: plantsLoading } = useGetPlantsQuery();

  useEffect(() => {
    if (navContext.entityPath.org) {
      setActiveOrganizationKeys([navContext.entityPath.org as React.Key]);
    }
  }, [navContext.entityPath.org]);

  if (isLoading) {
    return <Loader />;
  } else if (organizations === undefined) {
    return null;
  }

  return (
    <Collapse
      onChange={(key: React.Key | React.Key[]) =>
        setActiveOrganizationKeys(Array.isArray(key) ? key : [key])
      }
      defaultActiveKey={navContext.entityPath?.org ?? undefined}
      destroyInactivePanel={true}
    >
      {!plantsLoading &&
        organizations?.map((org) => {
          const orgPlants: Plant[] | undefined = plants?.filter((p: Plant) => p.orgId == org.id);
          const sortedPlantsByName = orgPlants
            ? [...orgPlants].sort((a, b) => a.name.localeCompare(b.name))
            : [];
          const hasPlants = sortedPlantsByName && sortedPlantsByName.length > 0;
          const orgOpened = activeOrganizationKeys?.includes(org.id);
          const businessUnits = hasPlants
            ? sortedPlantsByName[0].machines?.map((m) => mapBusinessUnit(m.businessUnit))
            : [];
          const orgClickable =
            businessUnits.includes(mapBusinessUnit(3)) ||
            businessUnits.includes(mapBusinessUnit(1)) ||
            businessUnits.includes(mapBusinessUnit(6)) ||
            businessUnits.includes(mapBusinessUnit(2));
          return (
            <OrganizationPanel
              showArrow={true}
              collapsible="header"
              key={org.id}
              header={NavHeaderNode(
                org.name,
                BuildingIcon,
                orgOpened,
                undefined,
                orgClickable,
                () => {
                  if (orgClickable) {
                    history.push(
                      businessUnits.includes(mapBusinessUnit(2))
                        ? JBTRoutes.fleet
                        : JBTRoutes.site.replace(':plantId', org.id)
                    );
                    navContext.setShowFlyout(false);
                  }
                },
                navContext.entityPath?.org === org.id
              )}
            >
              {hasPlants && !plantsLoading && (
                <PlantCollapse plants={sortedPlantsByName} isLoading={plantsLoading} />
              )}
            </OrganizationPanel>
          );
        })}
    </Collapse>
  );
};

export default OrganizationCollapse;
