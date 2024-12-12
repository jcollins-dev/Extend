import React, { ReactElement, useEffect } from 'react';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MachineConnectionStatus } from 'components/machine-health';
import Typography from 'components/Typography/Typography';
import { JBTRoutes } from 'constants/routes';
import { MachineIcon } from 'icons';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import theme from 'themes';

import { Machine } from 'types';
import { FleetNavigationEntityType, useFleetNavigation } from 'providers';

const SHOW_MACHINE_CONNECTION_STATUS = false;

export interface MachineListArgs {
  machines?: Machine[];
  nameLength?: number;
}

interface MachineRootProps {
  backgroundColor: string;
  padding: string;
  margin: string;
}

const MachineListRowRoot = styled.div<MachineRootProps>`
  display: flex;
  padding: ${(props) => props.padding};
  flex-direction: row;
  justify-content: space-between;
  margin: ${(props) => props.margin};
  background-color: ${(props) => props.backgroundColor};
  padding-bottom: 0.688rem;
  cursor: pointer;
`;

const MachineNameAndIconContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.black};
  & p {
    margin: 0;
    margin-left: 0.625rem;
    text-wrap: wrap;
  }
`;

const ConnectionStatus = styled((props) => <MachineConnectionStatus {...props} />)`
  margin-left: 0.625rem;
`;

const MachineList = ({ machines }: MachineListArgs): ReactElement => {
  const history = useHistory();
  const navContext = useFleetNavigation();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const navFlyoutHighlight = navContext.getFlyoutHighlight();
  const highlightColor = navFlyoutHighlight[FleetNavigationEntityType.MACHINE] as string;
  const getBackgroundColor = (id: string) => {
    return highlightColor && navContext.entityPath?.machine === id
      ? (highlightColor as string)
      : '';
  };
  const getPadding = (id: string) => {
    return highlightColor && navContext.entityPath?.machine === id
      ? '0.875rem 0.5rem 0 6.25rem'
      : '0';
  };

  const getMargin = (id: string) => {
    return highlightColor && navContext.entityPath?.machine === id
      ? '1.625rem -0.5rem 0 -4.5rem'
      : '1.625rem 0 0 1.75rem';
  };

  useEffect(() => {
    if (scrollRef.current !== null) {
      console.log(`MachineList useEffect - navContext.scrollRef = ${scrollRef.current}`);
      navContext.setScrollRef(scrollRef);
    }
  });

  return (
    <>
      {machines?.map((m: Machine) => {
        return (
          <MachineListRowRoot
            backgroundColor={getBackgroundColor(m.id)}
            padding={getPadding(m.id)}
            margin={getMargin(m.id)}
            key={m.id}
            ref={highlightColor && navContext.entityPath?.machine === m.id ? scrollRef : undefined}
            onClick={() => {
              /**
               * Since we have the 'businessUnit' at this point we're passing it to <Machine />
               * via the 'history' object in order to avoid an unnecessary call, as the <Machine />
               * will first fetch the 'businessUnit' before deciding which page to render.
               *
               *
               * 1: 'pna',
               * 2: 'avure',
               * 3: 'pemea',
               * 4: 'aseptic',
               * 5: 'avure'
               * 5: 'dsi'
               *
               */
              if (parseFloat(process.env.REACT_APP_NAV_VERSION as string) >= 2) {
                history.push(navContext.entityLinks?.machine?.replace(':machineId', m.id) ?? '', {
                  businessUnit: m.businessUnit
                });
              } else {
                history.push(JBTRoutes.machine.replace(':machineId', m.id), {
                  businessUnit: m.businessUnit
                });
              }
              navContext.setShowFlyout(false);
            }}
          >
            <MachineNameAndIconContainer>
              {MachineIcon(theme.colors.mediumGrey3)}
              <Typography variant="body1">{m.description}</Typography>
              {SHOW_MACHINE_CONNECTION_STATUS && <ConnectionStatus machineId={m.id} />}
            </MachineNameAndIconContainer>
            <FontAwesomeIcon icon={faAngleRight} />
          </MachineListRowRoot>
        );
      })}
    </>
  );
};

export default MachineList;
