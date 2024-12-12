import React, { useState, useEffect } from 'react';
import { Line, Plant } from 'types';
import { Loader } from 'components';
import Collapse, { Panel } from 'rc-collapse';
import styled from 'styled-components';
import { useGetLinesQuery } from 'api';
import MachineList from './MachineList';
import { PlantIcon } from 'icons';
import NavHeaderNode from './NavHeaderNode';
import LineCollapse from './LineCollapse';
import { mapBusinessUnit } from 'helpers/machine';
import { useHistory } from 'react-router-dom';
import { JBTRoutes } from 'constants/routes';
import { useFleetNavigation } from 'providers';

export interface PlantCollapseArgs {
  plants: Plant[] | undefined;
  isLoading: boolean;
}

const PlantCollapseRoot = styled(Collapse)`
  margin-top: 1.625rem;
  margin-left: 1.5rem;
`;

const PlantPanel = styled(Panel)`
  margin-bottom: 1.5rem;
  width: 100%;
  display: inline-block;
`;

const PlantLevelMachineList = styled((props) => <MachineList {...props} />)``;
const PlantCollapse = ({ plants, isLoading }: PlantCollapseArgs): React.ReactElement | null => {
  const history = useHistory();
  const navContext = useFleetNavigation();
  const [activePlantKeys, setActivePlantKeys] = useState<React.Key[]>([]);
  const { data: lines, isFetching: linesLoading } = useGetLinesQuery({
    plantIds: plants?.map((p) => p.id)
  });

  useEffect(() => {
    if (navContext.entityPath.plant) {
      setActivePlantKeys([navContext.entityPath.plant as React.Key]);
    }
  }, [navContext.entityPath.plant]);

  if (isLoading) {
    return <Loader />;
  } else if (plants === undefined) {
    return null;
  }

  return (
    <PlantCollapseRoot
      onChange={(key: React.Key | React.Key[]) =>
        setActivePlantKeys(Array.isArray(key) ? key : [key])
      }
      defaultActiveKey={navContext.entityPath?.plant ?? undefined}
      destroyInactivePanel={true}
    >
      {plants?.map((p) => {
        const plantLines: Line[] | undefined = lines?.filter((l: Line) => l.plantId == p.id);
        const hasLines = plantLines && plantLines.length > 0;
        const plantOpened = activePlantKeys?.includes(p.id);
        const businessUnits = p.machines.map((m) => mapBusinessUnit(m.businessUnit));
        const plantClickable =
          businessUnits.includes('pemea') ||
          businessUnits.includes('pna') ||
          businessUnits.includes('dsi') ||
          businessUnits.includes('avure');
        return (
          <PlantPanel
            showArrow={true}
            collapsible="header"
            key={p.id}
            header={NavHeaderNode(
              p.siteName ? p.siteName : p.name,
              PlantIcon,
              plantOpened,
              undefined,
              plantClickable,
              () => {
                if (plantClickable) {
                  history.push(
                    businessUnits.includes('avure')
                      ? JBTRoutes.fleet
                      : JBTRoutes.site.replace(':plantId', p.id)
                  );
                  navContext.setShowFlyout(false);
                }
              },
              navContext.entityPath?.plant === p.id
            )}
          >
            {hasLines && !linesLoading && <LineCollapse lines={plantLines} machines={p.machines} />}
            {!hasLines && !linesLoading && (
              <PlantLevelMachineList machines={p.machines} nameLength={22} />
            )}
          </PlantPanel>
        );
      })}
    </PlantCollapseRoot>
  );
};

export default PlantCollapse;
