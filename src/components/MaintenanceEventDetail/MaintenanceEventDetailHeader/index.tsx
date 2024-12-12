import React, { ReactElement } from 'react';
import styled, { useTheme } from 'styled-components';
import { Typography } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';

interface MaintenanceEventDetailHeaderProps {
  maintenanceEventFlyoutOpen: boolean;
  bgColor: string;
  title: string;
  onClose: () => void;
  onHeaderClick: () => void;
}

const Container = styled.div<{ bgColor?: string }>`
  background-color: ${({ bgColor, theme }) => (bgColor ? bgColor : theme.colors.lightGrey1)};
  > * + * {
    margin-top: 0.875rem;
  }
  padding: 0.5rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

// TODO - confirm that this is correct. Currently just adding a 'X' close button here as there is no
// other obvious way to close the flyout otherwise
const CloseButton = styled.button`
  background: inherit;
  border: none;
  cursor: pointer;
  padding: 0 0.5rem;
`;

const TitleText = styled.span`
  margin-left: 1rem;
`;

const MaintenanceEventDetailHeader = ({
  maintenanceEventFlyoutOpen,
  bgColor,
  onClose,
  title,
  onHeaderClick
}: MaintenanceEventDetailHeaderProps): ReactElement => {
  const theme = useTheme();
  return (
    <Container bgColor={bgColor}>
      <Header
        style={{
          padding: !maintenanceEventFlyoutOpen ? '0rem' : '1rem',
          cursor: !maintenanceEventFlyoutOpen ? 'auto' : 'pointer'
        }}
      >
        <Typography onClick={onHeaderClick} as="h3" mb={0} size="1.125rem" weight="bold">
          {maintenanceEventFlyoutOpen && (
            <FontAwesomeIcon icon={faChevronLeft} color={theme.colors.darkGrey} />
          )}
          <TitleText>{title}</TitleText>
        </Typography>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} color={theme.colors.darkGrey} />
        </CloseButton>
      </Header>
    </Container>
  );
};

export default MaintenanceEventDetailHeader;
