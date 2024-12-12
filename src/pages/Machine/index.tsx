// 3rd party libs
import React, { useEffect } from 'react';
import { DataRenderer } from 'components/machine-health';
import { JBTRoutes } from 'constants/routes';
import { mapBusinessUnit } from 'helpers/machine';
import { useMachine } from 'hooks';
import { Aseptic, DSI, FleetMachineDetail, ProteinMachine, Proseal } from 'pages';
import { Redirect, useLocation } from 'react-router-dom';
import { MachineBusinessUnit } from 'types';
import { TimeZoneProvider } from 'providers/timeZoneProvider';
import { useFleetNavigation, FleetNavigationEntityType } from 'providers';
import { NAV_ITEMS_TO_ID } from 'constants/nav';

const pages: Record<MachineBusinessUnit, JSX.Element> = {
  pemea: (
    <TimeZoneProvider>
      <ProteinMachine />
    </TimeZoneProvider>
  ),
  pna: (
    <TimeZoneProvider>
      <ProteinMachine />
    </TimeZoneProvider>
  ),
  avure: (
    <TimeZoneProvider>
      <FleetMachineDetail />
    </TimeZoneProvider>
  ),
  aseptic: (
    <TimeZoneProvider>
      {' '}
      <Aseptic />{' '}
    </TimeZoneProvider>
  ),
  dsi: (
    <TimeZoneProvider>
      <DSI />
    </TimeZoneProvider>
  ),
  proseal: <Proseal />
};

/**
 *
 * Redirect to the appropriate page, based on machine business unit
 */

const redirect = (key: MachineBusinessUnit | undefined) => {
  return key ? pages[key] : <Redirect to={JBTRoutes.fleet} />;
};

const Machine = (): JSX.Element => {
  const { state } = useLocation();
  const { businessUnit } = (state as Record<string, number>) || { businessUnit: 0 };

  const { machine, isLoading, error } = useMachine();

  const navContext = useFleetNavigation();

  useEffect(() => {
    machine?.id &&
      navContext.updateEntityIfNeeded({ type: FleetNavigationEntityType.MACHINE, id: machine.id });
    navContext.updateNavIdIfNeeded(NAV_ITEMS_TO_ID.fleet);
  }, [machine?.id, navContext]);

  const bu = mapBusinessUnit(businessUnit || machine?.businessUnit);

  return (
    <DataRenderer isLoading={isLoading} error={error && 'Failed to load machine'}>
      {redirect(bu)}
    </DataRenderer>
  );
};

export default Machine;
