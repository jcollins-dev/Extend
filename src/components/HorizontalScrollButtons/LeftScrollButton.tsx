import React from 'react';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ChevronLeftContainer } from './ChevronContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from 'themes';
import { ChevronBox } from './ChevronContainer';

interface ScrollProps {
  handleScroll: () => void;
}
const LeftChevron = ({ handleScroll }: ScrollProps): JSX.Element => {
  return (
    <ChevronLeftContainer onClick={handleScroll}>
      <ChevronBox>
        <FontAwesomeIcon icon={faChevronLeft} color={theme.colors.darkGrey} />
      </ChevronBox>
    </ChevronLeftContainer>
  );
};

export default LeftChevron;
