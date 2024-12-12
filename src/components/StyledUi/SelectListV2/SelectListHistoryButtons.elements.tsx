import styled from 'styled-components';

export interface SelectListHistoryButtonContainerProps {
  gridArea?: string;
  className?: string;
}

export const SelectListHistoryButtonsContainer = styled.div<SelectListHistoryButtonContainerProps>`
  display: flex;
  justify-content: flex-end;
  gap: 1em;
`;
