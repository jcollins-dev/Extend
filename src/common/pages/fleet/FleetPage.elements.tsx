import { StyledUiContainerProps } from 'components';
import styled from 'styled-components';

export const FleetPageContainer = styled.main<StyledUiContainerProps>`
  > header,
  > section {
    padding: 1.5em 2em;
  }

  .tabs-nav {
    font-size: clamp(0.75rem, 1.8vw, 0.875rem);
  }
`;

export const FleetPageViewContainer = styled.section<StyledUiContainerProps>``;
