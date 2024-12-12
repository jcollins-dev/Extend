import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';
import { styledTheme } from 'components';

export const OEEValueTilesContainer = styled.div<StyledUiContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 1.5em;
  text-align: center;

  @media (max-width: 800px) {
    flex-direction: row;
  }
`;

export interface OEEValueTileContainerProps extends StyledUiContainerProps {
  color?: string;
}

// todo: move colors to style guide/theme
export const OEEValueTileContainer = styled.div<OEEValueTileContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 0.7em;

  .oee-value-tiles__title {
    font-size: 1.5em;
    font-weight: 300;
  }

  .oee-value-tiles__value {
    font-size: 2.2em;
    font-weight: 300;
    color: ${({ color }) => color || 'inherit'};
  }

  .oee-value-tiles__label {
    font-size: 0.8em;
    font-weight: 600;
    color: ${styledTheme.color.main};
  }
`;
