// 3rd party libraries
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/dist/query';

// API
import { useGetPartsByMachineIdQuery, useGetPartByIdQuery } from 'api';

// Hooks
import { useQueryParams } from 'hooks';

// Types
import { Machine } from 'types';
import { Part } from 'types/parts';
import { BreadCrumb } from 'components/Breadcrumbs';

// Components
import { Button, Loader, PageHeader, Typography } from 'components';
import FindPart from './FindPart';
import theme from 'themes';

// Providers
import { useFleetNavigation, FleetNavigationEntityType } from 'providers';

// Constants
import { JBTRoutes } from 'constants/routes';

// Icons
import { PartsIcon } from 'icons';
import { NAV_ITEMS_TO_ID } from 'constants/nav';

// Styling
const Container = styled.div`
  padding: 1.75rem 1.5rem;
`;

const Root = styled.div`
  height: 17rem;
  width: 32rem;
  margin: auto;
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0.125rem solid;
  border-radius: 0.625rem;
  border-color: #e2e2e2;
  h3 {
    padding: 2rem;
  }
`;

const PartsButtons = styled.div`
  display: flex;
  max-width: 21rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  * + * {
    margin-left: 1rem;
  }
`;

export default function PartPage(): ReactElement {
  // State variables to help maintain what should be rendered
  const [activeMachine, setActiveMachine] = useState<Machine>();
  const [activePart, setActivePart] = useState<Part>();
  const { t } = useTranslation(['fpns']);
  const history = useHistory();

  const { machineId } = useParams<{ machineId: string }>();

  const navContext = useFleetNavigation();

  useEffect(() => {
    machineId &&
      navContext.updateEntityIfNeeded({ type: FleetNavigationEntityType.MACHINE, id: machineId });
    navContext.updateNavIdIfNeeded(NAV_ITEMS_TO_ID.parts);
  }, [machineId, navContext]);

  const {
    data: machine,
    error: machineError,
    isLoading: machineIsLoading
  } = useGetPartsByMachineIdQuery(machineId);

  useEffect(() => {
    if (!machineId || !machine) setActiveMachine(undefined);
    else if (machineId && machine) setActiveMachine({ ...machine });

    return () => {
      setActiveMachine(undefined);
    };
  }, [machineId, machine]);

  const query = useQueryParams();
  const partId = query.get('partId') || undefined;
  const {
    data: part,
    error: partError,
    isLoading: partIsLoading
  } = useGetPartByIdQuery(partId ?? skipToken);

  const machineCheck = Boolean(activeMachine && machineId === activeMachine.id);
  const partCheck = machineCheck && activePart && partId && activePart.id === partId;

  // Part breadcrumb building
  const baseMachineUrl = activeMachine
    ? JBTRoutes.partsMachine.replace(':machineId', activeMachine.id)
    : '';
  let partBreadcrumbs: BreadCrumb[] = [];
  if (activePart) {
    // Labels
    const navLabelString = query.get('labels') || '';
    const navLabels = navLabelString
      .split(',')
      .filter((label) => label !== '')
      .map((label) => label);
    // Part IDs/paths
    const navPathString = query.get('paths') || '';
    const navPathList: string[] = navPathString !== '' ? navPathString.split(',') : [];
    const navPaths = navPathList.map((path, index) => {
      const currentLabels =
        navLabels.length > index ? navLabels.slice(0, index + 1).join(',') : navLabels.join(',');
      const currentPaths = navPathList.slice(0, index + 1).join(',');
      return `${baseMachineUrl}?partId=${path}&labels=${encodeURIComponent(
        currentLabels
      )}&paths=${encodeURIComponent(currentPaths)}`;
    });
    // Combine labels and paths
    partBreadcrumbs = navLabels.map((label, index) => {
      return {
        label: label,
        link: navPaths.length > index ? navPaths[index] : undefined
      };
    });
  }

  const breadcrumbs = machineIsLoading
    ? [
        { label: t('parts_catalog'), link: JBTRoutes.partsCatalog },
        { label: t('retrieving_machine') }
      ]
    : machineError
    ? [
        { label: t('parts_catalog'), link: JBTRoutes.partsCatalog },
        { label: t('issue_retrieving_machine') }
      ]
    : // If part detail page reached from direct link
    activeMachine && activePart && partCheck && partBreadcrumbs.length === 0
    ? [
        { label: t('parts_catalog'), link: JBTRoutes.partsCatalog },
        { label: activeMachine.description, link: baseMachineUrl },
        { label: activePart.sku }
      ]
    : activeMachine
    ? [
        { label: t('parts_catalog'), link: JBTRoutes.partsCatalog },
        { label: activeMachine.description, link: baseMachineUrl },
        ...partBreadcrumbs
      ]
    : [];
  // end part breadcrumb building

  useEffect(() => {
    if (!partId || !part) setActivePart(undefined);
    else if (partId && part) setActivePart({ ...part });

    return () => {
      setActivePart(undefined);
    };
  }, [partId, part]);

  // Main Content
  let mainContent: React.ReactNode = null;
  // If machine is loading, show loading for main content and parts table
  if (machineIsLoading || partIsLoading) mainContent = <Loader />;
  // TODO - Do something better on error
  else if (machineError || partError) {
    mainContent = <div>There was an unexpected error loading the machine/part</div>;
  } else {
    mainContent = <FindPart machine={activeMachine} machineId={machineId} part={activePart} />;
  }

  const gotoPartsDashBoard = () => {
    history.push(JBTRoutes.partsCatalog);
  };

  return (
    <>
      <PageHeader
        heading={machine ? machine.description : t('loading_details')}
        icon={{ iconElement: PartsIcon, iconType: 'custom' }}
        breadcrumbs={breadcrumbs}
      />
      {machineIsLoading ? (
        <Loader />
      ) : (
        <>
          {(activeMachine?.parts?.length as number) > 0 ? (
            <Container>{mainContent}</Container>
          ) : (
            <Container>
              <Root>
                <Typography color={theme.colors.darkGrey} variant="h3">
                  {t('no_mechanical_drawing_exists')}
                </Typography>
                <PartsButtons>
                  <Button variant="primary" disabled={false} onClick={gotoPartsDashBoard}>
                    {t('go_to_parts_catalog')}
                  </Button>
                </PartsButtons>
              </Root>
            </Container>
          )}
        </>
      )}
    </>
  );
}
