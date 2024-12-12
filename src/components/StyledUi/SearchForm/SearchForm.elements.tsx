import styled from 'styled-components';
import { styledTheme } from '../theme';

export const baseClass = `search-form`;

export interface SearchFormContainerProps {
  gridArea?: string;
  className?: string;
}

export const SearchFormContainer = styled.form`
  position: relative;
  display: grid;
  grid-template-columns: 0.8em 1fr 0.7em;
  gap: 0.5em;
  align-items: center;
  margin: 0;
  padding: 0.5em 0.7em;
  flex-grow: 1;

  outline: solid 1px ${styledTheme.color.border.light};
  border-radius: ${styledTheme.radius.sm};

  &:focus-within {
    outline-color: ${styledTheme.color.secondary};
    box-shadow: 0px 0px 0px 2px #0a70ff40;
  }

  input {
    border: none;
    outline: none;
    font-family: inherit;
  }

  label {
    display: block;
    font-size: 0.8em;
    padding: 1em;
  }

  .${baseClass}__suggested {
    grid-row: 1;
    grid-column: 2;
    position: absolute;
    left: -1em;
    top: 100%;
    border-width: 1px;
    border-style: solid;
    max-height: 10em;
    overflow-x: hidden;
    overflow-y: auto;
    max-width: max-content;
    min-width: 10em;
    z-index: 500;
    box-shadow: 0 0.0625rem 0.375rem 0 rgb(0 0 0 / 15%);

    background-color: ${styledTheme.color.neg};
    border-left-color: ${styledTheme.color.border.light};
    border-right-color: ${styledTheme.color.border.light};
    border-bottom-color: ${styledTheme.color.border.light};
    border-top-color: ${styledTheme.color.secondary};
    border-radius: 0 0 ${styledTheme.radius.base} ${styledTheme.radius.base};

    .${baseClass}__suggested__item {
      padding: 0.5em 1em;
      font-size: 0.9em;
      opacity: 0.8;
      cursor: pointer;

      &:hover,
      &:first-child {
        color: ${styledTheme.color.secondary};
      }
    }
  }

  .${baseClass}__cancel {
    border: 0;
    padding: 0;
    background: none;
    transition: all 300ms ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      fill: ${styledTheme.color.secondary};
    }
  }

  .${baseClass}__cancel--is-hidden {
    opacity: 0;
  }
`;
