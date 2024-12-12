// 3rd Party
import React, { useState, useEffect } from 'react';
import Collapse, { Panel } from 'rc-collapse';
import styled from 'styled-components';

// Components
import { Loader } from 'components';
import { PlantCollapseArgs } from 'components/SidebarNav/NavFlyout/PlantCollapse';
import PlantCollapseV1 from './PlantCollapseV1';
import NavHeaderNode from './NavHeaderNode';

// Types
import { Plant } from 'types';
import { PlantIcon } from 'icons';

import { useFleetNavigation } from 'providers';

const PlantPanel = styled(Panel)`
  margin-bottom: 1.5rem;
  width: 100%;
  display: inline-block;
`;

const PlantNameCollapse = ({ plants, isLoading }: PlantCollapseArgs): React.ReactElement | null => {
  const [activePlantKeys, setActivePlantKeys] = useState<React.Key[]>([]);
  const groupedPlants: Record<string, Plant[]> = (plants ?? []).reduce(
    (acc: Record<string, Plant[]>, plant: Plant) => {
      const { name } = plant;
      acc[name] = acc[name] || [];
      acc[name].push(plant);
      return acc;
    },
    {}
  );

  const navContext = useFleetNavigation();
  useEffect(() => {
    if (navContext.entityPath.org) {
      setActivePlantKeys([navContext.entityPath.org as React.Key]);
    }
  }, [navContext.entityPath.org]);

  if (isLoading) {
    return <Loader />;
  } else if (plants === undefined) {
    return null;
  }

  return (
    <Collapse
      onChange={(key: React.Key | React.Key[]) =>
        setActivePlantKeys(Array.isArray(key) ? key : [key])
      }
      defaultActiveKey={navContext.entityPath?.org ?? undefined}
      destroyInactivePanel={true}
    >
      {Object.entries(groupedPlants).map(([plantName, gPlants]) => {
        const hasPlants = gPlants && gPlants.length > 0;
        const hasMachines: boolean =
          hasPlants && gPlants.some((plant) => plant.machines?.length > 0);
        const sortedPlantsByName = gPlants
          ? [...gPlants].sort((a, b) => a.siteName.localeCompare(b.siteName))
          : [];
        const plantOpened = activePlantKeys?.includes(plantName);
        return (
          <PlantPanel
            showArrow={true}
            collapsible="header"
            key={plantName}
            header={NavHeaderNode(
              plantName,
              PlantIcon,
              plantOpened,
              undefined,
              undefined,
              undefined,
              navContext.entityPath?.org === plantName
            )}
          >
            {hasMachines && !isLoading && (
              <PlantCollapseV1 plants={sortedPlantsByName} isLoading={isLoading} />
            )}
          </PlantPanel>
        );
      })}
    </Collapse>
  );
};

export default PlantNameCollapse;
