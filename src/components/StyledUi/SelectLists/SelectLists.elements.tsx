import styled from 'styled-components';

export interface SelectListContainerProps {
  gridArea?: string;
  className?: string;
}

export const SelectListContainer = styled.div<SelectListContainerProps>`
  grid-area: ${({ gridArea }) => gridArea};
`;
