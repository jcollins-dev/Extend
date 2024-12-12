import React, { useState } from 'react';
import { JBTRoutes } from 'constants/routes';
import { mapBusinessUnit } from 'helpers/machine';
import { LineIcon } from 'icons';
import { useFleetNavigation } from 'providers';
import Collapse, { Panel } from 'rc-collapse';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Line, Machine } from 'types';
import MachineList from './MachineList';
import NavHeaderNode from './NavHeaderNode';

interface LineCollapseArgs {
  lines: Line[];
  machines: Machine[];
}

const LineCollapseRoot = styled(Collapse)`
  margin-top: 1.625rem;
  margin-left: 1.5rem;
`;

const LinePanel = styled(Panel)`
  padding-bottom: 0.688rem;
`;

function groupMachinesByLine(
  lines: Line[] | undefined,
  machines: Machine[] | undefined
): Map<string, Machine[]> {
  const lineToMachineMap = new Map<string, Machine[]>();
  if (lines) {
    lines.forEach((l: Line) => {
      lineToMachineMap.set(l.id, []);
    });
  }
  lineToMachineMap.set('others', []);
  if (machines) {
    machines.forEach((m: Machine) => {
      if (m.lineId && lineToMachineMap.has(m.lineId)) {
        lineToMachineMap.get(m.lineId)?.push(m);
      } else {
        lineToMachineMap.get('others')?.push(m);
      }
    });
  }
  return lineToMachineMap;
}

const LineCollapse = ({ lines, machines }: LineCollapseArgs): React.ReactElement => {
  const [activeLinesKeys, setActiveLinesKeys] = useState<React.Key[]>(lines.map((l: Line) => l.id));
  const machinesByLine = groupMachinesByLine(lines, machines);
  const history = useHistory();
  const navContext = useFleetNavigation();

  return (
    <>
      <LineCollapseRoot
        destroyInactivePanel={true}
        onChange={(key: React.Key | React.Key[]) =>
          setActiveLinesKeys(Array.isArray(key) ? key : [key])
        }
        defaultActiveKey={lines.map((l: Line) => l.id)}
      >
        {lines
          .filter((line: Line) => (machinesByLine?.get(line.id)?.length as number) > 0)
          .map((l: Line) => {
            const lineOpened = activeLinesKeys?.includes(l.id);
            const lineMachines = machinesByLine.get(l.id);
            const businessUnits = lineMachines?.map((m) => mapBusinessUnit(m.businessUnit));
            const lineClickable =
              !!navContext.entityLinks?.line &&
              (businessUnits?.includes('aseptic') ||
              businessUnits?.includes('avure') ||
              businessUnits?.includes('dsi')
                ? false
                : true);
            return (
              <LinePanel
                collapsible="header"
                forceRender={true}
                key={l.id}
                header={NavHeaderNode(
                  l.name,
                  LineIcon,
                  lineOpened,
                  undefined,
                  lineClickable,
                  () => {
                    if (parseFloat(process.env.REACT_APP_NAV_VERSION as string) >= 2) {
                      history.push(navContext.entityLinks?.line?.replace(':lineId', l.id) ?? '');
                    } else {
                      history.push(JBTRoutes.line.replace(':lineId', l.id));
                    }
                    navContext.setShowFlyout(false);
                  },
                  navContext.entityPath?.line === l.id
                )}
              >
                <MachineList machines={lineMachines} />
              </LinePanel>
            );
          })}
      </LineCollapseRoot>
      <MachineList machines={machinesByLine.get('others')} />
    </>
  );
};

export default LineCollapse;
