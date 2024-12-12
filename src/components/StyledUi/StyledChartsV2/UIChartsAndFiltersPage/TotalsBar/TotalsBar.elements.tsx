import styled from 'styled-components';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';
import { styledTheme } from 'components/StyledUi/theme';

export const baseClass = `totals-bar`;
export const TotalsBarContainer = styled.div<StyledUiContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  font-size: 1rem;
  min-height: 4em;

  padding: ${styledTheme.space.md};
  border-radius: ${styledTheme.radius.base};
  background-color: ${styledTheme.color.bg.negLightest};
  color: ${styledTheme.color.main};
  grid-area: ${({ gridArea }) => gridArea};
  border: solid 1px ${styledTheme.color.border.main};

  .${baseClass}__cell {
    max-width: 100%;
    width: 33.3333%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .${baseClass}__cell-title {
    font-size: 0.7em;
  }

  .${baseClass}__cell-value {
    font-weight: 900;
    font-size: 1.5em;
  }

  .${baseClass}__cell-label {
    opacity: 0.8;
    font-size: 0.8em;
    font-weight: 500;
  }
`;
