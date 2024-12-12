import React from 'react';
import { SelectListProps } from './SelectList.types';
import { SelectListContainer } from './SelectList.elements';

interface ListWrapperProps extends SelectListProps {
  children: JSX.Element;
}

// List wrapper checks for incoming select list wrapper element.
// this can't be a React function, it must be a div or styled component
export const SelectListWrapper = ({
  children,
  Container,
  className,
  gridArea
}: ListWrapperProps): JSX.Element => {
  Container = Container || SelectListContainer;
  return (
    <Container {...{ className: className || `select-list-items`, gridArea }}>{children}</Container>
  );
};
