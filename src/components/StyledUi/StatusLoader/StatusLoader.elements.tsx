import styled from 'styled-components';
import { StyledContainer, Text, Icon } from '../elements';
import { styledTheme } from '../theme';
import { Types } from '.';

export const MessageContainer = styled(StyledContainer)<Types.StatusProps>`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    'icon     label'
    'message  message';

  &:after {
    content: '';
    display: block;
    grid-row: 1;
    grid-column: 1 / span 2;
    background-color: ${styledTheme.color.status.error.light};
    z-index: 100;
  }
  overflow: hidden;
  border-radius: ${styledTheme.radius.base};
  border: ${({ hasError }) => hasError && `solid 1px ${styledTheme.color.status.error.base}`};
`;

export const Message = styled(Text.StyledText)`
  grid-area: message;
  padding: ${styledTheme.space.md};
`;
export const Label = styled(Text.StyledText)`
  grid-area: label;
  z-index: 200;
  padding: ${styledTheme.space.md};
  color: ${styledTheme.color.status.error.light};
`;
export const IconHolder = styled.span`
  grid-area: icon;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  padding-left: ${styledTheme.space.md};
`;
export const ErrorIcon = styled(Icon.Alert).attrs(() => ({ alertType: 'error' }))``;
