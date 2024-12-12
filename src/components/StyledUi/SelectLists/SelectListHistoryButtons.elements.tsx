import styled from 'styled-components';

export interface SelectListHistoryButtonContainerProps {
  gridArea?: string;
  className?: string;
}

interface Props extends SelectListHistoryButtonContainerProps {
  disabled?: boolean;
}
export const SelectListHistoryButtonContainer = styled.div.attrs(({ disabled }: Props) => ({
  disabled: disabled,
  type: 'button'
}))<Props>`
  grid-area: ${({ gridArea }) => gridArea};
`;
