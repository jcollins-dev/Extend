import styled from 'styled-components';
import { styledTheme } from '../theme';
import { StyledUiContainerProps } from '../StyledUiGlobal.types';

export type RouterTabNavContainerProps = StyledUiContainerProps;

export const routerTabNavBaseClass = `router-tab-nav`;

export const RouterTabNavContainer = styled.nav<RouterTabNavContainerProps>`
  display: flex;

  .${routerTabNavBaseClass}__item {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    font-family: inherit;
    transition: all 200ms ease;
  }
  
  &.${routerTabNavBaseClass}--tabs {
    
    background-color: #fbfcff;

    .${routerTabNavBaseClass}__item {
      flex-grow: 1;
      padding: 1em;
      border-style: solid;
      border-width: 0 0 2px 0;
      border-color: transparent;
      font-weight: 500;

      color: ${styledTheme.color.main};

      &[data-disabled="true"] {
        cursor: not-allowed;
      }

      &:not([data-disabled="true"]) {
        cursor: pointer;
        &[data-current="true"] {
          cursor: arrow!important;
        }

        &[data-current="true"] {
          border-color: ${styledTheme.color.secondary};
        }

        &:hover,
        &[data-current="true"] {
          background-color: ${styledTheme.color.secondaryLight};
          color: ${styledTheme.color.secondary};
        }
      }
    }    
  }

  &.${routerTabNavBaseClass}--pills {
    gap: 1em;
    .${routerTabNavBaseClass}__item {
      display: inline-block;
      cursor: pointer;
      padding: 0.6875rem;
      font-size: 0.8125rem;
      background-color: #F9FAFB;
      border: 1px solid;
      border-radius: ${styledTheme.radius.sm};
      border-color: transparent;
      cursor pointer;
      
      color: ${styledTheme.color.main};

      &:not([data-disabled="true"]) {
        &:hover,
        &[data-current="true"] {
          background-color: ${styledTheme.color.secondaryLight};
          border-color: ${styledTheme.color.secondary};
        }
      }
    }
  }

`;
