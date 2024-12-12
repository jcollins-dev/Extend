// 3rd party libs
import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { Typography, PermissionWrapper } from 'components';
import RowRenderer from '../RowRenderer';
import DataRenderer from '../DataRenderer';
import AdminCardEditButton from '../configurator/AdminCardEditButton';
import { FlyoutSidebar } from '../../StyledUi/FlyoutSidebar';

// Utils
import { useMachineKpi } from '../MachineKpi/utils';

// Hooks
import { useMachine } from 'hooks';
import { useLanguage } from 'providers';
import { MachineHealthSubTabs } from 'types/protein';
import { useGetMachineConfiguratorDataQuery } from 'api';

import { PermissionScopeName } from 'types/user-management';
import { Role, UserScopes } from 'types';

type Props = {
  close?: () => void;
};

// Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.875rem;
  outline: none;
`;

const Body = styled.div<{ noData?: boolean }>`
  padding: 0rem ${({ noData }) => (noData ? '1rem' : '2rem')} 2rem;
`;

const KpiContainer = styled.div`
  border: ${(props) => `0.0625rem solid ${props.theme.colors.mediumGrey1}`};
  border-radius: 0.625rem;
  & > div {
    padding: 0rem 1rem;
  }
  & > div:first-child {
    border-top-left-radius: 0.625rem;
    border-top-right-radius: 0.625rem;
  }
  & > div:last-child {
    border-bottom: none;
  }
`;

const ExtendedMachineKpi = ({ close }: Props): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const { t } = useTranslation(['mh', 'common']);
  const { languageId } = useLanguage();
  const { description } = useMachine().machine || { description: t('retrieving_machine') };
  const { extended, isLoading, error } = useMachineKpi(5000);

  const { data } = useGetMachineConfiguratorDataQuery({
    machineId,
    labels: [MachineHealthSubTabs.OverviewFlyout],
    languageId: languageId
  });

  const [isEditAdminPopupOpen, setIsEditAdminPopupOpen] = useState<boolean>(false);
  const handleIsEditAdminPopupOpen = () => {
    setIsEditAdminPopupOpen(!isEditAdminPopupOpen);
  };

  //Drive System History
  const flyoutSidebarSettings = {
    onClose: close,
    heading: description,
    isAdmin: true,
    handleAdminCallback: handleIsEditAdminPopupOpen
  };

  return (
    <Container tabIndex={0}>
      <FlyoutSidebar {...flyoutSidebarSettings}>
        <DataRenderer
          isLoading={isLoading}
          error={error && (t('failed_to_load_data', { ns: 'common' }) as string)}
        >
          <Body noData={extended.length === 0}>
            {extended.length > 0 ? (
              <KpiContainer>
                <RowRenderer rows={extended} rowHeight={58} />
              </KpiContainer>
            ) : (
              <Typography>{t('no_data', { ns: 'common' })}</Typography>
            )}
          </Body>
        </DataRenderer>
      </FlyoutSidebar>
      {data?.[0]?.id && (
        <PermissionWrapper
          page={PermissionScopeName.FLEET}
          scope={UserScopes.Write}
          role={Role.Admin}
        >
          <AdminCardEditButton
            hideInactive
            machineId={machineId}
            widgetId={data[0].id}
            isEditAdminPopupOpen={isEditAdminPopupOpen}
            setIsEditAdminPopupOpen={handleIsEditAdminPopupOpen}
          />
        </PermissionWrapper>
      )}
    </Container>
  );
};
export default ExtendedMachineKpi;
