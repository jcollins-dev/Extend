import React from 'react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronRightContainer } from './ChevronContainer';
import theme from 'themes';
import { ChevronBox } from './ChevronContainer';

interface ScrollProps {
  handleScroll: () => void;
}
const RightChevron = ({ handleScroll }: ScrollProps): JSX.Element => {
  return (
    <ChevronRightContainer onClick={handleScroll}>
      <ChevronBox>
        <FontAwesomeIcon icon={faChevronRight} color={theme.colors.darkGrey} />
      </ChevronBox>
    </ChevronRightContainer>
  );
};

export default RightChevron;
