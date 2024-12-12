import styled from 'styled-components';
import { styledTheme } from '../theme';

import { GridContainer, GridContainerProps } from './UiGrid.elements';

//import { baseGap } from './pageGrid.options';

export interface PageGridContainerProps extends GridContainerProps {
  ga?: string;
}

export const PageGridContainer = styled(GridContainer)`
  grid-gap: ${({ gap }) => gap || `clamp(1.2vh, .85vw, 12px)`};

  h2,
  h3 {
    magin: 0;
    padding: 0;
  }

  &.grid-row {
    margin-bottom: 2rem;
  }

  &.page-grid--oee {
    .widget-ui-header {
      min-height: 3em;
    }

    .res-font--md {
      font-size: 1em;
    }
  }

  .page-grid__header {
    margin-bottom: 0;
  }
`;

interface PageGridColHeaderProps {
  ga?: string;
  className?: string;
}

export const PageGridColHeader = styled.h2.attrs(({ className }: PageGridColHeaderProps) => ({
  className: className ? `${className} page-grid__header` : `page-grid__header`
}))<PageGridColHeaderProps>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  text-transform: capitalize;
  font-weight: 500;
  gap: 1em;
  margin: 0 0 0.6em 0;

  color: ${styledTheme.color.mainLight};
  grid-area: ${({ ga }) => ga};

  &:before,
  &:after {
    content: '';
    display: block;
    flex-grow: 1;
    border-bottom: solid 1px ${styledTheme.color.mainLight};
    opacity: 0.4;
  }
`;
