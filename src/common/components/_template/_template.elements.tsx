import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const baseClass = '_template';

export const _templateContainer = styled.div<StyledUiContainerProps>`
  .${baseClass}__demo {
    color: red;
  }
`;
