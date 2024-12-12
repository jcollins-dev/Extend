import styled from 'styled-components';
import { DateRangeContainerProps } from './DateRangeButton.types';
import { styledTheme } from 'components/StyledUi/theme';

export const DateRangeButtonContainer = styled.button.attrs(() => ({
  ['aria-label']: 'Date Range',
  type: 'button'
}))<DateRangeContainerProps>`
  display: flex;
  align-items: center;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: color 300ms ease;
  gap: 3px;

  box-shadow: ${({ iconOnly }) => !iconOnly && `0 0.0625rem 0.375rem 0 rgb(0 0 0 / 15%)`};
  background-color: ${styledTheme.color.neg};
  color: ${styledTheme.color.main};
  border-radius: ${styledTheme.radius.base};
  padding: ${({ iconOnly }) => (iconOnly ? 0 : `.4em 1.2em`)};
  grid-area: ${({ ga }) => ga};
  border: ${({ iconOnly }) => (iconOnly ? `none` : `solid 1px ${styledTheme.color.border.light}`)};

  &:hover {
    color: ${styledTheme.color.secondary};
  }

  .date-col {
    padding: 0.5em 0 0.3em 0;

    &.pad-l {
      margin-left: 5px;
    }

    .date-col__label {
      font-weight: 300;
      font-size: 0.8em;
      opacity: 0.7;
    }
  }
`;
