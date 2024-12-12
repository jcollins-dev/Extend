import React from 'react';
import { SortStateArrowsContainer, baseClass } from './SortStateArrows.elements';
import { StyledUiContainerProps } from '../StyledUiGlobal.types';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface SortStateArrowsProps extends StyledUiContainerProps {
  sorting?: string;
}

export const SortStateArrows = ({
  className,
  gridArea,
  sorting
}: SortStateArrowsProps): JSX.Element => {
  className = className ? `${className} ${baseClass}` : baseClass;

  if (sorting) className = `${className} is-sorting--${sorting}`;

  const containerSettings = {
    className,
    gridArea
  };

  return (
    <SortStateArrowsContainer {...containerSettings}>
      <FontAwesomeIcon icon={faSortDown} className={sorting === 'up' ? 'is-sorting' : undefined} />
      <FontAwesomeIcon
        icon={faSortDown}
        className={sorting === 'down' ? 'is-sorting' : undefined}
      />
    </SortStateArrowsContainer>
  );
};
