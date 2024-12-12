import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const baseClass = 'machine-health-view';

export const ViewContainer = styled.div<StyledUiContainerProps>`
  .${baseClass}__demo {
    color: red;
  }
`;
