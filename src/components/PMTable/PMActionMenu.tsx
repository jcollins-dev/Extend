// 3rd party libs
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { faChevronRight, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components
import { Typography } from 'components';

// Types
import { PMTask } from 'types';

// Constants
import { JBTRoutes } from 'constants/routes';

interface Props {
  task: PMTask;
  onClose: () => void;
}

interface NavItemData {
  label: string;
  link: string;
}

const Container = styled.div`
  padding: 2rem;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5.3125rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  svg {
    margin-left: 0.5rem;
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const Link = styled(RouterLink)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text.link};

  span {
    display: flex;
    justify-content: space-between;
  }
`;

const ListItem = styled.li`
  margin-bottom: 1.25rem;
`;

const NavItem = ({ data }: { data: NavItemData }): JSX.Element => (
  <ListItem>
    <Link to={data.link}>
      <Typography as="span" size="1rem">
        {data.label}
        <FontAwesomeIcon icon={faCaretRight} />
      </Typography>
    </Link>
  </ListItem>
);

const PMActionMenu = ({ task, onClose }: Props): JSX.Element | null => {
  if (!task) return null;

  const navItems: NavItemData[] = [
    {
      label: 'See detailed PM',
      link: '' // TODO - set link
    },
    {
      label: 'Order parts',
      link: JBTRoutes.maintenanceMachinepmparts.replace(':machineId', task.machineId)
    },
    {
      label: 'Schedule service',
      link: '' // TODO - set link
    },

    {
      label: 'Review related PMs',
      link: '' // TODO - set link
    },
    {
      label: 'Assign owner',
      link: '' // TODO - set link
    }
  ];

  return (
    <Container>
      <Top>
        <Typography color="greyfont" weight="bold" mb={0} size="1rem" as="h2">
          {task.machineId}
        </Typography>
        <CloseButton onClick={onClose}>
          <Typography color="greyfont" weight="bold" mb={0} size="1rem" as="span">
            Close
            <FontAwesomeIcon icon={faChevronRight} />
          </Typography>
        </CloseButton>
      </Top>
      <List>
        {navItems.map((item, idx) => (
          <NavItem key={idx} data={item} />
        ))}
      </List>
    </Container>
  );
};

export default PMActionMenu;
