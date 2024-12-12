// 3rd party libs
import React from 'react';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import { Typography } from 'components';

// Utils
import { buildSvg, getChipProps, sanitize } from './utils';

// constants
import { JBTRoutes } from 'constants/routes';

// Types
import { ProteinMachineRouteQueryParams } from 'types/protein';

type Props = {
  width: number;
  // TODO - Position will be computed dynamically - adding it for testing purposes
  indicatorPosition: number;
};

type ChipProps = {
  position: number;
  color: string;
  bgColor: string;
  message?: string;
};

// styling
const HealthBar = styled.div`
  position: absolute;
  top: 2rem;
  right: 3rem;
`;

const Container = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  &:last-child {
    cursor: pointer;
  }
`;

const Chip = styled.div<ChipProps>`
  width: 3rem;
  position: absolute;
  padding: 0.3rem;
  background: ${({ bgColor }) => bgColor};
  color: ${({ color }) => color};
  text-align: center;
  top: 100%;
  left: ${({ position }) => `calc(${position}%)`};
  border-radius: 0.75rem;
`;

const overlay = (alarms: number, goto: () => void) => {
  const { t } = useTranslation(['mh']);
  return (
    <Overlay>
      <Typography mb={0} weight="medium">
        {t('alarms')}: {alarms}
      </Typography>
      <FontAwesomeIcon icon={faArrowRight} onClick={goto} />
    </Overlay>
  );
};

const MachineHelathBar = ({ width, indicatorPosition }: Props): JSX.Element => {
  const history = useHistory();
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const position = sanitize(indicatorPosition);
  const nodeRef = React.useRef(null);
  const { message, ...rest } = getChipProps(position) as ChipProps;

  const goto = () =>
    history.push(`${JBTRoutes.machineHealthAlarms.replace(':machineId', machineId)}`);

  return (
    <HealthBar>
      <Container style={{ width }}>
        <div dangerouslySetInnerHTML={{ __html: buildSvg(position) }} />
        <Tooltip ref={nodeRef} overlay={overlay(20, goto)} placement="bottom" trigger="hover">
          <Chip {...rest} ref={nodeRef}>
            <Typography mb={0} weight={'medium'}>
              {message}
            </Typography>
          </Chip>
        </Tooltip>
      </Container>
    </HealthBar>
  );
};

export default MachineHelathBar;
