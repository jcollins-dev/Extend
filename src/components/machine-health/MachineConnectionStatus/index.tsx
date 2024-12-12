// 3rd party libs
import React from 'react';
import { faWifi } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import Tooltip from 'rc-tooltip';
import { useParams } from 'react-router-dom';
import 'rc-tooltip/assets/bootstrap.css';
import { useTranslation } from 'react-i18next';

// Theme
import theme from 'themes';
// Components
import { Typography } from 'components';

// Types
import { ConnectionStatusResponse, ProteinMachineRouteQueryParams } from 'types/protein';
import { ConnectionStatus } from 'types/machine-health';

// Api
import { useGetMachineConnectionStatusQuery } from 'api';

// Styling
const MachineStatus = styled.div`
  margin-left: 0.1875rem;
  transform: translateY(0.125rem) rotate(45deg);
`;

const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Status = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  p::first-letter {
    text-transform: capitalize;
  }
`;

const StatusContainer = styled.div<{ isLoading?: boolean }>`
  @keyframes pulse {
    from {
      opacity: 30%;
    }
    to {
      opacity: 100%;
    }
  }
  ${({ isLoading }) =>
    isLoading === true ? 'animation: pulse ease-in-out 0.6s infinite alternate;' : ''}
`;

const statusRenderer = (property: keyof ConnectionStatusResponse, status: ConnectionStatus) => {
  const colors = theme.colors.machineConnectionStatusColors;
  return (
    <Status>
      <Typography mb={0} weight="medium">
        {property}
      </Typography>
      <Typography mb={0} weight="medium" color={status ? colors[status] : undefined}>
        {status}
      </Typography>
    </Status>
  );
};

const overlay = (status?: ConnectionStatusResponse, isLoading?: boolean) => {
  const { t } = useTranslation(['common']);
  if (isLoading) {
    return (
      <Typography mb={0} weight="medium">
        <i>{t('communicating')}</i>
      </Typography>
    );
  }
  return status && <Overlay>{statusRenderer('watchdog', status.watchdog)}</Overlay>;
};

// TODO - Discuss the logic with PO
const getIconColor = (status?: ConnectionStatusResponse, isLoading?: boolean) => {
  if (!status && isLoading) {
    return theme.colors.buttons.primary.fill;
  } else if (!status) return undefined;
  const colors = theme.colors.machineConnectionStatusColors;
  const { watchdog } = status;
  return watchdog ? colors[watchdog] : undefined;
};

const MachineConnectionStatus = ({ machineId }: { machineId?: string }): JSX.Element => {
  const nodeRef = React.useRef(null);
  if (machineId === undefined) {
    machineId = useParams<ProteinMachineRouteQueryParams>().machineId;
  }

  const { data: status, isFetching: statusLoading } = useGetMachineConnectionStatusQuery(
    { machineId },
    { pollingInterval: 30000 }
  );

  return (
    <MachineStatus>
      <Tooltip
        ref={nodeRef}
        overlay={overlay(status, statusLoading)}
        placement="bottom"
        trigger="hover"
      >
        <StatusContainer isLoading={statusLoading} ref={nodeRef}>
          <FontAwesomeIcon icon={faWifi} color={getIconColor(status, statusLoading)} size={'sm'} />
        </StatusContainer>
      </Tooltip>
    </MachineStatus>
  );
};

export default MachineConnectionStatus;
