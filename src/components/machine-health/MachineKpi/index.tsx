// 3rd party libs
import React, { useEffect, useState } from 'react';
import { faChevronRight, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Tooltip from 'rc-tooltip';

// Components
import AdminCardEditButton from '../configurator/AdminCardEditButton';
import { PermissionWrapper } from 'components';

// API
import { useGetMachineAssetsQuery, useGetMachineConfiguratorDataQuery } from 'api';

// Hooks & Providers
import { useContainerSize } from 'hooks';
import { useLanguage } from 'providers';

// Utils
import { useMachineKpi } from './utils';
import DataRenderer from '../DataRenderer';
import RowRenderer from '../RowRenderer';

// Theme
import theme from 'themes';

//Types
import { ResourceType, Role, UserScopes } from 'types';
import { MachineHealthSubTabs } from 'types/protein';
import { PermissionScopeName } from 'types/user-management';

// Images placeholders for testing purpose
const images = {
  '8a537e04-0139-4740-9a69-dadbd95d5984': '/assets/placeholder/machines/gcm_10.gif',
  'f026d81a-1589-4755-8bfc-1197b7a786d7': '/assets/placeholder/machines/gc_70.gif',
  '85a68065-ce6f-4467-835c-2062b9bc0b84': '/assets/placeholder/machines/gc_70.gif',
  'c2c5d503-3742-4a4b-99fb-7cc17d05d6eb': '/assets/placeholder/machines/gc_40.gif'
} as Record<string, string>;

type Props = {
  onClick: () => void;
};

// Styling
const Container = styled.div`
  height: 32.9375rem;
  border: ${(props) => `0.0625rem solid ${props.theme.colors.mediumGrey1}`};
  border-radius: 0.625rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MachineImage = styled.div`
  height: 9.125rem;
  padding: 0.5rem 0;
  border-bottom: ${(props) => `0.0625rem solid ${props.theme.colors.mediumGrey1}`};
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const KpiContainer = styled.div`
  height: 20.1875rem;
  & > div {
    padding: 0rem 1rem;
  }
`;

const ShowMore = styled.div`
  height: 3.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.mediumGrey3};
  font-weight: 500;
  font-size: 0.8125rem;
  padding: 0.625rem 1rem;
  cursor: pointer;
  margin-top: auto;
`;

const EditButtonWrapper = styled.div`
  position: absolute;
  top: 1.125rem;
  right: 1.125rem;
`;

const IconButton = styled.button`
  background: inherit;
  font-size: inherit;
  border: none;
  cursor: pointer;
  padding: 0 0.5rem;
`;

const MachineKpi = ({ onClick }: Props): JSX.Element => {
  const { height, containerRef: kpisContainerRef, triggerResize } = useContainerSize();
  const { main, isLoading, error, machineId } = useMachineKpi(5000);
  const { t } = useTranslation(['common']);
  const { languageId } = useLanguage();

  const { data } = useGetMachineConfiguratorDataQuery({
    machineId,
    labels: [MachineHealthSubTabs.OverviewMain],
    languageId: languageId
  });

  const { data: machineAssets } = useGetMachineAssetsQuery({
    machineId: machineId as string,
    assetType: ResourceType.MachineImage
  });

  // Re-evaluate the space available when loading is complete, as KpiContainer will return
  // a height of 0 until that moment
  useEffect(() => {
    triggerResize();
  }, [isLoading]);

  const [isEditAdminPopupOpen, setIsEditAdminPopupOpen] = useState<boolean>(false);
  const handleIsEditAdminPopupOpen = () => {
    setIsEditAdminPopupOpen(!isEditAdminPopupOpen);
  };

  return (
    <Container>
      <DataRenderer
        isLoading={isLoading}
        error={error && (t('failed_to_load_data', { ns: 'common' }) as string)}
      >
        <>
          <MachineImage>
            <img
              src={machineAssets ? machineAssets[machineAssets.length - 1].url : images[machineId]}
              alt={machineId}
            />
            {data?.[0]?.id && (
              <PermissionWrapper
                page={PermissionScopeName.FLEET}
                scope={UserScopes.Write}
                role={Role.Admin}
              >
                <>
                  <EditButtonWrapper>
                    <Tooltip placement="top" overlay={t('edit')}>
                      <IconButton onClick={() => setIsEditAdminPopupOpen(true)}>
                        <FontAwesomeIcon icon={faPencil} />
                      </IconButton>
                    </Tooltip>
                  </EditButtonWrapper>
                  <AdminCardEditButton
                    addImageRow
                    hideInactive
                    machineId={machineId}
                    widgetId={data[0].id}
                    isEditAdminPopupOpen={isEditAdminPopupOpen}
                    setIsEditAdminPopupOpen={handleIsEditAdminPopupOpen}
                  />
                </>
              </PermissionWrapper>
            )}
          </MachineImage>
          <KpiContainer ref={kpisContainerRef}>
            <RowRenderer rows={main} containerHeight={height} />
          </KpiContainer>
          <ShowMore onClick={() => onClick()}>
            <span>{t('show_more')}</span>
            <FontAwesomeIcon icon={faChevronRight} color={theme.colors.darkGrey} />
          </ShowMore>
        </>
      </DataRenderer>
    </Container>
  );
};

export default MachineKpi;
