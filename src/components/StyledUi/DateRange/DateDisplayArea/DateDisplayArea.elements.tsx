import styled from 'styled-components';
import { IcoCalendar } from 'icons/IcoCalendar';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';
import { styledTheme } from 'components/StyledUi/theme';

export const baseClass = `date-display-area`;

export const DateDisplayAreaContainer = styled.div<StyledUiContainerProps>`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  font-size: 0.8em;
  grid-area: ${({ gridArea }) => gridArea};

  .${baseClass}__date-wrapper {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0.5em;
    padding: 0.5em;
    justify-content: center;
    align-items: center;

    border: solid 1px ${styledTheme.color.border.light};
    border-radius: ${styledTheme.radius.xs};
  }

  .${baseClass}__label {
    font-weight: 500;
    text-transform: capitalize;
  }
`;

export const DateDisplayIcon = styled(IcoCalendar)``;
