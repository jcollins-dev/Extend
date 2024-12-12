import styled from 'styled-components';
import { StyledContainer, Text, styledTheme } from '../';
import { Button } from 'components/Button';

interface ContainerProps {
  hasHeadline?: boolean;
}

export const Container = styled(StyledContainer)<ContainerProps>`
  display: grid;
  flex-grow: 1;
  grid-template-columns: auto auto;
  grid-template-rows: ${({ hasHeadline }) => `${hasHeadline ? `auto ` : ``}1fr auto`};
  grid-template-areas: ${({ hasHeadline }) => `
    ${hasHeadline ? `'headline headline'` : ``}
    'calendar calendar'
    'btn-submit btn-cancel'
  `};
  grid-gap: ${styledTheme.space.sm};
  padding: ${styledTheme.space.base};
  background-color: white;
  border-radius: ${styledTheme.radius.base};
  box-shadow: ${styledTheme.effects.boxShadow.main};
  .ui-date-range {
    grid-area: calendar;
  }
`;

export interface BtnProps {
  ga?: string;
}
export const CalendarButton = styled(Button)<BtnProps>`
  grid-area: ${({ ga }) => ga};
`;

export const Headline = styled(Text.Headline).attrs(() => ({ styleType: 'popup-headline' }))`
  text-align: center;
  grid-area: headline;
`;
