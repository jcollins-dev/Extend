import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const baseClass = 'tile-widget';

export const TileWidgetContainer = styled.div<StyledUiContainerProps>`
  .${baseClass}__demo {
    color: red;
  }
`;
