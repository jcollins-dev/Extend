import styled from 'styled-components';
import { styledTheme } from '../theme';

export interface StyledTabsElementsProps {
  styleType?: string;
}

export const StyledTabsNavItem = styled.button.attrs(() => ({
  type: 'button'
}))<StyledTabsElementsProps>`
  display: block;
  background-color: transparent;
  border-width: 0 0 3px 0;
  border-style: solid;
  border-color: transparent;
  cursor: pointer;
  text-transform: capitalize;
  font-size: 1em;
  transition: color 300ms ease,
              border-color 300ms ease,
              translate 300ms ease;
              opacity 300ms ease;

  padding: .2em ${styledTheme.space.md};

  ${({ styleType }) => {
    switch (styleType) {
      case 'buttonStyle':
        return ``;
      default:
        return `
        font-weight: 500;
        font-family: inherit;
        opacity: .8;
        cursor: pointer;

        color: ${styledTheme.color.main};
      
        &:hover {
          border-color: ${styledTheme.color.mainLight};
        }

        &.styled-tabs-nav__button--is-current {
          cursor: arrow!important;
          border-color: ${styledTheme.color.secondary};
        }

        &:hover,
        &.styled-tabs-nav__button--is-current {
          opacity: 1;
        }
      `;
    }
  }}
`;
