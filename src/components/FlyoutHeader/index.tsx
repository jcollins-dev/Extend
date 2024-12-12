// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from 'themes';

// Components
import { Typography } from 'components';

interface Props {
  heading?: string;
  onClose?: (() => void) | null;
  onBack?: (() => void) | null;
  afterComponent?: React.ReactNode;
  bgColor?: string;
}

const Header = styled.header<{ bgColor?: string }>`
  padding: 1.5625rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ bgColor: bg }) => bg ?? ''};
`;

const IconButton = styled.button`
  background: inherit;
  font-size: inherit;
  border: none;
  cursor: pointer;
  padding: 0 0.5rem;
`;

const BackButton = styled(IconButton)`
  margin-right: 0.5rem;
`;

const CloseButton = styled(IconButton)`
  margin-left: auto;
`;

const FlyoutHeader = ({
  onClose,
  onBack,
  heading,
  afterComponent,
  bgColor
}: Props): JSX.Element => {
  return (
    <Header bgColor={bgColor}>
      <Typography as="h3" mb={0} size="1.125rem" weight="bold">
        {onBack && (
          <BackButton onClick={() => onBack()}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </BackButton>
        )}
        {heading}
      </Typography>
      {afterComponent && afterComponent}
      {onClose && (
        <CloseButton onClick={() => onClose()}>
          <FontAwesomeIcon icon={faTimes} color={theme.colors.darkGrey} />
        </CloseButton>
      )}
    </Header>
  );
};

export default FlyoutHeader;
