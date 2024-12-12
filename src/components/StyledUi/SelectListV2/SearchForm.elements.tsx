import styled from 'styled-components';
import { styledTheme } from '../theme';

export interface SearchFormContainerProps {
  gridArea?: string;
  className?: string;
}

export const SearchFormContainer = styled.div`
  form {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr auto;
    margin: 0;
    padding: 0;
    border: solid 1px ${styledTheme.color.border.light};
    border-radius: ${styledTheme.radius.base};
  }

  input {
    border: none;
  }

  label {
    display: block;
    font-size: 0.8em;
    padding: 1em;
  }

  .search-form-suggested {
    grid-row: 1;
    grid-column: 2;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
  }
`;
