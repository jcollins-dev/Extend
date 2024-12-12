import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const ChartTooltipWrapperContainer = styled.div<StyledUiContainerProps>`
  postion: absolute;
  left: ${({ left }) => (left as string) || '0px'};
  top: ${({ top }) => (top as string) || '0px'};
`;
