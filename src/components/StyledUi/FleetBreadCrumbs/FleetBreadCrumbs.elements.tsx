import styled from 'styled-components';
import { IcoChevRight } from 'icons';
import { styledTheme } from '../theme';

export interface BreadCrumbsContainerProps {
  gridArea?: string;
  className?: string;
  as?: string;
}

export const BreadCrumbsDividerIcon = IcoChevRight;

export const BreadCrumbsContainer = styled.nav<BreadCrumbsContainerProps>`
  display: flex;
  align-items: center;
  gap: 0.7em;

  .bread-crumbs__status--is-loading,
  .bread-crumbs__edit--is-loading {
    opacity: 0.6;
    cursor: arrow;
  }

  .icon__chev--right {
    height: 0.65em;
    opacity: 0.5;
  }

  .bread-crumbs-item,
  a.bread-crumbs-item {
    min-height: 1em;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    font-size: clamp(13px, 1.4vw, 17px);

    color: ${styledTheme.color.main};
  }

  .bread-crumbs-item:last-child {
    font-weight: 500;
  }

  .bread-crumbs-item--is-loading span {
    font-size: 0.85em;
    opacity: 0.8;
  }

  a.bread-crumbs-item,
  .bread-crumbs__btn-back {
    text-decoration: none;
    border-bottom: solid 2px transparent;
    transition: all 300ms ease;
    color: ${styledTheme.color.main};

    &:hover {
      border-bottom-color: ${styledTheme.color.darken};
      opacity: 1;
    }
  }

  .configurator_breadcrumbs__btn-back {
    background: none;
    border: 0;
    cursor: pointer;

    &:visited {
      color: ${styledTheme.color.main};
    }
  }

  .bread-crumbs__btn-back {
    opacity: 0.8;
    border-bottom: 0;
  }

  .bread-crumbs__edit {
    border: 0;
    background-color: transparent;

    &:hover {
      cursor: pointer;
    }
  }
`;

export const BreadCrumbsPaddingFixer = styled.div`
  display: flex;
  align-items: center;
  padding: 1.625rem;

  > * + * {
    margin-left: 0.75rem;
  }
`;
