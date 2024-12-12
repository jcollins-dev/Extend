import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';
import { styledTheme } from 'components';

export const baseClass = 'fleet-machine-page';

export const PageLayoutContainer = styled.div<StyledUiContainerProps>`
  width: 100%;
  height: 100%;
  display: grid;

  grid-template-rows: ${({ gridRows }) => gridRows || `auto auto 1fr auto`};

  .${baseClass}__header {
    display: flex;
    flex-direction: column;

    padding: ${styledTheme.space.base};
    gap: ${styledTheme.space.md};
  }

  .${baseClass}__tab-nav {
  }

  .${baseClass}__main {
    padding: ${styledTheme.space.base};
  }

  .${baseClass}__footer {
    padding: ${styledTheme.space.base};
  }
`;
